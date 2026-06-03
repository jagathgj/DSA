import type { InteractiveSection } from '@/types'
import { ArrayPlayground } from './interactive/ArrayPlayground'
import { LinkedListPlayground } from './interactive/LinkedListPlayground'
import { StackPlayground, QueuePlayground } from './interactive/StackQueuePlayground'

export function InteractiveBlock({ section }: { section: InteractiveSection }) {
  return (
    <section className="dsa-section">
      {section.caption && (
        <div className="dsa-eyebrow dsa-mt-2">{section.caption}</div>
      )}
      {section.widget === 'array-playground' && <ArrayPlayground />}
      {section.widget === 'linked-list-playground' && <LinkedListPlayground />}
      {section.widget === 'stack-playground' && <StackPlayground />}
      {section.widget === 'queue-playground' && <QueuePlayground />}
    </section>
  )
}
