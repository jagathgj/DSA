import type { Lesson } from '@/types'

// Vite glob import — loads every lesson JSON in this folder.
// Adding a new lesson = adding a new JSON file. No code changes needed.
const modules = import.meta.glob<{ default: Lesson }>('./lessons/*.json', { eager: true })

export const LESSONS: Record<string, Lesson> = Object.fromEntries(
  Object.values(modules).map((m) => [m.default.id, m.default])
)

export function getLesson(id: string): Lesson | undefined {
  return LESSONS[id]
}

export function getAllLessons(): Lesson[] {
  return Object.values(LESSONS)
}
