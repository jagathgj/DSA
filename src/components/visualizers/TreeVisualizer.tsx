import { useEffect, useMemo, useRef, useState } from 'react'
import { Select, SelectItem, Button } from '@carbon/react'
import {
  Play,
  Pause,
  Reset,
  ChevronLeft,
  ChevronRight,
} from '@carbon/icons-react'

interface TreeNode {
  v: number
  l?: TreeNode
  r?: TreeNode
}

const SAMPLE_TREE: TreeNode = {
  v: 50,
  l: {
    v: 30,
    l: { v: 20, l: { v: 10 }, r: { v: 25 } },
    r: { v: 40 },
  },
  r: {
    v: 70,
    l: { v: 60 },
    r: { v: 80, r: { v: 90 } },
  },
}

type Traversal = 'bfs' | 'inorder' | 'preorder' | 'postorder'

function inorder(n: TreeNode | undefined, out: number[] = []) {
  if (!n) return out
  inorder(n.l, out)
  out.push(n.v)
  inorder(n.r, out)
  return out
}
function preorder(n: TreeNode | undefined, out: number[] = []) {
  if (!n) return out
  out.push(n.v)
  preorder(n.l, out)
  preorder(n.r, out)
  return out
}
function postorder(n: TreeNode | undefined, out: number[] = []) {
  if (!n) return out
  postorder(n.l, out)
  postorder(n.r, out)
  out.push(n.v)
  return out
}
function bfs(root: TreeNode): number[] {
  const out: number[] = []
  const q: TreeNode[] = [root]
  while (q.length) {
    const n = q.shift()!
    out.push(n.v)
    if (n.l) q.push(n.l)
    if (n.r) q.push(n.r)
  }
  return out
}

interface Positioned {
  node: TreeNode
  x: number
  y: number
}

function layout(root: TreeNode) {
  const positions: Positioned[] = []
  let xCounter = 0
  function visit(n: TreeNode | undefined, depth: number) {
    if (!n) return
    visit(n.l, depth + 1)
    positions.push({ node: n, x: xCounter++, y: depth })
    visit(n.r, depth + 1)
  }
  visit(root, 0)
  return positions
}

export function TreeVisualizer() {
  const [traversal, setTraversal] = useState<Traversal>('bfs')
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed] = useState(700)
  const timer = useRef<number | null>(null)

  const order = useMemo(() => {
    switch (traversal) {
      case 'bfs':
        return bfs(SAMPLE_TREE)
      case 'inorder':
        return inorder(SAMPLE_TREE)
      case 'preorder':
        return preorder(SAMPLE_TREE)
      case 'postorder':
        return postorder(SAMPLE_TREE)
    }
  }, [traversal])

  const visited = order.slice(0, step + 1)
  const current = order[step]

  const positioned = useMemo(() => layout(SAMPLE_TREE), [])
  const maxX = Math.max(...positioned.map((p) => p.x))
  const maxY = Math.max(...positioned.map((p) => p.y))
  const cellW = 64
  const cellH = 72
  const w = (maxX + 1) * cellW + 40
  const h = (maxY + 1) * cellH + 40

  const posOf = new Map<TreeNode, { cx: number; cy: number }>()
  positioned.forEach((p) => {
    posOf.set(p.node, {
      cx: 20 + p.x * cellW + cellW / 2,
      cy: 20 + p.y * cellH + cellH / 2,
    })
  })

  const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
  positioned.forEach(({ node }) => {
    const a = posOf.get(node)!
    if (node.l) {
      const b = posOf.get(node.l)
      if (b) lines.push({ x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy })
    }
    if (node.r) {
      const b = posOf.get(node.r)
      if (b) lines.push({ x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy })
    }
  })

  useEffect(() => {
    if (!playing) return
    if (step >= order.length - 1) {
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
  }, [playing, step, order.length, speed])

  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [traversal])

  return (
    <div>
      <div className="dsa-viz-controls">
        <div className="dsa-viz-controls__select dsa-viz-controls__select--wider">
          <Select
            id="tree-traversal"
            labelText=""
            hideLabel
            size="sm"
            value={traversal}
            onChange={(e) => setTraversal(e.target.value as Traversal)}
          >
            <SelectItem value="bfs" text="BFS (level order)" />
            <SelectItem value="inorder" text="Inorder DFS (left, root, right)" />
            <SelectItem value="preorder" text="Preorder DFS (root, left, right)" />
            <SelectItem value="postorder" text="Postorder DFS (left, right, root)" />
          </Select>
        </div>
      </div>

      <div className="dsa-viz-frame">
        <svg width={w} height={h} className="dsa-viz-frame__svg">
          {lines.map((l, i) => (
            <line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              className="dsa-svg-edge"
            />
          ))}
          {positioned.map(({ node }, i) => {
            const p = posOf.get(node)!
            const isCurrent = node.v === current
            const isVisited = visited.includes(node.v)
            return (
              <g key={i}>
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={20}
                  className={`dsa-svg-node${isCurrent ? ' dsa-svg-node--current' : isVisited ? ' dsa-svg-node--visited' : ''}`}
                  strokeWidth={isCurrent ? 2.5 : 1.5}
                />
                <text
                  x={p.cx}
                  y={p.cy + 4}
                  textAnchor="middle"
                  fontSize="12"
                  className={`dsa-svg-text${isCurrent || isVisited ? ' dsa-svg-text--on-color' : ''}`}
                >
                  {node.v}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="dsa-viz-frame__note">
          visited so far: [{visited.join(', ')}]
        </div>
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
            onClick={() => setStep((s) => Math.min(order.length - 1, s + 1))}
            disabled={step >= order.length - 1}
          >
            Next
          </Button>
          <Button size="sm" kind="ghost" renderIcon={Reset} onClick={() => setStep(0)}>
            Reset
          </Button>
        </div>
        <div className="dsa-viz-foot__step">
          step {step + 1} / {order.length}
        </div>
      </div>
    </div>
  )
}
