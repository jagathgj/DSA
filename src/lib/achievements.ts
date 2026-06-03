import { ACHIEVEMENTS } from '@/content/achievements'
import { MODULES } from '@/content/modules'
import type { Achievement, AchievementCondition, ProgressState } from '@/types'

function evalCondition(c: AchievementCondition, p: ProgressState): boolean {
  switch (c.kind) {
    case 'firstLesson':
      return Object.keys(p.completedLessons).length >= 1
    case 'totalLessons':
      return Object.keys(p.completedLessons).length >= c.count
    case 'totalXp':
      return p.xp >= c.amount
    case 'streakDays':
      return p.streak.current >= c.days
    case 'completeModule': {
      const m = MODULES.find((x) => x.id === c.moduleId)
      if (!m) return false
      return m.lessons.every((l) => p.completedLessons[l])
    }
    case 'solveProblems': {
      const ids = Object.keys(p.completedProblems)
      return ids.length >= c.count
    }
    case 'perfectQuiz': {
      const perfect = Object.values(p.quizScores).filter(
        (q) => q.total > 0 && q.correct === q.total
      ).length
      return perfect >= c.count
    }
  }
}

/** Returns achievements newly unlocked given the current state. */
export function checkNewAchievements(progress: ProgressState): Achievement[] {
  return ACHIEVEMENTS.filter(
    (a) => !progress.unlockedAchievements[a.id] && evalCondition(a.condition, progress)
  )
}
