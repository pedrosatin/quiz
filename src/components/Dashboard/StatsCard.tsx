interface StatsCardProps {
  label: string
  value: string | number
  icon: string
  sublabel?: string
}

export default function StatsCard({ label, value, icon, sublabel }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex items-start gap-4">
      <div className="text-3xl" aria-hidden="true">{icon}</div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums truncate">
          {value}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {sublabel && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sublabel}</p>
        )}
      </div>
    </div>
  )
}
