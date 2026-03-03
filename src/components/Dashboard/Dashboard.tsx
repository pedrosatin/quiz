import { useAnalytics } from '../../hooks/useAnalytics'
import { useQuizStore } from '../../store/quizStore'
import { formatTime, formatPercent } from '../../utils/formatters'
import { lsClear } from '../../utils/localStorage'
import StatsCard from './StatsCard'
import ProgressChart from './ProgressChart'
import { useState } from 'react'

export default function Dashboard() {
  const { getAnalytics, getCategoryStats, getTopWrongLogos, getAvgResponseTimeMs } = useAnalytics()
  const allLogos = useQuizStore((s) => s.allLogos)
  const analytics = getAnalytics()
  const categoryStats = getCategoryStats()
  const topWrong = getTopWrongLogos(5)
  const avgTimeMs = getAvgResponseTimeMs()
  const [resetConfirm, setResetConfirm] = useState(false)

  const logoNameMap = Object.fromEntries(allLogos.map((l) => [l.id, l.name]))

  const handleReset = () => {
    if (!resetConfirm) {
      setResetConfirm(true)
      return
    }
    lsClear()
    window.location.reload()
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">📊 Dashboard</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          icon="🎮"
          label="Quizzes completados"
          value={analytics.sessions.length}
        />
        <StatsCard
          icon="🎯"
          label="Acurácia geral"
          value={formatPercent(analytics.totalCorrect, analytics.totalAnswered)}
        />
        <StatsCard
          icon="✅"
          label="Respostas corretas"
          value={`${analytics.totalCorrect}/${analytics.totalAnswered}`}
        />
        <StatsCard
          icon="⏱"
          label="Tempo médio / pergunta"
          value={avgTimeMs > 0 ? `${(avgTimeMs / 1000).toFixed(1)}s` : '—'}
        />
      </div>

      {/* Accuracy by category */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Acurácia por Categoria
        </h2>
        <ProgressChart data={categoryStats} />
      </section>

      {/* Top wrong logos */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
          🔴 Top 5 Logos Mais Erradas
        </h2>
        {topWrong.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">Nenhum dado ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {topWrong.map((item, i) => (
              <li
                key={item.logoId}
                className="flex items-center gap-3 text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <span className="w-6 text-center font-bold text-gray-400">#{i + 1}</span>
                <span className="flex-1 text-gray-800 dark:text-gray-200">
                  {logoNameMap[item.logoId] ?? item.logoId}
                </span>
                <span className="text-red-500 text-xs tabular-nums">{item.wrong} ✗</span>
                <span className="text-green-500 text-xs tabular-nums">{item.correct} ✓</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent sessions */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
          🕐 Últimas Sessões
        </h2>
        {analytics.sessions.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">Nenhuma sessão ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {[...analytics.sessions].reverse().slice(0, 10).map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 gap-2"
              >
                <span className="text-gray-500 dark:text-gray-400 text-xs tabular-nums shrink-0">
                  {new Date(session.date).toLocaleDateString('pt-BR')}
                </span>
                <span className="flex-1 text-gray-700 dark:text-gray-300 truncate">
                  {session.category}
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 shrink-0">
                  {session.score}/{session.totalQuestions}
                </span>
                <span className="text-gray-400 text-xs shrink-0">
                  {formatTime(session.timeSpentSeconds)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Settings / Reset */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">⚙️ Configurações</h2>
        <button
          onClick={handleReset}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            resetConfirm
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
          }`}
          aria-label="Resetar todo o progresso e dados"
        >
          {resetConfirm ? '⚠️ Confirmar reset' : '🗑️ Resetar todo progresso'}
        </button>
        {resetConfirm && (
          <button
            onClick={() => setResetConfirm(false)}
            className="ml-2 px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
        )}
      </section>
    </div>
  )
}
