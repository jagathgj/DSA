import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AchievementWatcher } from '@/components/AchievementWatcher'
import { Layout } from '@/components/layout/Layout'
import { DashboardPage } from '@/pages/Dashboard'
import { RoadmapPage } from '@/pages/Roadmap'
import { LessonPage } from '@/pages/Lesson'
import { ProblemsListPage } from '@/pages/ProblemsList'
import { ProblemPage } from '@/pages/Problem'
import { PlaygroundPage } from '@/pages/Playground'
import { VisualizerPage } from '@/pages/Visualizer'
import { AchievementsPage } from '@/pages/Achievements'
import { SettingsPage } from '@/pages/Settings'
import { NotFoundPage } from '@/pages/NotFound'

export default function App() {
  return (
    <ThemeProvider>
      <AchievementWatcher />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/problems" element={<ProblemsListPage />} />
          <Route path="/problem/:id" element={<ProblemPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
