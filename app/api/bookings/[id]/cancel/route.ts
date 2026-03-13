// app/api/bookings/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/requireAuth";
import { sendBookingCancellationEmail } from "@/lib/email";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const bookingId = params.id;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: true,
        payment: true,
        user: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId !== auth.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    // Policy check: Prevent cancellation if check-in is in the past
    if (new Date(booking.startDate) < new Date()) {
      return NextResponse.json(
        { error: "Cannot cancel past or active bookings" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update booking status
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" },
      });

      // 2. Update payment status if exists
      if (booking.payment) {
        await tx.payment.update({
          where: { id: booking.payment.id },
          data: { status: "CANCELLED" },
        });
      }

      // 3. Free up availability
      // We update all availability records in the range to isBooked: false
      await tx.availability.updateMany({
        where: {
          listingId: booking.listingId,
          date: {
            gte: booking.startDate,
            lt: booking.endDate, // endDate is exclusive for availability (checkout day)
          },
        },
        data: { isBooked: false },
      });
    });

    // Send cancellation email
    try {
      await sendBookingCancellationEmail(
        booking.user.email,
        booking.user.name || "Guest",
        {
          id: booking.id,
          listingTitle: booking.listing.title,
          location: booking.listing.location,
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalPrice,
          refundAmount: booking.payment?.status === "COMPLETED" ? booking.totalPrice : undefined,
        }
      );
    } catch (err) {
      console.error("Failed to send cancellation email:", err);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
