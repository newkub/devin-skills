import { For, Show } from 'solid-js'
import type { useFeatureApp } from './hooks/useFeatureApp'

type App = ReturnType<typeof useFeatureApp>

const filterLabels: Record<string, string> = { type: 'Type', impact: 'Impact', phase: 'Phase', effort: 'Effort', risk: 'Risk' }

export default function Filters(props: { app: App }) {
  const activeFilterCount = () =>
    Object.values(props.app.activeFilters()).reduce((sum, set) => sum + set.size, 0)

  return (
    <div class="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div class="relative w-full md:max-w-md">
          <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
          <input
            type="text"
            value={props.app.search()}
            onInput={e => props.app.setSearch(e.currentTarget.value)}
            placeholder="ค้นหา features, tags, หรือรายละเอียด..."
            class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-900"
          />
        </div>
        <div class="flex items-center gap-3 text-sm">
          <span class="text-slate-500 dark:text-slate-400">แสดง <span class="font-semibold text-slate-900 dark:text-white">{props.app.visibleFeatures().length}</span> รายการ</span>
          <Show when={activeFilterCount() > 0 || props.app.search()}>
            <button
              onClick={props.app.clearFilters}
              class="rounded-lg px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              ล้าง filter ({activeFilterCount() + (props.app.search() ? 1 : 0)})
            </button>
          </Show>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-5 text-xs">
        <For each={Object.entries(props.app.filterCategories())}>
          {([key, values]) => (
            <div class="flex flex-col gap-1.5">
              <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{filterLabels[key]}</span>
              <div class="flex flex-wrap gap-1.5">
                {Array.from(values).map(value => {
                  const active = props.app.activeFilters()[key]?.has(value)
                  return (
                    <button
                      onClick={() => props.app.toggleFilter(key, value)}
                      class={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                        active
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white'
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
