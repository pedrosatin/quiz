import { useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuizStore } from '../store/quizStore'
import { useQuiz } from '../hooks/useQuiz'
import { useProgress } from '../hooks/useProgress'
import { getCategoryFromSlug } from '../utils/dataLoader'
import QuestionCard from '../components/Quiz/QuestionCard'
import type { QuizAnswerRecord } from '../types'

export default function QuizPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { selectedCategory, isDataLoaded, allLogos, setSelectedCategory } = useQuizStore()
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    isRoundOver,
    startNewRound,
    getCategoryLogos,
    getBrandColor,
    recordAnswer,
    advanceQuestion,
  } = useQuiz()
  const { getUnseenPool, markAsUsed, initCategoryTotal, QUESTIONS_PER_ROUND } = useProgress()

  // Resolve category from URL param → store
  useEffect(() => {
    if (!isDataLoaded) return
    const slug = searchParams.get('category')
    if (!slug) {
      navigate('/', { replace: true })
      return
    }
    const categories = [...new Set(allLogos.map((l) => l.category))]
    const resolved = getCategoryFromSlug(slug, categories)
    if (!resolved) {
      navigate('/', { replace: true })
      return
    }
    if (resolved !== selectedCategory) {
      setSelectedCategory(resolved)
    }
  }, [isDataLoaded, searchParams, allLogos, selectedCategory, setSelectedCategory, navigate])

  // Initialize round
  useEffect(() => {
    if (!isDataLoaded || !selectedCategory) return

    const categoryLogos = getCategoryLogos()
    initCategoryTotal(selectedCategory, categoryLogos.length)
    const pool = getUnseenPool(categoryLogos, QUESTIONS_PER_ROUND)
    startNewRound(pool)
  // Run only once when data/category is ready
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataLoaded, selectedCategory])

  // Navigate to results when round is over
  useEffect(() => {
    if (isRoundOver) {
      navigate('/results', { replace: true })
    }
  }, [isRoundOver, navigate])

  const handleAnswer = useCallback(
    (answer: string, timeMs: number) => {
      if (!currentQuestion) return

      const correct = answer === currentQuestion.correctAnswer
      const record: QuizAnswerRecord = {
        logoId: currentQuestion.logo.id,
        logoName: currentQuestion.logo.name,
        correct,
        timeMs,
      }
      recordAnswer(record)

      // Mark logo as used after answering
      markAsUsed([currentQuestion.logo])

      advanceQuestion()
    },
    [currentQuestion, recordAnswer, advanceQuestion, markAsUsed],
  )

  if (!isDataLoaded || !selectedCategory) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        Preparando quiz…
      </div>
    )
  }

  const brandColor = getBrandColor(currentQuestion.logo.simpleIconsSlug)

  return (
    <div className="max-w-lg mx-auto">
      <QuestionCard
        key={currentQuestion.logo.id}
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={totalQuestions}
        brandColor={brandColor}
        onAnswer={handleAnswer}
      />
    </div>
  )
}
