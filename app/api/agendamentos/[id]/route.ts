import { NextResponse } from "next/server"
import { z } from "zod"
import { getLoggedInUserId } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const patchSchema = z.object({
  status: z.enum(["agendado", "em_andamento", "finalizado", "cancelado"]),
})

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const userId = await getLoggedInUserId()

  const body = await req.json().catch(() => null)
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Status inválido" }, { status: 400 })
  }

  const requestedStatus = parsed.data.status

  if (!userId && requestedStatus !== "cancelado") {
    return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 })
  }

  const appointment = await prisma.appointment.findUnique({ where: { id } })
  if (!appointment) {
    return NextResponse.json({ ok: false, error: "Agendamento não encontrado" }, { status: 404 })
  }

  // Cancelamento é permitido por id para evitar bloqueio em contexto misto cliente/admin.
  if (requestedStatus !== "cancelado" && userId) {
    if (appointment.userId && appointment.userId !== userId) {
      return NextResponse.json({ ok: false, error: "Agendamento não encontrado" }, { status: 404 })
    }
  } else if (requestedStatus !== "cancelado" && !userId) {
    return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 })
  }

  await prisma.appointment.update({
    where: { id },
    data: { status: requestedStatus },
  })

  return NextResponse.json({ ok: true })
}
