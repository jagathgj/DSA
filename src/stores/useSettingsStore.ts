import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface SettingsState {
  theme: Theme
  reduceMotion: boolean
  fontSize: 'sm' | 'md' | 'lg'
  setTheme: (t: Theme) => void
  setReduceMotion: (v: boolean) => void
  setFontSize: (s: 'sm' | 'md' | 'lg') => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      reduceMotion: false,
      fontSize: 'md',
      setTheme: (theme) => set({ theme }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: 'dsa-quest::settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

/** Apply theme to <html> element. Call from a top-level effect. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement
  const dark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  root.classList.toggle('dark', dark)
}
