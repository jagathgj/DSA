interface TreeNode {
  value: string | number
  left?: TreeNode | null
  right?: TreeNode | null
}

interface Props {
  root: TreeNode | null | undefined
  highlight?: (string | number)[]
}

interface Positioned {
  node: TreeNode
  x: number
  y: number
}

function layout(
  node: TreeNode | null | undefined,
  depth: number,
  counter: { i: number },
  positions: Positioned[]
): void {
  if (!node) return
  layout(node.left, depth + 1, counter, positions)
  positions.push({ node, x: counter.i, y: depth })
  counter.i++
  layout(node.right, depth + 1, counter, positions)
}

export function TreeDiagram({ root, highlight = [] }: Props) {
  if (!root) {
    return <div className="dsa-text-mono dsa-text-secondary">(empty tree)</div>
  }

  const positions: Positioned[] = []
  layout(root, 0, { i: 0 }, positions)

  const xUnit = 56
  const yUnit = 70
  const radius = 20
  const padX = 32
  const padY = 32

  const maxX = Math.max(...positions.map((p) => p.x))
  const maxY = Math.max(...positions.map((p) => p.y))
  const width = (maxX + 1) * xUnit + padX * 2 - xUnit / 2
  const height = (maxY + 1) * yUnit + padY * 2

  const pos = new Map<TreeNode, Positioned>()
  positions.forEach((p) => pos.set(p.node, p))

  // Find edges
  const edges: { from: Positioned; to: Positioned }[] = []
  positions.forEach((p) => {
    if (p.node.left && pos.has(p.node.left)) {
      edges.push({ from: p, to: pos.get(p.node.left)! })
    }
    if (p.node.right && pos.has(p.node.right)) {
      edges.push({ from: p, to: pos.get(p.node.right)! })
    }
  })

  const cx = (p: Positioned) => p.x * xUnit + padX
  const cy = (p: Positioned) => p.y * yUnit + padY

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="dsa-viz-frame__svg"
    >
      {edges.map((e, i) => (
        <line
          key={i}
          x1={cx(e.from)}
          y1={cy(e.from)}
          x2={cx(e.to)}
          y2={cy(e.to)}
          className="dsa-svg-edge"
        />
      ))}
      {positions.map((p, i) => {
        const isHl = highlight.includes(p.node.value)
        return (
          <g key={i}>
            <circle
              cx={cx(p)}
              cy={cy(p)}
              r={radius}
              className={`dsa-svg-node${isHl ? ' dsa-svg-node--highlight' : ''}`}
            />
            <text
              x={cx(p)}
              y={cy(p) + 4}
              fontSize="13"
              className={`dsa-svg-text${isHl ? ' dsa-svg-text--on-color' : ''}`}
              textAnchor="middle"
            >
              {p.node.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
