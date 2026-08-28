import { For, Show } from 'solid-js'
import type { useFeatureApp } from './hooks/useFeatureApp'
import FeatureRow from './components/FeatureRow'

type App = ReturnType<typeof useFeatureApp>

export default function FeatureTable(props: { app: App }) {
  const sortBtn = (key: 'number' | 'feature' | 'mvpScore', label: string) => {
    const active = () => props.app.sortBy() === key
    return (
      <button
        onClick={() => {
          if (active()) props.app.setSortDesc(!props.app.sortDesc())
          else { props.app.setSortBy(key); props.app.setSortDesc(key === 'mvpScore') }
        }}
        class={`flex items-center gap-1 rounded-lg px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider transition ${
          active()
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200'
        }`}
      >
        {label}
        <span class="text-[10px]">{active() ? (props.app.sortDesc() ? '▲' : '▼') : '⇅'}</span>
      </button>
    )
  }

  const allSelected = () => props.app.visibleFeatures().length > 0 && props.app.visibleFeatures().every(f => props.app.selectedIds().has(f.number))

  return (
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900/80">
            <tr>
              <th class="w-14 px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={allSelected()}
                  onChange={() => allSelected() ? props.app.clearSelection() : props.app.selectAll()}
                  class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                />
              </th>
              <th class="px-2 py-2">{sortBtn('number', '#')}</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Impact</th>
              <th class="px-2 py-2">{sortBtn('feature', 'Feature')}</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tags</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phase</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Effort</th>
              <th class="px-2 py-2">{sortBtn('mvpScore', 'MVP')}</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Risk</th>
              <th class="w-16 px-4 py-3 text-center"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
            <For each={props.app.visibleFeatures()}>
              {f => <FeatureRow feature={f} app={props.app} />}
            </For>
          </tbody>
        </table>
      </div>
      <Show when={props.app.visibleFeatures().length === 0}>
        <div class="p-10 text-center">
          <div class="mb-2 text-4xl">🕸</div>
          <div class="text-sm font-medium text-slate-900 dark:text-white">ไม่พบ features ทีตรงกับ filter</div>
          <div class="text-xs text-slate-500 dark:text-slate-400">ลองเปลี่ยนคำค้นหาหรือกด ล้าง filter</div>
        </div>
      </Show>
    </div>
  )
}
