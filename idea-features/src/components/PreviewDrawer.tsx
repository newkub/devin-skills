import { For, Show } from 'solid-js'
import type { Component } from 'solid-js'
import { generateSketch } from '../sketch'
import Markdown from './Markdown'
import FileTree from './FileTree'
import { Badge, impactColor, impactIcon, riskColor, riskIcon, phaseColor, effortColor, typeColor } from '../ui'
import type { useFeatureApp } from '../hooks/useFeatureApp'

type App = ReturnType<typeof useFeatureApp>

interface PreviewDrawerProps {
  app: App
}

const PreviewDrawer: Component<PreviewDrawerProps> = (props) => {
  const f = props.app.hoveredFeature

  return (
    <Show when={f()}>
      <div
        class="fixed right-0 top-0 z-40 h-full w-full overflow-y-auto border-l border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 sm:w-[28rem]"
      >
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xl">🖼</span>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Preview</h2>
          </div>
          <button
            onClick={() => props.app.setHoveredId(null)}
            class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <div class="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div class="mb-2 flex items-center gap-2">
            <span class="font-mono text-sm text-slate-500 dark:text-slate-400">#{f()!.number}</span>
            <Badge class={typeColor(f()!.type)}>{f()!.type}</Badge>
          </div>
          <h3 class="mb-1 text-base font-semibold text-slate-900 dark:text-white">{f()!.feature}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300">{f()!.description}</p>
        </div>

        <div class="mb-4 grid grid-cols-2 gap-2">
          <div class="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
            <div class="mb-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">Impact</div>
            <Badge class={`${impactColor(f()!.impact)} gap-1`}><span>{impactIcon(f()!.impact)}</span>{f()!.impact}</Badge>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
            <div class="mb-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">Risk</div>
            <Badge class={`${riskColor(f()!.risk)} gap-1`}><span>{riskIcon(f()!.risk)}</span>{f()!.risk}</Badge>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
            <div class="mb-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">Phase</div>
            <Badge class={phaseColor(f()!.phase)}>🚀 {f()!.phase}</Badge>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
            <div class="mb-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">Effort</div>
            <Badge class={effortColor(f()!.effort)}>📊 {f()!.effort}</Badge>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
            <div class="mb-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">MVP</div>
            <span class="text-sm font-semibold text-slate-900 dark:text-white">⭐ {f()!.mvpScore}</span>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
            <div class="mb-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">Tags</div>
            <div class="flex flex-wrap gap-1">
              <Show when={(f()!.tags || []).length > 0} fallback={<span class="text-xs text-slate-400">-</span>}>
                <For each={f()!.tags || []}>
                  {t => <Badge class="bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600">{t}</Badge>}
                </For>
              </Show>
            </div>
          </div>
        </div>

        <div class="mb-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-900 p-3 dark:border-slate-700">
          <pre class="whitespace-pre font-mono text-xs leading-snug text-sky-300">{generateSketch(f()!)}</pre>
        </div>

        <Show when={f()!.reason}>
          <div class="mb-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <h4 class="mb-1 flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white"><span>💡</span> Why</h4>
            <Markdown content={f()!.reason || ''} />
          </div>
        </Show>

        <Show when={f()!.how}>
          <div class="mb-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <h4 class="mb-1 flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white"><span>🛠</span> How</h4>
            <Markdown content={f()!.how || ''} />
          </div>
        </Show>

        <Show when={f()!.riskDetail}>
          <div class="mb-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <h4 class="mb-1 flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white"><span>⚠</span> Risk</h4>
            <Markdown content={f()!.riskDetail || ''} />
          </div>
        </Show>

        <Show when={(f()!.files || []).length > 0}>
          <div class="mb-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <h4 class="mb-1 flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white"><span>🗂</span> Files</h4>
            <FileTree files={f()!.files || []} />
          </div>
        </Show>

        <div class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
          <h4 class="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white"><span>✨</span> AI Enhance</h4>
          <p class="mb-2 text-xs text-slate-500 dark:text-slate-400">พิมพ์ prompt แล้วกด Enter เพื่อ enhance feature นี้ (ต้องเชื่อม LLM backend)</p>
          <input
            type="text"
            disabled={props.app.enhancing() !== null}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                props.app.enhanceFeature(f()!, e.currentTarget.value)
                e.currentTarget.value = ''
              }
            }}
            placeholder="เช่น เพิ่ม dark mode, ทำให้สั้นลง..."
            class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <Show when={props.app.enhanceNumber() === f()!.number && props.app.enhanceMessage()}>
            <div class="mt-2 text-xs text-blue-600 dark:text-blue-400">{props.app.enhanceMessage()}</div>
          </Show>
        </div>
      </div>
    </Show>
  )
}

export default PreviewDrawer
