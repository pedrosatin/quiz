# Arquitetura — Quiz Logo

> **Documento vivo.** Atualizar sempre que houver mudança significativa de estrutura, rotas, componentes ou comportamento.

---

## Visão geral

Aplicação SPA estática (React + Vite). Sem backend. Dados em `/public/`, estado em Zustand (sessão) e localStorage (persistência).

```
Usuário → HomePage → escolhe categoria
        → QuizPage?category={slug} → 10 perguntas com timer
        → ResultsPage → score + replay
        → DashboardPage → analytics acumulados
```

---

## Rotas

| Path | Componente | Comportamento |
|---|---|---|
| `/` | `HomePage` | Grid de categorias com progresso por ciclo |
| `/quiz?category={slug}` | `QuizPage` | Rodada ativa; redireciona para `/` se slug inválido ou ausente |
| `/results` | `ResultsPage` | Resultado da última rodada; redireciona para `/` se `answers` vazio |
| `/dashboard` | `DashboardPage` | Analytics de todas as sessões |
| `*` | `HomePage` | Fallback |

**Parâmetro `category`:** slug gerado por `getCategorySlug()` em `src/utils/dataLoader.ts`. Reverse lookup via `getCategoryFromSlug()`.

---

## Componentes

### Layout
- `Header` — navegação global + toggle de tema
- `Layout` — wrapper com `max-w-4xl` e padding padrão

### Home
- `CategoryGrid` — recebe lista de categorias e `logosByCategory`, delega para `CategoryCard`
- `CategoryCard` — exibe progresso do ciclo, botão "Jogar Agora"

### Quiz
- `QuestionCard` — orquestra a pergunta: logo SVG, timer, 4 opções, feedback visual, atalhos de teclado (1–4)
- `AnswerButton` — botão de resposta com estados: `idle | correct | wrong | neutral | timeout`
- `TimerBar` — countdown visual de 15s; recebe `key` para forçar reset ao trocar pergunta
- `ResultsScreen` — score, breakdow por pergunta, botões de replay/troca

### Dashboard
- `Dashboard` — agrega analytics; contém seção de configurações (reset de progresso)
- `StatsCard` — card genérico: ícone + valor + label
- `ProgressChart` — barras HTML/CSS de acurácia por categoria

### Shared
- `ErrorBoundary` — envolve `QuizPage` e raiz; exibe fallback com botão de reload

---

## Hooks & Store

### `quizStore.ts` (Zustand)
Estado de sessão (não persiste entre reloads):

| Slice | Tipo | Descrição |
|---|---|---|
| `allLogos` | `Logo[]` | Dataset completo carregado do JSON |
| `brandColors` | `Record<string, string>` | Mapa slug → hex carregado do JSON |
| `isDataLoaded` | `boolean` | True após fetch inicial |
| `dataError` | `string \| null` | Mensagem de erro do fetch |
| `selectedCategory` | `string \| null` | Categoria da rodada atual |
| `settings` | `Settings` | Tema e dificuldade (espelhados do localStorage) |
| `questions` | `QuizQuestion[]` | Perguntas da rodada ativa |
| `currentIndex` | `number` | Índice da pergunta atual |
| `answers` | `QuizAnswerRecord[]` | Respostas registradas na rodada |
| `roundStartTime` | `number \| null` | Timestamp ms do início da rodada |
| `questionStartTime` | `number \| null` | Timestamp ms do início da pergunta atual |

### `useQuiz`
Fachada sobre o store para a lógica da rodada. Expõe: `currentQuestion`, `isRoundOver`, `startNewRound`, `getBrandColor`, `recordAnswer`, `advanceQuestion`, etc.

### `useProgress`
Gerencia os ciclos de não-repetição por categoria. Lê/escreve `quiz_progress_{slug}` no localStorage. Expõe: `getUnseenPool`, `markAsUsed`, `initCategoryTotal`.

### `useAnalytics`
Lê/escreve `quiz_analytics` no localStorage. Expõe: `saveSession`, `getCategoryStats`, `getTopWrongLogos`, `getAvgResponseTimeMs`, `getOverallAccuracy`.

### `useTheme`
Aplica classe `dark` no `<html>` e persiste em `quiz_settings`. Expõe: `theme`, `toggleTheme`, `setDifficulty`.

---

## Dados

- **`/public/data/logos.json`** — 464 marcas, 10 categorias, campos: `id, name, category, imageUrl, simpleIconsSlug, difficulty, yearFounded, country`
- **`/public/data/brandColors.json`** — gerado por `scripts/generate-brand-colors.js`; mapa `{slug: hexColor}`
- **`/public/logos/*.svg`** — Simple Icons monocromáticos; renderizados com `filter: brightness(0) invert(1)` sobre fundo colorido com a cor da marca

### Categorias atuais
1. Alimentação, Moda & Esportes
2. Automóveis & Motores
3. E-commerce & Varejo
4. Finanças & Cripto
5. Games & Esportes Eletrônicos
6. Mobilidade, Viagem & Transporte
7. Redes Sociais & Comunicação
8. Software & Ferramentas Dev
9. Streaming & Entretenimento
10. Tecnologia & Hardware

---

## Fluxo de uma rodada

```
1. Usuário clica "Jogar Agora" → navega para /quiz?category={slug}
2. QuizPage resolve slug → seta selectedCategory no store
3. useProgress.getUnseenPool() → pool de logos não vistas no ciclo atual
4. useQuiz.startNewRound(pool) → gera QuizQuestion[] com distrações da mesma categoria
5. QuestionCard exibe logo + 4 opções + TimerBar (15s)
6. Usuário responde (ou timer expira) → recordAnswer() + markAsUsed() + advanceQuestion()
7. Após 10 perguntas → isRoundOver = true → navega para /results
8. ResultsPage salva QuizSession via useAnalytics.saveSession()
9. Usuário pode jogar novamente (novo pool, mesma categoria) ou trocar categoria
```

---

## Padrões de UI

- **Skeleton loading:** `animate-pulse` com divs de placeholder (ver `HomePage`)
- **Feedback de resposta:** travar opções imediatamente, delay de 900ms antes de avançar
- **Cores de marca:** fundo `#${hexColor}` + logo `brightness(0) invert(1)` (branca)
- **Tema escuro:** via classe `dark` no `<html>`, controlado por `useTheme`
