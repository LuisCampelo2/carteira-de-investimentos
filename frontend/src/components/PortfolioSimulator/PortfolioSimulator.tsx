import { useMemo, useState } from 'react'
import { AlertTriangle, ChevronLeft, GripVertical, Minus, Plus, PiggyBank, Sparkles, X } from 'lucide-react'
import {
  ASSET_CLASSES,
  ASSET_CLASS_COLORS,
  ANNUAL_RATE_BY_RISK,
  getAllocationPreset,
  simulateGrowth,
  formatBRL,
  formatBRLExact,
  formatPaymentDate,
  type AssetClass,
  type RiskTolerance,
} from '../../utils/finance'
import type { CarteiraItem, CarteiraState, InvestmentOption } from '../../data/types'
import { useInvestmentOptions } from '../../hooks/useInvestmentOptions'
import { useCompanies } from '../../hooks/useCompanies'
import { RefreshPricesButton } from '../ui/RefreshPricesButton'
import { GrowthChart } from './GrowthChart'

const objetivos = ['Aposentadoria', 'Reserva de longo prazo', 'Comprar um imóvel', 'Independência financeira', 'Outro']

const MONTHS_PT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

function formatReferenceMonth(iso: string): string {
  const [year, month] = iso.split('-')
  return `${MONTHS_PT[Number(month) - 1]}/${year}`
}

// Each class's monthly budget is split into this many equal shares ("cotas").
// Selecting an asset spends one cota; once all cotas are spent, the class is
// fully allocated and no more assets can be added to it without freeing one up.
const MAX_ITEMS_PER_CLASS = 4

const RISK_SUGGESTION_BY_OBJECTIVE: Partial<Record<(typeof objetivos)[number], RiskTolerance>> = {
  Aposentadoria: 'media',
  'Reserva de longo prazo': 'baixa',
  'Comprar um imóvel': 'baixa',
  'Independência financeira': 'alta',
}

// Renda fixa (CDB/LCI/LCA/Tesouro) is bought over-the-counter, at whatever
// rate/term the bank or corretora is offering that day — there's no public
// unit price the way there is for a stock. So instead of the price+quantity
// model used for exchange-traded classes, it's captured as a described
// application: what it is, the rate, the maturity, and any IR/fees/lock-up.
interface RendaFixaEntry {
  id: string
  tipo: string
  taxa: string
  vencimento: string
  temIR: boolean
  temTaxas: boolean
  temCarencia: boolean
  valor: number
}

const RENDA_FIXA_TIPOS = ['CDB', 'LCI', 'LCA', 'Tesouro Selic', 'Tesouro IPCA+', 'Tesouro Prefixado', 'Debênture', 'Outro']

type Step = 'alocacao' | 'ativos' | 'resumo'

const STEPS: Step[] = ['alocacao', 'ativos', 'resumo']
const STEP_LABELS: Record<Step, string> = { alocacao: '1. Alocação', ativos: '2. Ativos', resumo: '3. Carteira' }

