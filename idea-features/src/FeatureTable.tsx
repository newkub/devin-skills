import { For, Show } from 'solid-js'
import type { Feature } from './types'
import { Badge, impactColor, riskColor } from './ui'
import Markdown from './components/Markdown'
import { generateSketch } from './sketch'
import FileTree from './components/FileTree'
import type { useFeatureApp } from './hooks/useFeatureApp'

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
              {f => {
                const isExpanded = () => props.app.selectedDetailId() === f.number
                const isSelected = () => props.app.selectedIds().has(f.number)
                return (
                  <>
                    <tr
                      class={`group cursor-pointer transition-colors ${
                        isExpanded()
                          ? 'bg-blue-50/70 dark:bg-blue-900/10'
                          : isSelected()
                            ? 'bg-emerald-50/60 dark:bg-emerald-900/10'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                      }`}
                      onClick={() => props.app.setSelectedDetailId(isExpanded() ? null : f.number)}
                    >
                      <td class="px-4 py-3.5 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected()}
                          onChange={() => props.app.toggleSelect(f.number)}
                          class="h-4 w-4 rounded border-slate-300 text-blue-600 transition focus:ring-blue-500 dark:border-slate-600"
                        />
                      </td>
                      <td class="px-4 py-3.5 font-mono text-xs font-medium text-slate-500 dark:text-slate-400">#{f.number}</td>
                      <td class="px-4 py-3.5"><Badge class={impactColor(f.impact)}>{f.impact}</Badge></td>
                      <td class="px-4 py-3.5">
                        <div class="font-medium text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">{f.feature}</div>
                        <div class="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{f.description}</div>
                      </td>
                      <td class="px-4 py-3.5">
                        <div class="flex flex-wrap gap-1">
                          <For each={f.tags}>{tag => <Badge class="bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600">{tag}</Badge>}</For>
                        </div>
                      </td>
                      <td class="px-4 py-3.5"><Badge class="bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:ring-indigo-900/50">{f.phase}</Badge></td>
                      <td class="px-4 py-3.5"><Badge class="bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:ring-violet-900/50">{f.effort}</Badge></td>
                      <td class="px-4 py-3.5 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{f.mvpScore}</td>
                      <td class="px-4 py-3.5"><Badge class={riskColor(f.risk)}>{f.risk}</Badge></td>
                      <td class="px-4 py-3.5 text-center">
                        <button
                          onClick={e => { e.stopPropagation(); props.app.setSelectedDetailId(isExpanded() ? null : f.number) }}
                          class={`rounded-lg p-1.5 transition ${
                            isExpanded()
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-200'
                          }`}
                        >
                          {isExpanded() ? '▲' : '▼'}
                        </button>
                      </td>
                    </tr>
                    <Show when={isExpanded()}>
                      <tr class="bg-white dark:bg-slate-800">
                        <td colSpan={10} class="border-b border-slate-100 p-4 dark:border-slate-700/50">
                          <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            <div class="rounded-xl border border-slate-200 bg-slate-950 p-4 shadow-inner dark:border-slate-700">
                              <div class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                                <span>🖼</span> UX/UI Sketch
                              </div>
                              <pre class="overflow-x-auto text-xs leading-snug text-emerald-400 font-mono whitespace-pre">
                                {generateSketch(f)}
                              </pre>
                            </div>
                            <div class="space-y-4">
                              <section>
                                <h4 class="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                  <span class="text-blue-500">●</span> Why
                                </h4>
                                <div class="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                                  <Markdown content={f.reason || '-'} class="text-sm text-slate-700 dark:text-slate-300" />
                                </div>
                              </section>
                              <section>
                                <h4 class="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                  <span class="text-emerald-500">●</span> How
                                </h4>
                                <div class="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                                  <Markdown content={f.how || '-'} class="text-sm text-slate-700 dark:text-slate-300" />
                                </div>
                              </section>
                              <section>
                                <h4 class="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                  <span class="text-rose-500">●</span> Risk
                                </h4>
                                <div class="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                                  <Markdown content={f.riskDetail || '-'} class="text-sm text-slate-700 dark:text-slate-300" />
                                </div>
                              </section>
                              <section>
                                <h4 class="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                                  <span class="text-violet-500">●</span> File Structure
                                </h4>
                                <FileTree files={f.files || []} />
                              </section>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </Show>
                  </>
                )
              }}
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
