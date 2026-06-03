import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Button } from '@carbon/react'
import {
  Home,
  Roadmap as RoadmapIcon,
  CodeReference,
  ChartLine,
  Trophy,
  Settings as SettingsIcon,
  StarFilled,
  Fire,
  Sun,
  Moon,
  Menu,
  Close,
} from '@carbon/icons-react'
import { useProgressStore } from '@/stores/useProgressStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { getLevelInfo } from '@/lib/utils'

const NAV = [
  { to: '/', label: 'Dashboard', icon: Home, end: true },
  { to: '/roadmap', label: 'Roadmap', icon: RoadmapIcon },
  { to: '/problems', label: 'Problems', icon: CodeReference },
  { to: '/playground', label: 'Playground', icon: CodeReference },
  { to: '/visualizer', label: 'Visualizer', icon: ChartLine },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export function Layout() {
  const xp = useProgressStore((s) => s.xp)
  const streak = useProgressStore((s) => s.streak)
  const { theme, setTheme } = useSettingsStore()
  const level = getLevelInfo(xp)
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Resolve "active" theme for the toggle icon
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <div className="app-shell">
      {/* Desktop sidebar */}
      <aside className="app-sidenav">
        <SidenavContent location={location} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="app-mobile-drawer-backdrop"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="app-mobile-drawer">
            <SidenavContent location={location} />
          </aside>
        </>
      )}

      <main className="app-main">
        <div className="app-topbar">
          <div className="dsa-row dsa-row--gap-3">
            <Button
              onClick={() => setMobileOpen((v) => !v)}
              className="dsa-icon-button app-topbar__mobile-toggle"
              aria-label="Toggle menu"
              kind="ghost"
              hasIconOnly
              iconDescription="Toggle menu"
              renderIcon={mobileOpen ? Close : Menu}
            />
            <span className="app-topbar__title">
              {(() => {
                // Special case: /lesson/:id should show "Roadmap"
                if (location.pathname.startsWith('/lesson/')) {
                  return 'Roadmap'
                }
                // Special case: /problem/:id should show "Problems"
                if (location.pathname.startsWith('/problem/')) {
                  return 'Problems'
                }
                return NAV.find((n) =>
                  n.end
                    ? location.pathname === n.to
                    : location.pathname.startsWith(n.to),
                )?.label ?? 'DSA Quest'
              })()}
            </span>
          </div>
          <div className="app-topbar__meta">
            <Button
              className="dsa-icon-button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              kind="ghost"
              hasIconOnly
              iconDescription={isDark ? 'Switch to light' : 'Switch to dark'}
              renderIcon={isDark ? Sun : Moon}
            />
            <span className="app-topbar__chip">
              <StarFilled size={14} />
              <span>{level.current.name}</span>
            </span>
            <span className="app-topbar__chip">
              <Fire size={14} />
              <span>{streak.current}d</span>
            </span>
          </div>
        </div>
        <div className="app-content"><Outlet /></div>
      </main>
    </div>
  )
}

function SidenavContent({ location }: { location: ReturnType<typeof useLocation> }) {
  // Special case: /lesson/:id should highlight Roadmap
  const isLessonRoute = location.pathname.startsWith('/lesson/')
  
  return (
    <>
      <Link to="/" className="app-sidenav__brand">
        <div className="app-sidenav__brand-mark">
          <CodeReference size={18} />
        </div>
        <div>
          <div className="app-sidenav__brand-name">DSA Quest</div>
          <div className="app-sidenav__brand-tag">THRIVE • MASTER • EXCEL</div>
        </div>
      </Link>
      <div className="app-sidenav__section-label">Learn</div>
      <nav className="app-sidenav__nav">
        {NAV.map((n) => {
          const shouldHighlight = n.to === '/roadmap' && isLessonRoute
          
          return (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                'app-sidenav__link' +
                ((isActive || shouldHighlight) ? ' app-sidenav__link--active' : '')
              }
            >
              <n.icon size={16} />
              {n.label}
            </NavLink>
          )
        })}
      </nav>
      <div className="app-sidenav__footer">
        <div>DSA Quest</div>
        <div>v1.0</div>
      </div>
    </>
  )
}
