import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// Use bcryptjs instead of bcrypt to avoid native binary issues on Vercel
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

// Ensure this route runs in the Node.js runtime on Vercel (needed for bcrypt & Prisma)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json({
      token,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
