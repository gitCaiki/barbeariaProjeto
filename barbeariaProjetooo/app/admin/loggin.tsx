"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

const STORAGE_KEY = "studiofeel_admin_auth"

export function Loggin() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const nextPath = useMemo(() => {
    const next = searchParams.get("next")
    return next && next.startsWith("/") ? next : "/admin"
  }, [searchParams])

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    setIsSubmitting(true)

    fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as null | { ok?: boolean; error?: string }
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || "Falha ao autenticar")
        }

        localStorage.setItem(STORAGE_KEY, "1")
        router.replace(nextPath)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Falha ao autenticar")
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className="min-h-[100svh] bg-background text-foreground flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold">Painel do Barbeiro</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Entre para acessar a agenda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="username">
              Login
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md bg-input border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Digite seu login"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-input border border-border px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Digite a senha"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 font-medium disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-xs text-muted-foreground">
            <p className="mt-2">
              <Link href="/" className="hover:text-primary transition-colors">
                Voltar para o site
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export const adminAuth = {
  storageKey: STORAGE_KEY,
  isLoggedIn: () => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(STORAGE_KEY) === "1"
  },
  logout: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  },
}
