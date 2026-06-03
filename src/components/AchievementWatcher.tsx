import { useEffect, useState } from 'react'
import * as Icons from '@carbon/icons-react'
import { Trophy } from '@carbon/icons-react'
import { useProgressStore } from '@/stores/useProgressStore'
import { checkNewAchievements } from '@/lib/achievements'

interface Toast {
  id: string
  title: string
  description: string
  icon: string
}

/**
 * Watches the progress store for changes that would unlock achievements,
 * unlocks them, and renders toast notifications.
 */
export function AchievementWatcher() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const state = useProgressStore()

  useEffect(() => {
    const newlyUnlocked = checkNewAchievements(state)
    if (newlyUnlocked.length === 0) return
    for (const meta of newlyUnlocked) {
      state.unlockAchievement(meta.id)
      const toast: Toast = {
        id: `${meta.id}-${Date.now()}`,
        title: meta.title,
        description: meta.description,
        icon: meta.icon,
      }
      setToasts((cur) => [...cur, toast])
      setTimeout(() => {
        setToasts((cur) => cur.filter((t) => t.id !== toast.id))
      }, 4500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.xp,
    state.streak.current,
    Object.keys(state.completedLessons).length,
    Object.keys(state.completedProblems).length,
  ])

  if (toasts.length === 0) return null

  return (
    <div className="dsa-toast-stack">
      {toasts.map((t) => {
        const Icon = (Icons as any)[t.icon] ?? Trophy
        return (
          <div key={t.id} className="dsa-toast">
            <Icon size={20} className="dsa-toast__icon" />
            <div className="dsa-toast__body">
              <div className="dsa-toast__eyebrow">Achievement unlocked</div>
              <div className="dsa-toast__title">{t.title}</div>
              <div className="dsa-toast__desc">{t.description}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
