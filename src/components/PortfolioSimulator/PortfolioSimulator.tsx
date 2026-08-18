import { useMemo, useState } from 'react'
import { AlertTriangle, Check, ChevronLeft, PiggyBank, Sparkles } from 'lucide-react'
import {
  ASSET_CLASSES,
  ASSET_CLASS_COLORS,
  getAllocationPreset,
  simulateGrowth,
  formatBRL,
  type AssetClass,
  type RiskTolerance,
} from '../../utils/finance'
import type { InvestmentOption } from '../../data/investmentOptions'
import { etfOptions, rendaFixaOptions, fiiOptions } from '../../data/investmentOptions'
import { empresas } from '../../data/empresas'
import type { CarteiraState } from '../../data/types'
import { GrowthChart } from './GrowthChart'

const objetivos = ['Aposentadoria', 'Reserva de longo prazo', 'Comprar um imóvel', 'Independência financeira', 'Outro']

function optionsForClass(cls: AssetClass): InvestmentOption[] {
  switch (cls) {
    case 'Ações':
      return empresas.map((e) => ({ id: e.id, name: e.name, ticker: e.ticker, description: e.whatItDoes }))
    case 'ETFs':
      return etfOptions
    case 'Renda fixa':
      return rendaFixaOptions
    case 'FIIs':
      return fiiOptions
  }
}

type Step = 'alocacao' | 'ativos' | 'resumo'

const STEP_LABELS: Record<Step, string> = { alocacao: '1. Alocação', ativos: '2. Ativos', resumo: '3. Carteira' }

