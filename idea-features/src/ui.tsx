import type { Component } from 'solid-js'

export const impactColor = (impact: string) => {
  if (impact === 'สูง') return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-900/50'
  if (impact === 'กลาง') return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-900/50'
  return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-900/50'
}

export const riskColor = (risk: string) => {
  if (risk === 'สูง') return 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-900/50'
  if (risk === 'กลาง') return 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:ring-yellow-900/50'
  return 'bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/50'
}

export const Badge: Component<{ children: any; class?: string }> = (props) => (
  <span class={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${props.class || ''}`}>
    {props.children}
  </span>
)

export const Card: Component<{ title: string; value: string | number; class?: string }> = (props) => (
  <div class={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${props.class || ''}`}>
    <div class="text-xs font-medium text-slate-500 dark:text-slate-400">{props.title}</div>
    <div class="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{props.value}</div>
  </div>
)
