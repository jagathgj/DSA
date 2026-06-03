import { useMemo } from 'react'
import { ProgressBar } from '@carbon/react'
import * as Icons from '@carbon/icons-react'
import { Trophy, Locked } from '@carbon/icons-react'
import { ACHIEVEMENTS } from '@/content/achievements'
import { useProgressStore } from '@/stores/useProgressStore'

export function AchievementsPage() {
  const unlocked = useProgressStore((s) => s.unlockedAchievements)
  const unlockedCount = useMemo(() => Object.keys(unlocked).length, [unlocked])
  const total = ACHIEVEMENTS.length
  const pct = total > 0 ? (unlockedCount / total) * 100 : 0

  return (
    <div className="dsa-stack dsa-stack--gap-6">
      <header className="dsa-page-header">
        <h1 className="dsa-page-header__title">Achievements</h1>
        <p className="dsa-page-header__subtitle">
          Milestones unlock as you progress through lessons, problems, and streaks.
        </p>
      </header>

      <section className="dsa-surface">
        <div className="dsa-row dsa-row--space-between dsa-row--gap-3 dsa-mt-2">
          <div className="dsa-card-section__title dsa-card-section__title--with-icon">
            <Trophy size={18} className="dsa-stat-chip__icon" />
            {unlockedCount} / {total} unlocked
          </div>
          <div className="dsa-text-mono dsa-text-mono--xs dsa-text-secondary">
            {Math.round(pct)}%
          </div>
        </div>
        <div className="dsa-mt-3">
          <ProgressBar label="" hideLabel value={pct} max={100} size="small" />
        </div>
      </section>

      <div className="dsa-grid dsa-grid--two dsa-grid--gap-4">
        {ACHIEVEMENTS.map((a) => {
          const isUnlocked = !!unlocked[a.id]
          const Icon = (Icons as any)[a.icon] ?? Trophy
          const unlockedAt = unlocked[a.id]
          return (
            <div
              key={a.id}
              className={
                'dsa-achievement ' +
                (isUnlocked
                  ? 'dsa-achievement--unlocked'
                  : 'dsa-achievement--locked')
              }
            >
              <div
                className={
                  'dsa-achievement__icon ' +
                  (isUnlocked ? 'dsa-achievement__icon--unlocked' : '')
                }
              >
                {isUnlocked ? <Icon size={20} /> : <Locked size={18} />}
              </div>
              <div className="dsa-achievement__body">
                <div className="dsa-achievement__title">{a.title}</div>
                <div className="dsa-achievement__desc">{a.description}</div>
                {isUnlocked && unlockedAt && (
                  <div className="dsa-achievement__date">
                    Unlocked {new Date(unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
