import { useMemo, useState } from 'react'
import { AlertTriangle, PiggyBank, Trash2, X } from 'lucide-react'
import type { CarteiraState } from '../../data/types'
import { ASSET_CLASSES, ASSET_CLASS_COLORS, formatBRL, simulateGrowth, type RiskTolerance } from '../../utils/finance'
import { GrowthChart } from '../PortfolioSimulator/GrowthChart'
import { PortfolioSimulator } from '../PortfolioSimulator/PortfolioSimulator'

export function MinhaCarteira({
  carteira,
  onClose,
  onRemoveItem,
  onSaveCarteira,
  onClearCarteira,
}: {
  carteira: CarteiraState | null
  onClose: () => void
  onRemoveItem: (itemId: string) => void
  onSaveCarteira: (carteira: CarteiraState) => void
  onClearCarteira: () => void
}) {
  const [showSimulator, setShowSimulator] = useState(false)
  const totalMonthly = useMemo(() => carteira?.items.reduce((sum, i) => sum + i.monthlyAmount, 0) ?? 0, [carteira])

  const percentByClass = useMemo(() => {
    if (!carteira || totalMonthly === 0) return {} as Record<string, number>
    const map: Record<string, number> = {}
    for (const item of carteira.items) {
      map[item.assetClass] = (map[item.assetClass] || 0) + item.monthlyAmount
    }
    for (const key of Object.keys(map)) map[key] = (map[key] / totalMonthly) * 100
    return map
  }, [carteira, totalMonthly])

  const points = useMemo(() => {
    if (!carteira) return []
    return simulateGrowth(carteira.initialAmount, carteira.monthlyContribution, carteira.years, (carteira.risk as RiskTolerance) || 'media')
  }, [carteira])

  return (
    <div className="flex h-full w-full flex-col bg-slate-950">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <PiggyBank size={18} className="text-emerald-400" /> Minha Carteira
        </h2>
        <div className="flex items-center gap-1">
          {carteira && carteira.items.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Limpar toda a Minha Carteira?')) onClearCarteira()
              }}
              className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-800 hover:text-rose-400"
            >
              Limpar carteira
            </button>
          )}
          <button onClick={onClose} className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {!carteira || carteira.items.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Monte sua carteira simulando abaixo o seu aporte e escolhendo seus investimentos.</p>
            <PortfolioSimulator
              onConfirm={(next) => {
                onSaveCarteira(next)
                setShowSimulator(false)
              }}
            />
          </div>
        ) : showSimulator ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowSimulator(false)}
              className="text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              ← Voltar para a carteira
            </button>
            <PortfolioSimulator
              onConfirm={(next) => {
                onSaveCarteira(next)
                setShowSimulator(false)
              }}
            />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <div className="rounded-lg border border-slate-700/50 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">Aporte mensal</div>
                <div className="text-slate-200">{formatBRL(carteira.monthlyContribution)}</div>
              </div>
              <div className="rounded-lg border border-slate-700/50 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">Patrimônio inicial</div>
                <div className="text-slate-200">{formatBRL(carteira.initialAmount)}</div>
              </div>
              <div className="rounded-lg border border-slate-700/50 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">Horizonte</div>
                <div className="text-slate-200">{carteira.years} anos</div>
              </div>
              <div className="rounded-lg border border-slate-700/50 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-500">Objetivo</div>
                <div className="text-slate-200">{carteira.objective}</div>
              </div>
            </div>

            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {ASSET_CLASSES.filter((c) => percentByClass[c] > 0).map((cls) => (
                <div key={cls} style={{ width: `${percentByClass[cls]}%`, backgroundColor: ASSET_CLASS_COLORS[cls] }} title={cls} />
              ))}
            </div>

            <div className="space-y-3">
              {ASSET_CLASSES.filter((cls) => carteira.items.some((i) => i.assetClass === cls)).map((cls) => (
                <div key={cls}>
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: ASSET_CLASS_COLORS[cls] }}>
                    {cls} — {(percentByClass[cls] ?? 0).toFixed(0)}%
                  </div>
                  <ul className="space-y-1.5">
                    {carteira.items
                      .filter((i) => i.assetClass === cls)
                      .map((item) => (
                        <li key={item.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm">
                          <span className="text-slate-200">
                            {item.name}
                            {item.ticker && item.ticker !== item.name && <span className="ml-1 text-xs text-slate-500">({item.ticker})</span>}
                          </span>
                          <span className="flex items-center gap-3">
                            <span className="text-slate-500">{formatBRL(item.monthlyAmount)}/mês</span>
                            <button onClick={() => onRemoveItem(item.id)} className="text-slate-600 hover:text-rose-400" aria-label={`Remover ${item.name}`}>
                              <Trash2 size={14} />
                            </button>
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>

            {points.length > 0 && (
              <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
                <div className="mb-3 text-sm font-medium text-slate-300">Projeção de crescimento (simulação educacional)</div>
                <GrowthChart points={points} />
              </div>
            )}

            <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-200">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-400" />
              <span>Carteira e projeção são simulações educacionais, não recomendações de investimento.</span>
            </div>

            <button
              onClick={() => setShowSimulator(true)}
              className="w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500"
            >
              Refazer simulação
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
