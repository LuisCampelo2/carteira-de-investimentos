import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ChevronLeft, Coins, Download, PiggyBank, Plus, Trash2, X } from 'lucide-react'
import type { CarteiraState } from '../../data/types'
import {
  ASSET_CLASSES,
  ASSET_CLASS_COLORS,
  ANNUAL_RATE_BY_RISK,
  formatBRL,
  formatBRLExact,
  formatPaymentDate,
  simulatePortfolioGrowth,
  type RiskTolerance,
} from '../../utils/finance'

import { GrowthChart } from '../PortfolioSimulator/GrowthChart'
import { PortfolioSimulator } from '../PortfolioSimulator/PortfolioSimulator'

function CarteiraDetail({
  carteira,
  onBack,
  onEdit,
  onDelete,
  onRemoveItem,
}: {
  carteira: CarteiraState
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
  onRemoveItem: (itemId: string) => void
}) {
  const totalMonthly = useMemo(() => carteira.items.reduce((sum, i) => sum + i.monthlyAmount, 0), [carteira])

  const percentByClass = useMemo(() => {
    if (totalMonthly === 0) return {} as Record<string, number>
    const map: Record<string, number> = {}
    for (const item of carteira.items) {
      map[item.assetClass] = (map[item.assetClass] || 0) + item.monthlyAmount
    }
    for (const key of Object.keys(map)) map[key] = (map[key] / totalMonthly) * 100
    return map
  }, [carteira, totalMonthly])

  const incomeSummary = useMemo(() => {
    let total = 0
    let withData = 0
    let withoutData = 0
    for (const item of carteira.items) {
      if (item.expectedIncome != null) {
        total += item.expectedIncome
        withData++
      } else {
        withoutData++
      }
    }
    return { total, withData, withoutData }
  }, [carteira])

  // Taxa média exibida no resumo — calculada quando a carteira foi montada
  // (ver portfolioAnnualRate no PortfolioSimulator); carteiras salvas antes
  // dessa funcionalidade não têm esse dado, então caem de volta na taxa
  // hipotética do risco.
  const effectiveRatePercent = useMemo(
    () => carteira.estimatedAnnualRate ?? ANNUAL_RATE_BY_RISK[(carteira.risk as RiskTolerance) || 'media'] * 100,
    [carteira],
  )

  // A projeção em si assume que você repete TODO mês a mesma compra (mesmos
  // ativos, mesma quantidade salva na carteira) — um stream por item, cada
  // um rendendo à sua própria taxa (real quando o item tem uma, senão a
  // hipotética do risco). Qualquer sobra do aporte mensal que não corresponde
  // a nenhum item salvo também vira um stream à taxa hipotética.
  const points = useMemo(() => {
    const fallbackRate = ANNUAL_RATE_BY_RISK[(carteira.risk as RiskTolerance) || 'media']
    const streams = carteira.items.map((item) => ({
      monthlyAmount: item.monthlyAmount,
      annualRate: (item.estimatedAnnualRate ?? fallbackRate * 100) / 100,
    }))
    const leftover = carteira.monthlyContribution - totalMonthly
    if (leftover > 0.005) streams.push({ monthlyAmount: leftover, annualRate: fallbackRate })
    return simulatePortfolioGrowth(carteira.initialAmount, fallbackRate, carteira.years, streams)
  }, [carteira, totalMonthly])

  return (
    <div className="space-y-4">
      <div className="no-print flex items-center justify-between gap-2">
        <button onClick={onBack} className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-200">
          <ChevronLeft size={14} /> Todas as carteiras
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => window.print()}
            className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
            aria-label="Baixar carteira em PDF"
            title="Baixar carteira em PDF"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => {
              if (confirm(`Excluir a carteira "${carteira.name}"?`)) onDelete()
            }}
            className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-800 hover:text-rose-400"
          >
            Excluir carteira
          </button>
        </div>
      </div>

      <div className="print-area space-y-5">
        <h3 className="text-base font-semibold text-slate-100 print:text-slate-900">
          {carteira.name} <span className="hidden font-normal text-slate-500 print:inline">— {new Date().toLocaleDateString('pt-BR')}</span>
        </h3>
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
            <div className="text-[11px] uppercase tracking-wide text-slate-500">Taxa usada na projeção</div>
            <div className="text-slate-200">≈{effectiveRatePercent.toFixed(1).replace('.', ',')}% a.a.</div>
          </div>
        </div>
        {carteira.estimatedAnnualRate != null && (
          <p className="text-xs text-slate-500">
            {(carteira.estimatedAnnualRateCoverage ?? 0) > 0.5
              ? `Baseada no rendimento real de ${(carteira.estimatedAnnualRateCoverage ?? 0).toFixed(0)}% da carteira (dividendos/proventos dos ativos escolhidos)${
                  (carteira.estimatedAnnualRateCoverage ?? 0) < 99.5
                    ? ', misturada com uma taxa hipotética de mercado para o restante.'
                    : '.'
                }`
              : 'Sem dado real de rendimento para os ativos escolhidos — usando uma taxa hipotética de mercado.'}{' '}
            Não inclui valorização/desvalorização do preço dos ativos, só o rendimento.
          </p>
        )}

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
                    <li key={item.id} className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200">
                          {item.name}
                          {item.ticker && item.ticker !== item.name && <span className="ml-1 text-xs text-slate-500">({item.ticker})</span>}
                          {item.quantity != null && item.quantity > 1 && <span className="ml-1 text-xs text-slate-500">×{item.quantity}</span>}
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="text-slate-500">{formatBRLExact(item.monthlyAmount)}/mês</span>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="no-print text-slate-600 hover:text-rose-400"
                            aria-label={`Remover ${item.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </span>
                      </div>
                      {item.expectedIncome != null && (
                        <div className="mt-0.5 text-xs text-emerald-400">
                          Recebe ≈ {formatBRLExact(item.expectedIncome)}
                          {item.expectedIncomeNote ? ` (${item.expectedIncomeNote})` : ''}
                        </div>
                      )}
                      {item.rendaFixaTipo && item.estimatedAnnualRate != null && (
                        <div className="mt-0.5 text-xs text-slate-500">≈{item.estimatedAnnualRate.toFixed(1).replace('.', ',')}% a.a. usado na projeção</div>
                      )}
                      {item.rendaFixaVencimento && (
                        <div className="mt-0.5 text-xs text-slate-500">Vencimento: {formatPaymentDate(item.rendaFixaVencimento)}</div>
                      )}
                      {item.rendaFixaAvisos && item.rendaFixaAvisos.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.rendaFixaAvisos.map((aviso) => (
                            <span key={aviso} className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-300">
                              {aviso}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        {incomeSummary.withData > 0 && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-emerald-300">
              <Coins size={14} /> Proventos esperados
            </div>
            <div className="text-2xl font-bold text-emerald-400">{formatBRLExact(incomeSummary.total)}</div>
            <p className="mt-1 text-xs text-emerald-200/80">
              Soma do próximo pagamento (ações) ou estimativa mensal (FIIs) de {incomeSummary.withData}{' '}
              {incomeSummary.withData === 1 ? 'ativo com dado real' : 'ativos com dado real'} de mercado.
              {incomeSummary.withoutData > 0 &&
                ` Não inclui ${incomeSummary.withoutData} ${incomeSummary.withoutData === 1 ? 'ativo sem' : 'ativos sem'} dado real disponível.`}
            </p>
          </div>
        )}

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
          onClick={onEdit}
          className="no-print w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500"
        >
          Refazer simulação
        </button>
      </div>
    </div>
  )
}

export function MinhaCarteira({
  carteiras,
  loading,
  selectedId,
  onSelectCarteira,
  onClose,
  onRemoveItem,
  onCreateCarteira,
  onUpdateCarteira,
  onDeleteCarteira,
}: {
  carteiras: CarteiraState[]
  loading: boolean
  /** Which carteira's detail is open — lives in the URL (/carteira/:id) at
   * the App level, not local state, so F5/back-forward/sharing a link work. */
  selectedId: number | null
  onSelectCarteira: (id: number | null) => void
  onClose: () => void
  onRemoveItem: (carteiraId: number, itemId: string) => void
  onCreateCarteira: (next: Omit<CarteiraState, 'id'>) => Promise<CarteiraState>
  onUpdateCarteira: (id: number, next: Omit<CarteiraState, 'id'>) => Promise<CarteiraState>
  onDeleteCarteira: (id: number) => void
}) {
  const [wizardMode, setWizardMode] = useState<'new' | 'edit' | null>(null)

  const selected = selectedId != null ? carteiras.find((c) => c.id === selectedId) : undefined
  // A carteira selecionada pode ter sido apagada em outra sessão/aba — some da lista sem travar a tela.
  useEffect(() => {
    if (selectedId != null && !loading && !selected) onSelectCarteira(null)
  }, [selectedId, loading, selected, onSelectCarteira])

  return (
    <div className="flex h-full w-full flex-col bg-slate-950">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <PiggyBank size={18} className="text-emerald-400" /> Minha Carteira
        </h2>
        <div className="no-print flex items-center gap-1">
          {!wizardMode && !selected && carteiras.length > 0 && (
            <button
              onClick={() => setWizardMode('new')}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              <Plus size={14} /> Nova carteira
            </button>
          )}
          <button onClick={onClose} className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {loading ? (
          <p className="text-sm text-slate-500">Carregando...</p>
        ) : wizardMode === 'new' ? (
          <div className="space-y-4">
            {carteiras.length > 0 && (
              <button onClick={() => setWizardMode(null)} className="text-xs font-medium text-slate-400 hover:text-slate-200">
                ← Cancelar
              </button>
            )}
            <p className="text-sm text-slate-400">Monte sua carteira simulando abaixo o seu aporte e escolhendo seus investimentos.</p>
            <PortfolioSimulator
              onConfirm={(next) => {
                onCreateCarteira(next).then(() => setWizardMode(null))
              }}
            />
          </div>
        ) : wizardMode === 'edit' && selected ? (
          <div className="space-y-4">
            <button onClick={() => setWizardMode(null)} className="text-xs font-medium text-slate-400 hover:text-slate-200">
              ← Voltar para "{selected.name}"
            </button>
            <PortfolioSimulator
              defaultName={selected.name}
              onConfirm={(next) => {
                onUpdateCarteira(selected.id, next).then(() => setWizardMode(null))
              }}
            />
          </div>
        ) : selected ? (
          <CarteiraDetail
            carteira={selected}
            onBack={() => onSelectCarteira(null)}
            onEdit={() => setWizardMode('edit')}
            onDelete={() => {
              onDeleteCarteira(selected.id)
              onSelectCarteira(null)
            }}
            onRemoveItem={(itemId) => onRemoveItem(selected.id, itemId)}
          />
        ) : carteiras.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Monte sua carteira simulando abaixo o seu aporte e escolhendo seus investimentos.</p>
            <PortfolioSimulator onConfirm={(next) => onCreateCarteira(next)} />
          </div>
        ) : (
          <div className="space-y-2">
            {carteiras.map((c) => {
              const income = c.items.reduce((sum, i) => sum + (i.expectedIncome ?? 0), 0)
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCarteira(c.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-700/60 bg-slate-900/40 px-4 py-3 text-left transition-colors hover:border-sky-500"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-200">{c.name}</div>
                    <div className="text-xs text-slate-500">
                      {formatBRL(c.monthlyContribution)}/mês · {c.years} anos · {c.items.length} {c.items.length === 1 ? 'ativo' : 'ativos'}
                    </div>
                  </div>
                  {income > 0 && <div className="shrink-0 text-sm font-medium text-emerald-400">{formatBRLExact(income)}</div>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
