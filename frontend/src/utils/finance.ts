export type RiskTolerance = 'baixa' | 'media' | 'alta'

export type AssetClass =
  | 'Renda fixa'
  | 'ETFs'
  | 'Ações'
  | 'FIIs'
  | 'Fundos Multimercado'
  | 'Previdência Privada'
  | 'Debêntures'
  | 'Criptomoedas'

export const ASSET_CLASSES: AssetClass[] = [
  'Renda fixa',
  'ETFs',
  'Ações',
  'FIIs',
  'Fundos Multimercado',
  'Previdência Privada',
  'Debêntures',
  'Criptomoedas',
]

export const ASSET_CLASS_COLORS: Record<AssetClass, string> = {
  'Renda fixa': 'var(--color-brand-4)',
  ETFs: 'var(--color-brand-2)',
  Ações: 'var(--color-brand-1)',
  FIIs: 'var(--color-brand-5)',
  'Fundos Multimercado': 'var(--color-brand-3)',
  'Previdência Privada': 'var(--color-brand-8)',
  Debêntures: 'var(--color-brand-10)',
  Criptomoedas: 'var(--color-brand-6)',
}

export interface Allocation {
  label: AssetClass
  percent: number
  color: string
}

const PRESETS: Record<RiskTolerance, Record<AssetClass, number>> = {
  baixa: {
    'Renda fixa': 45,
    ETFs: 10,
    Ações: 5,
    FIIs: 10,
    'Fundos Multimercado': 5,
    'Previdência Privada': 15,
    Debêntures: 10,
    Criptomoedas: 0,
  },
  media: {
    'Renda fixa': 25,
    ETFs: 15,
    Ações: 15,
    FIIs: 15,
    'Fundos Multimercado': 10,
    'Previdência Privada': 10,
    Debêntures: 8,
    Criptomoedas: 2,
  },
  alta: {
    'Renda fixa': 5,
    ETFs: 20,
    Ações: 35,
    FIIs: 10,
    'Fundos Multimercado': 10,
    'Previdência Privada': 0,
    Debêntures: 5,
    Criptomoedas: 15,
  },
}

export function getAllocationPreset(risk: RiskTolerance): Record<AssetClass, number> {
  return { ...PRESETS[risk] }
}

export function getAllocation(risk: RiskTolerance): Allocation[] {
  const preset = PRESETS[risk] ?? PRESETS.media
  return ASSET_CLASSES.map((label) => ({ label, percent: preset[label], color: ASSET_CLASS_COLORS[label] }))
}

export const ANNUAL_RATE_BY_RISK: Record<RiskTolerance, number> = {
  baixa: 0.08,
  media: 0.1,
  alta: 0.12,
}

export interface ProjectionPoint {
  year: number
  invested: number
  projected: number
}

export function simulateGrowth(
  initial: number,
  monthly: number,
  years: number,
  risk: RiskTolerance,
): ProjectionPoint[] {
  const annualRate = ANNUAL_RATE_BY_RISK[risk]
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1

  const points: ProjectionPoint[] = [{ year: 0, invested: initial, projected: initial }]
  let balance = initial
  let invested = initial

  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthly
      invested += monthly
    }
    points.push({ year, invested, projected: balance })
  }

  return points
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}
