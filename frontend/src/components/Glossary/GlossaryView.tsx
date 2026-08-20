import { useMemo, useState } from 'react'
import { BookOpen, Search, X } from 'lucide-react'
import { glossario } from '../../data/glossario'

export function GlossaryView({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return glossario
    return glossario.filter((t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="flex h-full w-full flex-col bg-slate-950">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <BookOpen size={18} className="text-sky-400" /> Glossário
        </h2>
        <button onClick={onClose} className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200">
          <X size={18} />
        </button>
      </div>

      <div className="border-b border-slate-800 px-5 py-3">
        <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5">
          <Search size={14} className="text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar termo..."
            className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-5 py-4">
        {filtered.map((t) => (
          <div key={t.term} className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2.5">
            <div className="text-sm font-semibold text-slate-100">{t.term}</div>
            <div className="mt-0.5 text-sm text-slate-400">{t.definition}</div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-slate-500">Nenhum termo encontrado.</p>}
      </div>
    </div>
  )
}
