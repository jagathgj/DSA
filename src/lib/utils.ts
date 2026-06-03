import type { LevelInfo } from '@/types'

type ClassValue = string | number | null | undefined | false | Record<string, boolean>

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []
  for (const v of inputs) {
    if (!v) continue
    if (typeof v === 'string' || typeof v === 'number') {
      out.push(String(v))
    } else if (typeof v === 'object') {
      for (const [k, b] of Object.entries(v)) {
        if (b) out.push(k)
      }
    }
  }
  return out.join(' ')
}

// ============================================================================
// XP & Level helpers
// ============================================================================

export const LEVELS: LevelInfo[] = [
  { name: 'Beginner', min: 0, max: 199, color: 'hsl(var(--muted-foreground))' },
  { name: 'Explorer', min: 200, max: 599, color: 'hsl(195 80% 50%)' },
  { name: 'Builder', min: 600, max: 1499, color: 'hsl(142 60% 45%)' },
  { name: 'Solver', min: 1500, max: 3499, color: 'hsl(38 92% 55%)' },
  { name: 'Expert', min: 3500, max: Infinity, color: 'hsl(280 70% 60%)' },
]

export function getLevelInfo(xp: number): {
  current: LevelInfo
  next: LevelInfo | null
  progress: number
} {
  const current = LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[0]
  const idx = LEVELS.indexOf(current)
  const next = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null
  const progress =
    next && current.max !== Infinity
      ? ((xp - current.min) / (current.max - current.min + 1)) * 100
      : 100
  return { current, next, progress }
}

// ============================================================================
// Date / streak helpers
// ============================================================================

export function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function daysBetween(a: string, b: string): number {
  const toDate = (k: string) => {
    const [y, m, d] = k.split('-').map(Number)
    return new Date(y, m - 1, d).getTime()
  }
  return Math.round((toDate(b) - toDate(a)) / 86400000)
}

// ============================================================================
// Sandboxed JS execution
// ============================================================================

export interface RunResult {
  logs: string[]
  result: any
  error: string | null
  durationMs: number
}

/**
 * Runs JavaScript code in an isolated function scope with a captured console.
 * NOT a true sandbox, but adequate for a learning playground.
 */
export function runJavaScript(code: string, ...args: any[]): RunResult {
  const logs: string[] = []
  const start = performance.now()
  const fakeConsole = {
    log: (...a: any[]) => logs.push(a.map(stringify).join(' ')),
    error: (...a: any[]) => logs.push('Error: ' + a.map(stringify).join(' ')),
    warn: (...a: any[]) => logs.push('Warn: ' + a.map(stringify).join(' ')),
    info: (...a: any[]) => logs.push(a.map(stringify).join(' ')),
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const fn = new Function('console', `"use strict";\n${code}\nreturn typeof __ret === 'undefined' ? undefined : __ret;`)
    const result = fn(fakeConsole)
    return { logs, result, error: null, durationMs: performance.now() - start }
  } catch (err: any) {
    return { logs, result: undefined, error: err?.message ?? String(err), durationMs: performance.now() - start }
  }
}

/**
 * Runs JavaScript code expected to define a named function, then calls that
 * function with given args. Returns the function's return value.
 */
export function runFunction(
  code: string,
  functionName: string,
  args: any[]
): RunResult {
  const logs: string[] = []
  const start = performance.now()
  const fakeConsole = {
    log: (...a: any[]) => logs.push(a.map(stringify).join(' ')),
    error: (...a: any[]) => logs.push('Error: ' + a.map(stringify).join(' ')),
    warn: (...a: any[]) => logs.push('Warn: ' + a.map(stringify).join(' ')),
    info: (...a: any[]) => logs.push(a.map(stringify).join(' ')),
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const fn = new Function(
      'console',
      'args',
      `"use strict";\n${code}\nreturn (typeof ${functionName} === 'function') ? ${functionName}.apply(null, args) : undefined;`
    )
    const result = fn(fakeConsole, args)
    return { logs, result, error: null, durationMs: performance.now() - start }
  } catch (err: any) {
    return {
      logs,
      result: undefined,
      error: err?.message ?? String(err),
      durationMs: performance.now() - start,
    }
  }
}

export function stringify(v: any): string {
  if (typeof v === 'string') return v
  if (v === undefined) return 'undefined'
  if (v === null) return 'null'
  if (typeof v === 'function') return v.toString()
  try {
    return JSON.stringify(v)
  } catch {
    return String(v)
  }
}

export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object' || a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false
    return a.every((x, i) => deepEqual(x, b[i]))
  }
  const ak = Object.keys(a)
  const bk = Object.keys(b)
  if (ak.length !== bk.length) return false
  return ak.every((k) => deepEqual(a[k], b[k]))
}

// ============================================================================
// Markdown-lite renderer (just **bold** and `code`)
// ============================================================================

export function renderInline(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
}
