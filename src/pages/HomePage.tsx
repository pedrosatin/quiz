import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../store/quizStore'
import { getCategorySlug } from '../utils/dataLoader'
import CategoryGrid from '../components/Home/CategoryGrid'

// Skeleton loading card
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-1/2" />
        </div>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-4" />
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { allLogos, isDataLoaded, dataError } = useQuizStore()

  const categories = useMemo(() => {
    const cats = [...new Set(allLogos.map((l) => l.category))]
    return cats.sort()
  }, [allLogos])

  const logosByCategory = useMemo(() => {
    const map: Record<string, typeof allLogos> = {}
    for (const logo of allLogos) {
      if (!map[logo.category]) map[logo.category] = []
      map[logo.category]!.push(logo)
    }
    return map
  }, [allLogos])

  const handlePlay = (category: string) => {
    navigate(`/quiz?category=${getCategorySlug(category)}`)
  }

  if (dataError) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 font-semibold text-lg">Erro ao carregar dados</p>
        <p className="text-gray-500 mt-2 text-sm">{dataError}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          🏷️ Escolha uma categoria
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          {isDataLoaded ? `${allLogos.length} marcas disponíveis` : 'Carregando…'}
        </p>
      </div>

      {!isDataLoaded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <CategoryGrid
          categories={categories}
          logosByCategory={logosByCategory}
          onPlay={handlePlay}
        />
      )}
    </div>
  )
}
