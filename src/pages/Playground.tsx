import { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { Button, Tag } from '@carbon/react'
import {
  Play,
  TrashCan,
  Copy,
  Checkmark,
  DocumentBlank,
} from '@carbon/icons-react'
import { runJavaScript, stringify } from '@/lib/utils'
import { useSettingsStore } from '@/stores/useSettingsStore'

interface LogLine {
  kind: 'log' | 'error' | 'result'
  text: string
}

const PRESETS: { label: string; code: string }[] = [
  {
    label: 'Hello World',
    code: `// A friendly start
console.log("Hello, DSA Quest!")
`,
  },
  {
    label: 'FizzBuzz',
    code: `// Classic FizzBuzz from 1 to 20
for (let i = 1; i <= 20; i++) {
  if (i % 15 === 0) console.log("FizzBuzz")
  else if (i % 3 === 0) console.log("Fizz")
  else if (i % 5 === 0) console.log("Buzz")
  else console.log(i)
}
`,
  },
  {
    label: 'Fibonacci',
    code: `// First 10 Fibonacci numbers
function fib(n) {
  const out = [0, 1]
  for (let i = 2; i < n; i++) out.push(out[i - 1] + out[i - 2])
  return out
}
console.log(fib(10))
`,
  },
  {
    label: 'Two Sum',
    code: `// Find two indices whose values sum to target
function twoSum(nums, target) {
  const seen = new Map()
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (seen.has(need)) return [seen.get(need), i]
    seen.set(nums[i], i)
  }
  return []
}
console.log(twoSum([2, 7, 11, 15], 9))
console.log(twoSum([3, 2, 4], 6))
`,
  },
  {
    label: 'Reverse Linked List',
    code: `// Iterative reversal of a singly linked list
function reverse(head) {
  let prev = null, curr = head
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}

const list = { v: 1, next: { v: 2, next: { v: 3, next: { v: 4, next: null } } } }
let r = reverse(list)
const out = []
while (r) { out.push(r.v); r = r.next }
console.log(out)
`,
  },
]

export function PlaygroundPage() {
  const [code, setCode] = useState<string>(PRESETS[0].code)
  const [logs, setLogs] = useState<LogLine[]>([])
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [duration, setDuration] = useState<number | null>(null)
  const { theme } = useSettingsStore()

  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  const handleRun = useCallback(() => {
    setRunning(true)
    setLogs([])
    setDuration(null)
    setTimeout(() => {
      const result = runJavaScript(code)
      const next: LogLine[] = []
      result.logs.forEach((l) => next.push({ kind: 'log', text: l }))
      if (result.error) next.push({ kind: 'error', text: result.error })
      if (
        result.result !== undefined &&
        result.error === null &&
        result.logs.length === 0
      ) {
        next.push({ kind: 'result', text: stringify(result.result) })
      }
      setLogs(next)
      setDuration(result.durationMs)
      setRunning(false)
    }, 30)
  }, [code])

  const handleClear = () => {
    setLogs([])
    setDuration(null)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* noop */
    }
  }

  return (
    <div className="dsa-stack dsa-stack--gap-6">
      <header className="dsa-page-header">
        <h1 className="dsa-page-header__title">Playground</h1>
        <p className="dsa-page-header__subtitle">
          A sandbox for JavaScript. Runs in a sandboxed Function — no network, no DOM.
        </p>
      </header>

      <div className="dsa-playground__presets">
        <div className="dsa-playground__presets-label">
          <DocumentBlank size={14} />
          <span className="dsa-eyebrow">Presets</span>
        </div>
        {PRESETS.map((p) => (
          <Tag
            key={p.label}
            type="cool-gray"
            onClick={() => {
              setCode(p.code)
              setLogs([])
              setDuration(null)
            }}
          >
            {p.label}
          </Tag>
        ))}
      </div>

      <div className="dsa-grid dsa-grid--editor-console dsa-grid--gap-4">
        <div className="dsa-editor-frame">
          <div className="dsa-editor-frame__bar">
            <span className="dsa-editor-frame__filename">playground.js</span>
            <div className="dsa-editor-frame__actions">
              <Button
                size="sm"
                kind="ghost"
                renderIcon={copied ? Checkmark : Copy}
                onClick={handleCopy}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button
                size="sm"
                kind="primary"
                renderIcon={Play}
                onClick={handleRun}
                disabled={running}
              >
                {running ? 'Running…' : 'Run'}
              </Button>
            </div>
          </div>
          <Editor
            height="540px"
            defaultLanguage="javascript"
            value={code}
            theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
            onChange={(v) => setCode(v ?? '')}
            options={{
              fontSize: 14,
              fontFamily: "'IBM Plex Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              tabSize: 2,
              padding: { top: 12, bottom: 12 },
              smoothScrolling: true,
              cursorBlinking: 'smooth',
            }}
          />
        </div>

        <div className="dsa-editor-frame">
          <div className="dsa-editor-frame__bar">
            <div className="dsa-playground__console-head">
              <span className="dsa-eyebrow">Console</span>
              {duration !== null && (
                <span className="dsa-playground__duration">
                  · {duration.toFixed(2)}ms
                </span>
              )}
            </div>
            <Button
              size="sm"
              kind="ghost"
              renderIcon={TrashCan}
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
          <div className="dsa-console dsa-console--lg">
            {logs.length === 0 && (
              <div className="dsa-console__line dsa-console__line--muted">
                Output will appear here when you run your code…
              </div>
            )}
            {logs.map((line, i) => (
              <div
                key={i}
                className={
                  'dsa-console__line ' +
                  (line.kind === 'error'
                    ? 'dsa-console__line--error'
                    : line.kind === 'result'
                      ? 'dsa-console__line--result'
                      : '')
                }
              >
                {line.kind === 'error' && '⨯ '}
                {line.kind === 'result' && '→ '}
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dsa-surface dsa-playground__hint">
        <strong>Tip:</strong> Use <code className="dsa-code-inline">console.log()</code>{' '}
        to print values. The last expression's value is also shown if nothing
        was logged. Errors and stack traces appear in red.
      </div>
    </div>
  )
}
