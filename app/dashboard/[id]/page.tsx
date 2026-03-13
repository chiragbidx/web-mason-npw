"use client";

import { useState, useEffect, ElementType } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Star,
  MapPin,
  Wifi,
  Car,
  Utensils,
  Coffee,
  Tv,
  Wind,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Loader from "@/components/ui/Loader";

// Helper for amenity icons

const AMENITY_ICONS: Record<string, ElementType> = {
  Wifi: Wifi,
  Parking: Car,
  Restaurant: Utensils,
  Breakfast: Coffee,
  TV: Tv,
  AC: Wind,
  Bar: Coffee,
  Gym: Wind,
  Pool: Wind,
};


type Listing = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  type: string;
  amenities: { amenity: { name: string } }[];
  images: { url: string }[];
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  availability?: { date: string; isBooked: boolean }[];
};

export default function ListingDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
    const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/${id}`);
        if (res.ok) {
              const data: Listing = await res.json();
          setListing(data);
          if (data.availability) {
            const booked = data.availability
                  .filter((a) => a.isBooked)
                  .map((a) => a.date.split("T")[0]);

            const bookedWithCheckout = new Set<string>(booked);
            booked.forEach((dateStr: string) => {
              const [y, m, d] = dateStr.split("-").map(Number);
              const date = new Date(Date.UTC(y, m - 1, d));
              date.setUTCDate(date.getUTCDate() + 1);
              const nextDay = date.toISOString().split("T")[0];
              bookedWithCheckout.add(nextDay);
            });

            setBookedDates(Array.from(bookedWithCheckout));
          }
        } else {
          toast.error("Failed to load property details");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const isDateBooked = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return bookedDates.includes(`${year}-${month}-${day}`);
  };

  const isRangeValid = (start: Date, end: Date) => {
    const current = new Date(start);
    const endDate = new Date(end);
    while (current < endDate) {
      if (isDateBooked(current)) return false;
      current.setDate(current.getDate() + 1);
    }
    return true;
  };

  const handleBook = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (!isRangeValid(checkIn, checkOut)) {
      toast.error("Selected dates include booked days. Please choose different dates.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      router.push("/auth/login");
      return;
    }

    // Create UTC dates to avoid timezone shifts
    const checkInDate = new Date(Date.UTC(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate()));
    const checkOutDate = new Date(Date.UTC(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate()));

    // Redirect to payment page with details
    const queryParams = new URLSearchParams({
      listingId: listing!.id,
      title: listing!.title,
      price: listing!.price.toString(),
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      guests: guests.toString(),
      image: listing!.images[0]?.url || "",
    });

    router.push(`/payment?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900">Property not found</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-rose-600 hover:underline flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    );
  }

  // Calculate total price
  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;
  const totalPrice = nights * listing.price;

  return (
    <div className="min-h-screen bg-white pb-20">
      <style>{`
        .react-datepicker__day--disabled.booked-date {
          background-color: #fee2e2 !important;
          color: #ef4444 !important;
          text-decoration: line-through;
        }
      `}</style>
        <div className="max-w-7xl mx-auto px-4 pt-6">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-sm text-black hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>
      {/* Header / Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1 font-medium text-black">
              <Star className="w-4 h-4 fill-black" />
              {listing.rating || "New"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 underline cursor-pointer hover:text-rose-600">
              <MapPin className="w-4 h-4" />
              {listing.location}
            </span>
          </div>
        </div>

        {/* Image Grid */}
        <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-100 md:h-125">
                {/* First large image */}
                {listing.images[0] && (
                  <div
                    className="relative col-span-2 row-span-2 cursor-pointer group overflow-hidden"
                    onClick={() => {
                      setSelectedImageIndex(0);
                      setImageModalOpen(true);
                    }}
                  >
                    <Image
                      src={listing.images[0].url}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                {/* Next 4 smaller images */}
                {listing.images.slice(1, 5).map((img, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer group overflow-hidden"
                    onClick={() => {
                      setSelectedImageIndex(index + 1);
                      setImageModalOpen(true);
                    }}
                  >
                    <Image
                      src={img.url}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {index === 3 && listing.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex(0);
                            setImageModalOpen(true);
                          }}
                          className="text-white font-semibold text-sm md:text-lg px-4 md:px-6 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                        >
                          View More ({listing.images.length - 5} more)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
      

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="flex items-center justify-between pb-8 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Hosted by {listing.user?.name || "Host"}
                </h2>
                <p className="text-gray-500">
                  {listing.type} • {listing.location}
                </p>
              </div>
              <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden relative flex items-center justify-center">
                {listing.user?.image ? (
                  <Image
                    src={listing.user.image}
                    alt="Host"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-500">
                    {listing.user?.name?.[0] || "H"}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                About this place
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What this place offers
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {listing.amenities.map((item, idx) => {
                  const Icon = AMENITY_ICONS[item.amenity.name] || Sparkles;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-gray-600"
                    >
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span>{item.amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map Section */}
            <div className="pb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Where you&apos;ll be
              </h3>
              <p className="text-gray-600 mb-4">{listing.location}</p>
              <div className="w-full h-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100 relative">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    listing.location,
                  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full"
                  title="Location Map"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="relative">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 shadow-xl p-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    ${listing.price}
                  </span>
                  <span className="text-gray-500"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span className="text-black font-medium">{listing.rating || "New"}</span>
                </div>
              </div>

              <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
                <div className="grid grid-cols-2 border-b border-gray-300">
                  <div className="p-3 border-r border-gray-300">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Check-in
                    </label>
                    <DatePicker
                      selected={checkIn}
                      onChange={(date: Date | null) => setCheckIn(date)}
                      selectsStart
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={new Date()}
                      filterDate={(date) => !isDateBooked(date)}
                      dayClassName={(date: Date) => (isDateBooked(date) ? "booked-date" : "")}
                      placeholderText="Add date"
                      className="text-black w-full text-sm outline-none cursor-pointer"
                    />
                  </div>
                  <div className="p-3">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Check-out
                    </label>
                    <DatePicker
                      selected={checkOut}
                      onChange={(date: Date | null) => setCheckOut(date)} 
                      selectsEnd
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={checkIn || new Date()}
                      filterDate={(date) => !isDateBooked(date)}
                      dayClassName={(date: Date) => (isDateBooked(date) ? "booked-date" : "")}
                      placeholderText="Add date"
                      className="text-black w-full text-sm outline-none cursor-pointer"
                    />
                  </div>
                </div>
                <div className="p-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="text-black w-full text-sm outline-none bg-transparent cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} guest{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleBook}
                className="w-full bg-linear-to-r from-rose-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition shadow-md mb-4"
              >
                Reserve
              </button>

              {nights > 0 && (
                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span className="underline">
                      ${listing.price} x {nights} nights
                    </span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Cleaning fee</span>
                    <span>$50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Service fee</span>
                    <span>$30</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-lg">
                    <span>Total</span>
                    <span>${totalPrice + 80}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
       {imageModalOpen && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                <div className="relative w-full max-w-6xl h-full flex flex-col">
                  {/* Close Button */}
                  <button
                    onClick={() => setImageModalOpen(false)}
                    className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 hover:bg-black/70"
                  >
                    <X className="w-6 h-6" />
                  </button>
      
                  {/* Main Image */}
                  <div className="flex-1 relative mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={listing.images[selectedImageIndex]?.url}
                      alt={listing.title}
                      fill
                      className="object-contain"
                    />
                  </div>
      
                  {/* Navigation Buttons */}
                  {listing.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedImageIndex(
                            selectedImageIndex === 0
                              ? listing.images.length - 1
                              : selectedImageIndex - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 hover:bg-black/70 z-10"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedImageIndex(
                            selectedImageIndex === listing.images.length - 1
                              ? 0
                              : selectedImageIndex + 1
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 hover:bg-black/70 z-10"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
      
                  {/* Thumbnail Strip */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {listing.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          index === selectedImageIndex
                            ? "border-white scale-110"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={`${listing.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
      
                  {/* Image Counter */}
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                    {selectedImageIndex + 1} / {listing.images.length}
                  </div>
                </div>
              </div>
            )}
    </div>
  );
}