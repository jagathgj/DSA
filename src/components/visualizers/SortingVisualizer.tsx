import { useEffect, useMemo, useRef, useState } from 'react'
import { Select, SelectItem, Slider, Button } from '@carbon/react'
import {
  Play,
  Pause,
  Reset,
  Shuffle,
  ChevronLeft,
  ChevronRight,
} from '@carbon/icons-react'

type Algo = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick'

interface Frame {
  arr: number[]
  highlight?: number[]
  marker?: number[]
  note?: string
}

function genArray(n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10)
}

function bubbleFrames(input: number[]): Frame[] {
  const a = [...input]
  const frames: Frame[] = [{ arr: [...a], note: 'starting array' }]
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      frames.push({
        arr: [...a],
        highlight: [j, j + 1],
        marker: Array.from({ length: i }, (_, k) => a.length - 1 - k),
        note: `compare a[${j}] and a[${j + 1}]`,
      })
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        frames.push({
          arr: [...a],
          highlight: [j, j + 1],
          marker: Array.from({ length: i }, (_, k) => a.length - 1 - k),
          note: `swap (${a[j]} < ${a[j + 1]})`,
        })
      }
    }
  }
  frames.push({ arr: [...a], marker: a.map((_, k) => k), note: '✓ sorted' })
  return frames
}

function selectionFrames(input: number[]): Frame[] {
  const a = [...input]
  const frames: Frame[] = [{ arr: [...a], note: 'starting array' }]
  for (let i = 0; i < a.length; i++) {
    let min = i
    for (let j = i + 1; j < a.length; j++) {
      frames.push({
        arr: [...a],
        highlight: [min, j],
        marker: Array.from({ length: i }, (_, k) => k),
        note: `looking for min from index ${i}`,
      })
      if (a[j] < a[min]) min = j
    }
    if (min !== i) {
      ;[a[i], a[min]] = [a[min], a[i]]
      frames.push({
        arr: [...a],
        highlight: [i, min],
        marker: Array.from({ length: i + 1 }, (_, k) => k),
        note: `swap min into position ${i}`,
      })
    }
  }
  frames.push({ arr: [...a], marker: a.map((_, k) => k), note: '✓ sorted' })
  return frames
}

function insertionFrames(input: number[]): Frame[] {
  const a = [...input]
  const frames: Frame[] = [{ arr: [...a], note: 'starting array' }]
  for (let i = 1; i < a.length; i++) {
    let j = i
    frames.push({
      arr: [...a],
      highlight: [j],
      marker: Array.from({ length: i }, (_, k) => k),
      note: `insert a[${i}]=${a[i]} into sorted portion`,
    })
    while (j > 0 && a[j - 1] > a[j]) {
      ;[a[j], a[j - 1]] = [a[j - 1], a[j]]
      j--
      frames.push({
        arr: [...a],
        highlight: [j, j + 1],
        marker: Array.from({ length: i }, (_, k) => k),
        note: 'shift left',
      })
    }
  }
  frames.push({ arr: [...a], marker: a.map((_, k) => k), note: '✓ sorted' })
  return frames
}

function mergeFrames(input: number[]): Frame[] {
  const a = [...input]
  const frames: Frame[] = [{ arr: [...a], note: 'starting array' }]
  function mergeRange(lo: number, hi: number) {
    if (hi - lo <= 1) return
    const mid = (lo + hi) >> 1
    mergeRange(lo, mid)
    mergeRange(mid, hi)
    const merged: number[] = []
    let i = lo,
      j = mid
    while (i < mid && j < hi) {
      frames.push({
        arr: [...a],
        highlight: [i, j],
        marker: Array.from({ length: hi - lo }, (_, k) => lo + k),
        note: `merge [${lo}..${hi}) — compare a[${i}]=${a[i]}, a[${j}]=${a[j]}`,
      })
      if (a[i] <= a[j]) merged.push(a[i++])
      else merged.push(a[j++])
    }
    while (i < mid) merged.push(a[i++])
    while (j < hi) merged.push(a[j++])
    for (let k = 0; k < merged.length; k++) a[lo + k] = merged[k]
    frames.push({
      arr: [...a],
      marker: Array.from({ length: hi - lo }, (_, k) => lo + k),
      note: `merged [${lo}..${hi})`,
    })
  }
  mergeRange(0, a.length)
  frames.push({ arr: [...a], marker: a.map((_, k) => k), note: '✓ sorted' })
  return frames
}

function quickFrames(input: number[]): Frame[] {
  const a = [...input]
  const frames: Frame[] = [{ arr: [...a], note: 'starting array' }]
  function qs(lo: number, hi: number) {
    if (lo >= hi) return
    const pivot = a[hi]
    let i = lo - 1
    frames.push({ arr: [...a], marker: [hi], note: `pivot = a[${hi}] = ${pivot}` })
    for (let j = lo; j < hi; j++) {
      frames.push({
        arr: [...a],
        highlight: [j],
        marker: [hi],
        note: `compare a[${j}]=${a[j]} to pivot ${pivot}`,
      })
      if (a[j] < pivot) {
        i++
        ;[a[i], a[j]] = [a[j], a[i]]
        frames.push({
          arr: [...a],
          highlight: [i, j],
          marker: [hi],
          note: `swap into low partition`,
        })
      }
    }
    ;[a[i + 1], a[hi]] = [a[hi], a[i + 1]]
    frames.push({
      arr: [...a],
      highlight: [i + 1, hi],
      note: `place pivot at ${i + 1}`,
    })
    qs(lo, i)
    qs(i + 2, hi)
  }
  qs(0, a.length - 1)
  frames.push({ arr: [...a], marker: a.map((_, k) => k), note: '✓ sorted' })
  return frames
}

