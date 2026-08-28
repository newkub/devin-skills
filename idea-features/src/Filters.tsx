import { For } from 'solid-js'
import type { useFeatureApp } from './hooks/useFeatureApp'

type App = ReturnType<typeof useFeatureApp>

const filterLabels: Record<string, string> = { type: 'type', impact: 'impact', phase: 'phase', effort: 'effort', risk: 'risk' }

export default function Filters(props: { app: App }) {
  return (
    <div class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          value={props.app.search()}
          onInput={e => props.app.setSearch(e.currentTarget.value)}
          placeholder="ค้นหา features..."
          class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white md:w-80"
        />
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          แสดง {props.app.visibleFeatures().length} รายการ
          <button onClick={props.app.clearFilters} class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">ล้าง filter</button>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap gap-4 text-xs">
        <For each={Object.entries(props.app.filterCategories())}>
          {([key, values]) => (
            <div class="flex flex-col gap-1">
              <span class="font-medium text-gray-500 dark:text-gray-400">{filterLabels[key]}</span>
              <div class="flex flex-wrap gap-1">
                {Array.from(values).map(value => {
                  const active = props.app.activeFilters()[key]?.has(value)
                  return (
                    <button
                      onClick={() => props.app.toggleFilter(key, value)}
                      class={`rounded px-2 py-1 transition ${
                        active
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
