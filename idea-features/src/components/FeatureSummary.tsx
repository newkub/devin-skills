import { For } from 'solid-js'
import type { Feature } from '../types'
import { Badge, typeColor, impactColor, riskColor, phaseColor, effortColor } from '../ui'

interface FeatureSummaryProps {
  feature: Feature
}

export default function FeatureSummary(props: FeatureSummaryProps) {
  const f = () => props.feature
  return (
    <section class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
      <h4 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        <span>📋</span> สรุป feature นี้
      </h4>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div class="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
          <span class="text-[10px] font-semibold uppercase text-slate-400">Type</span>
          <Badge class={typeColor(f().type)}>{f().type}</Badge>
        </div>
        <div class="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
          <span class="text-[10px] font-semibold uppercase text-slate-400">Impact</span>
          <Badge class={impactColor(f().impact)}>{f().impact}</Badge>
        </div>
        <div class="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
          <span class="text-[10px] font-semibold uppercase text-slate-400">Phase</span>
          <Badge class={phaseColor(f().phase)}>{f().phase}</Badge>
        </div>
        <div class="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
          <span class="text-[10px] font-semibold uppercase text-slate-400">Effort</span>
          <Badge class={effortColor(f().effort)}>{f().effort}</Badge>
        </div>
        <div class="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
          <span class="text-[10px] font-semibold uppercase text-slate-400">MVP</span>
          <span class="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">{f().mvpScore}<span class="text-xs text-slate-400">/10</span></span>
        </div>
        <div class="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
          <span class="text-[10px] font-semibold uppercase text-slate-400">Risk</span>
          <Badge class={riskColor(f().risk)}>{f().risk}</Badge>
        </div>
      </div>
      <div class="mt-3 flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
        <span class="text-[10px] font-semibold uppercase text-slate-400">Tags</span>
        <div class="flex flex-wrap gap-1">
          <For each={f().tags}>
            {tag => <Badge class="bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600">{tag}</Badge>}
          </For>
        </div>
      </div>
    </section>
  )
}
