import Link from "next/link";

export default function AuthLayout({
  title,
  children,
  footerText,
  footerLink,
  footerLinkText,
}: {
  title: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT — BRAND */}
      <div className="hidden md:flex bg-primary text-white items-center justify-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">PandaCommerce</h1>
          <p className="text-lg text-gray-300">
            Production-ready e-commerce SaaS starter built with Next.js.
          </p>
        </div>
      </div>

      {/* RIGHT — FORM */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6">{title}</h2>

          {children}

          <p className="text-sm text-gray-600 mt-6 text-center">
            {footerText}{" "}
            <Link href={footerLink} className="text-accent font-medium">
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
