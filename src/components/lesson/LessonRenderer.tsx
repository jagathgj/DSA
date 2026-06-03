import type { Lesson, LessonSection } from '@/types'
import { ExplanationBlock, AnalogyBlock } from './ExplanationBlock'
import { CodeBlock } from './CodeBlock'
import { DiagramBlock } from './DiagramBlock'
import { InteractiveBlock } from './InteractiveBlock'
import { WalkthroughBlock } from './WalkthroughBlock'
import { QuizBlock } from './QuizBlock'
import { ChallengeBlock } from './ChallengeBlock'

export function LessonRenderer({ lesson }: { lesson: Lesson }) {
  return (
    <div className="dsa-lesson-renderer">
      {lesson.sections.map((section, i) => (
        <SectionRenderer key={i} section={section} lessonId={lesson.id} />
      ))}
    </div>
  )
}

function SectionRenderer({
  section,
  lessonId,
}: {
  section: LessonSection
  lessonId: string
}) {
  switch (section.type) {
    case 'explanation':
      return <ExplanationBlock section={section} />
    case 'analogy':
      return <AnalogyBlock section={section} />
    case 'diagram':
      return <DiagramBlock section={section} />
    case 'code':
      return <CodeBlock section={section} />
    case 'interactive':
      return <InteractiveBlock section={section} />
    case 'walkthrough':
      return <WalkthroughBlock section={section} />
    case 'quiz':
      return <QuizBlock section={section} lessonId={lessonId} />
    case 'challenge':
      return <ChallengeBlock section={section} />
    default:
      return null
  }
}
