import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { api } from '../../utils/api'

interface RefreshResult {
  updated: string[]
  errors: string[]
  refreshedAt: string
}

export function RefreshPricesButton({ onRefreshed }: { onRefreshed: () => Promise<unknown> | unknown }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RefreshResult | null>(null)

  const handleClick = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await api.post<RefreshResult>('/api/market-data/refresh')
      setResult(res)
      await onRefreshed()
    } catch {
      setResult({ updated: [], errors: ['Não foi possível conectar com o servidor.'], refreshedAt: new Date().toISOString() })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex w-fit items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Atualizando preços...' : 'Atualizar preços'}
      </button>
      {result && (
        <div className="max-w-md text-xs">
          {result.updated.length > 0 && <p className="text-emerald-400">Atualizado: {result.updated.join(' · ')}.</p>}
          {result.errors.map((e, i) => (
            <p key={i} className="text-amber-400">
              {e}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
