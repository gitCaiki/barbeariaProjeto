import { NextResponse } from "next/server"
import { ADMIN_USER_ID_COOKIE, ensureDefaultUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as null | {
    username?: unknown
    password?: unknown
  }

  const username = typeof body?.username === "string" ? body.username : ""
  const password = typeof body?.password === "string" ? body.password : ""

  const defaultUser = await ensureDefaultUser()
  const existingUser = await prisma.user.findUnique({ where: { username } })
  const user = existingUser ?? defaultUser

  if (!user || password !== user.password || username !== user.username) {
    return NextResponse.json({ ok: false, error: "Credenciais inválidas" }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true, userId: user.id })
  response.cookies.set(ADMIN_USER_ID_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
