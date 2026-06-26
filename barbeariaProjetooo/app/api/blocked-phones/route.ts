import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { normalizePhone } from "@/lib/phone"
import { adminAuth } from "@/app/admin/loggin"

// GET - List all blocked phones
export async function GET(req: Request) {
  // Check if admin (optional, since we might want to check if a phone is blocked publicly)
  const isAdmin = adminAuth.isLoggedIn()
  
  const { searchParams } = new URL(req.url)
  const telefone = searchParams.get("telefone")

  if (telefone) {
    const normalized = normalizePhone(telefone)
    const blocked = await prisma.blockedPhone.findUnique({
      where: { telefone: normalized }
    })
    return NextResponse.json({ ok: true, blocked: !!blocked })
  }

  // If admin, list all
  if (isAdmin) {
    const blockedPhones = await prisma.blockedPhone.findMany({
      orderBy: { bloqueadoEm: "desc" }
    })
    return NextResponse.json({ ok: true, blockedPhones })
  }

  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
}

// POST - Block a new phone
export async function POST(req: Request) {
  const isAdmin = adminAuth.isLoggedIn()
  if (!isAdmin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const { telefone, motivo } = body

  const normalized = normalizePhone(telefone)
  if (!normalized) {
    return NextResponse.json({ ok: false, error: "Telefone inválido" }, { status: 400 })
  }

  try {
    const blocked = await prisma.blockedPhone.create({
      data: {
        telefone: normalized,
        motivo
      }
    })
    return NextResponse.json({ ok: true, blocked })
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Telefone já bloqueado" }, { status: 409 })
  }
}

// DELETE - Unblock a phone
export async function DELETE(req: Request) {
  const isAdmin = adminAuth.isLoggedIn()
  if (!isAdmin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const { telefone } = body

  const normalized = normalizePhone(telefone)
  if (!normalized) {
    return NextResponse.json({ ok: false, error: "Telefone inválido" }, { status: 400 })
  }

  try {
    await prisma.blockedPhone.delete({
      where: { telefone: normalized }
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Telefone não encontrado" }, { status: 404 })
  }
}