export function PortfolioSimulator({ onConfirm }: { onConfirm: (carteira: CarteiraState) => void }) {
  const [step, setStep] = useState<Step>('alocacao')
  const [initial, setInitial] = useState(1000)
  const [monthly, setMonthly] = useState(400)
  const [years, setYears] = useState(5)
  const [risk, setRisk] = useState<RiskTolerance>('media')
  const [objective, setObjective] = useState(objetivos[0])
  const [percents, setPercents] = useState<Record<AssetClass, number>>(() => getAllocationPreset('media'))
  const [selections, setSelections] = useState<Record<AssetClass, Set<string>>>(() => ({
    'Renda fixa': new Set(),
    ETFs: new Set(),
    Ações: new Set(),
    FIIs: new Set(),
  }))

  const total = ASSET_CLASSES.reduce((sum, c) => sum + (percents[c] || 0), 0)
  const activeClasses = ASSET_CLASSES.filter((c) => percents[c] > 0)
  const allActiveClassesHaveSelection = activeClasses.every((c) => selections[c].size > 0)

  const points = useMemo(() => simulateGrowth(initial, monthly, years, risk), [initial, monthly, years, risk])
  const last = points[points.length - 1]

  const applyPreset = (r: RiskTolerance) => {
    setRisk(r)
    setPercents(getAllocationPreset(r))
  }

  const setPercent = (cls: AssetClass, value: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(value)))
    setPercents((prev) => ({ ...prev, [cls]: clamped }))
  }

  const toggleAsset = (cls: AssetClass, id: string) => {
    setSelections((prev) => {
      const next = new Set(prev[cls])
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...prev, [cls]: next }
    })
  }

  const confirm = () => {
    const items = activeClasses.flatMap((cls) => {
      const classAmount = monthly * (percents[cls] / 100)
      const ids = Array.from(selections[cls])
      const perAsset = classAmount / ids.length
      const options = optionsForClass(cls)
      return ids.map((id) => {
        const opt = options.find((o) => o.id === id)!
        return {
          id: `${cls}:${id}`,
          assetClass: cls,
          name: opt.name,
          ticker: opt.ticker,
          monthlyAmount: perAsset,
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
        {(['alocacao', 'ativos', 'resumo'] as Step[]).map((s) => (
          <span key={s} className={`rounded-full px-2.5 py-1 ${step === s ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800/60'}`}>
            {STEP_LABELS[s]}
          </span>
        ))}
      </div>

      {step === 'alocacao' && (
        <div className="animate-fade-in space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-400">Patrimônio inicial</span>
              <input
                type="number"
                min={0}
                value={initial}
                onChange={(e) => setInitial(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-400">Aporte mensal</span>
              <input
                type="number"
                min={0}
                value={monthly}
                onChange={(e) => setMonthly(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-400">Horizonte de investimento (anos)</span>
              <input
                type="number"
                min={1}
                max={40}
                value={years}
                onChange={(e) => setYears(Math.min(40, Math.max(1, Number(e.target.value))))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-200 outline-none focus:border-sky-500"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-400">Objetivo</span>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
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
            <span className="mb-1.5 block text-sm text-slate-400">Tolerância ao risco (aplica uma sugestão de %, editável abaixo)</span>
            <div className="flex gap-2">
              {(['baixa', 'media', 'alta'] as RiskTolerance[]).map((r) => (
                <button
                  key={r}
                  onClick={() => applyPreset(r)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition-colors ${
                    risk === r
                      ? 'border-sky-500 bg-sky-500/20 text-sky-200'
                      : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {r === 'media' ? 'Média' : r}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Sparkles size={16} className="text-sky-400" />
                Escolha você mesmo a alocação por classe
              </div>
              <span className={`text-xs font-medium ${total === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>Total: {total}%</span>
            </div>
            <div className="space-y-2.5">
              {ASSET_CLASSES.map((cls) => (
                <div key={cls} className="flex items-center gap-3">
                  <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: ASSET_CLASS_COLORS[cls] }} />
                  <span className="w-24 shrink-0 text-sm text-slate-300">{cls}</span>
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
                    value={percents[cls]}
                    onChange={(e) => setPercent(cls, Number(e.target.value))}
                    className="w-16 rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1 text-right text-sm text-slate-200 outline-none focus:border-sky-500"
                  />
                  <span className="w-3 shrink-0 text-xs text-slate-500">%</span>
                </div>
              ))}
            </div>
            {total !== 100 && (
              <p className="mt-3 text-xs text-amber-300">A soma das classes precisa ser 100% para continuar.</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <div className="mb-3 text-sm font-medium text-slate-300">Projeção de crescimento (simulação educacional)</div>
            <GrowthChart points={points} />
          </div>

          <button
            onClick={() => setStep('ativos')}
            disabled={total !== 100}
            className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
          >
            Continuar para escolher os ativos
          </button>
        </div>
      )}

      {step === 'ativos' && (
        <div className="animate-fade-in space-y-5">
          {activeClasses.map((cls) => {
            const options = optionsForClass(cls)
            const classAmount = monthly * (percents[cls] / 100)
            return (
              <div key={cls} className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ASSET_CLASS_COLORS[cls] }} />
                    {cls}
                  </div>
                  <span className="text-xs text-slate-500">
                    {percents[cls]}% · {formatBRL(classAmount)}/mês
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {options.map((opt) => {
                    const selected = selections[cls].has(opt.id)
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleAsset(cls, opt.id)}
                        className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
                          selected ? 'border-sky-500 bg-sky-500/10' : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            selected ? 'border-sky-500 bg-sky-500' : 'border-slate-600'
                          }`}
                        >
                          {selected && <Check size={11} className="text-white" />}
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-slate-200">
                            {opt.name}
                            {opt.ticker && opt.ticker !== opt.name && <span className="ml-1 text-xs text-slate-500">({opt.ticker})</span>}
                          </span>
                          <span className="block text-xs text-slate-500">{opt.description}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
                {selections[cls].size === 0 && (
                  <p className="mt-2 text-xs text-amber-300">Selecione ao menos um ativo desta classe.</p>
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
                const ids = Array.from(selections[cls])
                const classAmount = monthly * (percents[cls] / 100)
                const perAsset = classAmount / ids.length
                const options = optionsForClass(cls)
                return (
                  <div key={cls}>
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: ASSET_CLASS_COLORS[cls] }}>
                      {cls} — {percents[cls]}%
                    </div>
                    <ul className="space-y-1">
                      {ids.map((id) => {
                        const opt = options.find((o) => o.id === id)!
                        return (
                          <li key={id} className="flex items-center justify-between rounded-lg bg-slate-800/40 px-3 py-1.5 text-sm text-slate-300">
                            <span>{opt.name}</span>
                            <span className="text-slate-500">{formatBRL(perAsset)}/mês</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
            <div className="mb-3 text-sm font-medium text-slate-300">Projeção de crescimento (simulação educacional)</div>
            <GrowthChart points={points} />
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
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
