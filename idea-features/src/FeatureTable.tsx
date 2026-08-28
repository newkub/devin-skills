import { Show, createMemo } from 'solid-js'
import type { Component } from 'solid-js'
import FeatureGrid from './components/FeatureGrid'
import type { useFeatureApp } from './hooks/useFeatureApp'

type App = ReturnType<typeof useFeatureApp>

interface FeatureTableProps {
  app: App
}

const FeatureTable: Component<FeatureTableProps> = (props) => {
  const hasFilters = createMemo(() =>
    Object.values(props.app.activeFilters()).some(s => s.size > 0)
  )

  return (
    <section class="mt-4">
      <div class="mb-3 flex items-center justify-between">
        <div class="text-sm text-slate-500 dark:text-slate-400">
          แสดง <span class="font-semibold text-slate-900 dark:text-white">{props.app.visibleFeatures().length}</span> รายการ
        </div>
        <Show when={hasFilters()}>
          <button
            onClick={props.app.clearFilters}
            class="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ล้าง filter
          </button>
        </Show>
      </div>
      <FeatureGrid app={props.app} />
    </section>
  )
}

export default FeatureTable
