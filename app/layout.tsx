import "./globals.css";
import RouteGuard from "@/components/auth/RouteGuard";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RouteGuard>
          {children}
        </RouteGuard>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
