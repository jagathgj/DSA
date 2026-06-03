import type { Achievement } from '@/types'

// Icon names map to @carbon/icons-react exports
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'First Step',
    description: 'Complete your very first lesson',
    icon: 'Bookmark',
    condition: { kind: 'firstLesson' },
  },
  {
    id: 'array-master',
    title: 'Array Master',
    description: 'Complete the entire Arrays module',
    icon: 'GridAlt',
    condition: { kind: 'completeModule', moduleId: 'arrays' },
  },
  {
    id: 'tree-explorer',
    title: 'Tree Explorer',
    description: 'Complete the Trees module',
    icon: 'TreeViewAlt',
    condition: { kind: 'completeModule', moduleId: 'trees' },
  },
  {
    id: 'sorting-expert',
    title: 'Sorting Expert',
    description: 'Complete every sorting lesson',
    icon: 'SortAscending',
    condition: { kind: 'completeModule', moduleId: 'sorting' },
  },
  {
    id: 'graph-adventurer',
    title: 'Graph Adventurer',
    description: 'Conquer the Graphs module',
    icon: 'ChartNetwork',
    condition: { kind: 'completeModule', moduleId: 'graphs' },
  },
  {
    id: 'recursion-apprentice',
    title: 'Recursion Apprentice',
    description: 'Survive your first recursive lesson',
    icon: 'Repeat',
    condition: { kind: 'completeModule', moduleId: 'recursion' },
  },
  {
    id: 'dp-warrior',
    title: 'DP Warrior',
    description: 'Finish Dynamic Programming',
    icon: 'MachineLearningModel',
    condition: { kind: 'completeModule', moduleId: 'dp' },
  },
  {
    id: 'ten-lessons',
    title: 'Dedicated',
    description: 'Complete 10 lessons',
    icon: 'Trophy',
    condition: { kind: 'totalLessons', count: 10 },
  },
  {
    id: 'thousand-xp',
    title: '1,000 XP Club',
    description: 'Earn your first 1,000 XP',
    icon: 'Medal',
    condition: { kind: 'totalXp', amount: 1000 },
  },
  {
    id: 'streak-3',
    title: 'On a Roll',
    description: 'Learn 3 days in a row',
    icon: 'Fire',
    condition: { kind: 'streakDays', days: 3 },
  },
  {
    id: 'streak-7',
    title: 'Weekly Devotee',
    description: 'Learn 7 days in a row',
    icon: 'FlameFilled',
    condition: { kind: 'streakDays', days: 7 },
  },
  {
    id: 'solver-five',
    title: 'Problem Solver',
    description: 'Solve 5 problems',
    icon: 'CheckmarkFilled',
    condition: { kind: 'solveProblems', count: 5 },
  },
]

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}
