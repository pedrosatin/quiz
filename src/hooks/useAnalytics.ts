import { useCallback } from 'react'
import type { Analytics, QuizSession, CategoryStat } from '../types'
import { lsGet, lsSet } from '../utils/localStorage'
import { calcAccuracy } from '../utils/formatters'

const ANALYTICS_KEY = 'quiz_analytics'

const defaultAnalytics: Analytics = {
  sessions: [],
  totalCorrect: 0,
  totalAnswered: 0,
  logoStats: {},
}

export function useAnalytics() {
  const getAnalytics = useCallback((): Analytics => {
    return lsGet<Analytics>(ANALYTICS_KEY, defaultAnalytics)
  }, [])

  const saveSession = useCallback((session: QuizSession) => {
    const analytics = lsGet<Analytics>(ANALYTICS_KEY, defaultAnalytics)

    const updatedLogoStats = { ...analytics.logoStats }
    for (const q of session.questions) {
      const prev = updatedLogoStats[q.logoId] ?? { correct: 0, wrong: 0 }
      updatedLogoStats[q.logoId] = q.correct
        ? { ...prev, correct: prev.correct + 1 }
        : { ...prev, wrong: prev.wrong + 1 }
    }

    const updated: Analytics = {
      sessions: [...analytics.sessions, session],
      totalCorrect: analytics.totalCorrect + session.score,
      totalAnswered: analytics.totalAnswered + session.totalQuestions,
      logoStats: updatedLogoStats,
    }

    lsSet(ANALYTICS_KEY, updated)
  }, [])

  const getCategoryStats = useCallback((): CategoryStat[] => {
    const analytics = lsGet<Analytics>(ANALYTICS_KEY, defaultAnalytics)
    const map: Record<string, { correct: number; answered: number }> = {}

    for (const session of analytics.sessions) {
      const s = map[session.category] ?? { correct: 0, answered: 0 }
      map[session.category] = {
        correct: s.correct + session.score,
        answered: s.answered + session.totalQuestions,
      }
    }

    return Object.entries(map).map(([category, stats]) => ({
      category,
      correct: stats.correct,
      answered: stats.answered,
      accuracy: calcAccuracy(stats.correct, stats.answered),
    }))
  }, [])

  const getTopWrongLogos = useCallback(
    (limit = 5): Array<{ logoId: string; wrong: number; correct: number }> => {
      const analytics = lsGet<Analytics>(ANALYTICS_KEY, defaultAnalytics)
      return Object.entries(analytics.logoStats)
        .map(([logoId, stats]) => ({ logoId, ...stats }))
        .sort((a, b) => b.wrong - a.wrong)
        .slice(0, limit)
    },
    [],
  )

  const getAvgResponseTimeMs = useCallback((): number => {
    const analytics = lsGet<Analytics>(ANALYTICS_KEY, defaultAnalytics)
    const allTimes = analytics.sessions.flatMap((s) => s.questions.map((q) => q.timeMs))
    if (allTimes.length === 0) return 0
    return Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length)
  }, [])

  const getOverallAccuracy = useCallback((): number => {
    const analytics = lsGet<Analytics>(ANALYTICS_KEY, defaultAnalytics)
    return calcAccuracy(analytics.totalCorrect, analytics.totalAnswered)
  }, [])

  return {
    getAnalytics,
    saveSession,
    getCategoryStats,
    getTopWrongLogos,
    getAvgResponseTimeMs,
    getOverallAccuracy,
  }
}