const ALGOS: Record<
  Algo,
  { name: string; gen: (a: number[]) => Frame[]; complexity: string }
> = {
  bubble: {
    name: 'Bubble Sort',
    gen: bubbleFrames,
    complexity: 'O(n²) worst — swaps adjacent pairs',
  },
  selection: {
    name: 'Selection Sort',
    gen: selectionFrames,
    complexity: 'O(n²) — picks min each pass',
  },
  insertion: {
    name: 'Insertion Sort',
    gen: insertionFrames,
    complexity: 'O(n²) worst, O(n) best — fast on nearly-sorted',
  },
  merge: {
    name: 'Merge Sort',
    gen: mergeFrames,
    complexity: 'O(n log n) — divide and conquer',
  },
  quick: {
    name: 'Quick Sort',
    gen: quickFrames,
    complexity: 'O(n log n) avg, O(n²) worst — pivot-based',
  },
}

export function SortingVisualizer() {
  const [algo, setAlgo] = useState<Algo>('bubble')
  const [size, setSize] = useState(16)
  const [seed, setSeed] = useState(0)
  const [speed, setSpeed] = useState(140)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)

  const initialArray = useMemo(() => genArray(size), [size, seed])
  const frames = useMemo(() => ALGOS[algo].gen(initialArray), [algo, initialArray])
  const current = frames[Math.min(step, frames.length - 1)]
  const maxVal = Math.max(...initialArray, 100)

  useEffect(() => {
    if (!playing) return
    if (step >= frames.length - 1) {
      setPlaying(false)
      return
    }
    timer.current = window.setTimeout(
      () => setStep((s) => s + 1),
      speed
    ) as unknown as number
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [playing, step, frames.length, speed])

  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [algo, seed, size])

  return (
    <div>
      <div className="dsa-viz-controls">
        <div className="dsa-viz-controls__select">
          <Select
            id="sort-algo"
            labelText=""
            hideLabel
            size="sm"
            value={algo}
            onChange={(e) => setAlgo(e.target.value as Algo)}
          >
            {(Object.keys(ALGOS) as Algo[]).map((k) => (
              <SelectItem key={k} value={k} text={ALGOS[k].name} />
            ))}
          </Select>
        </div>
        <div className="dsa-viz-controls__slider">
          <Slider
            id="sort-size"
            labelText="Array size"
            min={6}
            max={30}
            step={1}
            value={size}
            onChange={({ value }) => setSize(value)}
            hideTextInput
          />
        </div>
        <div className="dsa-viz-controls__slider">
          <Slider
            id="sort-speed"
            labelText="Speed"
            min={30}
            max={400}
            step={10}
            value={400 - speed + 30}
            onChange={({ value }) => setSpeed(400 - value + 30)}
            hideTextInput
          />
        </div>
        <Button
          size="sm"
          kind="ghost"
          renderIcon={Shuffle}
          onClick={() => setSeed((s) => s + 1)}
        >
          New
        </Button>
      </div>

      <div className="dsa-viz-frame">
        <div className="dsa-bars">
          {current.arr.map((v, i) => {
            const isHi = current.highlight?.includes(i)
            const isMark = current.marker?.includes(i)
            return (
              <div
                key={i}
                className={
                  'dsa-bar' +
                  (isHi ? ' dsa-bar--cmp' : isMark ? ' dsa-bar--done' : '')
                }
                style={{ height: `${(v / maxVal) * 100}%` }}
                title={String(v)}
              />
            )
          })}
        </div>
        <div className="dsa-viz-frame__note">{current.note}</div>
        <div className="dsa-viz-frame__hint">{ALGOS[algo].complexity}</div>
      </div>

      <div className="dsa-viz-foot">
        <div className="dsa-viz-foot__buttons">
          <Button
            size="sm"
            kind="ghost"
            renderIcon={ChevronLeft}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Prev
          </Button>
          <Button
            size="sm"
            kind="primary"
            renderIcon={playing ? Pause : Play}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? 'Pause' : 'Play'}
          </Button>
          <Button
            size="sm"
            kind="ghost"
            renderIcon={ChevronRight}
            onClick={() => setStep((s) => Math.min(frames.length - 1, s + 1))}
            disabled={step >= frames.length - 1}
          >
            Next
          </Button>
          <Button
            size="sm"
            kind="ghost"
            renderIcon={Reset}
            onClick={() => {
              setStep(0)
              setPlaying(false)
            }}
          >
            Reset
          </Button>
        </div>
        <div className="dsa-viz-foot__step">
          step {step + 1} / {frames.length}
        </div>
      </div>
    </div>
  )
}
