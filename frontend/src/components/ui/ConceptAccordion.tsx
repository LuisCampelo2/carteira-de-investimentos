import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Concept } from '../../data/types'
import { ContentBlockView } from './ContentBlockView'

export function ConceptAccordion({ concept, defaultOpen = false, depth = 0 }: { concept: Concept; defaultOpen?: boolean; depth?: number }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={depth === 0 ? 'rounded-xl border border-slate-700/60 bg-slate-900/40' : 'rounded-lg border border-slate-700/40 bg-slate-900/30'}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className={depth === 0 ? 'font-semibold text-slate-100' : 'text-sm font-medium text-slate-200'}>{concept.title}</span>
        <ChevronDown size={16} className={`shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="animate-fade-in space-y-3 border-t border-slate-700/40 px-4 py-3">
          {concept.blocks.map((block, i) => (
            <ContentBlockView key={i} block={block} />
          ))}
          {concept.subConcepts && concept.subConcepts.length > 0 && (
            <div className="space-y-2 pt-1">
              {concept.subConcepts.map((sub) => (
                <ConceptAccordion key={sub.id} concept={sub} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
