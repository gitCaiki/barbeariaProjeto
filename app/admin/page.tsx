"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { adminAuth } from "@/app/admin/loggin"
import { cn } from "@/lib/utils"

type AppointmentStatus = "agendado" | "em_andamento" | "finalizado" | "cancelado"

type AppointmentAdmin = {
  id: string
  cliente: string
  servico: string
  horario: string
  duracao: number
  status: AppointmentStatus
  data: string
}

type FilterKey = "todos" | "hoje" | "finalizados" | "cancelados"
type ApiAppointmentStatus = "agendado" | "em_andamento" | "finalizado" | "cancelado"
type ApiAppointment = {
  id: string
  clienteNome: string
  clienteTelefone: string
  servicoNome: string
  duracao: number
  startDateTime: string
  endDateTime: string
  status: ApiAppointmentStatus
  createdAt: string
}

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map((n) => Number(n))
  return h * 60 + m
}

const formatTodayIso = () => {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const dd = String(now.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

const mapApiToAdmin = (appointment: ApiAppointment): AppointmentAdmin => {
  const start = new Date(appointment.startDateTime)
  const yyyy = start.getFullYear()
  const mm = String(start.getMonth() + 1).padStart(2, "0")
  const dd = String(start.getDate()).padStart(2, "0")
  const hh = String(start.getHours()).padStart(2, "0")
  const min = String(start.getMinutes()).padStart(2, "0")

  return {
    id: appointment.id,
    cliente: appointment.clienteNome,
    servico: appointment.servicoNome,
    horario: `${hh}:${min}`,
    duracao: appointment.duracao,
    status: appointment.status,
    data: `${yyyy}-${mm}-${dd}`,
  }
}

const statusLabel: Record<AppointmentStatus, string> = {
  agendado: "Agendado",
  em_andamento: "Em andamento",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
}

const statusClass: Record<AppointmentStatus, string> = {
  agendado: "bg-blue-600/15 text-blue-300 border-blue-600/30",
  em_andamento: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  finalizado: "bg-green-600/15 text-green-300 border-green-600/30",
  cancelado: "bg-red-600/15 text-red-300 border-red-600/30",
}

export default function AdminPage() {
  const router = useRouter()
  const [checkedAuth, setCheckedAuth] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [loadingAppointments, setLoadingAppointments] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const [filter, setFilter] = useState<FilterKey>("hoje")
  const [appointments, setAppointments] = useState<AppointmentAdmin[]>([])

  useEffect(() => {
    const ok = adminAuth.isLoggedIn()
    setIsAuthed(ok)
    setCheckedAuth(true)
    if (!ok) router.replace("/admin/login?next=/admin")
  }, [router])

  useEffect(() => {
    if (!isAuthed) return

    setLoadingAppointments(true)
    setApiError(null)

    fetch("/api/agendamentos")
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as null | {
          ok?: boolean
          error?: string
          agendamentos?: ApiAppointment[]
        }

        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || "Falha ao carregar agendamentos")
        }

        setAppointments((data.agendamentos ?? []).map(mapApiToAdmin))
      })
      .catch((err: unknown) => {
        setApiError(err instanceof Error ? err.message : "Falha ao carregar agendamentos")
      })
      .finally(() => {
        setLoadingAppointments(false)
      })
  }, [isAuthed])

  const todayIso = useMemo(() => formatTodayIso(), [])

  const filtered = useMemo(() => {
    const base = [...appointments]

    const byDate = filter === "hoje" ? base.filter((a) => a.data === todayIso) : base
    const byStatus =
      filter === "finalizados"
        ? byDate.filter((a) => a.status === "finalizado")
        : filter === "cancelados"
          ? byDate.filter((a) => a.status === "cancelado")
          : byDate

    return byStatus.sort((a, b) => toMinutes(a.horario) - toMinutes(b.horario))
  }, [appointments, filter, todayIso])

  const inProgressId = useMemo(() => {
    return filtered.find((a) => a.status === "em_andamento")?.id ?? null
  }, [filtered])

  const nextId = useMemo(() => {
    const now = new Date()
    const minutes = now.getHours() * 60 + now.getMinutes()

    const candidate = filtered
      .filter((a) => a.status === "agendado")
      .find((a) => toMinutes(a.horario) >= minutes)

    return candidate?.id ?? filtered.find((a) => a.status === "agendado")?.id ?? null
  }, [filtered])

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const res = await fetch(`/api/agendamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      const data = (await res.json().catch(() => null)) as null | { ok?: boolean; error?: string }
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Falha ao atualizar status")
      }

      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    } catch (error: unknown) {
      setApiError(error instanceof Error ? error.message : "Falha ao atualizar status")
    }
  }

  const counts = useMemo(() => {
    const base = appointments.filter((a) => a.data === todayIso)
    return {
      total: base.length,
      agendado: base.filter((a) => a.status === "agendado").length,
      em_andamento: base.filter((a) => a.status === "em_andamento").length,
      finalizado: base.filter((a) => a.status === "finalizado").length,
      cancelado: base.filter((a) => a.status === "cancelado").length,
    }
  }, [appointments, todayIso])

  if (!checkedAuth) {
    return (
      <main className="min-h-[100svh] bg-background text-foreground flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
          <p className="text-muted-foreground text-sm">Carregando...</p>
        </div>
      </main>
    )
  }

  if (!isAuthed) {
    return (
      <main className="min-h-[100svh] bg-background text-foreground flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6">
          <h1 className="text-2xl font-serif font-bold">Agenda do Dia</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Faça login para acessar o painel.
          </p>
          <div className="mt-6">
            <button
              className="w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 font-medium"
              onClick={() => router.replace("/admin/login?next=/admin")}
            >
              Ir para login
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[100svh] bg-background text-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-primary text-xs font-medium tracking-widest uppercase">Painel Administrativo</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mt-2">Agenda do Dia</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Total hoje: <span className="text-foreground font-medium">{counts.total}</span> (Agendados {counts.agendado}, Em andamento {counts.em_andamento}, Finalizados {counts.finalizado}, Cancelados {counts.cancelado})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="rounded-md border border-border bg-card/60 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" }).catch(() => null)
                adminAuth.logout()
                router.replace("/admin/login")
              }}
            >
              Sair
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {(
            [
              { key: "todos", label: "Todos" },
              { key: "hoje", label: "Hoje" },
              { key: "finalizados", label: "Finalizados" },
              { key: "cancelados", label: "Cancelados" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={cn(
                "px-4 py-2 rounded-md text-sm border transition-colors",
                filter === item.key
                  ? "bg-primary text-primary-foreground border-primary/40"
                  : "bg-card/50 text-muted-foreground border-border hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Agendamentos</p>
            <p className="text-xs text-muted-foreground">
              Próximo: <span className="text-foreground">{nextId ?? "-"}</span>
            </p>
          </div>

          {apiError && (
            <div className="px-4 py-3 text-sm text-red-400 border-b border-border">
              {apiError}
            </div>
          )}

          <div className="divide-y divide-zinc-800/60">
            {loadingAppointments ? (
              <div className="px-4 py-10 text-center text-muted-foreground">
                Carregando agendamentos...
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-10 text-center text-muted-foreground">
                Nenhum agendamento encontrado.
              </div>
            ) : (
              filtered.map((a) => {
                const isInProgress = a.id === inProgressId
                const isNext = a.id === nextId

                return (
                  <div
                    key={a.id}
                    className={cn(
                      "flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4",
                      isInProgress && "bg-yellow-500/10",
                      !isInProgress && isNext && "bg-blue-600/10"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="text-foreground font-semibold truncate">{a.cliente}</p>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full border", statusClass[a.status])}>
                          {statusLabel[a.status]}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">{a.horario}</span>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">
                        {a.servico} <span className="text-zinc-600">•</span> {a.duracao} min
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">{a.data}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium text-white transition-colors",
                          a.status === "agendado" ? "bg-yellow-500 hover:bg-yellow-400" : "bg-zinc-700 text-zinc-300 cursor-not-allowed"
                        )}
                        onClick={() => updateStatus(a.id, "em_andamento")}
                        disabled={a.status !== "agendado"}
                      >
                        Iniciar atendimento
                      </button>
                      <button
                        className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium text-white transition-colors",
                          a.status === "em_andamento" ? "bg-green-600 hover:bg-green-500" : "bg-zinc-700 text-zinc-300 cursor-not-allowed"
                        )}
                        onClick={() => updateStatus(a.id, "finalizado")}
                        disabled={a.status !== "em_andamento"}
                      >
                        Finalizar
                      </button>
                      <button
                        className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium text-white transition-colors",
                          a.status === "cancelado" || a.status === "finalizado"
                            ? "bg-zinc-700 text-zinc-300 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-500"
                        )}
                        onClick={() => updateStatus(a.id, "cancelado")}
                        disabled={a.status === "cancelado" || a.status === "finalizado"}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
