import { Show } from 'solid-js'
import type { Component } from 'solid-js'
import { generateSketch } from '../sketch'
import { Badge, impactColor, impactIcon, riskColor, riskIcon, phaseColor, effortColor, typeColor } from '../ui'
import FileTree from './FileTree'
import Markdown from './Markdown'
import type { useFeatureApp } from '../hooks/useFeatureApp'

type App = ReturnType<typeof useFeatureApp>

interface PreviewPanelProps {
  app: App
}

const PreviewPanel: Component<PreviewPanelProps> = (props) => {
  const f = props.app.selectedFeature

  return (
    <div class="flex h-full w-full flex-col border-l border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 lg:w-[26rem]">
      <Show
        when={f()}
        fallback={
          <div class="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <div class="text-3xl text-slate-300 dark:text-slate-600">🖼</div>
            <div class="text-sm font-medium text-slate-700 dark:text-slate-300">เลือก feature เพื่อดูรายละเอียด</div>
            <div class="text-xs text-slate-500 dark:text-slate-400">คลิก card ฝั่งซ้ายเพื่อ preview</div>
          </div>
        }
      >
        <div class="flex-1 overflow-y-auto p-5">
          <div class="mb-4">
            <div class="mb-2 flex flex-wrap gap-1.5">
              <Badge class={typeColor(f()!.type)}>{f()!.type}</Badge>
              <Badge class={`${impactColor(f()!.impact)} gap-0.5`}><span>{impactIcon(f()!.impact)}</span>{f()!.impact}</Badge>
              <Badge class={riskColor(f()!.risk)}><span>{riskIcon(f()!.risk)}</span>{f()!.risk}</Badge>
              <Badge class={phaseColor(f()!.phase)}>🚀 {f()!.phase}</Badge>
              <Badge class={effortColor(f()!.effort)}>📊 {f()!.effort}</Badge>
              <Badge class="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">⭐ {f()!.mvpScore}</Badge>
            </div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">#{f()!.number} {f()!.feature}</h2>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{f()!.description}</p>
          </div>

          <div class="mb-4 overflow-x-auto rounded-lg border border-slate-200 bg-slate-900 p-2.5 dark:border-slate-700">
            <pre class="whitespace-pre font-mono text-[10px] leading-snug text-sky-300">{generateSketch(f()!)}</pre>
          </div>

          <Show when={f()!.reason}>
            <div class="mb-3">
              <h4 class="mb-0.5 text-xs font-semibold text-slate-900 dark:text-white">💡 Why</h4>
              <Markdown content={f()!.reason || ''} />
            </div>
          </Show>

          <Show when={f()!.how}>
            <div class="mb-3">
              <h4 class="mb-0.5 text-xs font-semibold text-slate-900 dark:text-white">🛠 How</h4>
              <Markdown content={f()!.how || ''} />
            </div>
          </Show>

          <Show when={f()!.riskDetail}>
            <div class="mb-3">
              <h4 class="mb-0.5 text-xs font-semibold text-slate-900 dark:text-white">⚠ Risk</h4>
              <Markdown content={f()!.riskDetail || ''} />
            </div>
          </Show>

          <Show when={(f()!.files || []).length > 0}>
            <div class="mb-4">
              <h4 class="mb-0.5 text-xs font-semibold text-slate-900 dark:text-white">🗂 Files</h4>
              <FileTree files={f()!.files || []} />
            </div>
          </Show>

          <div class="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            <div class="mb-2 text-xs font-medium text-slate-700 dark:text-slate-300">Prompt preview</div>
            <pre class="max-h-48 overflow-y-auto whitespace-pre-wrap break-words rounded-md bg-white p-2.5 text-[10px] text-slate-600 dark:bg-slate-900 dark:text-slate-300 border border-slate-100 dark:border-slate-700">{props.app.promptText()}</pre>
            <button
              onClick={props.app.copyPrompt}
              class="mt-2 w-full rounded-md bg-slate-900 py-2 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              {props.app.copied() ? 'Copied!' : 'Copy prompt'}
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default PreviewPanel
