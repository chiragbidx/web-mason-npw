// app/history/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Download, Calendar, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import Loader from "@/components/ui/Loader";
import axios from "axios";

const ROSE_COLOR = "#e11d48";
const GRAY_COLOR = "#4b5563";
const BLACK_COLOR = "#000000";

type PaymentHistoryItem = {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  transactionId: string | null;
  booking: {
    startDate: string;
    endDate: string;
    listing: {
      title: string;
      location: string;
      images?: { url: string }[];
    };
  };
};

export default function HistoryPage() {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get("/api/booking-history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPayments(data);
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getBase64Image = async (url: string) => {
    try {
      const { data } = await axios.get(url, { responseType: "blob" });
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(data);
      });
    } catch (e) {
      console.error("Error loading image", e);
      return null;
    }
  };

  const downloadReceipt = async (payment: PaymentHistoryItem) => {
    const doc = new jsPDF();

    // Header Background
    doc.setFillColor(ROSE_COLOR);
    doc.rect(0, 0, 210, 40, "F");

    // --- Header Text ---
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PandaStay", 20, 26);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("RECEIPT", 190, 26, { align: "right" });

    // --- Meta Info ---
    doc.setTextColor(GRAY_COLOR);
    doc.setFontSize(10);
    const metaY = 55;

    doc.text(`Receipt #: ${payment.id.slice(-8).toUpperCase()}`, 20, metaY);
    doc.text(
      `Date: ${new Date(payment.createdAt).toLocaleDateString()}`,
      20,
      metaY + 5
    );
    doc.text(`Transaction ID: ${payment.transactionId || "N/A"}`, 20, metaY + 10);

    // Status Badge
    const statusColor = payment.status === "COMPLETED" ? "#166534" : "#854d0e";
    doc.setTextColor(statusColor);
    doc.setFont("helvetica", "bold");
    doc.text(payment.status.toUpperCase(), 190, metaY, { align: "right" });

    // --- Property Details ---
    const contentY = 85;

    // Load Image
    const imageUrl = payment.booking.listing.images?.[0]?.url;
    if (imageUrl) {
      const imgBase64 = await getBase64Image(imageUrl);
      if (imgBase64) {
        doc.addImage(imgBase64, "JPEG", 20, contentY, 80, 50); // x, y, w, h
      }
    }

    // Details Text (Right of image if exists, else left)
    const detailsX = imageUrl ? 110 : 20;

    doc.setTextColor(GRAY_COLOR);
    doc.setFontSize(10);
    doc.text("Property Details", detailsX, contentY + 5);

    doc.setTextColor(BLACK_COLOR);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    // Wrap title if long
    const titleLines = doc.splitTextToSize(payment.booking.listing.title, 80);
    doc.text(titleLines, detailsX, contentY + 14);

    const titleHeight = titleLines.length * 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(GRAY_COLOR);
    doc.text(
      payment.booking.listing.location,
      detailsX,
      contentY + 14 + titleHeight
    );

    // Dates
    const datesY = contentY + 14 + titleHeight + 12;
    doc.setTextColor(BLACK_COLOR);
    doc.text(
      `Check-in:   ${new Date(payment.booking.startDate).toLocaleDateString()}`,
      detailsX,
      datesY
    );
    doc.text(
      `Check-out:  ${new Date(payment.booking.endDate).toLocaleDateString()}`,
      detailsX,
      datesY + 5
    );

    // --- Payment Table ---
    const tableY = contentY + 65;

    // Table Header
    doc.setFillColor(245, 245, 245);
    doc.rect(20, tableY, 170, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(BLACK_COLOR);
    doc.text("Description", 25, tableY + 7);
    doc.text("Amount", 185, tableY + 7, { align: "right" });

    // Table Row
    doc.setFont("helvetica", "normal");
    
    const cleaningFee = 50;
    const serviceFee = 30;
    const accommodation = payment.amount - cleaningFee - serviceFee;

    doc.text(
      `Accommodation (${payment.booking.listing.title})`,
      25,
      tableY + 20
    );
    doc.text(`$${accommodation.toFixed(2)}`, 185, tableY + 20, {
      align: "right",
    });

    doc.text("Cleaning Fee", 25, tableY + 28);
    doc.text(`$${cleaningFee.toFixed(2)}`, 185, tableY + 28, { align: "right" });

    doc.text("Service Fee", 25, tableY + 36);
    doc.text(`$${serviceFee.toFixed(2)}`, 185, tableY + 36, { align: "right" });

    // Line
    doc.setDrawColor(220, 220, 220);
    doc.line(20, tableY + 45, 190, tableY + 45);

    // Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total", 140, tableY + 55);
    doc.setTextColor(ROSE_COLOR);
    doc.setFontSize(14);
    doc.text(`$${payment.amount.toFixed(2)}`, 185, tableY + 55, {
      align: "right",
    });

    // Footer
    doc.setTextColor(GRAY_COLOR);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for staying with PandaStay!", 105, 280, {
      align: "center",
    });
    doc.text("support@pandastay.com", 105, 285, { align: "center" });

    // Save
    doc.save(`Receipt-${payment.id}.pdf`);
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-sm text-black hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <h1 className="text-3xl font-bold text-black mb-8">Payment History</h1>

        {payments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-black">No payments found</h3>
            <p className="text-gray-500 mt-2">
              You have not made any transactions yet.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 text-rose-600 font-medium hover:underline"
            >
              Start Booking
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Left Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-black mb-2">
                      {payment.booking.listing.title}
                    </h3>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {payment.booking.listing.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(payment.booking.startDate).toLocaleDateString()} -{" "}
                          {new Date(payment.booking.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 min-w-35 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Amount
                      </p>
                      <p className="text-2xl font-bold text-black">
                        ${payment.amount}
                      </p>
                    </div>

                    <button
                      onClick={() => downloadReceipt(payment)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}