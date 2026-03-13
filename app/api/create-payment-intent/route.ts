import { NextResponse } from "next/server";
import Stripe from "stripe";
export const dynamic = "force-dynamic";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { listingId, price, checkIn, checkOut, guests, userEmail } =
      await req.json();

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    let nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (nights === 0) {
      nights = 1;
    }

    if (nights < 0) {
      return NextResponse.json(
        { error: "Invalid date range" },
        { status: 400 },
      );
    }
    
    const cleaningFee = 50;
    const serviceFee = 30;
    const totalAmount = (price * nights * guests) + cleaningFee + serviceFee;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Amount in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        listingId,
        checkIn,
        checkOut,
        guests: String(guests),
        userEmail,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: "Error creating payment intent" },
      { status: 500 },
    );
  }
}
