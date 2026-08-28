import { For, Show, createMemo } from 'solid-js'
import type { useFeatureApp } from './hooks/useFeatureApp'

type App = ReturnType<typeof useFeatureApp>

const filterLabels: Record<string, string> = { type: 'Type', impact: 'Impact', phase: 'Phase', effort: 'Effort', risk: 'Risk' }

const sortOptions: { key: 'impact' | 'mvpScore' | 'number' | 'feature'; label: string }[] = [
  { key: 'impact', label: 'Impact' },
  { key: 'mvpScore', label: 'MVP' },
  { key: 'number', label: '#' },
  { key: 'feature', label: 'Name' },
]

interface FiltersProps {
  app: App
}

export default function Filters(props: FiltersProps) {
  const activeCount = createMemo(() =>
    Object.values(props.app.activeFilters()).reduce((sum, set) => sum + set.size, 0)
  )

  const isActive = (key: string, value: string) => props.app.activeFilters()[key]?.has(value)

  const setSort = (key: string) => {
    if (props.app.sortBy() === key) {
      props.app.setSortDesc(!props.app.sortDesc())
    } else {
      props.app.setSortBy(key as 'impact' | 'mvpScore' | 'number' | 'feature')
      props.app.setSortDesc(true)
    }
  }

  return (
    <div class="mb-4 space-y-3">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative w-full sm:max-w-sm">
          <input
            type="text"
            value={props.app.search()}
            onInput={e => props.app.setSearch(e.currentTarget.value)}
            placeholder="Search features, tags, or details..."
            class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div class="flex items-center gap-2">
          <select
            value={props.app.sortBy()}
            onInput={e => setSort(e.currentTarget.value)}
            class="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <For each={sortOptions}>
              {opt => <option value={opt.key}>Sort: {opt.label}</option>}
            </For>
          </select>
          <span class="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            {props.app.visibleFeatures().length}
          </span>
          <Show when={activeCount() > 0 || props.app.search()}>
            <button
              onClick={props.app.clearFilters}
              class="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Clear
            </button>
          </Show>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 text-xs">
        <For each={Object.entries(props.app.filterCategories())}>
          {([key, values]) => (
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-medium uppercase text-slate-400">{filterLabels[key]}</span>
              {Array.from(values).map(value => (
                <button
                  onClick={() => props.app.toggleFilter(key, value)}
                  class={`rounded-full px-2.5 py-1 text-[10px] font-medium transition ${
                    isActive(key, value)
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
