import type { Accessor, Component } from 'solid-js'

interface FiltersProps {
  search: Accessor<string>
  setSearch: (v: string) => void
  activeFilters: Accessor<Record<string, Set<string>>>
  setActiveFilters: (fn: (prev: Record<string, Set<string>>) => Record<string, Set<string>>) => void
  filterCategories: Accessor<Record<string, Set<string>>>
  filteredCount: Accessor<number>
  clearFilters: () => void
}

const Filters: Component<FiltersProps> = (props) => {
  const toggleFilter = (key: string, value: string) => {
    props.setActiveFilters(prev => {
      const next: Record<string, Set<string>> = { ...prev }
      if (!next[key]) next[key] = new Set()
      const set = new Set(next[key])
      if (set.has(value)) set.delete(value)
      else set.add(value)
      next[key] = set
      return next
    })
  }

  return (
    <section class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="mb-3">
        <input
          type="text"
          value={props.search()}
          onInput={e => props.setSearch(e.currentTarget.value)}
          placeholder="ค้นหา features..."
          class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div class="flex flex-wrap gap-4">
        {Object.entries(props.filterCategories()).map(([key, values]) => (
          <div class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{key}</span>
            <div class="flex flex-wrap gap-1">
              {Array.from(values).map(value => {
                const active = props.activeFilters()[key]?.has(value)
                return (
                  <button
                    onClick={() => toggleFilter(key, value)}
                    class={`rounded px-2 py-1 text-xs transition ${
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
        ))}
      </div>

      <div class="mt-3 flex items-center gap-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">แสดง {props.filteredCount()} รายการ</span>
        <button
          onClick={props.clearFilters}
          class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ล้าง filter
        </button>
      </div>
    </section>
  )
}

export default Filters
