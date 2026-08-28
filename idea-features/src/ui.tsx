import type { Component } from 'solid-js'

export const impactColor = (impact: string) => {
  if (impact === 'สูง') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
  if (impact === 'กลาง') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
  return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
}

export const riskColor = (risk: string) => {
  if (risk === 'สูง') return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300'
  if (risk === 'กลาง') return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300'
  return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300'
}

export const Badge: Component<{ children: any; class?: string }> = (props) => (
  <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${props.class || ''}`}>
    {props.children}
  </span>
)

export const Card: Component<{ title: string; value: string | number; class?: string }> = (props) => (
  <div class={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${props.class || ''}`}>
    <div class="text-sm text-gray-500 dark:text-gray-400">{props.title}</div>
    <div class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{props.value}</div>
  </div>
)
