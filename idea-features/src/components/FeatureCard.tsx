import { Show } from 'solid-js'
import type { Component } from 'solid-js'
import type { Feature } from '../types'
import { Badge, impactIcon, riskColor, riskIcon, typeColor } from '../ui'

interface FeatureCardProps {
  feature: Feature
  selected: boolean
  onSelect: (id: number) => void
}

const FeatureCard: Component<FeatureCardProps> = (props) => {
  const f = () => props.feature

  return (
    <button
      type="button"
      onClick={() => props.onSelect(f().number)}
      class={`group w-full text-left flex flex-col gap-1.5 rounded-lg border bg-slate-800 p-3 transition focus:outline-none ${
        props.selected
          ? 'border-blue-400 ring-2 ring-blue-400/20'
          : 'border-slate-700 hover:border-slate-500'
      }`}
    >
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center gap-1.5">
          <Badge class={`${typeColor(f().type)} text-[10px]`}>{f().type[0]}</Badge>
          <span class="text-xs" title={`Impact: ${f().impact}`}>{impactIcon(f().impact)}</span>
          <span class="text-xs" title={`Risk: ${f().risk}`}>{riskIcon(f().risk)}</span>
        </div>
        <span class="font-mono text-[10px] text-slate-500">#{f().number}</span>
      </div>

      <h3 class="text-sm font-semibold leading-snug text-slate-100">
        {f().feature}
      </h3>
      <p class="line-clamp-2 text-xs leading-relaxed text-slate-400">
        {f().description}
      </p>

      <div class="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
        <Badge class={`${riskColor(f().risk)} text-[10px]`}>{f().risk}</Badge>
        <Badge class="bg-slate-700 text-slate-300 text-[10px]">⭐ {f().mvpScore}</Badge>
        <Show when={(f().tags || []).length > 0}>
          {(f().tags || []).slice(0, 2).map(t => (
            <Badge class="bg-slate-800 text-slate-400 text-[10px]">{t}</Badge>
          ))}
        </Show>
      </div>
    </button>
  )
}

export default FeatureCard
