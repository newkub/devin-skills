import { For, Show } from 'solid-js'
import type { Feature } from './types'
import { Badge, impactColor, riskColor } from './ui'
import Markdown from './components/Markdown'
import { generateSketch } from './sketch'
import FileTree from './components/FileTree'
import type { useFeatureApp } from './hooks/useFeatureApp'

type App = ReturnType<typeof useFeatureApp>

export default function FeatureTable(props: { app: App }) {
  const sortedBy = (key: 'number' | 'feature' | 'mvpScore') => () => props.app.sortBy() === key

  const headerClass = (key: 'number' | 'feature' | 'mvpScore') =>
    `cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ${sortedBy(key)() ? 'text-blue-600 dark:text-blue-400' : ''}`

  const toggleSort = (key: 'number' | 'feature' | 'mvpScore') => {
    if (props.app.sortBy() === key) props.app.setSortDesc(!props.app.sortDesc())
    else { props.app.setSortBy(key); props.app.setSortDesc(key === 'mvpScore') }
  }

  const allSelected = () => props.app.visibleFeatures().length > 0 && props.app.visibleFeatures().every(f => props.app.selectedIds().has(f.number))

  return (
    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="w-12 px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={allSelected()}
                  onChange={() => allSelected() ? props.app.clearSelection() : props.app.selectAll()}
                  class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th class={headerClass('number')} onClick={() => toggleSort('number')}># {props.app.sortBy() === 'number' && (props.app.sortDesc() ? '▲' : '▼')}</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Impact</th>
              <th class={headerClass('feature')} onClick={() => toggleSort('feature')}>Feature {props.app.sortBy() === 'feature' && (props.app.sortDesc() ? '▲' : '▼')}</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Tags</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Phase</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Effort</th>
              <th class={headerClass('mvpScore')} onClick={() => toggleSort('mvpScore')}>MVP {props.app.sortBy() === 'mvpScore' && (props.app.sortDesc() ? '▲' : '▼')}</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Risk</th>
              <th class="w-16 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <For each={props.app.visibleFeatures()}>
              {f => {
                const isExpanded = () => props.app.selectedDetailId() === f.number
                const isSelected = () => props.app.selectedIds().has(f.number)
                return (
                  <>
                    <tr
                      class={`cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-700/50 ${isExpanded() ? 'bg-blue-50 dark:bg-blue-900/10' : ''} ${isSelected() ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
                      onClick={() => props.app.setSelectedDetailId(isExpanded() ? null : f.number)}
                    >
                      <td class="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected()}
                          onChange={() => props.app.toggleSelect(f.number)}
                          class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td class="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">#{f.number}</td>
                      <td class="px-4 py-3"><Badge class={impactColor(f.impact)}>{f.impact}</Badge></td>
                      <td class="px-4 py-3">
                        <div class="font-medium text-gray-900 dark:text-white">{f.feature}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{f.description}</div>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex flex-wrap gap-1">
                          <For each={f.tags}>{tag => <Badge class="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">{tag}</Badge>}</For>
                        </div>
                      </td>
                      <td class="px-4 py-3"><Badge class="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{f.phase}</Badge></td>
                      <td class="px-4 py-3"><Badge class="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">{f.effort}</Badge></td>
                      <td class="px-4 py-3 font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">{f.mvpScore}</td>
                      <td class="px-4 py-3"><Badge class={riskColor(f.risk)}>{f.risk}</Badge></td>
                      <td class="px-4 py-3 text-center">
                        <button
                          onClick={e => { e.stopPropagation(); props.app.setSelectedDetailId(isExpanded() ? null : f.number) }}
                          class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                        >
                          {isExpanded() ? '▲' : '▼'}
                        </button>
                      </td>
                    </tr>
                    <Show when={isExpanded()}>
                      <tr class="bg-white dark:bg-gray-800">
                        <td colSpan={10} class="px-4 py-4">
                          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div class="rounded border border-gray-200 bg-gray-900 p-3 dark:border-gray-700">
                              <h4 class="mb-2 text-xs font-semibold uppercase text-gray-400">UX/UI Sketch</h4>
                              <pre class="overflow-x-auto text-xs leading-tight text-green-400 font-mono whitespace-pre">
                                {generateSketch(f)}
                              </pre>
                            </div>
                            <div class="space-y-3">
                              <div>
                                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Why</h4>
                                <Markdown content={f.reason || '-'} />
                              </div>
                              <div>
                                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">How</h4>
                                <Markdown content={f.how || '-'} />
                              </div>
                              <div>
                                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Risk</h4>
                                <Markdown content={f.riskDetail || '-'} />
                              </div>
                              <div>
                                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">File Structure</h4>
                                <FileTree files={f.files || []} />
                              </div>
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
        <div class="p-8 text-center text-sm text-gray-500 dark:text-gray-400">ไม่พบ features ทีตรงกับ filter</div>
      </Show>
    </div>
  )
}
