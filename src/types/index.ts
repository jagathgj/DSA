// ============================================================================
// Module & Roadmap Types
// ============================================================================

export interface Module {
  id: string
  title: string
  icon: string // lucide icon name
  description: string
  color: string // tailwind color hint
  lessons: string[] // ordered lesson IDs
  unlocksAfter?: string // module id required
}

// ============================================================================
// Lesson Section Types — Discriminated Union
// ============================================================================

export type LessonSection =
  | ExplanationSection
  | AnalogySection
  | DiagramSection
  | CodeSection
  | InteractiveSection
  | QuizSection
  | ChallengeSection
  | WalkthroughSection

export interface ExplanationSection {
  type: 'explanation'
  heading?: string
  body: string // markdown-like simple text with **bold** and `code`
}

export interface AnalogySection {
  type: 'analogy'
  emoji: string
  title: string
  body: string
}

export interface DiagramSection {
  type: 'diagram'
  variant: 'array' | 'linked-list' | 'tree' | 'stack' | 'queue' | 'graph' | 'ascii'
  caption?: string
  data: any // shape depends on variant
}

export interface CodeSection {
  type: 'code'
  language: 'javascript'
  code: string
  caption?: string
  runnable?: boolean
}

export interface InteractiveSection {
  type: 'interactive'
  widget: 'array-playground' | 'linked-list-playground' | 'stack-playground' | 'queue-playground'
  caption?: string
}

export interface QuizSection {
  type: 'quiz'
  questions: QuizQuestion[]
}

export interface ChallengeSection {
  type: 'challenge'
  prompt: string
  starterCode: string
  solution: string
  testCases: TestCase[]
  hints: string[]
}

export interface WalkthroughSection {
  type: 'walkthrough'
  title: string
  steps: WalkthroughStep[]
}

export interface WalkthroughStep {
  text: string
  code?: string
  highlight?: string
}

// ============================================================================
// Quiz Types
// ============================================================================

export type QuizQuestion = MCQQuestion | FillBlankQuestion | PredictOutputQuestion | OrderingQuestion

export interface MCQQuestion {
  id: string
  type: 'mcq'
  question: string
  options: string[]
  correct: number // index
  explanation: string
}

export interface FillBlankQuestion {
  id: string
  type: 'fill-blank'
  question: string // contains ___ where blank goes
  answers: string[] // accepted answers (case-insensitive)
  explanation: string
}

export interface PredictOutputQuestion {
  id: string
  type: 'predict-output'
  question: string
  code: string
  options: string[]
  correct: number
  explanation: string
}

export interface OrderingQuestion {
  id: string
  type: 'ordering'
  question: string
  items: string[] // shown in random order
  correctOrder: number[] // indices into items in correct order
  explanation: string
}

// ============================================================================
// Lesson Type
// ============================================================================

export interface Lesson {
  id: string
  moduleId: string
  title: string
  subtitle?: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedMinutes: number
  xpReward: number
  sections: LessonSection[]
}

// ============================================================================
// Problems (LeetCode-style)
// ============================================================================

export interface TestCase {
  input: any[]
  expected: any
  description?: string
}

export interface Problem {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  starterCode: string
  solution: string
  hints: string[]
  testCases: TestCase[]
  functionName: string
  xpReward: number
}

// ============================================================================
// Achievements
// ============================================================================

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: AchievementCondition
}

export type AchievementCondition =
  | { kind: 'firstLesson' }
  | { kind: 'completeModule'; moduleId: string }
  | { kind: 'totalLessons'; count: number }
  | { kind: 'totalXp'; amount: number }
  | { kind: 'streakDays'; days: number }
  | { kind: 'solveProblems'; count: number; difficulty?: 'Easy' | 'Medium' | 'Hard' }
  | { kind: 'perfectQuiz'; count: number }

// ============================================================================
// Progress State (persisted)
// ============================================================================

export interface ProgressState {
  xp: number
  completedLessons: Record<string, { completedAt: number; score?: number }>
  completedProblems: Record<string, { completedAt: number; attempts: number }>
  quizScores: Record<string, { correct: number; total: number; lastAttempt: number }>
  unlockedAchievements: Record<string, number> // id -> timestamp
  streak: { current: number; longest: number; lastActiveDay: string | null }
  lastVisited: string | null // lesson id
}

// ============================================================================
// Level definitions
// ============================================================================

export interface LevelInfo {
  name: string
  min: number
  max: number
  color: string
}
