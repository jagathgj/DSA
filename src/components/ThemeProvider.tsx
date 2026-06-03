import { useEffect, type ReactNode } from 'react'
import { useSettingsStore } from '@/stores/useSettingsStore'

/**
 * Applies the Carbon theme to <body> based on the user's setting.
 * Carbon uses class scopes: default = light (white), .cds--g100 = dark.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    const apply = () => {
      const resolved =
        theme === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : theme

      const body = document.body
      // Carbon's theme class scopes
      body.classList.remove('cds--white', 'cds--g100')
      body.classList.add(resolved === 'dark' ? 'cds--g100' : 'cds--white')

      // Also set a data attr so app SCSS can react if needed.
      body.dataset.theme = resolved
    }

    apply()

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = () => apply()
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    }
  }, [theme])

  return <>{children}</>
}
