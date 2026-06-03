import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ProgressState } from '@/types'
import { todayKey, daysBetween } from '@/lib/utils'

interface ProgressActions {
  completeLesson: (lessonId: string, xp: number) => void
  completeProblem: (problemId: string, xp: number) => void
  recordProblemAttempt: (problemId: string) => void
  recordQuiz: (lessonId: string, correct: number, total: number) => void
  unlockAchievement: (id: string) => boolean
  addXp: (amount: number) => void
  setLastVisited: (lessonId: string) => void
  touchStreak: () => void
  reset: () => void
}

const INITIAL: ProgressState = {
  xp: 0,
  completedLessons: {},
  completedProblems: {},
  quizScores: {},
  unlockedAchievements: {},
  streak: { current: 0, longest: 0, lastActiveDay: null },
  lastVisited: null,
}

export const useProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => ({
      ...INITIAL,

      completeLesson: (lessonId, xp) => {
        const existing = get().completedLessons[lessonId]
        if (existing) return // idempotent — no double XP
        set((s) => ({
          completedLessons: {
            ...s.completedLessons,
            [lessonId]: { completedAt: Date.now() },
          },
          xp: s.xp + xp,
        }))
        get().touchStreak()
      },

      completeProblem: (problemId, xp) => {
        const existing = get().completedProblems[problemId]
        if (existing) {
          set((s) => ({
            completedProblems: {
              ...s.completedProblems,
              [problemId]: {
                ...existing,
                attempts: existing.attempts + 1,
              },
            },
          }))
          return
        }
        set((s) => ({
          completedProblems: {
            ...s.completedProblems,
            [problemId]: { completedAt: Date.now(), attempts: 1 },
          },
          xp: s.xp + xp,
        }))
        get().touchStreak()
      },

      recordProblemAttempt: (problemId) => {
        set((s) => {
          const cur = s.completedProblems[problemId]
          if (cur) {
            return {
              completedProblems: {
                ...s.completedProblems,
                [problemId]: { ...cur, attempts: cur.attempts + 1 },
              },
            }
          }
          // Don't mark complete; just don't track attempts on incomplete
          return {}
        })
      },

      recordQuiz: (lessonId, correct, total) => {
        set((s) => ({
          quizScores: {
            ...s.quizScores,
            [lessonId]: { correct, total, lastAttempt: Date.now() },
          },
        }))
      },

      unlockAchievement: (id) => {
        if (get().unlockedAchievements[id]) return false
        set((s) => ({
          unlockedAchievements: { ...s.unlockedAchievements, [id]: Date.now() },
        }))
        return true
      },

      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),

      setLastVisited: (lessonId) => set({ lastVisited: lessonId }),

      touchStreak: () => {
        const today = todayKey()
        const { lastActiveDay, current, longest } = get().streak
        if (lastActiveDay === today) return
        let nextCurrent = 1
        if (lastActiveDay) {
          const d = daysBetween(lastActiveDay, today)
          if (d === 1) nextCurrent = current + 1
          else if (d === 0) nextCurrent = current
          else nextCurrent = 1
        }
        set({
          streak: {
            current: nextCurrent,
            longest: Math.max(longest, nextCurrent),
            lastActiveDay: today,
          },
        })
      },

      reset: () => set({ ...INITIAL }),
    }),
    {
      name: 'dsa-quest::progress',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
)
