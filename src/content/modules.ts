import type { Module } from '@/types'

export const MODULES: Module[] = [
  {
    id: 'js-basics',
    title: 'JavaScript Basics',
    icon: 'Sparkles',
    description: 'Variables, functions, loops. The foundation everything sits on.',
    color: '38 92% 55%',
    lessons: ['js-variables', 'js-functions'],
  },
  {
    id: 'big-o',
    title: 'Big O Notation',
    icon: 'Gauge',
    description: 'How we measure if code is fast or slow.',
    color: '195 80% 55%',
    lessons: [
      'big-o-intro',
      'big-o-formal',
      'big-o-omega-theta',
      'big-o-comparison',
      'big-o-space',
      'big-o-cases',
      'big-o-logn',
      'big-o-nlogn',
      'big-o-bad-ones',
      'big-o-when-it-doesnt-matter',
    ],
    unlocksAfter: 'js-basics',
  },
  {
    id: 'arrays',
    title: 'Arrays',
    icon: 'LayoutGrid',
    description: 'A row of numbered boxes that hold things in order.',
    color: '142 60% 45%',
    lessons: ['arrays-intro', 'arrays-operations'],
    unlocksAfter: 'big-o',
  },
  {
    id: 'strings',
    title: 'Strings',
    icon: 'Type',
    description: 'Text is just a special kind of array.',
    color: '280 70% 60%',
    lessons: ['strings-intro'],
    unlocksAfter: 'arrays',
  },
  {
    id: 'recursion',
    title: 'Recursion',
    icon: 'Repeat',
    description: 'Functions that call themselves. Magical but tricky.',
    color: '0 72% 60%',
    lessons: ['recursion-intro'],
    unlocksAfter: 'strings',
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    icon: 'Link2',
    description: 'Boxes connected by arrows. No fixed positions.',
    color: '210 80% 60%',
    lessons: ['linked-lists-intro'],
    unlocksAfter: 'recursion',
  },
  {
    id: 'stacks',
    title: 'Stacks',
    icon: 'Layers',
    description: 'Like a stack of plates. Last in, first out.',
    color: '25 90% 55%',
    lessons: ['stacks-intro'],
    unlocksAfter: 'linked-lists',
  },
  {
    id: 'queues',
    title: 'Queues',
    icon: 'AlignLeft',
    description: 'Like people in line. First in, first out.',
    color: '180 70% 45%',
    lessons: ['queues-intro'],
    unlocksAfter: 'stacks',
  },
  {
    id: 'hash-maps',
    title: 'Hash Maps',
    icon: 'KeySquare',
    description: 'Lightning-fast lookups by key.',
    color: '320 70% 55%',
    lessons: ['hash-maps-intro'],
    unlocksAfter: 'queues',
  },
  {
    id: 'sets',
    title: 'Sets',
    icon: 'Boxes',
    description: 'Collections with no duplicates.',
    color: '160 60% 45%',
    lessons: ['sets-intro'],
    unlocksAfter: 'hash-maps',
  },
  {
    id: 'trees',
    title: 'Trees',
    icon: 'GitBranch',
    description: 'Family-tree-like data with parents and children.',
    color: '110 60% 45%',
    lessons: ['trees-intro'],
    unlocksAfter: 'sets',
  },
  {
    id: 'bst',
    title: 'Binary Search Trees',
    icon: 'Binary',
    description: 'Trees that stay sorted automatically.',
    color: '90 60% 45%',
    lessons: ['bst-intro'],
    unlocksAfter: 'trees',
  },
  {
    id: 'heaps',
    title: 'Heaps',
    icon: 'Mountain',
    description: 'Trees that always keep the biggest (or smallest) on top.',
    color: '40 80% 50%',
    lessons: ['heaps-intro'],
    unlocksAfter: 'bst',
  },
  {
    id: 'graphs',
    title: 'Graphs',
    icon: 'Network',
    description: 'Nodes connected by edges. The structure of relationships.',
    color: '250 70% 60%',
    lessons: ['graphs-intro'],
    unlocksAfter: 'heaps',
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    icon: 'ArrowDownUp',
    description: 'Putting things in order — every which way.',
    color: '15 85% 55%',
    lessons: ['sorting-intro', 'sorting-bubble', 'sorting-merge'],
    unlocksAfter: 'graphs',
  },
  {
    id: 'searching',
    title: 'Searching Algorithms',
    icon: 'Search',
    description: 'Finding what you need, fast.',
    color: '195 80% 50%',
    lessons: ['searching-intro', 'searching-binary'],
    unlocksAfter: 'sorting',
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers',
    icon: 'MoveHorizontal',
    description: 'A clever pattern using two indexes.',
    color: '300 60% 55%',
    lessons: ['two-pointers-intro'],
    unlocksAfter: 'searching',
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    icon: 'Move3D',
    description: 'Process subarrays efficiently by sliding a window.',
    color: '50 80% 50%',
    lessons: ['sliding-window-intro'],
    unlocksAfter: 'two-pointers',
  },
  {
    id: 'greedy',
    title: 'Greedy Algorithms',
    icon: 'TrendingUp',
    description: 'Make the best choice right now. Hope it works out.',
    color: '142 60% 45%',
    lessons: ['greedy-intro'],
    unlocksAfter: 'sliding-window',
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    icon: 'RotateCcw',
    description: 'Try things. Undo. Try something else.',
    color: '345 70% 55%',
    lessons: ['backtracking-intro'],
    unlocksAfter: 'greedy',
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    icon: 'Brain',
    description: 'Remember answers so you don\'t solve the same problem twice.',
    color: '270 70% 60%',
    lessons: ['dp-intro'],
    unlocksAfter: 'backtracking',
  },
]

export function getModule(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id)
}

export function getModuleForLesson(lessonId: string): Module | undefined {
  return MODULES.find((m) => m.lessons.includes(lessonId))
}

export function isModuleUnlocked(
  moduleId: string,
  completedLessons: Record<string, unknown>
): boolean {
  const mod = getModule(moduleId)
  if (!mod) return false
  if (!mod.unlocksAfter) return true
  const prev = getModule(mod.unlocksAfter)
  if (!prev) return true
  return prev.lessons.every((l) => completedLessons[l])
}

export function getNextLesson(
  lessonId: string,
  completedLessons: Record<string, unknown>
): { lessonId: string; moduleId: string } | null {
  // Same module first
  const mod = getModuleForLesson(lessonId)
  if (mod) {
    const idx = mod.lessons.indexOf(lessonId)
    if (idx < mod.lessons.length - 1) {
      return { lessonId: mod.lessons[idx + 1], moduleId: mod.id }
    }
    // Next module
    const modIdx = MODULES.indexOf(mod)
    for (let i = modIdx + 1; i < MODULES.length; i++) {
      if (isModuleUnlocked(MODULES[i].id, completedLessons) && MODULES[i].lessons.length) {
        return { lessonId: MODULES[i].lessons[0], moduleId: MODULES[i].id }
      }
    }
  }
  return null
}

export function getRecommendedLesson(
  completedLessons: Record<string, unknown>
): { lessonId: string; moduleId: string } | null {
  for (const m of MODULES) {
    if (!isModuleUnlocked(m.id, completedLessons)) continue
    for (const l of m.lessons) {
      if (!completedLessons[l]) return { lessonId: l, moduleId: m.id }
    }
  }
  return null
}
