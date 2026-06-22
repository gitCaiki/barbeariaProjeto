import { normalizePhone } from "./phone"

const BLOCKED_NUMBERS_KEY = "blockedNumbers"

export function getBlockedNumbers(): string[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(BLOCKED_NUMBERS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function isNumberBlocked(phone: string): boolean {
  const normalized = normalizePhone(phone)
  if (!normalized) return false
  const blocked = getBlockedNumbers()
  return blocked.includes(normalized)
}

export function addBlockedNumber(phone: string): void {
  const normalized = normalizePhone(phone)
  if (!normalized) return
  const blocked = getBlockedNumbers()
  if (!blocked.includes(normalized)) {
    blocked.push(normalized)
    localStorage.setItem(BLOCKED_NUMBERS_KEY, JSON.stringify(blocked))
  }
}

export function removeBlockedNumber(phone: string): void {
  const normalized = normalizePhone(phone)
  if (!normalized) return
  const blocked = getBlockedNumbers()
  const filtered = blocked.filter((num) => num !== normalized)
  localStorage.setItem(BLOCKED_NUMBERS_KEY, JSON.stringify(filtered))
}
