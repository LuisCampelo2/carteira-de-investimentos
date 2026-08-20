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

export type ProgressStatus = 'not-started' | 'in-progress' | 'completed'
