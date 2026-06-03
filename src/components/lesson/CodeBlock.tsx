import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Button } from '@carbon/react'
import { Play, Reset, Copy, Checkmark } from '@carbon/icons-react'
import type { CodeSection } from '@/types'
import { runJavaScript, stringify } from '@/lib/utils'
import { useSettingsStore } from '@/stores/useSettingsStore'

export function CodeBlock({ section }: { section: CodeSection }) {
  const [code, setCode] = useState(section.code)
  const [output, setOutput] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const { theme } = useSettingsStore()

  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  const handleRun = () => {
    setRunning(true)
    setTimeout(() => {
      const result = runJavaScript(code)
      const lines: string[] = []
      result.logs.forEach((l) => lines.push(l))
      if (result.error) lines.push('⨯ ' + result.error)
      if (
        result.result !== undefined &&
        result.error === null &&
        result.logs.length === 0
      ) {
        lines.push('→ ' + stringify(result.result))
      }
      setOutput(lines)
      setRunning(false)
    }, 30)
  }

  const handleReset = () => {
    setCode(section.code)
    setOutput([])
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
    <section className="dsa-section">
      {section.caption && (
        <div className="dsa-eyebrow dsa-mt-2">{section.caption}</div>
      )}
      <div className="dsa-editor-frame">
        <div className="dsa-editor-frame__bar">
          <span className="dsa-editor-frame__filename">snippet.js</span>
          <div className="dsa-editor-frame__actions">
            <Button
              kind="ghost"
              size="sm"
              renderIcon={copied ? Checkmark : Copy}
              iconDescription={copied ? 'Copied' : 'Copy'}
              hasIconOnly
              onClick={handleCopy}
            />
            <Button
              kind="ghost"
              size="sm"
              renderIcon={Reset}
              iconDescription="Reset"
              hasIconOnly
              onClick={handleReset}
            />
            {section.runnable !== false && (
              <Button
                kind="primary"
                size="sm"
                renderIcon={Play}
                onClick={handleRun}
                disabled={running}
              >
                {running ? 'Running…' : 'Run'}
              </Button>
            )}
          </div>
        </div>
        <Editor
          height="260px"
          defaultLanguage="javascript"
          value={code}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
          onChange={(v) => setCode(v ?? '')}
          options={{
            fontSize: 13,
            fontFamily: "'IBM Plex Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            tabSize: 2,
            padding: { top: 10, bottom: 10 },
            lineNumbers: 'on',
          }}
        />
      </div>
      {output.length > 0 && (
        <div className="dsa-console dsa-console--top-gap">
          {output.map((line, i) => (
            <div
              key={i}
              className={
                'dsa-console__line ' +
                (line.startsWith('⨯')
                  ? 'dsa-console__line--error'
                  : line.startsWith('→')
                    ? 'dsa-console__line--result'
                    : '')
              }
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
