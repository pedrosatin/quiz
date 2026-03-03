import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../store/quizStore'
import { useQuiz } from '../hooks/useQuiz'
import { useAnalytics } from '../hooks/useAnalytics'
import { useProgress } from '../hooks/useProgress'
import ResultsScreen from '../components/Quiz/ResultsScreen'
import type { QuizSession } from '../types'
import { nanoid } from '../utils/nanoid'

export default function ResultsPage() {
  const navigate = useNavigate()
  const { answers, selectedCategory, brandColors } = useQuizStore()
  const { getRoundDurationSeconds, startNewRound, getCategoryLogos, resetRound } = useQuiz()
  const { saveSession } = useAnalytics()
  const { getUnseenPool, initCategoryTotal, QUESTIONS_PER_ROUND } = useProgress()

  // Redirect if no results
  useEffect(() => {
    if (answers.length === 0) {
      navigate('/', { replace: true })
    }
  }, [answers, navigate])

  // Save session to analytics once on mount
  useEffect(() => {
    if (!selectedCategory || answers.length === 0) return

    const session: QuizSession = {
      id: nanoid(),
      category: selectedCategory,
      date: new Date().toISOString(),
      score: answers.filter((a) => a.correct).length,
      totalQuestions: answers.length,
      timeSpentSeconds: getRoundDurationSeconds(),
      questions: answers,
    }
    saveSession(session)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally run once

  const handlePlayAgain = () => {
    if (!selectedCategory) return
    const categoryLogos = getCategoryLogos()
    initCategoryTotal(selectedCategory, categoryLogos.length)
    const pool = getUnseenPool(categoryLogos, QUESTIONS_PER_ROUND)
    resetRound()
    startNewRound(pool)
    navigate('/quiz', { replace: true })
  }

  if (!selectedCategory || answers.length === 0) return null

  return (
    <div className="max-w-lg mx-auto">
      <ResultsScreen
        answers={answers}
        category={selectedCategory}
        totalTimeSeconds={getRoundDurationSeconds()}
        brandColors={brandColors}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  )
}
