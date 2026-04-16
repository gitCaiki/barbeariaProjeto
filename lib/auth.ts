import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export const ADMIN_USER_ID_COOKIE = "barbearia_admin_user_id"
const DEFAULT_USERNAME = process.env.ADMIN_USERNAME ?? "admin"
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD ?? ""

export async function ensureDefaultUser() {
  let user = await prisma.user.findUnique({
    where: { username: DEFAULT_USERNAME },
  })

  if (!user && DEFAULT_PASSWORD) {
    user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        username: DEFAULT_USERNAME,
        password: DEFAULT_PASSWORD,
      },
    })
  }

  return user
}

export async function getLoggedInUserId() {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_USER_ID_COOKIE)?.value ?? null
}
