export type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'example'; title?: string; code: string }
  | { type: 'formula'; formula: string; description?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'warning'; text: string }
  | { type: 'compare'; items: { label: string; text: string }[] }

export interface Concept {
  id: string
  title: string
  blocks: ContentBlock[]
  subConcepts?: Concept[]
}

export type ProgressStatus = 'not-started' | 'in-progress' | 'completed'

export interface Aula {
  id: string
  number: number
  emoji: string
  title: string
  shortTitle: string
  objective?: string
  color: string
  concepts: Concept[]
  checklist?: string[]
  special?: 'company-analyzer' | 'portfolio-builder'
}

export interface GlossaryTerm {
  term: string
  definition: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Quiz {
  aulaId: string
  questions: QuizQuestion[]
}

export interface CarteiraItem {
  id: string
  assetClass: string
  name: string
  ticker?: string
  monthlyAmount: number
}

export interface CarteiraState {
  items: CarteiraItem[]
  monthlyContribution: number
  initialAmount: number
  years: number
  objective: string
  risk: string
  updatedAt: string
}

export interface Company {
  id: string
  name: string
  ticker: string
  sector: string
  whatItDoes: string
  howItMakesMoney: string
  revenue: string
  profit: string
  margin: string
  roe: string
  debt: string
  cashFlow: string
  pl: string
  pvp: string
  dividendYield: string
  growth: string
  risks: string[]
  outlook: string
  positives: string[]
  attention: string[]
  dangers: string[]
  qualitySummary: string
  priceSummary: string
}
