import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/requireAuth";
import {
  sendBookingConfirmationEmail,
  sendPaymentReceiptEmail,
} from "@/lib/email";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    /* ---------------- AUTH ---------------- */

    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const userId = auth.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please login again." },
        { status: 401 },
      );
    }

    /* ---------------- BODY ---------------- */

    const { payment_intent_id } = await req.json();

    if (!payment_intent_id) {
      return NextResponse.json(
        { error: "PaymentIntent ID is required" },
        { status: 400 },
      );
    }

    /* ---------------- STRIPE ---------------- */

    const intent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (intent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 },
      );
    }

    const { listingId, checkIn, checkOut, guests, userEmail } =
      intent.metadata as {
        listingId: string;
        checkIn: string;
        checkOut: string;
        guests?: string;
        userEmail?: string;
      };

    const guestsCount = guests ? parseInt(guests, 10) : 1;

    const startDate = new Date(checkIn);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(checkOut);
    endDate.setUTCHours(0, 0, 0, 0);
    const totalAmount = (intent.amount ?? 0) / 100;

    /* ---------------- DUPLICATE GUARD ---------------- */

    const alreadyPaid = await prisma.payment.findFirst({
      where: { transactionId: intent.id },
    });

    if (alreadyPaid) {
      return NextResponse.json({ success: true });
    }

    /* ---------------- TRANSACTION ---------------- */

    let bookingId: string;
    let listingTitle: string;
    let listingLocation: string;

    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          listing: { connect: { id: listingId } },
          user: { connect: { id: userId } },
          startDate,
          endDate,
          totalPrice: totalAmount,
          status: "CONFIRMED",
          guests: {
            create: Array.from({ length: guestsCount }, (_, i) => ({
              name: i === 0 ? user.name || "Guest" : `Guest ${i + 1}`,
              email: i === 0 ? user.email || userEmail : undefined,
            })),
          },
        },
        include: {
          listing: true,
          guests: true,
        },
      });

      bookingId = booking.id;
      listingTitle = booking.listing.title;
      listingLocation = booking.listing.location;

      await tx.payment.create({
        data: {
          booking: { connect: { id: booking.id } },
          user: { connect: { id: userId } },
          amount: totalAmount,
          status: "COMPLETED",
          method: "STRIPE",
          transactionId: intent.id,
        },
      });

      /* --------- AVAILABILITY (FIXED) --------- */
      /* --------- AVAILABILITY (CORRECT & SIMPLE) --------- */

      const currentDate = new Date(startDate);
      currentDate.setHours(0, 0, 0, 0);

      const finalDate = new Date(endDate);
      finalDate.setHours(0, 0, 0, 0);

      while (currentDate <= finalDate) {
        await tx.availability.upsert({
          where: {
            listingId_date: {
              listingId,
              date: new Date(currentDate),
            },
          },
          update: { isBooked: true },
          create: {
            listingId,
            date: new Date(currentDate),
            isBooked: true,
            price: 0,
          },
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    /* ---------------- EMAIL ---------------- */

    try {
      // Send booking confirmation email
      await sendBookingConfirmationEmail(auth.email!, user.name || "Guest", {
        id: bookingId!,
        listingTitle: listingTitle!,
        location: listingLocation!,
        startDate,
        endDate,
        totalPrice: totalAmount,
        guests: guestsCount || 1,
      });

      // Send payment receipt email
      await sendPaymentReceiptEmail(auth.email!, user.name || "Guest", {
        id: bookingId!,
        transactionId: intent.id,
        amount: totalAmount,
        method: "Credit Card (Stripe)",
        status: "COMPLETED",
        createdAt: new Date(),
        booking: {
          listingTitle: listingTitle!,
          location: listingLocation!,
          startDate,
          endDate,
        },
      });
    } catch (err) {
      console.error("Email send failed:", err);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Confirm Payment Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
