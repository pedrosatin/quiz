#!/usr/bin/env node
/**
 * Generates public/data/brandColors.json from simple-icons package.
 * Maps each simpleIconsSlug in logos.json to its brand hex color.
 *
 * Run: node scripts/generate-brand-colors.js
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Load logos.json to know which slugs we need
const logosJson = JSON.parse(readFileSync(join(root, 'public/data/logos.json'), 'utf8'))
const slugs = [...new Set(logosJson.logos.map((l) => l.simpleIconsSlug))]

// Dynamic import of simple-icons (ESM)
const si = await import('simple-icons')

const colorMap = {}
let found = 0
let missing = 0

for (const slug of slugs) {
  // simple-icons exports icons as `si${PascalCase}` e.g. siApple, siGithub
  const key = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  const icon = si[key]

  if (icon && icon.hex) {
    colorMap[slug] = icon.hex
    found++
  } else {
    // Fallback: try searching by title/slug
    const allIcons = Object.values(si).filter((v) => v && typeof v === 'object' && 'hex' in v)
    const match = allIcons.find(
      (v) => v.slug === slug || v.title?.toLowerCase().replace(/[^a-z0-9]/g, '') === slug.replace(/-/g, '')
    )
    if (match) {
      colorMap[slug] = match.hex
      found++
    } else {
      colorMap[slug] = '6e6e6e' // neutral gray fallback
      missing++
      console.warn(`[MISSING] ${slug} → using fallback color #6e6e6e`)
    }
  }
}

const outPath = join(root, 'public/data/brandColors.json')
writeFileSync(outPath, JSON.stringify(colorMap, null, 2), 'utf8')

console.log(`\n✅ Generated ${outPath}`)
console.log(`   Found: ${found} | Missing (fallback): ${missing} | Total: ${slugs.length}`)
