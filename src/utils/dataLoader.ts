import type { LogosData } from '../types'

let cachedData: LogosData | null = null

export async function loadLogos(): Promise<LogosData> {
  if (cachedData) return cachedData

  const response = await fetch('/data/logos.json')
  if (!response.ok) {
    throw new Error(`Failed to load logos: ${response.statusText}`)
  }

  const data: LogosData = await response.json() as LogosData
  cachedData = data
  return data
}

let cachedColors: Record<string, string> | null = null

export async function loadBrandColors(): Promise<Record<string, string>> {
  if (cachedColors) return cachedColors

  try {
    const response = await fetch('/data/brandColors.json')
    if (!response.ok) return {}
    cachedColors = await response.json() as Record<string, string>
    return cachedColors
  } catch {
    return {}
  }
}

export function getCategorySlug(category: string): string {
  return category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Reverse lookup: find the original category name from its slug */
export function getCategoryFromSlug(slug: string, categories: string[]): string | null {
  return categories.find((c) => getCategorySlug(c) === slug) ?? null
}
