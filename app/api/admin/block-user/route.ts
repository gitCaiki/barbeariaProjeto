import { NextResponse } from "next/server"
import { z } from "zod"
import { getLoggedInUserId } from "@/lib/auth"
import { normalizePhone } from "@/lib/phone"
import { prisma } from "@/lib/prisma"

const blockSchema = z.object({
  telefone: z.string().min(8),
  motivo: z.string().optional(),
})

export async function GET() {
  const userId = await getLoggedInUserId()
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 })
  }

  try {
    const bloqueados = await prisma.bloqueado.findMany({
      orderBy: { bloqueadoEm: "desc" },
    })

    return NextResponse.json({ ok: true, bloqueados })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error: "Falha ao carregar números bloqueados" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const userId = await getLoggedInUserId()
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => null)
    const parsed = blockSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Dados inválidos" }, { status: 400 })
    }

    const { telefone, motivo } = parsed.data
    const telefoneNormalizado = normalizePhone(telefone)

    if (!telefoneNormalizado) {
      return NextResponse.json({ ok: false, error: "Telefone inválido" }, { status: 400 })
    }

    const exists = await prisma.bloqueado.findUnique({
      where: { telefone: telefoneNormalizado },
    })

    if (exists) {
      return NextResponse.json({ ok: false, error: "Esse número já está bloqueado" }, { status: 409 })
    }

    const bloqueado = await prisma.bloqueado.create({
      data: {
        id: crypto.randomUUID(),
        telefone: telefoneNormalizado,
        motivo,
        userId,
      },
    })

    return NextResponse.json({ ok: true, bloqueado }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error: "Falha ao bloquear número" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const userId = await getLoggedInUserId()
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID não fornecido" }, { status: 400 })
    }

    await prisma.bloqueado.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error: "Falha ao desbloquear número" }, { status: 500 })
  }
}