export function PortfolioSimulator({ onConfirm }: { onConfirm: (carteira: CarteiraState) => void }) {
  const { byClass: baseOptionsByClass, loading: optionsLoading, refetch: refetchOptions } = useInvestmentOptions()
  const { companies, loading: companiesLoading, refetch: refetchCompanies } = useCompanies()

  const optionsForClass = (cls: AssetClass): InvestmentOption[] => {
    if (cls === 'Ações') {
      return companies.map((c) => ({
        id: c.id,
        assetClass: 'Ações',
        name: c.name,
        ticker: c.ticker,
        description: c.whatItDoes,
        marketInfo: c.priceApprox,
        payoutFrequency: c.payoutFrequency,
        price: c.priceValue,
        dividendYieldValue: c.dividendYieldValue,
        nextPaymentDate: c.nextPaymentDate,
        nextPaymentAmount: c.nextPaymentAmount,
        nextPaymentLabel: c.nextPaymentLabel,
        realPaymentFrequency: c.realPaymentFrequency,
      }))
    }
    return baseOptionsByClass[cls]
  }

  const [step, setStep] = useState<Step>('alocacao')
  const [initial, setInitial] = useState(0)
  const [monthly, setMonthly] = useState(0)
  const [years, setYears] = useState(0)
  const [risk, setRisk] = useState<RiskTolerance>('media')
  const [objective, setObjective] = useState(objetivos[0])
  const [percents, setPercents] = useState<Record<AssetClass, number>>(() =>
    Object.fromEntries(ASSET_CLASSES.map((cls) => [cls, 0])) as Record<AssetClass, number>,
  )
  const [addedClasses, setAddedClasses] = useState<AssetClass[]>([])
  const [dragOver, setDragOver] = useState(false)
  // Quantity of each asset id within its class (0 or missing = not in the cart).
  const [quantities, setQuantities] = useState<Record<AssetClass, Record<string, number>>>(() =>
    Object.fromEntries(ASSET_CLASSES.map((cls) => [cls, {} as Record<string, number>])) as Record<AssetClass, Record<string, number>>,
  )
  const [customOptions, setCustomOptions] = useState<Record<AssetClass, InvestmentOption[]>>(() =>
    Object.fromEntries(ASSET_CLASSES.map((cls) => [cls, [] as InvestmentOption[]])) as Record<AssetClass, InvestmentOption[]>,
  )
  const [customInput, setCustomInput] = useState<Record<AssetClass, string>>(() =>
    Object.fromEntries(ASSET_CLASSES.map((cls) => [cls, ''])) as Record<AssetClass, string>,
  )
  const [rendaFixaEntries, setRendaFixaEntries] = useState<RendaFixaEntry[]>([])
  const [rfTipo, setRfTipo] = useState(RENDA_FIXA_TIPOS[0])
  const [rfTaxa, setRfTaxa] = useState('')
  const [rfVencimento, setRfVencimento] = useState('')
  const [rfTemIR, setRfTemIR] = useState(true)
  const [rfTemTaxas, setRfTemTaxas] = useState(false)
  const [rfTemCarencia, setRfTemCarencia] = useState(false)
  const [rfValor, setRfValor] = useState(0)

  const allOptionsForClass = (cls: AssetClass): InvestmentOption[] => [...optionsForClass(cls), ...customOptions[cls]]

  const addCustomOption = (cls: AssetClass) => {
    const name = customInput[cls].trim()
    if (!name) return
    const classAmount = monthly * (percents[cls] / 100)
    const cota = classAmount / MAX_ITEMS_PER_CLASS
    const spent = classSpent(cls, allOptionsForClass(cls))
    if (spent + cota > classAmount + 0.005) return
    const id = `custom-${cls}-${Date.now()}`
    setCustomOptions((prev) => ({
      ...prev,
      [cls]: [...prev[cls], { id, assetClass: cls, name, description: 'Investimento adicionado por você.' }],
    }))
    setQuantities((prev) => ({ ...prev, [cls]: { ...prev[cls], [id]: 1 } }))
    setCustomInput((prev) => ({ ...prev, [cls]: '' }))
  }

  const removeCustomOption = (cls: AssetClass, id: string) => {
    setCustomOptions((prev) => ({ ...prev, [cls]: prev[cls].filter((o) => o.id !== id) }))
    setQuantities((prev) => {
      const next = { ...prev[cls] }
      delete next[id]
      return { ...prev, [cls]: next }
    })
  }

  const classQuantity = (cls: AssetClass, id: string): number => quantities[cls][id] ?? 0

  const availableClasses = ASSET_CLASSES.filter((c) => !addedClasses.includes(c))
  const total = addedClasses.reduce((sum, c) => sum + (percents[c] || 0), 0)
  const activeClasses = addedClasses.filter((c) => percents[c] > 0)
  const allActiveClassesHaveSelection = activeClasses.every((c) =>
    c === 'Renda fixa' ? rendaFixaEntries.length > 0 : Object.values(quantities[c]).some((q) => q > 0),
  )

  const points = useMemo(() => simulateGrowth(initial, monthly, years, risk), [initial, monthly, years, risk])
  const last = points[points.length - 1]

  const addClass = (cls: AssetClass) => {
    setAddedClasses((prev) => (prev.includes(cls) ? prev : [...prev, cls]))
  }

  const applyPreset = (r: RiskTolerance) => {
    setRisk(r)
    if (addedClasses.length === 0) return

    const preset = getAllocationPreset(r)
    const weights = addedClasses.map((c) => preset[c] || 0)
    const sumWeights = weights.reduce((s, w) => s + w, 0)

    setPercents((prev) => {
      const next = { ...prev }
      let allocated = 0
      addedClasses.forEach((c, i) => {
        if (i === addedClasses.length - 1) {
          next[c] = Math.max(0, 100 - allocated)
        } else {
          const value = sumWeights === 0 ? Math.round(100 / addedClasses.length) : Math.round((weights[i] / sumWeights) * 100)
          next[c] = value
          allocated += value
        }
      })
      return next
    })
  }

  const removeClass = (cls: AssetClass) => {
    setAddedClasses((prev) => prev.filter((c) => c !== cls))
    setPercents((prev) => ({ ...prev, [cls]: 0 }))
    setQuantities((prev) => ({ ...prev, [cls]: {} }))
    if (cls === 'Renda fixa') setRendaFixaEntries([])
  }

  const setPercent = (cls: AssetClass, value: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(value)))
    setPercents((prev) => ({ ...prev, [cls]: clamped }))
  }

  const handleObjectiveChange = (nextObjective: string) => {
    setObjective(nextObjective)
    const suggestion = RISK_SUGGESTION_BY_OBJECTIVE[nextObjective]
    if (suggestion) applyPreset(suggestion)
  }

  // Real unit price when we know it (stocks), otherwise an equal share of the
  // class budget across MAX_ITEMS_PER_CLASS slots — see MAX_ITEMS_PER_CLASS.
  const unitPrice = (cls: AssetClass, opt: InvestmentOption): number => {
    if (opt.price != null) return opt.price
    const classAmount = monthly * (percents[cls] / 100)
    return classAmount / MAX_ITEMS_PER_CLASS
  }

  const classSpent = (cls: AssetClass, options: InvestmentOption[]): number => {
    let sum = 0
    for (const opt of options) {
      const qty = classQuantity(cls, opt.id)
      if (qty > 0) sum += unitPrice(cls, opt) * qty
    }
    return sum
  }

  const rendaFixaSpent = rendaFixaEntries.reduce((sum, e) => sum + e.valor, 0)
  const rendaFixaRemaining = Math.max(0, monthly * (percents['Renda fixa'] / 100) - rendaFixaSpent)

  const addRendaFixaEntry = () => {
    if (!rfTaxa.trim() || rfValor <= 0 || rfValor > rendaFixaRemaining + 0.005) return
    const avisos: string[] = []
    if (rfTemIR) avisos.push('Tem IR')
    if (rfTemTaxas) avisos.push('Tem taxas')
    if (rfTemCarencia) avisos.push('Tem carência')
    setRendaFixaEntries((prev) => [
      ...prev,
      {
        id: `rf-${Date.now()}`,
        tipo: rfTipo,
        taxa: rfTaxa.trim(),
        vencimento: rfVencimento,
        temIR: rfTemIR,
        temTaxas: rfTemTaxas,
        temCarencia: rfTemCarencia,
        valor: rfValor,
      },
    ])
    setRfTaxa('')
    setRfVencimento('')
    setRfValor(0)
  }

  const removeRendaFixaEntry = (id: string) => {
    setRendaFixaEntries((prev) => prev.filter((e) => e.id !== id))
  }

  // Real payout only when we actually have it (brapi.dev for stocks, CVM for
  // FIIs) — never estimated for classes without real data. Returns the next
  // (or estimated monthly) amount for the given quantity, or null.
  const expectedIncome = (cls: AssetClass, opt: InvestmentOption, qty: number): number | null => {
    if (qty <= 0) return null
    if (opt.nextPaymentAmount != null && opt.nextPaymentDate) return opt.nextPaymentAmount * qty
    if (opt.dividendYieldValue != null && opt.dividendReferenceMonth) {
      return unitPrice(cls, opt) * (opt.dividendYieldValue / 100) * qty
    }
    return null
  }

  const changeQuantity = (cls: AssetClass, id: string, delta: number) => {
    const options = allOptionsForClass(cls)
    const opt = options.find((o) => o.id === id)
    if (!opt) return
    setQuantities((prev) => {
      const current = prev[cls][id] ?? 0
      const next = current + delta
      if (next < 0) return prev
      if (delta > 0) {
        const classAmount = monthly * (percents[cls] / 100)
        const spent = classSpent(cls, options)
        if (spent + unitPrice(cls, opt) > classAmount + 0.005) return prev
      }
      return { ...prev, [cls]: { ...prev[cls], [id]: next } }
    })
  }

  const confirm = () => {
    const items: CarteiraItem[] = activeClasses.flatMap((cls): CarteiraItem[] => {
      if (cls === 'Renda fixa') {
        return rendaFixaEntries.map((e) => {
          const avisos: string[] = []
          if (e.temIR) avisos.push('Tem IR')
          if (e.temTaxas) avisos.push('Tem taxas')
          if (e.temCarencia) avisos.push('Tem carência')
          return {
            id: e.id,
            assetClass: cls,
            name: `${e.tipo} — ${e.taxa}`,
            monthlyAmount: e.valor,
            rendaFixaTipo: e.tipo,
            rendaFixaTaxa: e.taxa,
            rendaFixaVencimento: e.vencimento || undefined,
            rendaFixaAvisos: avisos,
          }
        })
      }
      const options = allOptionsForClass(cls)
      return options
        .map((opt) => ({ opt, qty: classQuantity(cls, opt.id) }))
        .filter(({ qty }) => qty > 0)
        .map(({ opt, qty }) => {
          const income = expectedIncome(cls, opt, qty)
          const note =
            income == null
              ? undefined
              : opt.nextPaymentDate
                ? `próximo pagamento em ${formatPaymentDate(opt.nextPaymentDate)}`
                : opt.dividendReferenceMonth
                  ? `estimativa mensal, base ${formatReferenceMonth(opt.dividendReferenceMonth)}`
                  : undefined
          return {
            id: `${cls}:${opt.id}`,
            assetClass: cls,
            name: opt.name,
            ticker: opt.ticker,
            quantity: qty,
            monthlyAmount: unitPrice(cls, opt) * qty,
            expectedIncome: income ?? undefined,
            expectedIncomeNote: note,
          }
        })
    })

    onConfirm({
      items,
      monthlyContribution: monthly,
      initialAmount: initial,
      years,
      objective,
      risk,
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        {STEPS.map((s, i) => {
          const canGoBack = i < STEPS.indexOf(step)
          return (
            <button
              key={s}
              type="button"
              disabled={!canGoBack}
              onClick={() => setStep(s)}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                step === s
                  ? 'bg-sky-500/20 text-sky-300'
                  : canGoBack
                    ? 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
                    : 'cursor-not-allowed bg-slate-800/60 text-slate-500'
              }`}
            >
              {STEP_LABELS[s]}
            </button>
          )
        })}
      </div>

      {step === 'alocacao' && (
        <div className="animate-fade-in space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-400">Patrimônio inicial</span>
              <input
                type="number"
                min={0}
                value={initial === 0 ? '' : initial}
                onChange={(e) => setInitial(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-200 outline-none [-moz-appearance:textfield] focus:border-sky-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-400">Aporte mensal</span>
              <input
                type="number"
                min={0}
                value={monthly === 0 ? '' : monthly}
                onChange={(e) => setMonthly(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-200 outline-none [-moz-appearance:textfield] focus:border-sky-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-400">Horizonte de investimento (anos)</span>
              <input
                type="number"
                min={1}
                max={40}
                value={years === 0 ? '' : years}
                onChange={(e) => setYears(e.target.value === '' ? 0 : Math.min(40, Math.max(1, Number(e.target.value))))}
                onBlur={() => setYears((y) => (y === 0 ? 1 : y))}
                className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-200 outline-none [-moz-appearance:textfield] focus:border-sky-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-400">Objetivo</span>
              <select
                value={objective}
                onChange={(e) => handleObjectiveChange(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
              >
                {objetivos.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <span className="mb-1.5 block text-sm text-slate-400">Tolerância ao risco (redistribui a % entre os investimentos já adicionados à carteira)</span>
            <div className="flex gap-2">
              {(['baixa', 'media', 'alta'] as RiskTolerance[]).map((r) => (
                <button
                  key={r}
                  onClick={() => applyPreset(r)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    risk === r
                      ? 'border-sky-500 bg-sky-500/20 text-sky-200'
                      : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="block capitalize">{r === 'media' ? 'Média' : r}</span>
                  <span className="block text-xs opacity-70">~{(ANNUAL_RATE_BY_RISK[r] * 100).toFixed(0)}% a.a.</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Sparkles size={16} className="text-sky-400" />
              Tipos de investimento disponíveis — arraste para a sua carteira
            </div>
            <div className="flex flex-wrap gap-2">
              {availableClasses.length === 0 && <p className="text-xs text-slate-500">Todos os tipos já estão na sua carteira.</p>}
              {availableClasses.map((cls) => (
                <div
                  key={cls}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', cls)}
                  onClick={() => addClass(cls)}
                  className="flex cursor-grab items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-slate-500 active:cursor-grabbing"
                >
                  <GripVertical size={13} className="text-slate-600" />
                  <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: ASSET_CLASS_COLORS[cls] }} />
                  {cls}
                </div>
              ))}
            </div>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              const cls = e.dataTransfer.getData('text/plain') as AssetClass
              if (ASSET_CLASSES.includes(cls)) addClass(cls)
            }}
            className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
              dragOver ? 'border-sky-500 bg-sky-500/5' : 'border-slate-700/60 bg-slate-900/40'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium text-slate-300">Sua carteira</div>
              <span className={`text-xs font-medium ${total === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>Total: {total}%</span>
            </div>

            {addedClasses.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                Arraste aqui os tipos de investimento que você quer na carteira (ou clique neles acima).
              </p>
            ) : (
              <div className="space-y-2.5">
                {addedClasses.map((cls) => (
                  <div key={cls} className="flex items-center gap-3">
                    <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: ASSET_CLASS_COLORS[cls] }} />
                    <span className="w-36 shrink-0 text-sm text-slate-300">{cls}</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={percents[cls]}
                      onChange={(e) => setPercent(cls, Number(e.target.value))}
                      className="flex-1 accent-sky-500"
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={percents[cls] === 0 ? '' : percents[cls]}
                      onChange={(e) => setPercent(cls, e.target.value === '' ? 0 : Number(e.target.value))}
                      className="w-16 appearance-none rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1 text-right text-sm text-slate-200 outline-none [-moz-appearance:textfield] focus:border-sky-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="w-3 shrink-0 text-xs text-slate-500">%</span>
                    <button onClick={() => removeClass(cls)} className="shrink-0 text-slate-600 hover:text-rose-400" aria-label={`Remover ${cls}`}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {addedClasses.length > 0 && total !== 100 && (
              <p className="mt-3 text-xs text-amber-300">A soma das classes precisa ser 100% para continuar.</p>
            )}
          </div>

          <button
            onClick={() => setStep('ativos')}
            disabled={total !== 100 || optionsLoading || companiesLoading}
            className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
          >
            {optionsLoading || companiesLoading ? 'Carregando investimentos...' : 'Continuar para escolher os ativos'}
          </button>
        </div>
      )}

      {step === 'ativos' && (
        <div className="animate-fade-in space-y-5">
          <RefreshPricesButton onRefreshed={() => Promise.all([refetchOptions(), refetchCompanies()])} />

          {activeClasses.map((cls) => {
            const classAmount = monthly * (percents[cls] / 100)

            if (cls === 'Renda fixa') {
              const rfFullyAllocated = rendaFixaRemaining < 0.005
              return (
                <div key={cls} className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ASSET_CLASS_COLORS[cls] }} />
                      {cls}
                    </div>
                    <span className="text-xs text-slate-500">
                      {percents[cls]}% · {formatBRLExact(classAmount)}/mês
                    </span>
                  </div>
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Renda fixa é OTC — descreva a aplicação em vez de escolher um preço de mercado</span>
                    <span className={`font-medium ${rfFullyAllocated ? 'text-emerald-400' : 'text-slate-400'}`}>
                      Restante: {formatBRLExact(rendaFixaRemaining)}
                    </span>
                  </div>

                  {rendaFixaEntries.length > 0 && (
                    <ul className="mb-3 space-y-2">
                      {rendaFixaEntries.map((e) => (
                        <li key={e.id} className="flex items-start justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2 text-sm">
                          <div>
                            <div className="font-medium text-slate-200">
                              {e.tipo} <span className="text-xs text-slate-500">— {e.taxa}</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              {e.vencimento && `Vencimento: ${formatPaymentDate(e.vencimento)} · `}
                              {formatBRLExact(e.valor)}/mês
                            </div>
                            {(e.temIR || e.temTaxas || e.temCarencia) && (
                              <div className="mt-0.5 flex flex-wrap gap-1">
                                {e.temIR && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-300">Tem IR</span>}
                                {e.temTaxas && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-300">Tem taxas</span>}
                                {e.temCarencia && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-300">Tem carência</span>}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeRendaFixaEntry(e.id)}
                            className="shrink-0 text-slate-600 hover:text-rose-400"
                            aria-label={`Remover ${e.tipo}`}
                          >
                            <X size={13} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="space-y-2 rounded-lg border border-slate-700/60 bg-slate-900/60 p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="block text-xs">
                        <span className="mb-1 block text-slate-400">Qual é a aplicação?</span>
                        <select
                          value={rfTipo}
                          onChange={(e) => setRfTipo(e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-1.5 text-sm text-slate-200 outline-none focus:border-sky-500"
                        >
                          {RENDA_FIXA_TIPOS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-xs">
                        <span className="mb-1 block text-slate-400">Qual é a taxa?</span>
                        <input
                          value={rfTaxa}
                          onChange={(e) => setRfTaxa(e.target.value)}
                          placeholder="ex: 100% do CDI, IPCA + 6%"
                          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-1.5 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-sky-500"
                        />
                      </label>
                      <label className="block text-xs">
                        <span className="mb-1 block text-slate-400">Prazo / data de vencimento</span>
                        <input
                          type="date"
                          value={rfVencimento}
                          onChange={(e) => setRfVencimento(e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-1.5 text-sm text-slate-200 outline-none focus:border-sky-500 [color-scheme:dark]"
                        />
                      </label>
                      <label className="block text-xs">
                        <span className="mb-1 block text-slate-400">Valor mensal nesta aplicação</span>
                        <input
                          type="number"
                          min={0}
                          value={rfValor === 0 ? '' : rfValor}
                          onChange={(e) => setRfValor(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                          placeholder={formatBRLExact(rendaFixaRemaining)}
                          className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-1.5 text-sm text-slate-200 outline-none placeholder:text-slate-600 [-moz-appearance:textfield] focus:border-sky-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                      <label className="flex items-center gap-1.5">
                        <input type="checkbox" checked={rfTemIR} onChange={(e) => setRfTemIR(e.target.checked)} className="accent-sky-500" />
                        Tem IR
                      </label>
                      <label className="flex items-center gap-1.5">
                        <input type="checkbox" checked={rfTemTaxas} onChange={(e) => setRfTemTaxas(e.target.checked)} className="accent-sky-500" />
                        Tem taxas
                      </label>
                      <label className="flex items-center gap-1.5">
                        <input type="checkbox" checked={rfTemCarencia} onChange={(e) => setRfTemCarencia(e.target.checked)} className="accent-sky-500" />
                        Tem carência
                      </label>
                    </div>
                    <button
                      onClick={addRendaFixaEntry}
                      disabled={!rfTaxa.trim() || rfValor <= 0 || rfValor > rendaFixaRemaining + 0.005}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={14} /> Adicionar aplicação
                    </button>
                  </div>

                  {rendaFixaEntries.length === 0 && (
                    <p className="mt-2 text-xs text-amber-300">Descreva ao menos uma aplicação desta classe.</p>
                  )}
                </div>
              )
            }

            const options = allOptionsForClass(cls)
            const cota = classAmount / MAX_ITEMS_PER_CLASS
            const spent = classSpent(cls, options)
            const remaining = Math.max(0, classAmount - spent)
            const fullyAllocated = remaining < 0.005
            const hasAnyQty = Object.values(quantities[cls]).some((q) => q > 0)
            return (
              <div key={cls} className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ASSET_CLASS_COLORS[cls] }} />
                    {cls}
                  </div>
                  <span className="text-xs text-slate-500">
                    {percents[cls]}% · {formatBRLExact(classAmount)}/mês
                  </span>
                </div>
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {options.some((o) => o.price != null)
                      ? 'Desconta o preço real × quantidade de cada ativo'
                      : `${formatBRLExact(cota)} por unidade escolhida`}
                  </span>
                  <span className={`font-medium ${fullyAllocated ? 'text-emerald-400' : 'text-slate-400'}`}>
                    Restante: {formatBRLExact(remaining)}
                  </span>
                </div>
                {fullyAllocated && (
                  <p className="mb-2 text-xs text-amber-300">
                    Valor da classe totalmente distribuído. Reduza a quantidade de um ativo para ajustar outro.
                  </p>
                )}
                <div className="grid gap-2 sm:grid-cols-2">
                  {options.map((opt) => {
                    const qty = classQuantity(cls, opt.id)
                    const isCustom = opt.id.startsWith('custom-')
                    const unit = unitPrice(cls, opt)
                    const canIncrement = remaining >= unit - 0.005
                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 transition-colors ${
                          qty > 0 ? 'border-sky-500 bg-sky-500/10' : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-200">
                            {opt.name}
                            {opt.ticker && opt.ticker !== opt.name && <span className="ml-1 text-xs text-slate-500">{opt.ticker}</span>}
                          </div>
                          <div className="text-lg font-bold text-emerald-400">{formatBRLExact(unit)}</div>
                          {opt.dividendYieldValue != null && opt.nextPaymentDate && (
                            <div className="text-xs text-slate-400">
                              <span>
                                Paga ≈ {opt.dividendYieldValue.toFixed(1).replace('.', ',')}% a.a.
                                {opt.realPaymentFrequency ? ` (${opt.realPaymentFrequency})` : ''}
                              </span>
                              {opt.nextPaymentAmount != null && (
                                <span className={qty > 0 ? 'block font-medium text-emerald-300' : 'block'}>
                                  {qty > 0
                                    ? `Você recebe ${formatBRLExact(opt.nextPaymentAmount * qty)}`
                                    : `Próximo: ${formatBRLExact(opt.nextPaymentAmount)}/un.`}
                                  {' em '}
                                  {formatPaymentDate(opt.nextPaymentDate)}
                                  {opt.nextPaymentLabel ? ` (${opt.nextPaymentLabel})` : ''}
                                </span>
                              )}
                            </div>
                          )}
                          {opt.dividendYieldValue != null && !opt.nextPaymentDate && opt.dividendReferenceMonth && (
                            <div className="text-xs text-slate-400">
                              <span>
                                Rendeu {opt.dividendYieldValue.toFixed(2).replace('.', ',')}% em{' '}
                                {formatReferenceMonth(opt.dividendReferenceMonth)} · Mensal
                              </span>
                              <span className={qty > 0 ? 'block font-medium text-emerald-300' : 'block'}>
                                {qty > 0
                                  ? `Você recebe ≈ ${formatBRLExact(unit * (opt.dividendYieldValue / 100) * qty)}/mês`
                                  : `≈ ${formatBRLExact(unit * (opt.dividendYieldValue / 100))}/un. por mês`}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            onClick={() => changeQuantity(cls, opt.id, -1)}
                            disabled={qty === 0}
                            aria-label={`Diminuir quantidade de ${opt.name}`}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-5 text-center text-sm font-medium text-slate-200">{qty}</span>
                          <button
                            onClick={() => changeQuantity(cls, opt.id, 1)}
                            disabled={!canIncrement}
                            aria-label={`Aumentar quantidade de ${opt.name}`}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Plus size={12} />
                          </button>
                          {isCustom && (
                            <button
                              onClick={() => removeCustomOption(cls, opt.id)}
                              className="ml-1 text-slate-600 hover:text-rose-400"
                              aria-label={`Remover ${opt.name}`}
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-2.5 flex gap-2">
                  <input
                    value={customInput[cls]}
                    onChange={(e) => setCustomInput((prev) => ({ ...prev, [cls]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addCustomOption(cls)
                      }
                    }}
                    disabled={remaining < cota - 0.005}
                    placeholder={remaining < cota - 0.005 ? 'Valor da classe já totalmente distribuído' : 'Adicionar meu próprio investimento...'}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <button
                    onClick={() => addCustomOption(cls)}
                    disabled={!customInput[cls].trim() || remaining < cota - 0.005}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={13} /> Adicionar
                  </button>
                </div>

                {!hasAnyQty && (
                  <p className="mt-2 text-xs text-amber-300">Escolha a quantidade de ao menos um ativo desta classe (ou adicione o seu).</p>
                )}
              </div>
            )
          })}

          <div className="flex gap-2">
            <button
              onClick={() => setStep('alocacao')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500"
            >
              <ChevronLeft size={15} /> Voltar
            </button>
            <button
              onClick={() => setStep('resumo')}
              disabled={!allActiveClassesHaveSelection}
              className="flex-1 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
            >
              Ver resumo da carteira
            </button>
          </div>
        </div>
      )}

      {step === 'resumo' && (
        <div className="animate-fade-in space-y-5">
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
              <PiggyBank size={16} className="text-emerald-400" />
              Sua carteira montada
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {activeClasses.map((cls) => (
                <div key={cls} style={{ width: `${percents[cls]}%`, backgroundColor: ASSET_CLASS_COLORS[cls] }} title={`${cls}: ${percents[cls]}%`} />
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {activeClasses.map((cls) => {
                const classAmount = monthly * (percents[cls] / 100)

                if (cls === 'Renda fixa') {
                  const unallocated = classAmount - rendaFixaSpent
                  return (
                    <div key={cls}>
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: ASSET_CLASS_COLORS[cls] }}>
                        {cls} — {percents[cls]}%
                      </div>
                      <ul className="space-y-1">
                        {rendaFixaEntries.map((e) => (
                          <li key={e.id} className="rounded-lg bg-slate-800/40 px-3 py-1.5 text-sm text-slate-300">
                            <div className="flex items-center justify-between">
                              <span>
                                {e.tipo} <span className="text-xs text-slate-500">— {e.taxa}</span>
                              </span>
                              <span className="text-slate-500">{formatBRLExact(e.valor)}/mês</span>
                            </div>
                            {e.vencimento && <div className="text-xs text-slate-500">Vencimento: {formatPaymentDate(e.vencimento)}</div>}
                          </li>
                        ))}
                      </ul>
                      {unallocated > 0.005 && (
                        <p className="mt-1 text-xs text-amber-300">
                          {formatBRLExact(unallocated)}/mês desta classe ainda não foram atribuídos a nenhuma aplicação.
                        </p>
                      )}
                    </div>
                  )
                }

                const options = allOptionsForClass(cls)
                const selectedOptions = options.filter((o) => classQuantity(cls, o.id) > 0)
                const spent = classSpent(cls, options)
                const unallocated = classAmount - spent
                return (
                  <div key={cls}>
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: ASSET_CLASS_COLORS[cls] }}>
                      {cls} — {percents[cls]}%
                    </div>
                    <ul className="space-y-1">
                      {selectedOptions.map((opt) => {
                        const qty = classQuantity(cls, opt.id)
                        return (
                          <li key={opt.id} className="flex items-center justify-between rounded-lg bg-slate-800/40 px-3 py-1.5 text-sm text-slate-300">
                            <span>
                              {opt.name}
                              {qty > 1 && <span className="ml-1 text-xs text-slate-500">×{qty}</span>}
                            </span>
                            <span className="text-slate-500">{formatBRLExact(unitPrice(cls, opt) * qty)}/mês</span>
                          </li>
                        )
                      })}
                    </ul>
                    {unallocated > 0.005 && (
                      <p className="mt-1 text-xs text-amber-300">
                        {formatBRLExact(unallocated)}/mês desta classe ainda não foram atribuídos a nenhum ativo.
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {(() => {
            let total = 0
            let withData = 0
            let withoutData = 0
            for (const cls of activeClasses) {
              for (const opt of allOptionsForClass(cls)) {
                const qty = classQuantity(cls, opt.id)
                if (qty <= 0) continue
                const income = expectedIncome(cls, opt, qty)
                if (income != null) {
                  total += income
                  withData++
                } else {
                  withoutData++
                }
              }
            }
            if (withData === 0) return null
            return (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-emerald-300">Proventos esperados</div>
                <div className="text-2xl font-bold text-emerald-400">{formatBRLExact(total)}</div>
                <p className="mt-1 text-xs text-emerald-200/80">
                  Soma do próximo pagamento (ações) ou estimativa mensal (FIIs) de {withData}{' '}
                  {withData === 1 ? 'ativo com dado real' : 'ativos com dado real'} de mercado.
                  {withoutData > 0 &&
                    ` Não inclui ${withoutData} ${withoutData === 1 ? 'ativo sem' : 'ativos sem'} dado real disponível.`}
                </p>
              </div>
            )
          })()}

          <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <div className="mb-3 text-sm font-medium text-slate-300">Projeção de crescimento (simulação educacional)</div>
            <GrowthChart points={points} />
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <div className="rounded-lg border border-slate-700/50 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">Total aportado</div>
                <div className="text-slate-200">{formatBRL(last.invested)}</div>
              </div>
              <div className="rounded-lg border border-slate-700/50 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">Projeção final</div>
                <div className="text-slate-200">{formatBRL(last.projected)}</div>
              </div>
              <div className="rounded-lg border border-slate-700/50 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">Objetivo</div>
                <div className="text-slate-200">{objective}</div>
              </div>
              <div className="rounded-lg border border-slate-700/50 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">Risco (usado na projeção)</div>
                <div className="text-slate-200 capitalize">
                  {risk === 'media' ? 'Média' : risk} · ≈{(ANNUAL_RATE_BY_RISK[risk] * 100).toFixed(0)}% a.a.
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-200">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-400" />
            <span>Esta é uma simulação educacional com taxas hipotéticas. Não é garantia de rentabilidade — rentabilidade passada não garante rentabilidade futura.</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep('ativos')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500"
            >
              <ChevronLeft size={15} /> Voltar
            </button>
            <button
              onClick={confirm}
              className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
            >
              Adicionar à Minha Carteira
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
