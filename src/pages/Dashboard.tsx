import { Link, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { ProgressBar, Tag, Tile, Button } from '@carbon/react'
import {
  StarFilled,
  Fire,
  Trophy,
  Book,
  ArrowRight,
  CheckmarkFilled,
  LocationCurrent,
  Growth,
} from '@carbon/icons-react'
import * as Icons from '@carbon/icons-react'
import { useProgressStore } from '@/stores/useProgressStore'
import { MODULES, getRecommendedLesson, getModule } from '@/content/modules'
import { getLesson } from '@/content/lessons'
import { ACHIEVEMENTS } from '@/content/achievements'
import { getLevelInfo } from '@/lib/utils'

export function DashboardPage() {
  const xp = useProgressStore((s) => s.xp)
  const completedLessons = useProgressStore((s) => s.completedLessons)
  const completedProblems = useProgressStore((s) => s.completedProblems)
  const quizScores = useProgressStore((s) => s.quizScores)
  const streak = useProgressStore((s) => s.streak)
  const unlocked = useProgressStore((s) => s.unlockedAchievements)
  const lastVisited = useProgressStore((s) => s.lastVisited)
  const level = useMemo(() => getLevelInfo(xp), [xp])

  const recommended = useMemo(
    () => getRecommendedLesson(completedLessons),
    [completedLessons],
  )
  const recommendedLesson = recommended ? getLesson(recommended.lessonId) : null
  const recommendedModule = recommended ? getModule(recommended.moduleId) : null

  const recentLessons = useMemo(() => {
    return Object.entries(completedLessons)
      .sort((a, b) => b[1].completedAt - a[1].completedAt)
      .slice(0, 5)
      .map(([id, info]) => ({ id, info, lesson: getLesson(id) }))
      .filter((x) => x.lesson)
  }, [completedLessons])

  const recentAchievements = useMemo(() => {
    return Object.entries(unlocked)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([id, t]) => ({
        achievement: ACHIEVEMENTS.find((a) => a.id === id),
        unlockedAt: t,
      }))
      .filter((x) => x.achievement)
  }, [unlocked])

  const moduleStats = useMemo(() => {
    return MODULES.map((m) => {
      const total = m.lessons.length
      const done = m.lessons.filter((l) => completedLessons[l]).length
      let quizCorrect = 0
      let quizTotal = 0
      for (const l of m.lessons) {
        const s = quizScores[l]
        if (s) {
          quizCorrect += s.correct
          quizTotal += s.total
        }
      }
      const quizPct = quizTotal > 0 ? quizCorrect / quizTotal : null
      return { module: m, done, total, quizPct }
    })
  }, [completedLessons, quizScores])

  const strongAreas = moduleStats
    .filter((s) => s.quizPct !== null && s.quizPct >= 0.8)
    .slice(0, 3)
  const weakAreas = moduleStats
    .filter((s) => s.quizPct !== null && s.quizPct < 0.6)
    .slice(0, 3)

  const totalLessons = MODULES.reduce((a, m) => a + m.lessons.length, 0)
  const completedCount = Object.keys(completedLessons).length
  const overallPct = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0
  const isFirstTime = completedCount === 0 && xp === 0

  return (
    <div className="dsa-stack dsa-stack--gap-6">
      {/* Hero */}
      <section className="dsa-surface dsa-hero">
        <div className="dsa-hero__top">
          <div>
            <div className="dsa-eyebrow">
              {isFirstTime ? 'Welcome to DSA Quest' : 'Welcome back'}
            </div>
            <h1 className="dsa-hero__title">
              {isFirstTime
                ? "Let's start the journey"
                : `${completedCount} lessons strong`}
            </h1>
            <p className="dsa-hero__sub">
              {isFirstTime
                ? 'Learn data structures and algorithms with JavaScript — visually, interactively, one bite at a time.'
                : `You're a ${level.current.name}. Keep going.`}
            </p>
          </div>
          <div className="dsa-hero__chips">
            <StatChip icon={StarFilled} label="XP" value={xp.toLocaleString()} />
            <StatChip
              icon={Fire}
              label="Streak"
              value={`${streak.current} day${streak.current === 1 ? '' : 's'}`}
            />
            <StatChip icon={Trophy} label="Level" value={level.current.name} />
          </div>
        </div>

        {level.next && (
          <div className="dsa-hero__progress">
            <div className="dsa-progress-meta">
              <span>{level.current.name}</span>
              <span>
                {Math.max(0, level.next.min - xp)} XP to {level.next.name}
              </span>
            </div>
            <div className="dsa-progress-bar">
              {/* width is data, not styling — kept inline */}
              <div
                className="dsa-progress-bar__fill"
                style={{ width: `${Math.max(2, Math.min(100, level.progress))}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Next recommended lesson */}
      {recommendedLesson && recommendedModule && (
        <section className="dsa-surface dsa-surface--accent dsa-recommended">
          <div className="dsa-recommended__content">
            <div className="dsa-eyebrow dsa-eyebrow--accent">
              <LocationCurrent size={12} className="dsa-inline-block" />{' '}
              {lastVisited === recommendedLesson.id
                ? 'Continue where you left off'
                : 'Recommended next'}
            </div>
            <div className="dsa-recommended__title">
              {recommendedLesson.title}
            </div>
            <div className="dsa-recommended__meta">
              {recommendedModule.title} · {recommendedLesson.estimatedMinutes}{' '}
              min · +{recommendedLesson.xpReward} XP
            </div>
          </div>
          <Link to={`/lesson/${recommendedLesson.id}`}>
            <Button kind="primary" renderIcon={ArrowRight}>
              {isFirstTime ? 'Start' : 'Continue'}
            </Button>
          </Link>
        </section>
      )}

      {/* Overall progress */}
      <section className="dsa-surface">
        <div className="dsa-card-section__head">
          <div className="dsa-card-section__title">Overall progress</div>
          <div className="dsa-text-mono dsa-text-mono--xs dsa-text-secondary">
            {completedCount} / {totalLessons} lessons
          </div>
        </div>
        <ProgressBar
          label=""
          hideLabel
          value={overallPct}
          max={100}
          size="small"
        />
        <div className="dsa-grid dsa-grid--four dsa-grid--gap-3 dsa-mt-4">
          <MiniStat icon={Book} label="Lessons done" value={completedCount} />
          <MiniStat
            icon={CheckmarkFilled}
            label="Problems solved"
            value={Object.keys(completedProblems).length}
          />
          <MiniStat
            icon={Trophy}
            label="Achievements"
            value={Object.keys(unlocked).length}
          />
          <MiniStat icon={Fire} label="Longest streak" value={streak.longest} />
        </div>
      </section>

      <div className="dsa-grid dsa-grid--two dsa-grid--gap-5">
        {/* Recent activity */}
        <section className="dsa-card-section">
          <div className="dsa-card-section__title">Recent activity</div>
          {recentLessons.length === 0 ? (
            <div className="dsa-card-section__empty">
              Nothing yet. Complete a lesson to see it here.
            </div>
          ) : (
            <div>
              {recentLessons.map(({ id, lesson }) => (
                <Link
                  key={id}
                  to={`/lesson/${id}`}
                  className="dsa-activity-row"
                >
                  <CheckmarkFilled size={16} className="dsa-activity-row__icon" />
                  <div className="dsa-activity-row__title">{lesson!.title}</div>
                  <div className="dsa-activity-row__meta">+{lesson!.xpReward}</div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Achievements */}
        <section className="dsa-card-section">
          <div className="dsa-card-section__head">
            <div className="dsa-card-section__title">Recent achievements</div>
            <Link to="/achievements" className="dsa-card-section__link">
              See all
            </Link>
          </div>
          {recentAchievements.length === 0 ? (
            <div className="dsa-card-section__empty">
              Achievements unlock as you progress.
            </div>
          ) : (
            <div className="dsa-grid dsa-grid--auto-fit-180 dsa-grid--gap-3">
              {recentAchievements.map(({ achievement }) => {
                if (!achievement) return null
                const Icon = (Icons as any)[achievement.icon] ?? Trophy
                return (
                  <Tile key={achievement.id} className="dsa-mini-stat">
                    <div className="dsa-row dsa-row--start dsa-row--gap-2">
                      <Icon size={16} className="dsa-stat-chip__icon dsa-shrink-0" />
                      <div className="dsa-min-w-0">
                        <div className="dsa-text-mono dsa-truncate-1">
                          {achievement.title}
                        </div>
                        <div className="dsa-text-mono dsa-text-mono--xxs dsa-text-secondary">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  </Tile>
                )
              })}
            </div>
          )}
        </section>

        {/* Strong areas */}
        <section className="dsa-card-section">
          <div className="dsa-card-section__title dsa-card-section__title--with-icon">
            <Growth size={16} className="dsa-stat-chip__icon" />
            Strong areas
          </div>
          {strongAreas.length === 0 ? (
            <div className="dsa-card-section__empty">
              Complete some quizzes — your strongest modules will show up here.
            </div>
          ) : (
            <div className="dsa-stack dsa-stack--gap-2 dsa-mt-3">
              {strongAreas.map((s) => (
                <AreaRow key={s.module.id} stats={s} tone="success" />
              ))}
            </div>
          )}
        </section>

        {/* Weak areas */}
        <section className="dsa-card-section">
          <div className="dsa-card-section__title dsa-card-section__title--with-icon">
            <LocationCurrent size={16} className="dsa-stat-chip__icon" />
            Areas to revisit
          </div>
          {weakAreas.length === 0 ? (
            <div className="dsa-card-section__empty">
              Nothing needs urgent review. Nice.
            </div>
          ) : (
            <div className="dsa-stack dsa-stack--gap-2 dsa-mt-3">
              {weakAreas.map((s) => (
                <AreaRow key={s.module.id} stats={s} tone="warning" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: any
  label: string
  value: string | number
}) {
  return (
    <div className="dsa-stat-chip">
      <Icon size={16} className="dsa-stat-chip__icon" />
      <div>
        <div className="dsa-stat-chip__label">{label}</div>
        <div className="dsa-stat-chip__value">{value}</div>
      </div>
    </div>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: any
  label: string
  value: number | string
}) {
  return (
    <Tile className="dsa-mini-stat">
      <div className="dsa-mini-stat__header">
        <Icon size={12} />
        {label}
      </div>
      <div className="dsa-mini-stat__value">{value}</div>
    </Tile>
  )
}

function AreaRow({
  stats,
  tone,
}: {
  stats: {
    module: { id: string; title: string }
    done: number
    total: number
    quizPct: number | null
  }
  tone: 'success' | 'warning'
}) {
  return (
    <div className="dsa-area-row">
      <div className="dsa-area-row__head">
        <div className="dsa-area-row__title">{stats.module.title}</div>
        <Tag size="sm" type={tone === 'success' ? 'green' : 'warm-gray'}>
          {stats.quizPct !== null
            ? `${Math.round(stats.quizPct * 100)}% quiz`
            : '—'}
        </Tag>
      </div>
      <div className="dsa-area-row__meta">
        {stats.done} / {stats.total} lessons
      </div>
    </div>
  )
}
