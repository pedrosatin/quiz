import type { Logo } from '../../types'
import { useProgress } from '../../hooks/useProgress'

const CATEGORY_ICONS: Record<string, string> = {
  'Tecnologia & Hardware': '💻',
  'Software & Ferramentas Dev': '🛠️',
  'Redes Sociais & Comunicação': '💬',
  'Streaming & Entretenimento': '🎬',
  'Games & Esportes Eletrônicos': '🎮',
  'E-commerce & Varejo': '🛒',
  'Finanças & Cripto': '💰',
  'Automóveis & Motores': '🚗',
  'Mobilidade, Viagem & Transporte': '✈️',
  'Alimentação, Moda & Esportes': '👟',
}

interface CategoryCardProps {
  category: string
  logos: Logo[]
  onPlay: (category: string) => void
}

export default function CategoryCard({ category, logos, onPlay }: CategoryCardProps) {
  const { getSeenCount, getCycleCount } = useProgress()
  const seenCount = getSeenCount(category)
  const cycleCount = getCycleCount(category)
  const total = logos.length
  const progressPct = total > 0 ? Math.round((seenCount / total) * 100) : 0
  const icon = CATEGORY_ICONS[category] ?? '🏷️'

  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label={category}>{icon}</span>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
              {category}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {total} marcas
              {cycleCount > 0 && (
                <span className="ml-2 text-indigo-500">· ciclo {cycleCount + 1}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Progresso</span>
          <span>{seenCount}/{total}</span>
        </div>
        <div
          className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={seenCount}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${seenCount} de ${total} logos vistas`}
        >
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => onPlay(category)}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        aria-label={`Jogar quiz de ${category}`}
      >
        Jogar Agora ▶
      </button>
    </article>
  )
}
