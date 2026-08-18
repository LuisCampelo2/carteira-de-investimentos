import { AlertTriangle, Quote } from 'lucide-react'
import type { ContentBlock } from '../../data/types'

export function ContentBlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return <p className="text-sm leading-relaxed text-slate-300">{block.text}</p>

    case 'quote':
      return (
        <blockquote className="flex gap-2 rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-2.5 text-sm italic text-slate-200">
          <Quote size={16} className="mt-0.5 shrink-0 text-slate-500" />
          <span>{block.text}</span>
        </blockquote>
      )

    case 'warning':
      return (
        <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-200">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
          <span>{block.text}</span>
        </div>
      )

    case 'formula':
      return (
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2.5">
          <code className="font-mono text-sm text-indigo-200">{block.formula}</code>
          {block.description && <p className="mt-1 text-xs text-slate-400">{block.description}</p>}
        </div>
      )

    case 'example':
      return (
        <div className="overflow-hidden rounded-lg border border-slate-700/60 bg-black/30">
          {block.title && (
            <div className="border-b border-slate-700/60 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
              {block.title}
            </div>
          )}
          <pre className="overflow-x-auto whitespace-pre-wrap px-3 py-2.5 font-mono text-xs leading-relaxed text-emerald-300">
            {block.code}
          </pre>
        </div>
      )

    case 'list':
      return (
        <ul className="space-y-1.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-300">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'table':
      return (
        <div className="overflow-x-auto rounded-lg border border-slate-700/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/60">
                {block.headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 text-left font-medium text-slate-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-slate-700/60">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-slate-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'compare':
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {block.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-2.5">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</div>
              <div className="mt-1 text-sm text-slate-300">{item.text}</div>
            </div>
          ))}
        </div>
      )

    default:
      return null
  }
}
