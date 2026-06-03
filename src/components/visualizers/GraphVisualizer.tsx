import { useEffect, useMemo, useRef, useState } from 'react'
import { Select, SelectItem, Button } from '@carbon/react'
import {
  Play,
  Pause,
  Reset,
  ChevronLeft,
  ChevronRight,
} from '@carbon/icons-react'

interface GraphSpec {
  nodes: string[]
  edges: [string, string][]
}

const SAMPLE: GraphSpec = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  edges: [
    ['A', 'B'],
    ['A', 'C'],
    ['B', 'D'],
    ['B', 'E'],
    ['C', 'F'],
    ['E', 'G'],
    ['F', 'G'],
  ],
}

function buildAdj(g: GraphSpec): Record<string, string[]> {
  const adj: Record<string, string[]> = {}
  g.nodes.forEach((n) => (adj[n] = []))
  g.edges.forEach(([a, b]) => {
    adj[a].push(b)
    adj[b].push(a)
  })
  return adj
}

interface Frame {
  visited: string[]
  current: string
  queue?: string[]
  stack?: string[]
  note: string
}

function bfsFrames(g: GraphSpec, start: string): Frame[] {
  const adj = buildAdj(g)
  const visited = new Set<string>([start])
  const q: string[] = [start]
  const frames: Frame[] = [
    { visited: [start], current: start, queue: [...q], note: `start at ${start}` },
  ]
  while (q.length) {
    const cur = q.shift()!
    for (const next of adj[cur]) {
      if (!visited.has(next)) {
        visited.add(next)
        q.push(next)
        frames.push({
          visited: Array.from(visited),
          current: next,
          queue: [...q],
          note: `visit ${next} (neighbor of ${cur})`,
        })
      }
    }
  }
  return frames
}

function dfsFrames(g: GraphSpec, start: string): Frame[] {
  const adj = buildAdj(g)
  const visited = new Set<string>()
  const stack: string[] = [start]
  const frames: Frame[] = []
  while (stack.length) {
    const cur = stack.pop()!
    if (visited.has(cur)) continue
    visited.add(cur)
    frames.push({
      visited: Array.from(visited),
      current: cur,
      stack: [...stack],
      note: `visit ${cur}`,
    })
    for (let i = adj[cur].length - 1; i >= 0; i--) {
      const n = adj[cur][i]
      if (!visited.has(n)) stack.push(n)
    }
  }
  return frames
}

type Algo = 'bfs' | 'dfs'

export function GraphVisualizer() {
  const [algo, setAlgo] = useState<Algo>('bfs')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)
  const speed = 800

  const frames = useMemo(
    () => (algo === 'bfs' ? bfsFrames(SAMPLE, 'A') : dfsFrames(SAMPLE, 'A')),
    [algo]
  )
  const cur = frames[Math.min(step, frames.length - 1)]

  const positions = useMemo(() => {
    const n = SAMPLE.nodes.length
    const cx = 180
    const cy = 150
    const r = 110
    const map = new Map<string, { x: number; y: number }>()
    SAMPLE.nodes.forEach((id, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2
      map.set(id, { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) })
    })
    return map
  }, [])

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
  }, [playing, step, frames.length])

  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [algo])

  return (
    <div>
      <div className="dsa-viz-controls">
        <div className="dsa-viz-controls__select dsa-viz-controls__select--wider">
          <Select
            id="graph-algo"
            labelText=""
            hideLabel
            size="sm"
            value={algo}
            onChange={(e) => setAlgo(e.target.value as Algo)}
          >
            <SelectItem value="bfs" text="BFS (breadth-first, queue)" />
            <SelectItem value="dfs" text="DFS (depth-first, stack)" />
          </Select>
        </div>
      </div>

      <div className="dsa-viz-frame">
        <svg width={360} height={300} className="dsa-viz-frame__svg">
          {SAMPLE.edges.map(([a, b], i) => {
            const pa = positions.get(a)!
            const pb = positions.get(b)!
            return (
              <line
                key={i}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                className="dsa-svg-edge"
              />
            )
          })}
          {SAMPLE.nodes.map((id) => {
            const p = positions.get(id)!
            const isCurrent = cur.current === id
            const isVisited = cur.visited.includes(id)
            return (
              <g key={id}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={22}
                  className={`dsa-svg-node${isCurrent ? ' dsa-svg-node--current' : isVisited ? ' dsa-svg-node--visited' : ''}`}
                  strokeWidth={isCurrent ? 2.5 : 1.5}
                />
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="500"
                  className={`dsa-svg-text${isCurrent || isVisited ? ' dsa-svg-text--on-color' : ''}`}
                >
                  {id}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="dsa-viz-info">
          <div className="dsa-viz-info__cell">
            <div className="dsa-viz-info__label">visited</div>
            [{cur.visited.join(', ')}]
          </div>
          <div className="dsa-viz-info__cell">
            <div className="dsa-viz-info__label">
              {algo === 'bfs' ? 'queue' : 'stack'}
            </div>
            [{(algo === 'bfs' ? cur.queue : cur.stack)?.join(', ') ?? ''}]
          </div>
        </div>
        <div className="dsa-viz-frame__note">{cur.note}</div>
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
