import type { Component, JSX } from 'solid-js'

export const typeColor = (type: string) => {
  if (type === 'Extends') return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-900/50'
  return 'bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:ring-purple-900/50'
}

export const phaseColor = (phase: string) => {
  if (phase === 'MVP') return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:ring-indigo-900/50'
  if (phase === 'v2') return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-900/50'
  return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600'
}

export const effortColor = (effort: string) => {
  if (effort === 'S') return 'bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/50'
  if (effort === 'M') return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-900/50'
  if (effort === 'L') return 'bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:ring-orange-900/50'
  return 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-900/50'
}

export const impactColor = (impact: string) => {
  if (impact === 'สูง') return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-900/50'
  if (impact === 'กลาง') return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-900/50'
  return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-900/50'
}

export const impactIcon = (impact: string) => {
  if (impact === 'สูง') return '🔥'
  if (impact === 'กลาง') return '⚡'
  return '🌱'
}

export const riskColor = (risk: string) => {
  if (risk === 'สูง') return 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-900/50'
  if (risk === 'กลาง') return 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:ring-yellow-900/50'
  return 'bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-900/50'
}

export const riskIcon = (risk: string) => {
  if (risk === 'สูง') return '⚠'
  if (risk === 'กลาง') return '⛅'
  return '✓'
}

export const Badge: Component<{ children: JSX.Element; class?: string }> = (props) => (
  <span class={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${props.class || ''}`}>
    {props.children}
  </span>
)
