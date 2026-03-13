"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const paymentIntentId = searchParams.get("payment_intent"); // ✅ Added

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const hasConfirmed = useRef(false);

  useEffect(() => {
    // Check for either session_id OR payment_intent
    const idToConfirm = sessionId || paymentIntentId;

    if (!idToConfirm || hasConfirmed.current) return;

    hasConfirmed.current = true;

    const confirmPayment = async () => {
      try {
        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          // Send appropriate ID key
          body: JSON.stringify({ payment_intent_id: paymentIntentId }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Confirmation failed", error);
        setStatus("error");
      }
    };

    confirmPayment();
  }, [sessionId, paymentIntentId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          {status === "loading" && (
            <Loader2 className="w-16 h-16 text-rose-600 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle className="w-16 h-16 text-green-500" />
          )}
          {status === "error" && <div className="text-red-500 text-5xl">!</div>}
        </div>

        <h1 className="text-2xl font-bold text-black mb-2">
          {status === "loading" && "Confirming your booking..."}
          {status === "success" && "Payment Successful!"}
          {status === "error" && "Something went wrong"}
        </h1>

        <p className="text-black mb-8">
          {status === "loading" && "Please wait while we secure your dates."}
          {status === "success" &&
            "Your booking has been confirmed successfully."}
          {status === "error" &&
            "We couldn't confirm your booking. Please contact support."}
        </p>

        {status !== "loading" && (
          <Link
            href="/dashboard"
            className="block w-full bg-rose-600 text-white py-3 rounded-lg font-bold hover:bg-rose-700 transition"
          >
            Return to Home
          </Link>
        )}
      </div>
    </div>
  );
}
