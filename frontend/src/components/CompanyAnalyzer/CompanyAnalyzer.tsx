import { useEffect, useState } from 'react'
import { AlertTriangle, Building2, CheckCircle2, CircleAlert, XCircle } from 'lucide-react'
import { useCompanies } from '../../hooks/useCompanies'
import { RefreshPricesButton } from '../ui/RefreshPricesButton'
import type { Company } from '../../data/types'

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-slate-700/50 bg-slate-900/40 px-3 py-2">
      <span className="text-[11px] uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-sm text-slate-200">{value}</span>
    </div>
  )
}

function CompanyDetail({ company }: { company: Company }) {
  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-semibold text-slate-100">{company.name}</h4>
          <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-xs font-mono text-slate-300">{company.ticker}</span>
        </div>
        <p className="text-xs text-slate-500">{company.sector}</p>
      </div>

      <div className="space-y-2 text-sm text-slate-300">
        <p><span className="font-medium text-slate-200">O que a empresa faz? </span>{company.whatItDoes}</p>
        <p><span className="font-medium text-slate-200">Como ganha dinheiro? </span>{company.howItMakesMoney}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {company.priceApprox && <StatRow label="Preço aproximado" value={company.priceApprox} />}
        {company.payoutFrequency && <StatRow label="Frequência de pagamento" value={company.payoutFrequency} />}
        <StatRow label="Receita" value={company.revenue} />
        <StatRow label="Lucro" value={company.profit} />
        <StatRow label="Margem" value={company.margin} />
        <StatRow label="ROE" value={company.roe} />
        <StatRow label="Dívida" value={company.debt} />
        <StatRow label="Fluxo de caixa" value={company.cashFlow} />
        <StatRow label="P/L" value={company.pl} />
        <StatRow label="P/VP" value={company.pvp} />
        <StatRow label="Dividend Yield" value={company.dividendYield} />
        <StatRow label="Crescimento" value={company.growth} />
      </div>

      <div>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Riscos</span>
        <ul className="mt-1.5 space-y-1">
          {company.risks.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-300">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-slate-300"><span className="font-medium text-slate-200">Perspectivas: </span>{company.outlook}</p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            <CheckCircle2 size={14} /> Pontos positivos
          </div>
          <ul className="mt-1.5 space-y-1">
            {company.positives.map((p, i) => (
              <li key={i} className="text-xs text-emerald-100/90">{p}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-300">
            <CircleAlert size={14} /> Pontos de atenção
          </div>
          <ul className="mt-1.5 space-y-1">
            {company.attention.map((p, i) => (
              <li key={i} className="text-xs text-amber-100/90">{p}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-rose-300">
            <XCircle size={14} /> Riscos
          </div>
          <ul className="mt-1.5 space-y-1">
            {company.dangers.map((p, i) => (
              <li key={i} className="text-xs text-rose-100/90">{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-1.5 rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 py-2.5 text-sm text-slate-300">
        <p><span className="font-medium text-slate-200">Empresa de qualidade? </span>{company.qualitySummary}</p>
        <p><span className="font-medium text-slate-200">Preço parece razoável? </span>{company.priceSummary}</p>
      </div>

      <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-200">
        <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-400" />
        <span>
          Preço, P/L e Dividend Yield são valores aproximados pesquisados em ago/2026 — não são cotações em tempo real e mudam
          diariamente. Rentabilidade passada não garante rentabilidade futura. Não constituem recomendação de investimento.
        </span>
      </div>
    </div>
  )
}

export function CompanyAnalyzer() {
  const { companies, loading, refetch } = useCompanies()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedId && companies.length > 0) setSelectedId(companies[0].id)
  }, [companies, selectedId])

  const selected = companies.find((e) => e.id === selectedId)

  if (loading) {
    return <p className="text-sm text-slate-400">Carregando empresas...</p>
  }

  if (!selected) {
    return <p className="text-sm text-slate-400">Nenhuma empresa cadastrada.</p>
  }

  return (
    <div className="space-y-4">
      <RefreshPricesButton onRefreshed={refetch} />

      <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
        <Building2 size={16} />
        Selecione uma empresa
      </div>
      <div className="flex flex-wrap gap-2">
        {companies.map((company) => (
          <button
            key={company.id}
            onClick={() => setSelectedId(company.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedId === company.id
                ? 'border-sky-500 bg-sky-500/20 text-sky-200'
                : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            {company.name}
          </button>
        ))}
      </div>
      <CompanyDetail company={selected} />
    </div>
  )
}
