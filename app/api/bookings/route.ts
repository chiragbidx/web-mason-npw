// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";

export const dynamic = "force-dynamic";


export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const bookings = await prisma.booking.findMany({
      where: { userId: auth.userId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            location: true,
            images: {
              take: 1,
              select: { url: true },
            },
          },
        },
        reviews: {
          where: { userId: auth.userId },
          select: {
            id: true,
            rating: true,
            comment: true,
          },
          take: 1,
        },
      },
      orderBy: { startDate: "desc" },
    });

    // Transform reviews array to single review object
    const bookingsWithReview = bookings.map(({ reviews, ...booking }) => ({
      ...booking,
      review: reviews[0] || undefined,
    }));

    return NextResponse.json(bookingsWithReview);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
