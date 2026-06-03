import type { ExplanationSection, AnalogySection } from '@/types'
import { renderInline } from '@/lib/utils'

export function ExplanationBlock({ section }: { section: ExplanationSection }) {
  return (
    <section className="dsa-section">
      {section.heading && (
        <h2 className="dsa-section__heading">{section.heading}</h2>
      )}
      <div
        className="dsa-prose"
        dangerouslySetInnerHTML={{ __html: renderInline(section.body) }}
      />
    </section>
  )
}

export function AnalogyBlock({ section }: { section: AnalogySection }) {
  return (
    <section className="dsa-section">
      <div className="dsa-surface dsa-surface--accent dsa-analogy">
        <div className="dsa-analogy__emoji">{section.emoji ?? '💡'}</div>
        <div className="dsa-analogy__body">
          <h3 className="dsa-analogy__title">{section.title}</h3>
          <div
            className="dsa-analogy__text dsa-prose"
            dangerouslySetInnerHTML={{ __html: renderInline(section.body) }}
          />
        </div>
      </div>
    </section>
  )
}
