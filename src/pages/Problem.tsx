import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { Button, Tag } from '@carbon/react'
import {
  ArrowLeft,
  Play,
  Reset,
  LightFilled,
  View,
  CheckmarkFilled,
  CloseFilled,
  StarFilled,
} from '@carbon/icons-react'
import { getProblem } from '@/content/problems'
import { useProgressStore } from '@/stores/useProgressStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { runFunction, deepEqual, stringify } from '@/lib/utils'

interface TestRunResult {
  pass: boolean
  expected: any
  actual: any
  input: any[]
  description?: string
  error?: string
}

export function ProblemPage() {
  const { id } = useParams<{ id: string }>()
  const problem = id ? getProblem(id) : undefined
  const theme = useSettingsStore((s) => s.theme)
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  const completeProblem = useProgressStore((s) => s.completeProblem)
  const recordProblemAttempt = useProgressStore((s) => s.recordProblemAttempt)
  const completedProblems = useProgressStore((s) => s.completedProblems)

  const [code, setCode] = useState(problem?.starterCode ?? '')
  const [results, setResults] = useState<TestRunResult[] | null>(null)
  const [revealedHints, setRevealedHints] = useState(0)
  const [showSolution, setShowSolution] = useState(false)

  if (!problem) {
    return (
      <div className="dsa-surface dsa-surface--padded-lg dsa-surface--centered">
        <div className="dsa-not-found__title">Problem not found</div>
        <Link to="/problems">
          <Button kind="primary">Back to problems</Button>
        </Link>
      </div>
    )
  }

  const wasSolved = !!completedProblems[problem.id]

  function handleRun() {
    if (!problem) return
    const out: TestRunResult[] = []
    for (const tc of problem.testCases) {
      const r = runFunction(code, problem.functionName, tc.input)
      if (r.error) {
        out.push({
          pass: false,
          expected: tc.expected,
          actual: undefined,
          input: tc.input,
          description: tc.description,
          error: r.error,
        })
      } else {
        out.push({
          pass: deepEqual(r.result, tc.expected),
          expected: tc.expected,
          actual: r.result,
          input: tc.input,
          description: tc.description,
        })
      }
    }
    setResults(out)
    const allPass = out.every((r) => r.pass)
    if (allPass) {
      completeProblem(problem.id, problem.xpReward)
    } else {
      recordProblemAttempt(problem.id)
    }
  }

  const allPass = results && results.every((r) => r.pass)

  const difficultyType =
    problem.difficulty === 'Easy'
      ? 'green'
      : problem.difficulty === 'Medium'
        ? 'warm-gray'
        : 'red'

  return (
    <div className="dsa-stack dsa-stack--gap-4">
      <div>
        <Link to="/problems" className="dsa-problem__back">
          <ArrowLeft size={14} />
          All problems
        </Link>
      </div>

      <div className="dsa-grid dsa-grid--problem dsa-grid--gap-4">
        {/* Description panel */}
        <section className="dsa-surface">
          <div className="dsa-meta-row">
            <h1 className="dsa-problem__title">{problem.title}</h1>
            <Tag size="sm" type={difficultyType}>
              {problem.difficulty}
            </Tag>
            <Tag size="sm" type="blue" renderIcon={StarFilled}>
              +{problem.xpReward} XP
            </Tag>
            {wasSolved && (
              <Tag size="sm" type="green" renderIcon={CheckmarkFilled}>
                Solved
              </Tag>
            )}
          </div>
          <div className="dsa-problems-list__row-tags dsa-mt-3">
            {problem.tags.map((t) => (
              <Tag key={t} size="sm" type="cool-gray">
                {t}
              </Tag>
            ))}
          </div>

          <p className="dsa-problem__desc dsa-mt-3">{problem.description}</p>

          <h3 className="dsa-section-title dsa-section-title--small dsa-mt-5">
            Examples
          </h3>
          <div className="dsa-stack dsa-stack--gap-2">
            {problem.examples.map((ex, i) => (
              <div key={i} className="dsa-problem__example">
                <div className="dsa-problem__example-row">
                  <span className="dsa-problem__example-label">Input: </span>
                  <code className="dsa-code-inline">{ex.input}</code>
                </div>
                <div className="dsa-problem__example-row">
                  <span className="dsa-problem__example-label">Output: </span>
                  <code className="dsa-code-inline">{ex.output}</code>
                </div>
                {ex.explanation && (
                  <div className="dsa-problem__example-explain">
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Hints */}
          <div className="dsa-mt-5">
            <h3 className="dsa-section-title dsa-section-title--small dsa-section-title--inline">
              Hints
            </h3>
            {revealedHints < problem.hints.length ? (
              <Button
                size="sm"
                kind="tertiary"
                renderIcon={LightFilled}
                onClick={() => setRevealedHints((h) => h + 1)}
              >
                Reveal hint ({revealedHints} / {problem.hints.length})
              </Button>
            ) : (
              <div className="dsa-problem__hint-empty">All hints revealed.</div>
            )}
            <div className="dsa-stack dsa-stack--gap-2 dsa-mt-3">
              {problem.hints.slice(0, revealedHints).map((h, i) => (
                <div key={i} className="dsa-problem__hint">
                  <LightFilled size={14} className="dsa-problem__hint-icon" />
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className="dsa-mt-5">
            <Button
              size="sm"
              kind="tertiary"
              renderIcon={View}
              onClick={() => setShowSolution((s) => !s)}
            >
              {showSolution ? 'Hide solution' : 'Show solution'}
            </Button>
            {showSolution && (
              <pre className="dsa-code-block dsa-mt-3">{problem.solution}</pre>
            )}
          </div>
        </section>

        {/* Editor + tests panel */}
        <section className="dsa-editor-frame">
          <div className="dsa-editor-frame__bar">
            <span className="dsa-editor-frame__filename">
              {problem.functionName}.js
            </span>
            <div className="dsa-editor-frame__actions">
              <Button
                size="sm"
                kind="ghost"
                renderIcon={Reset}
                onClick={() => setCode(problem.starterCode)}
              >
                Reset
              </Button>
              <Button
                size="sm"
                kind="primary"
                renderIcon={Play}
                onClick={handleRun}
              >
                Run tests
              </Button>
            </div>
          </div>
          <div className="dsa-editor-frame__editor">
            <Editor
              height="380px"
              defaultLanguage="javascript"
              value={code}
              onChange={(v) => setCode(v ?? '')}
              theme={isDark ? 'vs-dark' : 'vs'}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'IBM Plex Mono', monospace",
                scrollBeyondLastLine: false,
                padding: { top: 8, bottom: 8 },
                tabSize: 2,
              }}
            />
          </div>

          {results && (
            <div className="dsa-test-results">
              <div
                className={
                  'dsa-test-results__banner ' +
                  (allPass ? 'dsa-test-results__banner--all-pass' : '')
                }
              >
                {allPass
                  ? `🎉 All ${results.length} tests passed!${wasSolved ? '' : ` +${problem.xpReward} XP`}`
                  : `${results.filter((r) => r.pass).length} / ${results.length} tests passed`}
              </div>
              <div className="dsa-test-results__list dsa-test-results__list--small">
                {results.map((r, i) => (
                  <div key={i} className="dsa-test-results__item">
                    <div className="dsa-test-results__row">
                      {r.pass ? (
                        <CheckmarkFilled
                          size={14}
                          className="dsa-module-card__lesson-status--done"
                        />
                      ) : (
                        <CloseFilled
                          size={14}
                          className="dsa-test-results__field-error"
                        />
                      )}
                      <span>Test {i + 1}</span>
                      {r.description && (
                        <span className="dsa-test-results__desc">
                          — {r.description}
                        </span>
                      )}
                    </div>
                    <div className="dsa-test-results__detail">
                      <div>
                        <span className="dsa-test-results__field-label">input: </span>
                        {stringify(r.input)}
                      </div>
                      <div>
                        <span className="dsa-test-results__field-label">expected: </span>
                        {stringify(r.expected)}
                      </div>
                      <div>
                        <span className="dsa-test-results__field-label">got: </span>
                        {r.error ? (
                          <span className="dsa-test-results__field-error">
                            {r.error}
                          </span>
                        ) : (
                          stringify(r.actual)
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
