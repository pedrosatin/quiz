import { useCallback } from 'react'
import type { Logo, CategoryProgress } from '../types'
import { lsGet, lsSet } from '../utils/localStorage'
import { getCategorySlug } from '../utils/dataLoader'
import { shuffleArray } from '../utils/shuffleArray'

const QUESTIONS_PER_ROUND = 10

function progressKey(category: string): string {
  return `quiz_progress_${getCategorySlug(category)}`
}

export function useProgress() {
  const getProgress = useCallback((category: string): CategoryProgress => {
    return lsGet<CategoryProgress>(progressKey(category), {
      usedIds: [],
      totalInCategory: 0,
      cycleCount: 0,
      lastPlayed: new Date().toISOString(),
    })
  }, [])

  const saveProgress = useCallback((category: string, progress: CategoryProgress) => {
    lsSet(progressKey(category), progress)
  }, [])

  /**
   * Returns a pool of `count` logos never seen in the current cycle.
   * Handles cycle wrap-around when the pool is smaller than count.
   */
  const getUnseenPool = useCallback(
    (logos: Logo[], count: number): Logo[] => {
      if (logos.length === 0) return []
      const category = logos[0].category
      const progress = getProgress(category)

      const unseen = logos.filter((l) => !progress.usedIds.includes(l.id))

      if (unseen.length >= count) {
        return shuffleArray(unseen).slice(0, count)
      }

      // Not enough unseen — use all unseen then wrap to next cycle
      const fromUnseen = shuffleArray(unseen)
      const needed = count - fromUnseen.length
      const fromNewCycle = shuffleArray(logos).slice(0, needed)
      return [...fromUnseen, ...fromNewCycle]
    },
    [getProgress],
  )

  const markAsUsed = useCallback(
    (logos: Logo[]) => {
      if (logos.length === 0) return
      const category = logos[0].category
      const progress = getProgress(category)

      const newUsedIds = [...new Set([...progress.usedIds, ...logos.map((l) => l.id)])]
      const totalInCategory = logos.length > 0 ? progress.totalInCategory || logos.length : 0

      let cycleCount = progress.cycleCount
      if (newUsedIds.length >= totalInCategory && totalInCategory > 0) {
        // Cycle complete — reset
        saveProgress(category, {
          usedIds: [],
          totalInCategory,
          cycleCount: cycleCount + 1,
          lastPlayed: new Date().toISOString(),
        })
        return
      }

      saveProgress(category, {
        usedIds: newUsedIds,
        totalInCategory,
        cycleCount,
        lastPlayed: new Date().toISOString(),
      })
    },
    [getProgress, saveProgress],
  )

  const initCategoryTotal = useCallback(
    (category: string, total: number) => {
      const progress = getProgress(category)
      if (progress.totalInCategory !== total) {
        saveProgress(category, { ...progress, totalInCategory: total })
      }
    },
    [getProgress, saveProgress],
  )

  const getSeenCount = useCallback(
    (category: string): number => getProgress(category).usedIds.length,
    [getProgress],
  )

  const getCycleCount = useCallback(
    (category: string): number => getProgress(category).cycleCount,
    [getProgress],
  )

  return {
    getUnseenPool,
    markAsUsed,
    initCategoryTotal,
    getSeenCount,
    getCycleCount,
    QUESTIONS_PER_ROUND,
  }
}
