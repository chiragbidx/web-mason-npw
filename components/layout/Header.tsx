"use client";
import { usePathname } from "next/navigation";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogOut, UserCircle } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    name: string | null;
    email: string;
  } | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
const pathname = usePathname();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let isMounted = true;

    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted || !data || data.error) return;

        setUser(data);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-pink-600 hover:opacity-80 transition-opacity">
              PandaStay
            </Link>
          </div>

          {/* Desktop Nav */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-1 bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
              <Link
                href="/dashboard"
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === "/dashboard" || pathname === "/"
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                Home
              </Link>
              <Link
                href="/bookings"
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === "/bookings"
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                Bookings
              </Link>
              <Link
                href="/booking-history"
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === "/booking-history"
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                History
              </Link>
            </nav>
          )}

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 focus:outline-none"
                >
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {user?.name?.split(' ')[0] || "User"}
                  </span>
                  <div className="h-10 w-10 rounded-full bg-linear-to-r from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-rose-100 transition-all">
                    <User className="h-5 w-5 text-rose-600" />
                  </div>
                </button>

                {/* Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl py-2 ring-1 ring-black/5 focus:outline-none z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                      <p className="text-sm font-bold text-gray-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <UserCircle className="h-4 w-4" /> View Profile
                      </Link>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-rose-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sidebar Menu */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-pink-600"
                >
                  PandaStay
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-4">
                {isLoggedIn && (
                  <div className="space-y-2 px-3">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        pathname === "/dashboard" || pathname === "/"
                          ? "bg-rose-50 text-rose-600 font-bold shadow-sm"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      href="/bookings"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        pathname === "/bookings"
                          ? "bg-rose-50 text-rose-600 font-bold shadow-sm"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Bookings
                    </Link>
                    <Link
                      href="/booking-history"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        pathname === "/booking-history"
                          ? "bg-rose-50 text-rose-600 font-bold shadow-sm"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      History
                    </Link>
                  </div>
                )}

                {/* Profile & Logout - Together */}
                {isLoggedIn && (
                  <div className="mt-6 pt-6 border-t border-gray-100 px-3 space-y-2">
                    <div className="px-4 mb-2">
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <UserCircle className="h-5 w-5" />
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                )}

                {/* Auth Links for non-logged in users */}
                {!isLoggedIn && (
                  <div className="px-4 space-y-3 mt-6">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-3 rounded-xl text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-rose-600 transition-colors text-center"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-3 rounded-xl text-base font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors text-center shadow-md"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
