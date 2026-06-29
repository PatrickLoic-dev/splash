'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'dark',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('splash-theme') as Theme | null
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initial = saved ?? system
    document.documentElement.classList.toggle('dark', initial === 'dark')
    setTheme(initial)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'

    const commit = () => {
      document.documentElement.classList.toggle('dark', next === 'dark')
      localStorage.setItem('splash-theme', next)
    }

    // Single GPU crossfade — no per-element transitions
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      document.startViewTransition(commit)
    } else {
      commit()
    }

    setTheme(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
