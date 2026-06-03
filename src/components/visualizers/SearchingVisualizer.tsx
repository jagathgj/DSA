import { useEffect, useMemo, useRef, useState } from 'react'
import { Select, SelectItem, Slider, Button, NumberInput } from '@carbon/react'
import {
  Play,
  Pause,
  Reset,
  Shuffle,
  ChevronLeft,
  ChevronRight,
} from '@carbon/icons-react'

type Algo = 'linear' | 'binary'

interface Frame {
  pointer: number
  range?: [number, number]
  found?: boolean
  note: string
}

function linearFrames(arr: number[], target: number): Frame[] {
  const frames: Frame[] = []
  for (let i = 0; i < arr.length; i++) {
    frames.push({
      pointer: i,
      note: `check a[${i}] = ${arr[i]} vs target ${target}`,
    })
    if (arr[i] === target) {
      frames.push({ pointer: i, found: true, note: `✓ found at index ${i}` })
      return frames
    }
  }
  frames.push({ pointer: -1, note: `✗ ${target} not found` })
  return frames
}

function binaryFrames(arr: number[], target: number): Frame[] {
  const frames: Frame[] = []
  let lo = 0,
    hi = arr.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    frames.push({
      pointer: mid,
      range: [lo, hi],
      note: `search [${lo}..${hi}] — mid=${mid}, a[${mid}]=${arr[mid]} vs ${target}`,
    })
    if (arr[mid] === target) {
      frames.push({
        pointer: mid,
        range: [lo, hi],
        found: true,
        note: `✓ found at index ${mid}`,
      })
      return frames
    }
    if (arr[mid] < target) lo = mid + 1
    else hi = mid - 1
  }
  frames.push({ pointer: -1, note: `✗ ${target} not found` })
  return frames
}

export function SearchingVisualizer() {
  const [algo, setAlgo] = useState<Algo>('binary')
  const [size, setSize] = useState(15)
  const [seed, setSeed] = useState(0)
  const [target, setTarget] = useState<number>(45)
  const [speed, setSpeed] = useState(450)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)

  const arr = useMemo(() => {
    const a = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 90) + 10,
    )
    return algo === 'binary' ? a.sort((x, y) => x - y) : a
  }, [size, seed, algo])

  const frames = useMemo(() => {
    return algo === 'linear' ? linearFrames(arr, target) : binaryFrames(arr, target)
  }, [arr, target, algo])

  const current = frames[Math.min(step, frames.length - 1)] ?? {
    pointer: -1,
    note: '',
  }

  useEffect(() => {
    if (!playing) return
    if (step >= frames.length - 1) {
      setPlaying(false)
      return
    }
    timer.current = window.setTimeout(
      () => setStep((s) => s + 1),
      speed,
    ) as unknown as number
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [playing, step, frames.length, speed])

  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [algo, seed, size, target])

  return (
    <div>
      <div className="dsa-viz-controls">
        <div className="dsa-viz-controls__select dsa-viz-controls__select--wide">
          <Select
            id="search-algo"
            labelText=""
            hideLabel
            size="sm"
            value={algo}
            onChange={(e) => setAlgo(e.target.value as Algo)}
          >
            <SelectItem value="linear" text="Linear Search" />
            <SelectItem value="binary" text="Binary Search (sorted)" />
          </Select>
        </div>
        <div className="dsa-viz-controls__field">
          <NumberInput
            id="search-target"
            label="Target"
            size="sm"
            value={target}
            onChange={(_e: any, { value }: any) => setTarget(Number(value))}
            hideSteppers
          />
        </div>
        <div className="dsa-viz-controls__slider">
          <Slider
            id="search-size"
            labelText="Array size"
            min={6}
            max={25}
            step={1}
            value={size}
            onChange={({ value }) => setSize(value)}
            hideTextInput
          />
        </div>
        <div className="dsa-viz-controls__slider">
          <Slider
            id="search-speed"
            labelText="Speed"
            min={100}
            max={1000}
            step={50}
            value={1000 - speed + 100}
            onChange={({ value }) => setSpeed(1000 - value + 100)}
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
        <div className="dsa-search-row">
          {arr.map((v, i) => {
            const inRange =
              current.range && i >= current.range[0] && i <= current.range[1]
            const isPtr = current.pointer === i
            const isFound = isPtr && current.found
            const boxModifier = isFound
              ? 'dsa-search-cell__box--found'
              : isPtr
                ? 'dsa-search-cell__box--pointer'
                : current.range && !inRange
                  ? 'dsa-search-cell__box--out-window'
                  : 'dsa-search-cell__box--in-window'
            return (
              <div key={i} className="dsa-search-cell">
                <div className={`dsa-search-cell__box ${boxModifier}`}>{v}</div>
                <div className="dsa-search-cell__idx">{i}</div>
              </div>
            )
          })}
        </div>
        <div className="dsa-viz-frame__note">{current.note}</div>
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
          <Button size="sm" kind="ghost" renderIcon={Reset} onClick={() => setStep(0)}>
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
