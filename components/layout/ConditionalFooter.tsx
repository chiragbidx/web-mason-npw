"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on auth pages
  const hideFooterPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  const shouldHideFooter = hideFooterPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (shouldHideFooter) {
    return null;
  }

  return <Footer />;
}
