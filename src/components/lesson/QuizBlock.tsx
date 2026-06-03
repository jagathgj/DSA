import { useState, useMemo } from 'react'
import type { QuizSection, QuizQuestion } from '@/types'
import { Button, TextInput, RadioButton, RadioButtonGroup } from '@carbon/react'
import { CheckmarkFilled, CloseFilled, Draggable } from '@carbon/icons-react'
import { motion } from 'framer-motion'
import { useProgressStore } from '@/stores/useProgressStore'

interface QuizBlockProps {
  section: QuizSection
  lessonId: string
}

interface AnswerState {
  [qid: string]: any
}

export function QuizBlock({ section, lessonId }: QuizBlockProps) {
  const [answers, setAnswers] = useState<AnswerState>({})
  const [submitted, setSubmitted] = useState(false)
  const recordQuiz = useProgressStore((s) => s.recordQuiz)

  const results = useMemo(() => {
    if (!submitted) return {}
    const r: Record<string, boolean> = {}
    for (const q of section.questions) {
      r[q.id] = isCorrect(q, answers[q.id])
    }
    return r
  }, [submitted, answers, section.questions])

  const score = Object.values(results).filter(Boolean).length
  const total = section.questions.length

  function handleSubmit() {
    setSubmitted(true)
    let correct = 0
    for (const q of section.questions) {
      if (isCorrect(q, answers[q.id])) correct++
    }
    recordQuiz(lessonId, correct, section.questions.length)
  }

  function handleReset() {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <section className="dsa-section">
      <div className="dsa-quiz">
        <div className="dsa-quiz__head">
          <div className="dsa-eyebrow">Quick check</div>
          <div className="dsa-quiz__head-title">
            {total} question{total > 1 ? 's' : ''}
          </div>
        </div>
        <div>
          {section.questions.map((q, i) => (
            <div key={q.id} className="dsa-quiz__question">
              <div className="dsa-quiz__question-head">
                <span className="dsa-quiz__question-num">{i + 1}</span>
                <div className="dsa-quiz__question-text">{q.question}</div>
              </div>
              <QuestionRenderer
                q={q}
                value={answers[q.id]}
                onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                disabled={submitted}
              />
              {submitted && (
                <div
                  className={
                    'dsa-quiz__feedback ' +
                    (results[q.id]
                      ? 'dsa-quiz__feedback--correct'
                      : 'dsa-quiz__feedback--wrong')
                  }
                >
                  <div
                    className={
                      'dsa-quiz__feedback-head ' +
                      (results[q.id]
                        ? 'dsa-quiz__feedback-head--correct'
                        : 'dsa-quiz__feedback-head--wrong')
                    }
                  >
                    {results[q.id] ? (
                      <>
                        <CheckmarkFilled size={16} />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <CloseFilled size={16} />
                        <span>Not quite — {showCorrectAnswer(q)}</span>
                      </>
                    )}
                  </div>
                  <div className="dsa-quiz__feedback-body">{q.explanation}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="dsa-quiz__foot">
          {submitted ? (
            <>
              <div className="dsa-quiz__score">
                Score:{' '}
                <span
                  className={
                    'dsa-quiz__score-value ' +
                    (score === total ? 'dsa-quiz__score-value--all' : '')
                  }
                >
                  {score} / {total}
                </span>
              </div>
              <Button kind="ghost" size="sm" onClick={handleReset}>
                Try again
              </Button>
            </>
          ) : (
            <>
              <div className="dsa-quiz__count">
                {Object.keys(answers).length} / {total} answered
              </div>
              <Button
                kind="primary"
                size="sm"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < total}
              >
                Submit answers
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function isCorrect(q: QuizQuestion, ans: any): boolean {
  if (ans === undefined || ans === null) return false
  switch (q.type) {
    case 'mcq':
    case 'predict-output':
      return ans === q.correct
    case 'fill-blank':
      return q.answers.some(
        (a) => a.toLowerCase().trim() === String(ans).toLowerCase().trim(),
      )
    case 'ordering':
      if (!Array.isArray(ans)) return false
      return (
        ans.length === q.correctOrder.length &&
        ans.every((v, i) => v === q.correctOrder[i])
      )
  }
}

function showCorrectAnswer(q: QuizQuestion): string {
  switch (q.type) {
    case 'mcq':
    case 'predict-output':
      return `correct: ${q.options[q.correct]}`
    case 'fill-blank':
      return `correct: ${q.answers[0]}`
    case 'ordering':
      return `correct order: ${q.correctOrder
        .map((i) => q.items[i])
        .join(' → ')}`
  }
}

interface QRProps {
  q: QuizQuestion
  value: any
  onChange: (v: any) => void
  disabled: boolean
}

function QuestionRenderer({ q, value, onChange, disabled }: QRProps) {
  switch (q.type) {
    case 'mcq':
      return (
        <MCQRenderer q={q} value={value} onChange={onChange} disabled={disabled} />
      )
    case 'predict-output':
      return (
        <PredictRenderer
          q={q}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )
    case 'fill-blank':
      return (
        <FillBlankRenderer
          q={q}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )
    case 'ordering':
      return (
        <OrderingRenderer
          q={q}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )
  }
}

function MCQRenderer({ q, value, onChange, disabled }: QRProps) {
  return (
    <RadioButtonGroup
      name={`mcq-${q.id}`}
      valueSelected={value !== undefined ? String(value) : ''}
      onChange={(selectedValue) => !disabled && onChange(Number(selectedValue))}
      orientation="vertical"
      className="dsa-mcq"
    >
      {(q as any).options.map((opt: string, i: number) => (
        <RadioButton
          key={i}
          id={`${q.id}-option-${i}`}
          labelText={opt}
          value={String(i)}
          disabled={disabled}
        />
      ))}
    </RadioButtonGroup>
  )
}

function PredictRenderer({ q, value, onChange, disabled }: QRProps) {
  const question = q as any
  return (
    <div>
      <pre className="dsa-code-block dsa-mt-2">{question.code}</pre>
      <MCQRenderer q={q} value={value} onChange={onChange} disabled={disabled} />
    </div>
  )
}

function FillBlankRenderer({ q, value, onChange, disabled }: QRProps) {
  const question = q as any
  const parts = String(question.question).split('___')
  return (
    <div className="dsa-fill-blank">
      {parts.map((p: string, i: number) => (
        <span key={i} className="dsa-fill-blank__segment">
          {p && <span className="dsa-fill-blank__pre">{p}</span>}
          {i < parts.length - 1 && (
            <div className="dsa-fill-blank__input">
              <TextInput
                id={`fb-${q.id}-${i}`}
                labelText=""
                hideLabel
                size="sm"
                value={value ?? ''}
                onChange={(e) => !disabled && onChange(e.target.value)}
                disabled={disabled}
                placeholder="..."
              />
            </div>
          )}
        </span>
      ))}
    </div>
  )
}

function OrderingRenderer({ q, value, onChange, disabled }: QRProps) {
  const question = q as any
  const order: number[] = value ?? question.items.map((_: any, i: number) => i)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  function moveItem(from: number, to: number) {
    if (from === to) return
    const next = [...order]
    const [m] = next.splice(from, 1)
    next.splice(to, 0, m)
    onChange(next)
  }

  return (
    <div className="dsa-ordering">
      <div className="dsa-ordering__hint">Drag to reorder</div>
      {order.map((itemIdx, i) => (
        <motion.div
          key={itemIdx}
          layout
          draggable={!disabled}
          onDragStart={() => setDragIdx(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIdx !== null) moveItem(dragIdx, i)
            setDragIdx(null)
          }}
          className={
            'dsa-ordering__item ' +
            (disabled ? 'dsa-ordering__item--disabled' : '')
          }
        >
          <Draggable size={16} className="dsa-ordering__handle" />
          <span className="dsa-ordering__num">{i + 1}.</span>
          <span>{question.items[itemIdx]}</span>
        </motion.div>
      ))}
    </div>
  )
}
