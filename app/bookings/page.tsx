// app/bookings/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Star,
  X,
  Loader2,
} from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import Loader from "@/components/ui/Loader";

type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  listing: {
    id: string;
    title: string;
    location: string;
    images: { url: string }[];
  };
  review?: {
    id: string;
    rating: number;
    comment: string | null;
  };
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">(
    "upcoming"
  );
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const reviewsFetchedRef = useRef(false);

  useEffect(() => {
    fetchBookings();
    reviewsFetchedRef.current = false; // Reset when bookings are fetched
  }, []);

  // Fetch reviews for bookings when past tab is active
  useEffect(() => {
    if (activeTab === "past" && bookings.length > 0 && !reviewsFetchedRef.current) {
      reviewsFetchedRef.current = true;
      fetchReviewsForBookings();
    }
    // Reset the ref when switching away from past tab
    if (activeTab !== "past") {
      reviewsFetchedRef.current = false;
    }
  }, [activeTab, bookings]);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(data);
      reviewsFetchedRef.current = false;
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsForBookings = async () => {
    setBookings((prevBookings) => {
      const pastBookings = prevBookings.filter((booking) => {
        const isPast = new Date(booking.endDate) < new Date();
        return isPast && booking.status !== "CANCELLED" && !booking.review;
      });

      if (pastBookings.length === 0) {
        return prevBookings; // No bookings need reviews, return unchanged
      }

      // Fetch reviews asynchronously
      const reviewsPromises = pastBookings.map(async (booking) => {
        try {
          const { data } = await axios.get(
            `/api/reviews?bookingId=${booking.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          return { bookingId: booking.id, review: data.review };
        } catch (error) {
          console.error("Failed to fetch review", error);
        }
        return { bookingId: booking.id, review: null };
      });

      Promise.all(reviewsPromises).then((reviewsData) => {
        setBookings((currentBookings) =>
          currentBookings.map((booking) => {
            const reviewData = reviewsData.find((r) => r.bookingId === booking.id);
            // Only update if review doesn't already exist
            if (reviewData && !booking.review) {
              return {
                ...booking,
                review: reviewData.review || undefined,
              };
            }
            return booking;
          })
        );
      });

      return prevBookings; // Return immediately, update will happen asynchronously
    });
  };

  const handleCancel = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedBookingId) return;

    setShowModal(false);
    setCancellingId(selectedBookingId);
    try {
      await axios.patch(`/api/bookings/${selectedBookingId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Refresh list
      fetchBookings();
      setSelectedBookingId(null);
      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling", error);
      const err = error as AxiosError<{ error: string }>;
      const message = err.response?.data?.error || "Failed to cancel";
      toast.error(message);
    } finally {
      setCancellingId(null);
      setSelectedBookingId(null);
    }
  };

  const openRatingModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setRating(0);
    setHoveredRating(0);
    setComment("");
    setRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedBooking(null);
    setRating(0);
    setHoveredRating(0);
    setComment("");
  };

  const handleSubmitRating = async () => {
    if (!selectedBooking || rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/reviews", {
          bookingId: selectedBooking.id,
          listingId: selectedBooking.listing.id,
          rating: rating,
          comment: comment.trim() || null,
        }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Update the booking with the new review
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, review: data.review }
            : booking
        )
      );
      closeRatingModal();
      toast.success("Thank you for your review!");
    } catch (error) {
      console.error("Error submitting review", error);
      const err = error as AxiosError<{ error: string }>;
      const message = err.response?.data?.error || "Failed to submit review. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const isPast = new Date(booking.endDate) < new Date();
    const isCancelled = booking.status === "CANCELLED";

    if (activeTab === "cancelled") return isCancelled;
    if (activeTab === "past") return isPast && !isCancelled;
    return !isPast && !isCancelled; // Upcoming
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black mb-2">My Bookings</h1>
        <p className="text-gray-600 mb-8">
          Manage your upcoming stays and view your booking history.
        </p>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {(["upcoming", "past", "cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab
                  ? "text-rose-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600" />
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-black">
                No {activeTab} bookings
              </h3>
              <p className="text-gray-500 mt-1">
                You do not have any {activeTab} bookings at the moment.
              </p>
              {activeTab === "upcoming" && (
                <Link
                  href="/"
                  className="inline-block mt-4 text-rose-600 font-medium hover:underline"
                >
                  Start exploring
                </Link>
              )}
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0">
                    <Image
                      src={
                        booking.listing.images[0]?.url ||
                        "https://via.placeholder.com/400"
                      }
                      alt={booking.listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-black line-clamp-1">
                            {booking.listing.title}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />{" "}
                            {booking.listing.location}
                          </p>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(booking.startDate)} -{" "}
                            {formatDate(booking.endDate)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-gray-600">
                            <CreditCard className="w-4 h-4" />
                            <span>${booking.totalPrice} Total</span>
                          </div>
                          <div className="text-xs text-gray-400 pl-6">
                            Includes $50 cleaning & $30 service fee
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        href={`/dashboard/${booking.listing.id}`}
                        className="text-sm font-medium text-black hover:text-rose-600 flex items-center gap-1"
                      >
                        View Property <ChevronRight className="w-4 h-4" />
                      </Link>

                      <div className="flex gap-3">
                        {activeTab === "upcoming" && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {cancellingId === booking.id
                              ? "Cancelling..."
                              : "Cancel Booking"}
                          </button>
                        )}

                        {activeTab === "past" && (
                          <>
                            {booking.review ? (
                              <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < booking.review!.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs">Reviewed</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => openRatingModal(booking)}
                                className="px-4 py-2 text-sm font-medium text-black border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                Give Rating
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100">
              <h3 className="text-lg font-bold text-black mb-2">Cancel Booking?</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors"
                >
                  Keep it
                </button>
                <button
                  onClick={confirmCancel}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium text-sm transition-colors shadow-sm"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Rate Your Stay</h2>
              <button
                onClick={closeRatingModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-black mb-1">
                {selectedBooking.listing.title}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedBooking.listing.location}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeRatingModal}
                disabled={submitting}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={submitting || rating === 0}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    CONFIRMED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const icons = {
    CONFIRMED: CheckCircle,
    PENDING: Clock,
    CANCELLED: XCircle,
  };

  const Icon = icons[status as keyof typeof icons] || AlertCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}
