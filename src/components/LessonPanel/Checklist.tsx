import { useEffect, useState } from 'react'
import { ListChecks } from 'lucide-react'

export function Checklist({ aulaId, items }: { aulaId: string; items: string[] }) {
  const storageKey = `mmi:checklist:${aulaId}`
  const [checked, setChecked] = useState<boolean[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) return JSON.parse(raw)
    } catch {
      // ignore
    }
    return items.map(() => false)
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked))
  }, [checked, storageKey])

  const toggle = (i: number) => {
    setChecked((prev) => prev.map((c, idx) => (idx === i ? !c : c)))
  }

  const doneCount = checked.filter(Boolean).length

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <ListChecks size={16} className="text-emerald-400" />
          Checklist de análise
        </div>
        <span className="text-xs text-slate-500">{doneCount}/{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <label key={i} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={checked[i] ?? false}
              onChange={() => toggle(i)}
              className="h-4 w-4 shrink-0 rounded border-slate-600 bg-slate-800 accent-emerald-500"
            />
            <span className={checked[i] ? 'text-slate-500 line-through' : ''}>{item}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
