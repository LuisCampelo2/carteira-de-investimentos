import { useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { searchAll } from '../../utils/search'

export function SearchBar({ onSelect }: { onSelect: (aulaId: string, conceptId: string) => void }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => searchAll(query), [query])

  const clear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className="relative min-w-0 flex-1 sm:max-w-sm">
      <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5">
        <Search size={15} className="shrink-0 text-slate-500" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Pesquisar conceitos (ex: P/L)"
          className="w-full min-w-0 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
        />
        {query && (
          <button onClick={clear} className="shrink-0 text-slate-500 hover:text-slate-300">
            <X size={14} />
          </button>
        )}
      </div>

      {focused && query && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-80 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 shadow-2xl">
          {results.length === 0 ? (
            <div className="px-3 py-3 text-sm text-slate-500">Nenhum resultado encontrado.</div>
          ) : (
            results.map((r) => (
              <button
                key={`${r.aulaId}-${r.conceptId}`}
                onMouseDown={() => onSelect(r.aulaId, r.conceptId)}
                className="block w-full border-b border-slate-800 px-3 py-2.5 text-left last:border-0 hover:bg-slate-800/60"
              >
                <div className="text-[11px] uppercase tracking-wide text-slate-500">
                  {r.aulaEmoji} {r.aulaTitle}
                </div>
                <div className="text-sm font-medium text-slate-200">{r.conceptTitle}</div>
                <div className="mt-0.5 truncate text-xs text-slate-500">{r.snippet}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
