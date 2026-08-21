export interface CarteiraItem {
  id: string
  assetClass: string
  name: string
  ticker?: string
  monthlyAmount: number
  quantity?: number
  expectedIncome?: number
  expectedIncomeNote?: string
  rendaFixaTipo?: string
  rendaFixaTaxa?: string
  rendaFixaVencimento?: string
  rendaFixaAvisos?: string[]
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

export type ProgressStatus = 'not-started' | 'in-progress' | 'completed'
