interface GraphData {
  nodes?: (string | number)[]
  edges?: [string | number, string | number][]
}

interface GraphProps {
  data: GraphData
  highlight?: (string | number)[]
}

export function GraphDiagram({ data, highlight = [] }: GraphProps) {
  const nodes = data.nodes ?? []
  const edges = data.edges ?? []
  const n = nodes.length
  const size = 280
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 32
  const radius = 22

  const positions = new Map<string | number, { x: number; y: number }>()
  nodes.forEach((node, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    positions.set(node, {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    })
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {edges.map(([a, b], i) => {
        const pa = positions.get(a)
        const pb = positions.get(b)
        if (!pa || !pb) return null
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
      {nodes.map((node) => {
        const p = positions.get(node)!
        const isHl = highlight.includes(node)
        return (
          <g key={String(node)}>
            <circle
              cx={p.x}
              cy={p.y}
              r={radius}
              className={`dsa-svg-node${isHl ? ' dsa-svg-node--highlight' : ''}`}
            />
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fontSize="13"
              className={`dsa-svg-text${isHl ? ' dsa-svg-text--on-color' : ''}`}
            >
              {node}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function AsciiDiagram({ text }: { text: string }) {
  return <pre className="dsa-ascii">{text}</pre>
}
