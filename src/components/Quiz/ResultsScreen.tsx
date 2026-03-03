import { Link } from 'react-router-dom'
import type { QuizAnswerRecord } from '../../types'
import { formatTime, calcAccuracy } from '../../utils/formatters'

interface ResultsScreenProps {
  answers: QuizAnswerRecord[]
  category: string
  totalTimeSeconds: number
  brandColors: Record<string, string>
  onPlayAgain: () => void
}

export default function ResultsScreen({
  answers,
  category,
  totalTimeSeconds,
  onPlayAgain,
}: ResultsScreenProps) {
  const correct = answers.filter((a) => a.correct).length
  const total = answers.length
  const accuracy = calcAccuracy(correct, total)

  const scoreEmoji =
    accuracy >= 80 ? '🏆' : accuracy >= 60 ? '🎯' : accuracy >= 40 ? '📈' : '💪'

  return (
    <div className="flex flex-col gap-6 animate-bounce-in">
      {/* Score summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <div className="text-5xl mb-3" aria-hidden="true">{scoreEmoji}</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {correct}/{total}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{accuracy}% de acerto</p>
        <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
          <span>🕐 {formatTime(totalTimeSeconds)}</span>
          <span>📂 {category}</span>
        </div>
      </div>

      {/* Question breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <h3 className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 font-semibold text-sm text-gray-700 dark:text-gray-300">
          Detalhes das respostas
        </h3>
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {answers.map((a, i) => (
            <li
              key={a.logoId}
              className="flex items-center gap-3 px-5 py-3 text-sm"
            >
              <span
                className={`text-lg ${a.correct ? 'text-green-500' : 'text-red-400'}`}
                aria-label={a.correct ? 'Correto' : 'Errado'}
              >
                {a.correct ? '✅' : '❌'}
              </span>
              <span className="w-5 text-gray-400 text-xs shrink-0">{i + 1}.</span>
              <span className="flex-1 text-gray-800 dark:text-gray-200 font-medium">
                {a.logoName}
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-xs tabular-nums">
                {(a.timeMs / 1000).toFixed(1)}s
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onPlayAgain}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label="Jogar novamente com a mesma categoria"
        >
          🔄 Jogar Novamente
        </button>
        <Link
          to="/"
          className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-semibold transition-colors text-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label="Trocar categoria"
        >
          🏠 Trocar Categoria
        </Link>
      </div>
    </div>
  )
}
