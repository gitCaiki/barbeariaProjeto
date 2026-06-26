import { NextResponse } from "next/server"
import { ADMIN_USER_ID_COOKIE } from "@/lib/auth"

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_USER_ID_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return response
}
