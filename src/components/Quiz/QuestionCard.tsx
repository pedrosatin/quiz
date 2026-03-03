import { useState, useEffect, useCallback } from 'react'
import type { QuizQuestion, AnswerState } from '../../types'
import AnswerButton from './AnswerButton'
import TimerBar from './TimerBar'

interface QuestionCardProps {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  brandColor: string
  onAnswer: (answer: string, timeMs: number) => void
}

const TIMER_DURATION = 15

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  brandColor,
  onAnswer,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [answerStates, setAnswerStates] = useState<Record<string, AnswerState | 'neutral'>>({})
  const [timerRunning, setTimerRunning] = useState(true)
  const [startTime] = useState(() => Date.now())
  const [timerKey, setTimerKey] = useState(0)

  // Reset state when question changes
  useEffect(() => {
    setSelected(null)
    setAnswerStates({})
    setTimerRunning(true)
    setTimerKey((k) => k + 1)
  }, [question.logo.id])

  // Keyboard shortcuts 1-4
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selected) return
      const idx = parseInt(e.key) - 1
      if (idx >= 0 && idx < question.options.length) {
        handleSelect(question.options[idx]!)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, question.options])

  const handleSelect = useCallback(
    (option: string) => {
      if (selected) return
      const elapsed = Date.now() - startTime
      setSelected(option)
      setTimerRunning(false)

      const isCorrect = option === question.correctAnswer
      const states: Record<string, AnswerState | 'neutral'> = {}
      for (const opt of question.options) {
        if (opt === question.correctAnswer) states[opt] = 'correct'
        else if (opt === option && !isCorrect) states[opt] = 'wrong'
        else states[opt] = 'neutral'
      }
      setAnswerStates(states)

      setTimeout(() => onAnswer(option, elapsed), 900)
    },
    [selected, question, startTime, onAnswer],
  )

  const handleTimeout = useCallback(() => {
    if (selected) return
    setSelected('__timeout__')
    setTimerRunning(false)

    const states: Record<string, AnswerState | 'neutral'> = {}
    for (const opt of question.options) {
      states[opt] = opt === question.correctAnswer ? 'correct' : 'neutral'
    }
    setAnswerStates(states)

    setTimeout(() => onAnswer('', TIMER_DURATION * 1000), 900)
  }, [selected, question, onAnswer])

  const bgColor = `#${brandColor}`

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      {/* Progress indicator */}
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Pergunta {questionNumber} de {totalQuestions}</span>
        <span>{question.logo.category}</span>
      </div>

      {/* Logo display */}
      <div className="flex justify-center">
        <div
          className="w-40 h-40 sm:w-52 sm:h-52 rounded-3xl shadow-xl flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
          aria-label="Logo da marca"
        >
          <img
            src={question.logo.imageUrl}
            alt="?"
            className="w-24 h-24 sm:w-36 sm:h-36 object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
            draggable={false}
          />
        </div>
      </div>

      {/* Timer */}
      <TimerBar
        key={timerKey}
        duration={TIMER_DURATION}
        isRunning={timerRunning}
        onExpire={handleTimeout}
      />

      {/* Answer options */}
      <fieldset>
        <legend className="sr-only">Escolha a marca correta</legend>
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((opt, i) => (
            <AnswerButton
              key={opt}
              label={opt}
              index={i}
              state={answerStates[opt] ?? 'idle'}
              disabled={!!selected}
              onClick={() => handleSelect(opt)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  )
}
