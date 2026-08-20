import type { ProjectionPoint } from '../../utils/finance'
import { formatBRL } from '../../utils/finance'

export function GrowthChart({ points }: { points: ProjectionPoint[] }) {
  const width = 560
  const height = 220
  const padding = { top: 16, right: 12, bottom: 24, left: 12 }

  const maxValue = Math.max(...points.map((p) => p.projected), 1)
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const xFor = (i: number) => padding.left + (i / (points.length - 1 || 1)) * innerW
  const yFor = (v: number) => padding.top + innerH - (v / maxValue) * innerH

  const projectedPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(p.projected)}`).join(' ')
  const investedPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(p.invested)}`).join(' ')
  const areaPath = `${projectedPath} L ${xFor(points.length - 1)} ${yFor(0)} L ${xFor(0)} ${yFor(0)} Z`

  const last = points[points.length - 1]

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Projeção de crescimento do patrimônio">
        <defs>
          <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-1)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-brand-1)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#growthFill)" stroke="none" />
        <path d={investedPath} fill="none" stroke="var(--color-border-subtle)" strokeWidth={2} strokeDasharray="4 4" />
        <path d={projectedPath} fill="none" stroke="var(--color-brand-1)" strokeWidth={2.5} />
        {points.map((p, i) => (
          <circle key={i} cx={xFor(i)} cy={yFor(p.projected)} r={2.5} fill="var(--color-brand-1)" />
        ))}
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-3 rounded bg-[var(--color-brand-1)]" /> Projeção com rendimento
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-3 rounded border-t-2 border-dashed border-slate-500" /> Total aportado
          </span>
        </div>
        <span>
          Em {last.year} anos: <span className="font-semibold text-slate-200">{formatBRL(last.projected)}</span>
        </span>
      </div>
    </div>
  )
}
