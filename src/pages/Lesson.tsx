import { useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Button, Tag } from '@carbon/react'
import {
  ArrowLeft,
  ArrowRight,
  CheckmarkFilled,
  Time,
  StarFilled,
} from '@carbon/icons-react'
import { getLesson } from '@/content/lessons'
import { getModuleForLesson, getNextLesson } from '@/content/modules'
import { useProgressStore } from '@/stores/useProgressStore'
import { LessonRenderer } from '@/components/lesson/LessonRenderer'

export function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const lesson = id ? getLesson(id) : undefined
  const navigate = useNavigate()
  const completedLessons = useProgressStore((s) => s.completedLessons)
  const completeLesson = useProgressStore((s) => s.completeLesson)
  const setLastVisited = useProgressStore((s) => s.setLastVisited)

  useEffect(() => {
    if (id) setLastVisited(id)
    window.scrollTo(0, 0)
  }, [id, setLastVisited])

  const mod = useMemo(() => (id ? getModuleForLesson(id) : null), [id])
  const next = useMemo(
    () => (id ? getNextLesson(id, completedLessons) : null),
    [id, completedLessons],
  )

  if (!lesson) {
    return (
      <div className="dsa-surface dsa-surface--padded-lg dsa-surface--centered">
        <div className="dsa-not-found__title">Lesson not found</div>
        <p className="dsa-not-found__body">
          We couldn't find a lesson with that id.
        </p>
        <Link to="/roadmap">
          <Button kind="primary">Back to roadmap</Button>
        </Link>
      </div>
    )
  }

  const isCompleted = !!completedLessons[lesson.id]

  function handleComplete() {
    completeLesson(lesson!.id, lesson!.xpReward)
    if (next) navigate(`/lesson/${next.lessonId}`)
    else navigate('/roadmap')
  }

  const difficultyTagType =
    lesson.difficulty === 'Beginner'
      ? 'green'
      : lesson.difficulty === 'Intermediate'
        ? 'warm-gray'
        : 'red'

  return (
    <article className="dsa-lesson">
      <div className="dsa-breadcrumb">
        <Link to="/roadmap">
          <ArrowLeft size={12} />
          Roadmap
        </Link>
        {mod && (
          <>
            <span>/</span>
            <span>{mod.title}</span>
          </>
        )}
      </div>

      <header className="dsa-lesson__hero">
        <div className="dsa-meta-row dsa-mt-2">
          <Tag size="sm" type={difficultyTagType}>
            {lesson.difficulty}
          </Tag>
          <Tag size="sm" renderIcon={Time}>
            {lesson.estimatedMinutes} min
          </Tag>
          <Tag size="sm" type="blue" renderIcon={StarFilled}>
            +{lesson.xpReward} XP
          </Tag>
          {isCompleted && (
            <Tag size="sm" type="green" renderIcon={CheckmarkFilled}>
              Completed
            </Tag>
          )}
        </div>
        <h1 className="dsa-lesson__title dsa-mt-3">{lesson.title}</h1>
        {lesson.subtitle && (
          <p className="dsa-lesson__subtitle">{lesson.subtitle}</p>
        )}
      </header>

      <LessonRenderer lesson={lesson} />

      <div className="dsa-surface dsa-lesson__footer">
        <div>
          <div className="dsa-lesson__footer-text">
            {isCompleted ? 'Lesson completed' : 'Done with this lesson?'}
          </div>
          <div className="dsa-lesson__footer-sub">
            {isCompleted
              ? "You've earned XP for this one. Move forward whenever you're ready."
              : `Mark it complete to earn ${lesson.xpReward} XP and unlock the next.`}
          </div>
        </div>
        <Button
          kind="primary"
          renderIcon={next ? ArrowRight : undefined}
          onClick={handleComplete}
        >
          {next
            ? isCompleted
              ? 'Next lesson'
              : 'Complete & continue'
            : isCompleted
              ? 'Back to roadmap'
              : 'Complete'}
        </Button>
      </div>
    </article>
  )
}
