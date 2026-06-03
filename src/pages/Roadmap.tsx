import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@carbon/react'
import {
  Locked,
  CheckmarkFilled,
  CircleDash,
  ChevronDown,
  ChevronRight,
} from '@carbon/icons-react'
import { MODULES, isModuleUnlocked } from '@/content/modules'
import { getLesson } from '@/content/lessons'
import { useProgressStore } from '@/stores/useProgressStore'
import { resolveIcon } from '@/lib/icons'

export function RoadmapPage() {
  const completedLessons = useProgressStore((s) => s.completedLessons)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setExpanded((cur) => {
      const next = new Set(cur)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      <header className="dsa-page-header">
        <h1 className="dsa-page-header__title">Learning roadmap</h1>
        <p className="dsa-page-header__subtitle">
          Complete each module to unlock the next. Tap a module to see its lessons.
        </p>
      </header>

      <div className="dsa-stack dsa-stack--gap-3">
        {MODULES.map((m, idx) => {
          const Icon = resolveIcon(m.icon)
          const unlocked = isModuleUnlocked(m.id, completedLessons)
          const done = m.lessons.filter((l) => completedLessons[l]).length
          const total = m.lessons.length
          const pct = total > 0 ? (done / total) * 100 : 0
          const complete = done === total && total > 0
          const isExpanded = expanded.has(m.id)

          const iconClasses = ['dsa-module-card__icon']
          if (complete) iconClasses.push('dsa-module-card__icon--complete')
          else if (!unlocked) iconClasses.push('dsa-module-card__icon--locked')

          return (
            <div
              key={m.id}
              className={
                'dsa-module-card ' + (unlocked ? '' : 'dsa-module-card--locked')
              }
            >
              <button
                onClick={() => unlocked && toggle(m.id)}
                disabled={!unlocked}
                className="dsa-module-card__head"
                type="button"
              >
                <div className={iconClasses.join(' ')}>
                  {unlocked ? <Icon size={20} /> : <Locked size={16} />}
                </div>
                <div className="dsa-module-card__main">
                  <div className="dsa-module-card__title-row">
                    <span className="dsa-module-card__number">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="dsa-module-card__title">{m.title}</span>
                    {complete && (
                      <CheckmarkFilled
                        size={16}
                        className="dsa-module-card__lesson-status dsa-module-card__lesson-status--done"
                      />
                    )}
                  </div>
                  <div className="dsa-module-card__summary">{m.description}</div>
                  <div className="dsa-module-card__progress-row">
                    <div className="dsa-progress-bar dsa-progress-bar--inline">
                      <div
                        className={
                          'dsa-progress-bar__fill' +
                          (complete ? ' dsa-progress-bar__fill--success' : '')
                        }
                        // width is computed; this is data, not styling.
                        // We expose it via CSS variable to keep BEM clean.
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="dsa-module-card__progress-text">
                      {done}/{total}
                    </div>
                  </div>
                </div>
                {unlocked && (
                  <span className="dsa-module-card__caret">
                    {isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </button>
              {unlocked && isExpanded && (
                <div className="dsa-module-card__body">
                  {m.lessons.map((lessonId) => {
                    const lesson = getLesson(lessonId)
                    if (!lesson) return null
                    const isDone = !!completedLessons[lessonId]
                    return (
                      <Link
                        key={lessonId}
                        to={`/lesson/${lessonId}`}
                        className="dsa-module-card__lesson"
                      >
                        <div className="dsa-module-card__lesson-info">
                          {isDone ? (
                            <CheckmarkFilled
                              size={16}
                              className="dsa-module-card__lesson-status dsa-module-card__lesson-status--done"
                            />
                          ) : (
                            <CircleDash
                              size={16}
                              className="dsa-module-card__lesson-status dsa-module-card__lesson-status--pending"
                            />
                          )}
                          <div className="dsa-module-card__lesson-text">
                            <div className="dsa-module-card__lesson-title">
                              {lesson.title}
                            </div>
                            {lesson.subtitle && (
                              <div className="dsa-module-card__lesson-subtitle">
                                {lesson.subtitle}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="dsa-module-card__lesson-meta">
                          <span>{lesson.estimatedMinutes}m</span>
                          <span className="dsa-module-card__lesson-meta-xp">
                            +{lesson.xpReward} XP
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
