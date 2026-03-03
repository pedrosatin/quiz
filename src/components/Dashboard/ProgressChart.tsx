import type { CategoryStat } from '../../types'

interface ProgressChartProps {
  data: CategoryStat[]
}

export default function ProgressChart({ data }: ProgressChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
        Nenhum dado ainda. Jogue um quiz!
      </p>
    )
  }

  const sorted = [...data].sort((a, b) => b.accuracy - a.accuracy)

  return (
    <div className="flex flex-col gap-3" role="list" aria-label="Acurácia por categoria">
      {sorted.map((item) => (
        <div key={item.category} role="listitem" className="flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300 truncate pr-2 max-w-[60%]">
              {item.category}
            </span>
            <span className="text-gray-500 dark:text-gray-400 tabular-nums shrink-0">
              {item.accuracy}% ({item.correct}/{item.answered})
            </span>
          </div>
          <div
            className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={item.accuracy}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${item.category}: ${item.accuracy}%`}
          >
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${item.accuracy}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
