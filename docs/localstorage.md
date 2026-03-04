# Schema do localStorage — Quiz Logo

> **Documento vivo.** Atualizar sempre que adicionar, remover ou modificar uma chave. Incluir a versão dos dados se houver risco de incompatibilidade com dados já gravados pelo usuário.

---

## Chaves registradas

| Chave | Interface TypeScript | Descrição |
|---|---|---|
| `quiz_analytics` | `Analytics` | Histórico completo de sessões e estatísticas |
| `quiz_progress_{categorySlug}` | `CategoryProgress` | Controle de ciclo por categoria |
| `quiz_settings` | `Settings` | Preferências do usuário (tema, dificuldade) |

---

## `quiz_analytics`

```typescript
interface Analytics {
  sessions: QuizSession[]       // todas as sessões jogadas
  totalCorrect: number          // acumulado de respostas corretas
  totalAnswered: number         // acumulado de respostas totais
  logoStats: Record<string, {   // chave: logoId
    correct: number
    wrong: number
  }>
}

interface QuizSession {
  id: string                    // nanoid gerado no momento do save
  category: string              // nome completo da categoria (não slug)
  date: string                  // ISO 8601
  score: number                 // nº de acertos na rodada
  totalQuestions: number        // sempre 10 na v1
  timeSpentSeconds: number      // duração total da rodada
  questions: QuizAnswerRecord[]
}

interface QuizAnswerRecord {
  logoId: string                // ex: "apple-1"
  logoName: string              // ex: "Apple"
  correct: boolean
  timeMs: number                // tempo que o usuário levou para responder (ms)
}
```

**Escrito por:** `useAnalytics.saveSession()`
**Lido por:** `useAnalytics.getAnalytics()`, `getCategoryStats()`, `getTopWrongLogos()`, `getAvgResponseTimeMs()`

---

## `quiz_progress_{categorySlug}`

O `{categorySlug}` é gerado por `getCategorySlug(category)` em `src/utils/dataLoader.ts`.

Exemplos de chaves reais:
- `quiz_progress_tecnologia-hardware`
- `quiz_progress_redes-sociais-comunicacao`
- `quiz_progress_games-esportes-eletronicos`

```typescript
interface CategoryProgress {
  usedIds: string[]       // IDs das logos já vistas no ciclo atual
  totalInCategory: number // total de logos nessa categoria (snapshot)
  cycleCount: number      // quantos ciclos completos foram feitos (começa em 0)
  lastPlayed: string      // ISO 8601 da última jogada
}
```

**Lógica de ciclo:**
- Quando `usedIds.length >= totalInCategory`: ciclo completo → `usedIds` reseta para `[]`, `cycleCount++`
- Se o pool disponível for menor que 10 perguntas: completa com logos do próximo ciclo

**Escrito por:** `useProgress.markAsUsed()`, `useProgress.initCategoryTotal()`, `useProgress.saveProgress()`
**Lido por:** `useProgress.getUnseenPool()`, `useProgress.getSeenCount()`, `useProgress.getCycleCount()`

---

## `quiz_settings`

```typescript
interface Settings {
  theme: 'light' | 'dark'
  difficulty: 'all' | 'easy' | 'medium' | 'hard'
}
```

**Valores padrão:** `{ theme: 'light', difficulty: 'all' }`

**Escrito por:** `useTheme.toggleTheme()`, `useTheme.setDifficulty()`
**Lido por:** `useTheme` (no mount via `useEffect`)

---

## Limpeza de dados

A função `lsClear()` em `src/utils/localStorage.ts` remove **todas as chaves com prefixo `quiz_`**. Acionada pelo botão "Resetar todo progresso" no Dashboard.

---

## Notas de compatibilidade

- **v1 (atual):** sem versionamento de schema. Se o schema mudar em uma v2, implementar migração em `src/utils/localStorage.ts` verificando a ausência/presença de campos antes de ler.
