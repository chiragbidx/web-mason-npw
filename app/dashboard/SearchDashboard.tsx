"use client";

import { useState, useMemo, forwardRef, useEffect, ElementType } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Filter,
  Star,
  ArrowUpDown,
  Check,
  Sparkles,
  TrendingUp,
  Heart,
  Wifi,
  Car,
  Utensils,
  Coffee,
  Tv,
  Wind,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const PROPERTY_TYPES = ["Hotel", "Resort", "Apartment", "Cabin", "Villa"];
const AMENITIES_LIST = ["Wifi", "Pool", "Parking", "Gym", "Spa", "Beach Access"];

const AMENITY_ICONS: Record<string, ElementType> = {
  Wifi: Wifi,
  Pool: Wind,
  Parking: Car,
  Gym: Wind,
  Spa: Sparkles,
  "Beach Access": MapPin,
  Restaurant: Utensils,
  Breakfast: Coffee,
  TV: Tv,
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
  images: { url: string }[];
  createdAt: string;
  description: string;
};

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
  description: string;
};

const DateInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; placeholder?: string }
>(({ value, onClick, placeholder }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    type="button"
    className="flex items-center gap-2 text-sm w-full text-left text-gray-700 hover:text-rose-600 transition-colors"
  >
    <Calendar className="w-4 h-4" />
    <span className={value ? "text-black font-medium" : "text-gray-400"}>
      {value || placeholder}
    </span>
  </button>
));
DateInput.displayName = "DateInput";

export default function SearchDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listing");
        if (res.ok) {
          const data: ListingAPI[] = await res.json();
          const formattedData = data.map((item) => ({
            id: item.id,
            name: item.title,
            location: item.location,
            price: item.price,
            rating: item.rating,
            type: item.type,
            amenities: item.amenities.map((a) => a.amenity.name),
            image: item.images[0]?.url || "https://via.placeholder.com/800",
            images: item.images,
            createdAt: item.createdAt || new Date().toISOString(),
            description: item.description,
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

  const filteredHotels = useMemo(() => {
    const result = hotels.filter((hotel) => {
      if (
        location &&
        !hotel.location.toLowerCase().includes(location.toLowerCase()) &&
        !hotel.name.toLowerCase().includes(location.toLowerCase())
      ) {
        return false;
      }
      if (hotel.price < priceRange[0] || hotel.price > priceRange[1]) {
        return false;
      }
      if (selectedTypes.length > 0 && !selectedTypes.includes(hotel.type)) {
        return false;
      }
      if (
        selectedAmenities.length > 0 &&
        !selectedAmenities.every((a) => hotel.amenities.includes(a))
      ) {
        return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return result;
  }, [hotels, location, priceRange, selectedTypes, selectedAmenities, sortBy]);

  const activeFiltersCount =
    selectedTypes.length + selectedAmenities.length + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0);

  const clearAllFilters = () => {
    setLocation("");
    setPriceRange([0, 1000]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setGuests(1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-rose-50/30">
      {/* Enhanced Hero Search Section */}
      <div className="bg-linear-to-br from-rose-600 via-rose-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Where do you want to go? ✈️
            </h1>
            <p className="text-lg text-rose-100">
              Discover amazing places to stay around the world
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-black w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white border focus:border-rose-500 rounded-lg text-sm transition-all outline-none"
              />
            </div>

            
            <div className="relative w-full md:w-40">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="text-black w-full pl-9 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white border focus:border-rose-500 rounded-lg text-sm outline-none appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} Guest{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <button className="w-full md:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div>
              <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h3>
              <div className="space-y-4">
                <label className="text-sm font-medium text-black">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="text-black w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="Min"
                  />
                  <span className="text-black">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="text-black w-full px-3 py-2 border rounded-md text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h4 className="text-sm font-medium text-black mb-3">
                Property Type
              </h4>
              <div className="space-y-2">
                {PROPERTY_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        selectedTypes.includes(type)
                          ? "bg-rose-600 border-rose-600"
                          : "border-gray-300 bg-white group-hover:border-rose-400"
                      }`}
                    >
                      {selectedTypes.includes(type) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                    />
                    <span className="text-sm text-black group-hover:text-black">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h4 className="text-sm font-medium text-black mb-3">
                Amenities
              </h4>
              <div className="space-y-2">
                {AMENITIES_LIST.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        selectedAmenities.includes(amenity)
                          ? "bg-rose-600 border-rose-600"
                          : "border-gray-300 bg-white group-hover:border-rose-400"
                      }`}
                    >
                      {selectedAmenities.includes(amenity) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                    />
                    <span className="text-sm text-black group-hover:text-black">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>


          {/* Main Content */}
          <main className="flex-1">
            {/* Header with Stats */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {filteredHotels.length} {filteredHotels.length === 1 ? "Property" : "Properties"} found
                </h2>
                {location && (
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    in {location}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-rose-600 text-white text-xs rounded-full px-2 py-0.5">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 text-gray-900 py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent cursor-pointer font-medium"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-4/3 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:-translate-y-1"
                  >
                    {/* Image with Favorite */}
                    <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                      <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-linear-to-br from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 z-10">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-gray-900">{hotel.rating}</span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(hotel.id);
                        }}
                        className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all z-10"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            favorites.has(hotel.id)
                              ? "text-rose-600 fill-rose-600"
                              : "text-gray-400 hover:text-rose-500"
                          }`}
                        />
                      </button>

                      {/* Type Badge */}
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold z-10">
                        {hotel.type}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-3">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1 mb-1">
                          {hotel.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-rose-500" />
                          {hotel.location}
                        </p>
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {hotel.amenities.slice(0, 3).map((amenity: string) => {
                          const Icon = AMENITY_ICONS[amenity] || Sparkles;
                          return (
                            <span
                              key={amenity}
                              className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium"
                            >
                              <Icon className="w-3 h-3" />
                              {amenity}
                            </span>
                          );
                        })}
                        {hotel.amenities.length > 3 && (
                          <span className="inline-flex items-center text-[10px] bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-medium">
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Price & CTA */}
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            ${hotel.price}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">/ night</span>
                        </div>
                        <Link
                          href={`/dashboard/${hotel.id}`}
                          className="px-5 py-2.5 bg-linear-to-br from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                          View Details
                          <TrendingUp className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search or filters to find what you are looking for.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-md hover:shadow-lg"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
