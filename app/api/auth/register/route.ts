import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// Use bcryptjs instead of bcrypt to avoid native binary issues on Vercel
import bcrypt from "bcryptjs";
import { sendAccountVerificationEmail } from "@/lib/email";

// Ensure this route runs in the Node.js runtime on Vercel (needed for bcrypt & Prisma)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Send registration confirmation email
    try {
      await sendAccountVerificationEmail(email, name || "User");
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
      message: "Account created. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
