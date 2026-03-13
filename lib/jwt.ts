import jwt from "jsonwebtoken";

const AUTH_SECRET = process.env.AUTH_SECRET!;

export function signToken(payload: any) {
  return jwt.sign(payload, AUTH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, AUTH_SECRET);
}
