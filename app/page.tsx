"use client";

import "react-datepicker/dist/react-datepicker.css";
import { MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import Loader from "@/components/ui/Loader";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
];

type ListingAPI = {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  type: string;
  amenities: { amenity: { name: string } }[];
  images: { url: string }[];
  createdAt: string;
};

type Hotel = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  type: string;
  amenities: string[];
  image: string;
  createdAt: string;
};

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listing");
        if (res.ok) {
          const data: ListingAPI[] = await res.json();
          // Transform API data to match component structure
          const formattedData = data.map((item) => ({
            id: item.id,
            name: item.title,
            location: item.location,
            price: item.price,
            rating: item.rating,
            type: item.type,
            amenities: item.amenities.map((a) => a.amenity.name),
            image: item.images[0]?.url || "https://via.placeholder.com/800",
            createdAt: item.createdAt || new Date().toISOString(),
          }));
          setHotels(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const scrollToFeatured = () => {
    const element = document.getElementById("featured-stays");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Hero Slider Section */}
      <section className="relative h-[85vh] min-h-150 w-full overflow-hidden">
        {HERO_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/20 to-black/70 z-10" />
            <Image
              src={img}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl tracking-tight leading-tight">
              Find Your Perfect <span className="text-rose-500">Getaway</span>
            </h1>
            <p className="text-lg md:text-2xl mb-10 drop-shadow-lg max-w-3xl mx-auto font-light text-gray-100">
              Discover luxury hotels, cozy cabins, and beautiful resorts around
              the world.
            </p>
            <button
              onClick={scrollToFeatured}
              className="group px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white text-lg font-bold rounded-full transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section
        id="featured-stays"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Featured Stays
          </h2>
          <div className="w-24 h-1 bg-rose-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Handpicked selection of top-rated accommodations for your next
            vacation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100 transform hover:-translate-y-1"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 text-gray-800">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  {hotel.rating}
                </div>
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium tracking-wide uppercase">
                  {hotel.type}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1 mb-1">
                    {hotel.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500" />{" "}
                    {hotel.location}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {hotel.amenities.slice(0, 3).map((amenity: string) => (
                    <span
                      key={amenity}
                      className="text-[11px] font-medium bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md border border-gray-100"
                    >
                      {amenity}
                    </span>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <span className="text-[11px] font-medium bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md border border-gray-100">
                      +{hotel.amenities.length - 3} more
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                      Price
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-gray-900">
                        ${hotel.price}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        / night
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/${hotel.id}`}
                    className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-rose-600 transition-colors shadow-md hover:shadow-lg transform active:scale-95"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
