import { For, Show } from 'solid-js'
import type { Feature } from '../types'
import { Badge, impactColor, riskColor } from '../ui'
import type { GroupKey, SortKey } from '../hooks/useFeatureApp'

interface FeatureListProps {
  grouped: { key: string; label: string; features: Feature[] }[]
  selectedIds: Set<number>
  selectedDetailId: number | null
  search: string
  setSearch: (v: string) => void
  groupBy: GroupKey
  setGroupBy: (v: GroupKey) => void
  sortBy: SortKey
  setSortBy: (v: SortKey) => void
  sortDesc: boolean
  setSortDesc: (v: boolean) => void
  activeFilters: Record<string, Set<string>>
  filterCategories: Record<string, Set<string>>
  toggleFilter: (key: string, value: string) => void
  clearFilters: () => void
  toggleSelect: (id: number) => void
  setSelectedDetail: (id: number) => void
  counts: { all: number; selected: number; mvp: number; high: number }
}

export default function FeatureList(props: FeatureListProps) {
  const groupOptions: { value: GroupKey; label: string }[] = [
    { value: 'none', label: 'ไม่ group' },
    { value: 'type', label: 'Type' },
    { value: 'impact', label: 'Impact' },
    { value: 'phase', label: 'Phase' },
    { value: 'effort', label: 'Effort' },
    { value: 'risk', label: 'Risk' },
  ]

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: 'mvpScore', label: 'MVP Score' },
    { value: 'number', label: 'Number' },
    { value: 'feature', label: 'Feature' },
  ]

  const filterLabels: Record<string, string> = { type: 'type', impact: 'impact', phase: 'phase', effort: 'effort', risk: 'risk' }

  const totalVisible = () => props.grouped.reduce((sum, g) => sum + g.features.length, 0)

  return (
    <aside class="flex h-full flex-col gap-3 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          ทั้งหมด {props.counts.all} · เลือก {props.counts.selected} · MVP {props.counts.mvp} · สูง {props.counts.high}
        </div>
        <Show when={totalVisible() !== props.counts.all}>
          <span class="text-xs text-gray-500 dark:text-gray-400">แสดง {totalVisible()} รายการ</span>
        </Show>
      </div>

      <input
        type="text"
        value={props.search}
        onInput={e => props.setSearch(e.currentTarget.value)}
        placeholder="ค้นหา features..."
        class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
      />

      <div class="flex flex-wrap items-center gap-2">
        <select
          value={props.groupBy}
          onChange={e => props.setGroupBy(e.currentTarget.value as GroupKey)}
          class="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        >
          <For each={groupOptions}>{opt => <option value={opt.value}>{opt.label}</option>}</For>
        </select>
        <select
          value={props.sortBy}
          onChange={e => props.setSortBy(e.currentTarget.value as SortKey)}
          class="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        >
          <For each={sortOptions}>{opt => <option value={opt.value}>{opt.label}</option>}</For>
        </select>
        <button
          onClick={() => props.setSortDesc(!props.sortDesc)}
          class="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
        >
          {props.sortDesc ? '▲ มากไปน้อย' : '▼ น้อยไปมาก'}
        </button>
      </div>

      <div class="flex flex-wrap gap-3 text-xs">
        <For each={Object.entries(props.filterCategories)}>
          {([key, values]) => (
            <div class="flex flex-col gap-1">
              <span class="font-medium text-gray-500 dark:text-gray-400">{filterLabels[key]}</span>
              <div class="flex flex-wrap gap-1">
                {Array.from(values).map(value => {
                  const active = props.activeFilters[key]?.has(value)
                  return (
                    <button
                      onClick={() => props.toggleFilter(key, value)}
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

      <button
        onClick={props.clearFilters}
        class="self-start text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        ล้าง filter
      </button>

      <div class="flex-1 overflow-y-auto pr-1">
        <For each={props.grouped}>
          {group => (
            <div class="mb-4">
              <Show when={props.groupBy !== 'none'}>
                <h3 class="sticky top-0 z-10 mb-2 rounded bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  {group.label} ({group.features.length})
                </h3>
              </Show>
              <div class="flex flex-col gap-2">
                <For each={group.features}>
                  {f => {
                    const isSelected = () => props.selectedIds.has(f.number)
                    const isDetail = () => props.selectedDetailId === f.number
                    return (
                      <button
                        onClick={() => props.setSelectedDetail(f.number)}
                        class={`flex flex-col gap-1 rounded border p-3 text-left transition ${
                          isDetail()
                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                            : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div class="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected()}
                            onClick={e => { e.stopPropagation(); props.toggleSelect(f.number) }}
                            class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div class="flex-1">
                            <div class="font-semibold text-gray-900 dark:text-white">{f.feature}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">{f.description}</div>
                            <div class="mt-1 flex flex-wrap gap-1">
                              <Badge class="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">{f.type}</Badge>
                              <Badge class={impactColor(f.impact)}>{f.impact}</Badge>
                              <Badge class="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{f.phase}</Badge>
                              <Badge class="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">{f.effort}</Badge>
                              <Badge class="bg-gray-100 font-mono text-gray-700 dark:bg-gray-700 dark:text-gray-300">MVP {f.mvpScore}</Badge>
                              <Badge class={riskColor(f.risk)}>{f.risk}</Badge>
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  }}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </aside>
  )
}
