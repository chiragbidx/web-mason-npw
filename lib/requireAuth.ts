import { NextResponse } from "next/server";
import { verifyAuthToken } from "./auth";

export async function requireAuth(req: Request) {
  const authHeader = req.headers.get("authorization");

  let token: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "");
  }

  // Optional: cookie support
  if (!token) {
    const cookie = req.headers.get("cookie");
    const match = cookie?.match(/token=([^;]+)/);
    token = match?.[1] ?? null;
  }

  if (!token) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const payload = verifyAuthToken(token);
  console.log("JWT PAYLOAD:", payload);

  if (!payload) {
    return {
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }

  return { userId: payload.userId, email: payload.email };
}
