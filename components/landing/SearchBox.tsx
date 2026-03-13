"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SearchBox() {
  const [location, setLocation] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const handleSearch = (): void => {
    console.log({
      location,
      checkIn,
      checkOut,
    });
  };

  return (
    <div className="w-full flex justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Location */}
          <div className="flex-1 px-6 py-4 border-b md:border-b-0 md:border-r border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLocation(e.target.value)
              }
              placeholder="Where are you going?"
              className="mt-1 w-full text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Check-in */}
          <div className="flex-1 px-6 py-4 border-b md:border-b-0 md:border-r border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Check in
            </label>
            <DatePicker
              selected={checkIn}
              onChange={(date: Date | null) => setCheckIn(date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={new Date()}
              placeholderText="Add date"
              className="mt-1 w-full text-sm font-medium text-gray-800 focus:outline-none"
            />
          </div>

          {/* Check-out */}
          <div className="flex-1 px-6 py-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Check out
            </label>
            <DatePicker
              selected={checkOut}
              onChange={(date: Date | null) => setCheckOut(date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn ?? new Date()}
              placeholderText="Add date"
              className="mt-1 w-full text-sm font-medium text-gray-800 focus:outline-none"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-center justify-center p-3">
            <button
              onClick={handleSearch}
              className="bg-rose-600 hover:bg-rose-700 transition text-white rounded-xl md:rounded-full p-4 w-full md:w-auto shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6 mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
