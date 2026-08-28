import { For, Show, createSignal } from 'solid-js'
import type { Feature } from '../types'
import { Badge, typeColor, impactColor, phaseColor, effortColor, riskColor } from '../ui'

interface CopyPreviewProps {
  features: Feature[]
}

export default function CopyPreview(props: CopyPreviewProps) {
  const [mode, setMode] = createSignal<'list' | 'table'>('list')
  const list = () => props.features

  return (
    <div class="w-96 max-w-[90vw] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
      <div class="mb-2 flex items-center justify-between">
        <div class="text-sm font-semibold text-slate-900 dark:text-white">📝 Copy Preview ({list().length})</div>
        <div class="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
          <button
            onClick={() => setMode('list')}
            class={`rounded-md px-2 py-1 text-[10px] font-medium ${mode() === 'list' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            List
          </button>
          <button
            onClick={() => setMode('table')}
            class={`rounded-md px-2 py-1 text-[10px] font-medium ${mode() === 'table' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Table
          </button>
        </div>
      </div>

      <Show when={list().length === 0}>
        <div class="py-4 text-center text-xs text-slate-500 dark:text-slate-400">ยังไม่ได้เลือก feature</div>
      </Show>

      <Show when={list().length > 0}>
        <Show when={mode() === 'list'}>
          <div class="max-h-72 overflow-y-auto space-y-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <For each={list()}>
              {(f, i) => (
                <div class="rounded-lg border border-slate-100 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
                  <span class="font-semibold text-slate-900 dark:text-white">{i() + 1}. {f.feature}</span>
                  <span class="text-slate-500 dark:text-slate-400"> — {f.description}</span>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={mode() === 'table'}>
          <div class="max-h-72 overflow-auto">
            <table class="w-full text-left text-[10px]">
              <thead class="sticky top-0 bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th class="px-2 py-1 font-semibold text-slate-600 dark:text-slate-300">#</th>
                  <th class="px-2 py-1 font-semibold text-slate-600 dark:text-slate-300">Feature</th>
                  <th class="px-2 py-1 font-semibold text-slate-600 dark:text-slate-300">Type</th>
                  <th class="px-2 py-1 font-semibold text-slate-600 dark:text-slate-300">Imp</th>
                  <th class="px-2 py-1 font-semibold text-slate-600 dark:text-slate-300">Phase</th>
                  <th class="px-2 py-1 font-semibold text-slate-600 dark:text-slate-300">Eff</th>
                  <th class="px-2 py-1 font-semibold text-slate-600 dark:text-slate-300">MVP</th>
                  <th class="px-2 py-1 font-semibold text-slate-600 dark:text-slate-300">Risk</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                <For each={list()}>
                  {(f, i) => (
                    <tr>
                      <td class="px-2 py-1.5 font-mono text-slate-500 dark:text-slate-400">{i() + 1}</td>
                      <td class="px-2 py-1.5">
                        <div class="max-w-[140px] truncate font-medium text-slate-900 dark:text-white" title={f.feature}>{f.feature}</div>
                      </td>
                      <td class="px-2 py-1.5"><Badge class={`${typeColor(f.type)} text-[9px]`}>{f.type[0]}</Badge></td>
                      <td class="px-2 py-1.5"><Badge class={`${impactColor(f.impact)} text-[9px]`}>{f.impact[0]}</Badge></td>
                      <td class="px-2 py-1.5"><Badge class={`${phaseColor(f.phase)} text-[9px]`}>{f.phase}</Badge></td>
                      <td class="px-2 py-1.5"><Badge class={`${effortColor(f.effort)} text-[9px]`}>{f.effort}</Badge></td>
                      <td class="px-2 py-1.5 font-mono text-slate-700 dark:text-slate-300">{f.mvpScore}</td>
                      <td class="px-2 py-1.5"><Badge class={`${riskColor(f.risk)} text-[9px]`}>{f.risk[0]}</Badge></td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Show>
    </div>
  )
}
