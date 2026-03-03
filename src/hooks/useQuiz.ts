import { useCallback } from 'react'
import { useQuizStore } from '../store/quizStore'
import type { Logo, QuizQuestion } from '../types'
import { pickRandom, shuffleArray } from '../utils/shuffleArray'

const QUESTIONS_PER_ROUND = 10

const DIFFICULTY_MAP: Record<string, Logo['difficulty']> = {
  easy: 'fácil',
  medium: 'médio',
  hard: 'difícil',
}

export function useQuiz() {
  const {
    questions,
    currentIndex,
    answers,
    roundStartTime,
    questionStartTime,
    allLogos,
    selectedCategory,
    settings,
    brandColors,
    startRound,
    recordAnswer,
    advanceQuestion,
    resetRound,
  } = useQuizStore()

  const currentQuestion = questions[currentIndex] ?? null
  const isRoundOver = questions.length > 0 && currentIndex >= questions.length
  const totalQuestions = questions.length

  const buildQuestions = useCallback(
    (logoPool: Logo[]): QuizQuestion[] => {
      return logoPool.map((logo) => {
        const distractors = allLogos
          .filter((l) => l.category === logo.category && l.id !== logo.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((l) => l.name)

        const options = shuffleArray([logo.name, ...distractors])
        return { logo, options, correctAnswer: logo.name }
      })
    },
    [allLogos],
  )

  const startNewRound = useCallback(
    (logoPool: Logo[]) => {
      const filtered =
        settings.difficulty === 'all'
          ? logoPool
          : logoPool.filter((l) => l.difficulty === DIFFICULTY_MAP[settings.difficulty])

      const picked = pickRandom(filtered.length >= 1 ? filtered : logoPool, QUESTIONS_PER_ROUND)
      const qs = buildQuestions(picked)
      startRound(qs)
    },
    [settings.difficulty, buildQuestions, startRound],
  )

  const getCategoryLogos = useCallback(() => {
    if (!selectedCategory) return []
    return allLogos.filter((l) => l.category === selectedCategory)
  }, [allLogos, selectedCategory])

  const getBrandColor = useCallback(
    (slug: string): string => brandColors[slug] ?? '6e6e6e',
    [brandColors],
  )

  const getRoundDurationSeconds = useCallback((): number => {
    if (!roundStartTime) return 0
    return Math.round((Date.now() - roundStartTime) / 1000)
  }, [roundStartTime])

  const getQuestionElapsedMs = useCallback((): number => {
    if (!questionStartTime) return 0
    return Date.now() - questionStartTime
  }, [questionStartTime])

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    answers,
    isRoundOver,
    startNewRound,
    getCategoryLogos,
    getBrandColor,
    getRoundDurationSeconds,
    getQuestionElapsedMs,
    recordAnswer,
    advanceQuestion,
    resetRound,
  }
}
