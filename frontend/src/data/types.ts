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
  quantity?: number
  /** Real expected payout for this item (next payment × qty for stocks,
   * or estimated monthly distribution × qty for FIIs) — only set when
   * real market data was available, never estimated/invented. */
  expectedIncome?: number
  expectedIncomeNote?: string
  /** Set only for "Renda fixa" items — these are user-described OTC products
   * (CDB/LCI/LCA/Tesouro), not exchange-traded assets with a public unit
   * price, so they're captured as a described application, not a quantity. */
  rendaFixaTipo?: string
  rendaFixaTaxa?: string
  rendaFixaVencimento?: string
  rendaFixaAvisos?: string[]
  /** Annual rate (%) used to compound this item's own recurring monthly
   * purchase in the growth projection — the item's real dividend/FII yield
   * when we have one, otherwise the hypothetical risk-based rate. */
  estimatedAnnualRate?: number
}

export interface CarteiraState {
  id: number
  name: string
  items: CarteiraItem[]
  monthlyContribution: number
  initialAmount: number
  years: number
  objective: string
  risk: string
  estimatedAnnualRate?: number
  estimatedAnnualRateCoverage?: number
  updatedAt: string
}

export interface InvestmentOption {
  id: string
  assetClass: string
  name: string
  ticker?: string
  description: string
  marketInfo?: string
  payoutFrequency?: string
  /** Real price per share/unit in R$, when known (e.g. stocks). Used to deduct
   * the actual value from the class budget instead of an even split. */
  price?: number
  /** Real dividend yield (%), from brapi.dev (stocks, annual) or CVM (FIIs, monthly). */
  dividendYieldValue?: number
  /** Real next (or most recent) payment date/amount from brapi.dev's dividend calendar (stocks only). */
  nextPaymentDate?: string
  nextPaymentAmount?: number
  nextPaymentLabel?: string
  realPaymentFrequency?: string
  /** "YYYY-MM-DD" reference month for dividendYieldValue when it's a FII's real
   * monthly distribution from CVM — no exact payment date is available there. */
  dividendReferenceMonth?: string
  /** Real Selic/CDI/IPCA (% a.a.) from Banco Central — only set on the
   * tesouro-selic/tesouro-ipca/cdb rows, used to compute a real rate for a
   * user-typed Renda fixa entry like "105% do CDI". */
  rateValue?: number
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
  priceApprox?: string
  priceValue?: number
  payoutFrequency?: string
  dividendYieldValue?: number
  dividendReferenceMonth?: string
  nextPaymentDate?: string
  nextPaymentAmount?: number
  nextPaymentLabel?: string
  realPaymentFrequency?: string
}
