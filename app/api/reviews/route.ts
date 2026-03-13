// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";
export const dynamic = "force-dynamic";


export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const { bookingId, listingId, rating, comment } = body;

    // Validate input
    if (!bookingId || !listingId || !rating) {
      return NextResponse.json(
        { error: "Booking ID, Listing ID, and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Verify the booking belongs to the user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: auth.userId,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found or unauthorized" },
        { status: 404 }
      );
    }

    // Check if user has already reviewed this booking
    const existingReview = await prisma.review.findFirst({
      where: {
        bookingId: bookingId,
        userId: auth.userId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this booking" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId: auth.userId,
        listingId: listingId,
        bookingId: bookingId,
        rating: parseInt(rating),
        comment: comment || null,
      },
    });

    // Calculate and update the listing's average rating
    const allReviews = await prisma.review.findMany({
      where: { listingId: listingId },
      select: { rating: true },
    });

    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.listing.update({
      where: { id: listingId },
      data: { rating: averageRating },
    });

    return NextResponse.json({
      success: true,
      review,
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// GET endpoint to check if a review exists for a booking
export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const review = await prisma.review.findFirst({
      where: {
        bookingId: bookingId,
        userId: auth.userId,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}
