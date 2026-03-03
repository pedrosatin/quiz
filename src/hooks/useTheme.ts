import { useEffect, useCallback } from 'react'
import { useQuizStore } from '../store/quizStore'
import { lsGet, lsSet } from '../utils/localStorage'
import type { Settings } from '../types'

const SETTINGS_KEY = 'quiz_settings'

export function useTheme() {
  const { settings, setSettings } = useQuizStore()

  // Load from localStorage on mount
  useEffect(() => {
    const saved = lsGet<Settings>(SETTINGS_KEY, { theme: 'light', difficulty: 'all' })
    setSettings(saved)
    applyTheme(saved.theme)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const applyTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = useCallback(() => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light'
    setSettings({ theme: newTheme })
    applyTheme(newTheme)
    const current = lsGet<Settings>(SETTINGS_KEY, { theme: 'light', difficulty: 'all' })
    lsSet<Settings>(SETTINGS_KEY, { ...current, theme: newTheme })
  }, [settings.theme, setSettings])

  const setDifficulty = useCallback(
    (difficulty: Settings['difficulty']) => {
      setSettings({ difficulty })
      const current = lsGet<Settings>(SETTINGS_KEY, { theme: 'light', difficulty: 'all' })
      lsSet<Settings>(SETTINGS_KEY, { ...current, difficulty })
    },
    [setSettings],
  )

  return { theme: settings.theme, difficulty: settings.difficulty, toggleTheme, setDifficulty }
}
