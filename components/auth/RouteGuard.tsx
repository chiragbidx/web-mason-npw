"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicPaths = [
      "/auth/login",
      "/auth/register",
      "/",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/dashboard", // property page and dashboard search should be publicly visible
    ];
    const protectedPaths = [
      "/bookings",
      "/booking-history",
      "/profile",
      "/payment",
      "/success",
    ];

    const authRedirectPaths = ["/auth/login", "/auth/register"];

    const isPublicPath = publicPaths.some((path) =>
      path === "/" ? pathname === path : pathname.startsWith(path),
    );
    const isProtectedPath = protectedPaths.some((path) =>
      pathname.startsWith(path),
    );
    const isAuthRedirectPath = authRedirectPaths.some((path) =>
      pathname.startsWith(path),
    );

    if (token && isAuthRedirectPath) {
      // If logged in and trying to access auth pages, redirect to dashboard
      router.replace("/dashboard");
    } else if (!token && isProtectedPath) {
      // If not logged in and trying to access protected routes, redirect to login
      router.replace("/auth/login");
    } else {
      // Otherwise, allow access
      if (!authorized) {
        setAuthorized(true);
      }
    }
  }, [router, pathname, authorized]);

  // Prevent flashing of protected content before redirect
  const protectedPaths = ["/bookings", "/booking-history", "/profile", "/payment", "/success"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // If on a protected path and not yet authorized, show nothing (or a loader)
  if (isProtectedPath && !authorized) {
    return null;
  }

  const hideHeaderFooter =
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/auth/forgot-password" ||
    pathname === "/auth/reset-password";

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
