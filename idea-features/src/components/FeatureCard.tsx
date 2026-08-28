import { Show } from 'solid-js'
import type { Component } from 'solid-js'
import type { Feature } from '../types'
import { Badge, impactColor, impactAccentColor, impactIcon, riskColor, riskIcon, phaseColor, effortColor, typeColor } from '../ui'

interface FeatureCardProps {
  feature: Feature
  selected: boolean
  onToggleSelect: (id: number) => void
  onHover: (id: number | null) => void
}

const FeatureCard: Component<FeatureCardProps> = (props) => {
  const f = () => props.feature

  return (
    <div
      class={`group relative flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 ${impactAccentColor(f().impact)} border-t-4`}
      onMouseEnter={() => props.onHover(f().number)}
      onMouseLeave={() => props.onHover(null)}
    >
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            checked={props.selected}
            onClick={(e) => { e.stopPropagation(); props.onToggleSelect(f().number) }}
            class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
          />
          <span class="font-mono text-xs text-slate-400 dark:text-slate-500">#{f().number}</span>
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          <Badge class={typeColor(f().type)}>{f().type[0]}</Badge>
          <Badge class={`${impactColor(f().impact)} gap-0.5`}><span>{impactIcon(f().impact)}</span>{f().impact}</Badge>
          <Badge class={`${riskColor(f().risk)} gap-0.5`}><span>{riskIcon(f().risk)}</span>{f().risk}</Badge>
        </div>
      </div>

      <h3 class="pr-6 text-sm font-semibold leading-snug text-slate-900 dark:text-white">
        {f().feature}
      </h3>
      <p class="line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        {f().description}
      </p>

      <div class="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
        <Badge class={phaseColor(f().phase)}>🚀 {f().phase}</Badge>
        <Badge class={effortColor(f().effort)}>📊 {f().effort}</Badge>
        <Badge class="bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600">⭐ {f().mvpScore}</Badge>
        {(f().tags || []).slice(0, 3).map(t => (
          <Badge class="bg-slate-50 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">🏷 {t}</Badge>
        ))}
      </div>

      <div class="absolute right-3 top-3 opacity-0 transition group-hover:opacity-100">
        <span class="text-lg text-slate-400 dark:text-slate-500">🔍</span>
      </div>
    </div>
  )
}

export default FeatureCard
