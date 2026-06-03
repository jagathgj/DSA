import { useState } from 'react'
import Editor from '@monaco-editor/react'
import type { ChallengeSection } from '@/types'
import { runFunction, deepEqual, stringify } from '@/lib/utils'
import { Button } from '@carbon/react'
import {
  Play,
  Reset,
  LightFilled,
  View,
  CheckmarkFilled,
  CloseFilled,
} from '@carbon/icons-react'
import { useSettingsStore } from '@/stores/useSettingsStore'

interface TestResult {
  pass: boolean
  expected: any
  actual: any
  input: any[]
  description?: string
  error?: string
}

export function ChallengeBlock({ section }: { section: ChallengeSection }) {
  const [code, setCode] = useState(section.starterCode)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [revealedHints, setRevealedHints] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const theme = useSettingsStore((s) => s.theme)
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  const fnNameMatch =
    section.starterCode.match(/function\s+(\w+)/) ||
    section.starterCode.match(/(?:const|let|var)\s+(\w+)\s*=/)
  const functionName = fnNameMatch?.[1] ?? 'solve'

  function handleRun() {
    const out: TestResult[] = []
    for (const tc of section.testCases) {
      const r = runFunction(code, functionName, tc.input)
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
  }

  const allPass = results && results.every((r) => r.pass)

  function handleReset() {
    setCode(section.starterCode)
    setResults(null)
  }

  return (
    <section className="dsa-section">
      <div className="dsa-challenge">
        <div className="dsa-challenge__head">
          <div className="dsa-eyebrow dsa-eyebrow--accent">Try it yourself</div>
          <div className="dsa-challenge__prompt">{section.prompt}</div>
        </div>
        <Editor
          height="240px"
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
        <div className="dsa-challenge__toolbar">
          <Button size="sm" kind="primary" renderIcon={Play} onClick={handleRun}>
            Run tests
          </Button>
          <Button size="sm" kind="ghost" renderIcon={Reset} onClick={handleReset}>
            Reset
          </Button>
          {revealedHints < section.hints.length && (
            <Button
              size="sm"
              kind="ghost"
              renderIcon={LightFilled}
              onClick={() => setRevealedHints((h) => h + 1)}
            >
              Hint ({revealedHints}/{section.hints.length})
            </Button>
          )}
          <Button
            size="sm"
            kind="ghost"
            renderIcon={View}
            onClick={() => setShowSolution((s) => !s)}
          >
            {showSolution ? 'Hide' : 'Show'} solution
          </Button>
        </div>
        {revealedHints > 0 && (
          <div className="dsa-challenge__hints">
            {section.hints.slice(0, revealedHints).map((h, i) => (
              <div key={i} className="dsa-challenge__hint">
                <LightFilled size={14} className="dsa-challenge__hint-icon" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        )}
        {showSolution && (
          <div className="dsa-challenge__solution">
            <div className="dsa-eyebrow dsa-mt-2">Solution</div>
            <pre className="dsa-code-block">{section.solution}</pre>
          </div>
        )}
        {results && (
          <div className="dsa-test-results">
            <div
              className={
                'dsa-test-results__banner ' +
                (allPass ? 'dsa-test-results__banner--all-pass' : '')
              }
            >
              {allPass
                ? `🎉 All ${results.length} tests passed!`
                : `${results.filter((r) => r.pass).length} / ${results.length} tests passed`}
            </div>
            <div className="dsa-test-results__list">
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
      </div>
    </section>
  )
}
