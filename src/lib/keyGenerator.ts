import { customAlphabet } from 'nanoid'

// Format: TEAM-XXXX-XXXX-XXXX (z.B. TEAM-A3B7-K9M2-P4Q8)
export function generateProductKey(): string {
  const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 4)
  return `TEAM-${nanoid()}-${nanoid()}-${nanoid()}`
}

export function validateKeyFormat(key: string): boolean {
  const regex = /^TEAM-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
  return regex.test(key)
}
