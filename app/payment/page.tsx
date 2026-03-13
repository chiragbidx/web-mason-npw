"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import axios from "axios";

// Make sure to add STRIPE_PUBLISHABLE_KEY to your .env
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ total }: { total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL where the user is redirected after the payment
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      toast.error(error.message || "An unexpected error occurred.");
    } else {
      toast.error("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-rose-600 text-white py-3 rounded-lg font-bold hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : `Pay $${total}`}
      </button>
    </form>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState("");

  const listingId = searchParams.get("listingId");
  const title = searchParams.get("title");
  const price = Number(searchParams.get("price"));
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = Number(searchParams.get("guests"));
  const userEmail = searchParams.get("userEmail");
  const image = searchParams.get("image");

  // Calculate total for display
  const start = checkIn ? new Date(checkIn) : new Date();
  const end = checkOut ? new Date(checkOut) : new Date();
  let nights = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (nights === 0) {
    nights = 1;
  }
  const subtotal = price * nights * guests;
  const cleaningFee = 50;
  const serviceFee = 30;
  const total = subtotal + cleaningFee + serviceFee;

  useEffect(() => {
    if (!listingId) return;

    // Create PaymentIntent as soon as the page loads
    axios.post("/api/create-payment-intent", {
        listingId,
        price,
        checkIn,
        checkOut,
        guests,
        userEmail,
    })
      .then((res) => setClientSecret(res.data.clientSecret));
  }, [listingId, price, checkIn, checkOut, guests, userEmail]);

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-black">
            Complete your booking
          </h1>
          <p className="mt-2 text-black">
            Secure payment • Instant confirmation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT — Booking Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-bold text-black mb-6">
              Booking summary
            </h2>

            {image && (
              <div className="relative w-full h-56 mb-6">
                <Image
                  src={image}
                  alt={title || "Listing"}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            )}

            <h3 className="text-lg font-semibold text-black mb-4">{title}</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-black">Check-in</span>
                <span className="text-black">
                  {new Date(checkIn!).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-black">Check-out</span>
                <span className="text-black">
                  {new Date(checkOut!).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-black">Guests</span>
                <span className="text-black">{guests}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-black font-medium">${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cleaning fee</span>
                <span className="text-black font-medium">${cleaningFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service fee</span>
                <span className="text-black font-medium">${serviceFee}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-black">Total amount</span>
              <span className="text-2xl font-bold text-black">${total}</span>
            </div>
          </div>

          {/* RIGHT — Payment */}
          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-bold text-black mb-6">
              Payment details
            </h2>

            <Elements
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorText: "#000000",
                    colorPrimary: "#e11d48",
                    fontFamily: "Inter, system-ui, sans-serif",
                  },
                },
              }}
              stripe={stripePromise}
            >
              <CheckoutForm total={total} />
            </Elements>

            <p className="mt-6 text-xs text-black text-center">
              Your payment is securely processed by Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
