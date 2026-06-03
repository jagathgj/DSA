import type { Problem } from '@/types'

const modules = import.meta.glob<{ default: Problem }>('./problems/*.json', { eager: true })

export const PROBLEMS: Record<string, Problem> = Object.fromEntries(
  Object.values(modules).map((m) => [m.default.id, m.default])
)

export function getProblem(id: string): Problem | undefined {
  return PROBLEMS[id]
}

export function getAllProblems(): Problem[] {
  return Object.values(PROBLEMS)
}
