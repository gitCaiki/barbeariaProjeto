import { NextResponse } from "next/server"
import { z } from "zod"
import { ensureDefaultUser, getLoggedInUserId } from "@/lib/auth"
import { normalizePhone } from "@/lib/phone"
import { prisma } from "@/lib/prisma"

const createAppointmentSchema = z.object({
  clienteNome: z.string().min(2),
  clienteTelefone: z.string().min(8),
  servicoNome: z.string().min(1),
  duracao: z.number().int().positive(),
  startDateTime: z.string().datetime(),
  userId: z.string().uuid().optional(),
})

function mapAppointment(appointment: {
  id: string
  clienteNome: string
  clienteTelefone: string
  servicoNome: string
  duracao: number
  startDateTime: Date
  endDateTime: Date
  status: string
  createdAt: Date
}) {
  return {
    id: appointment.id,
    clienteNome: appointment.clienteNome,
    clienteTelefone: appointment.clienteTelefone,
    servicoNome: appointment.servicoNome,
    duracao: appointment.duracao,
    startDateTime: appointment.startDateTime.toISOString(),
    endDateTime: appointment.endDateTime.toISOString(),
    status: appointment.status,
    createdAt: appointment.createdAt.toISOString(),
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = createAppointmentSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Dados inválidos" }, { status: 400 })
  }

  const payload = parsed.data
  const telefoneNormalizado = normalizePhone(payload.clienteTelefone)
  if (!telefoneNormalizado) {
    return NextResponse.json({ ok: false, error: "Telefone inválido" }, { status: 400 })
  }

  const startDateTime = new Date(payload.startDateTime)
  const endDateTime = new Date(startDateTime.getTime() + payload.duracao * 60 * 1000)

  let targetUserId = payload.userId
  if (!targetUserId) {
    const defaultUser = await ensureDefaultUser()
    if (!defaultUser) {
      return NextResponse.json({ ok: false, error: "Usuário padrão não configurado" }, { status: 500 })
    }
    targetUserId = defaultUser.id
  }

  const conflito = await prisma.appointment.findFirst({
    where: {
      userId: targetUserId,
      startDateTime: { lt: endDateTime },
      endDateTime: { gt: startDateTime },
      status: { not: "cancelado" },
    },
  })

  if (conflito) {
    return NextResponse.json(
      { ok: false, error: "Horário indisponível: existe conflito com outro agendamento." },
      { status: 409 }
    )
  }

  const appointment = await prisma.appointment.create({
    data: {
      clienteNome: payload.clienteNome,
      clienteTelefone: telefoneNormalizado,
      servicoNome: payload.servicoNome,
      duracao: payload.duracao,
      startDateTime,
      endDateTime,
      status: "agendado",
      userId: targetUserId,
    },
  })

  return NextResponse.json({ ok: true, agendamento: mapAppointment(appointment) }, { status: 201 })
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const telefoneQuery = url.searchParams.get("telefone")
  const telefoneNormalizado = telefoneQuery ? normalizePhone(telefoneQuery) : ""

  if (telefoneQuery) {
    if (!telefoneNormalizado) {
      return NextResponse.json({ ok: false, error: "Telefone inválido" }, { status: 400 })
    }

    await prisma.appointment.updateMany({
      where: {
        clienteTelefone: telefoneNormalizado,
        status: "agendado",
        endDateTime: { lt: new Date() },
      },
      data: { status: "finalizado" },
    })

    const agendamentosPorTelefone = await prisma.appointment.findMany({
      where: { clienteTelefone: telefoneNormalizado },
      orderBy: { startDateTime: "asc" },
    })

    return NextResponse.json({
      ok: true,
      agendamentos: agendamentosPorTelefone.map((item) =>
        mapAppointment({
          ...item,
          endDateTime: item.endDateTime ?? new Date(item.startDateTime.getTime() + item.duracao * 60 * 1000),
        })
      ),
    })
  }

  const loggedUserId = await getLoggedInUserId()
  const defaultUser = await ensureDefaultUser()
  const userId = loggedUserId ?? defaultUser?.id

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Usuário não encontrado" }, { status: 401 })
  }

  await prisma.appointment.updateMany({
    where: {
      userId,
      status: "agendado",
      endDateTime: { lt: new Date() },
    },
    data: { status: "finalizado" },
  })

  const appointments = await prisma.appointment.findMany({
    where: { userId },
    orderBy: { startDateTime: "asc" },
  })

  const normalized = await Promise.all(
    appointments.map(async (appointment) => {
      if (!appointment.endDateTime) {
        const computedEnd = new Date(appointment.startDateTime.getTime() + appointment.duracao * 60 * 1000)
        const updated = await prisma.appointment.update({
          where: { id: appointment.id },
          data: { endDateTime: computedEnd },
        })
        return updated
      }
      return appointment
    })
  )

  return NextResponse.json({
    ok: true,
    agendamentos: normalized.map((item) =>
      mapAppointment({
        ...item,
        endDateTime: item.endDateTime ?? new Date(item.startDateTime.getTime() + item.duracao * 60 * 1000),
      })
    ),
  })
}
