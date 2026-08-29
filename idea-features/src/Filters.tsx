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
            class="w-full rounded-lg border border-border bg-surface py-2 px-3 text-sm text-surface-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
          />
        </div>

        <div class="flex items-center gap-2">
          <select
            value={props.app.sortBy()}
            onInput={e => setSort(e.currentTarget.value)}
            class="rounded-lg border border-border bg-surface px-2 py-2 text-xs text-surface-foreground focus:border-ring focus:outline-none"
          >
            <For each={sortOptions}>
              {opt => <option value={opt.key}>Sort: {opt.label}</option>}
            </For>
          </select>
          <span class="rounded-md border border-border bg-muted px-2 py-1.5 text-xs text-muted-foreground">
            {props.app.visibleFeatures().length}
          </span>
          <Show when={activeCount() > 0 || props.app.search()}>
            <button
              onClick={props.app.clearFilters}
              class="text-xs font-medium text-muted-foreground hover:text-surface-foreground"
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
              <span class="text-[10px] font-medium uppercase text-muted-foreground">{filterLabels[key]}</span>
              {Array.from(values).map(value => (
                <button
                  onClick={() => props.app.toggleFilter(key, value)}
                  class={`rounded-full px-2.5 py-1 text-[10px] font-medium transition ${
                    isActive(key, value)
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-surface text-muted-foreground hover:border-border-hover hover:text-surface-foreground'
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
