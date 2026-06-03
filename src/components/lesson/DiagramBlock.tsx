import type { DiagramSection } from '@/types'
import { ArrayDiagram } from './diagrams/ArrayDiagram'
import { LinkedListDiagram } from './diagrams/LinkedListDiagram'
import { TreeDiagram } from './diagrams/TreeDiagram'
import { StackDiagram, QueueDiagram } from './diagrams/StackQueueDiagrams'
import { GraphDiagram, AsciiDiagram } from './diagrams/GraphAsciiDiagrams'

export function DiagramBlock({ section }: { section: DiagramSection }) {
  return (
    <section className="dsa-section">
      <div className="dsa-diagram">{renderInner(section)}</div>
      {section.caption && (
        <div className="dsa-diagram-caption">{section.caption}</div>
      )}
    </section>
  )
}

function renderInner(s: DiagramSection) {
  switch (s.variant) {
    case 'array':
      return (
        <ArrayDiagram
          values={s.data.values ?? []}
          highlight={s.data.highlight}
          labels={s.data.labels}
        />
      )
    case 'linked-list':
      return (
        <LinkedListDiagram
          values={s.data.values ?? []}
          nullTerminated={s.data.nullTerminated !== false}
        />
      )
    case 'tree':
      return <TreeDiagram root={s.data.root} highlight={s.data.highlight} />
    case 'stack':
      return <StackDiagram values={s.data.values ?? []} />
    case 'queue':
      return <QueueDiagram values={s.data.values ?? []} />
    case 'graph':
      return <GraphDiagram data={s.data} highlight={s.data.highlight} />
    case 'ascii':
      return <AsciiDiagram text={s.data.text ?? ''} />
    default:
      return null
  }
}
