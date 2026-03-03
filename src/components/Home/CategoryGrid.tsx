import type { Logo } from '../../types'
import CategoryCard from './CategoryCard'

interface CategoryGridProps {
  categories: string[]
  logosByCategory: Record<string, Logo[]>
  onPlay: (category: string) => void
}

export default function CategoryGrid({ categories, logosByCategory, onPlay }: CategoryGridProps) {
  return (
    <section aria-label="Categorias disponíveis">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category}
            category={category}
            logos={logosByCategory[category] ?? []}
            onPlay={onPlay}
          />
        ))}
      </div>
    </section>
  )
}
