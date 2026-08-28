import { For, Show, createSignal } from 'solid-js'
import type { Feature } from '../types'
import { Badge, impactColor, riskColor, typeColor, phaseColor, effortColor } from '../ui'
import Markdown from './Markdown'
import { generateSketch } from '../sketch'
import FileTree from './FileTree'
import FeatureSummary from './FeatureSummary'
import type { useFeatureApp } from '../hooks/useFeatureApp'

type App = ReturnType<typeof useFeatureApp>

interface FeatureRowProps {
  feature: Feature
  app: App
}

export default function FeatureRow(props: FeatureRowProps) {
  const f = () => props.feature
  const [prompt, setPrompt] = createSignal('')
  const isSelected = () => props.app.selectedIds().has(f().number)
  const isExpanded = () => props.app.isExpanded(f().number)

  const toggle = (e?: MouseEvent) => {
    e?.stopPropagation()
    props.app.toggleExpand(f().number)
  }

  const onPromptKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const p = prompt().trim()
      if (p) props.app.enhanceFeature(f(), p)
      setPrompt('')
    }
  }

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
        onClick={() => toggle()}
      >
        <td class="px-4 py-3.5 text-center" onClick={(e: MouseEvent) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected()}
            onChange={() => props.app.toggleSelect(f().number)}
            class="h-4 w-4 rounded border-slate-300 text-blue-600 transition focus:ring-blue-500 dark:border-slate-600"
          />
        </td>
        <td class="px-4 py-3.5 font-mono text-xs font-medium text-slate-500 dark:text-slate-400">#{f().number}</td>
        <td class="px-4 py-3.5"><Badge class={typeColor(f().type)}>{f().type}</Badge></td>
        <td class="px-4 py-3.5"><Badge class={impactColor(f().impact)}>{f().impact}</Badge></td>
        <td class="px-4 py-3.5">
          <div class="font-medium text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">{f().feature}</div>
          <div class="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{f().description}</div>
        </td>
        <td class="px-4 py-3.5">
          <div class="flex flex-wrap gap-1">
            <For each={f().tags}>{tag => <Badge class="bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600">{tag}</Badge>}</For>
          </div>
        </td>
        <td class="px-4 py-3.5"><Badge class={phaseColor(f().phase)}>{f().phase}</Badge></td>
        <td class="px-4 py-3.5"><Badge class={effortColor(f().effort)}>{f().effort}</Badge></td>
        <td class="px-4 py-3.5 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{f().mvpScore}</td>
        <td class="px-4 py-3.5"><Badge class={riskColor(f().risk)}>{f().risk}</Badge></td>
        <td class="px-4 py-3.5 text-center">
          <button
            onClick={(e: MouseEvent) => toggle(e)}
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
          <td colSpan={11} class="border-b border-slate-100 p-4 dark:border-slate-700/50">
            <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div class="rounded-xl border border-slate-200 bg-slate-950 p-4 shadow-inner dark:border-slate-700">
                <div class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                  <span>🖼</span> UX/UI Sketch
                </div>
                <pre class="overflow-x-auto text-xs leading-snug text-sky-400 font-mono whitespace-pre">
                  {generateSketch(f())}
                </pre>
              </div>
              <div class="space-y-4">
                <FeatureSummary feature={f()} />
                <section>
                  <h4 class="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <span class="text-blue-500">●</span> Why
                  </h4>
                  <div class="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                    <Markdown content={f().reason || '-'} class="text-sm text-slate-700 dark:text-slate-300" />
                  </div>
                </section>
                <section>
                  <h4 class="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <span class="text-emerald-500">●</span> How
                  </h4>
                  <div class="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                    <Markdown content={f().how || '-'} class="text-sm text-slate-700 dark:text-slate-300" />
                  </div>
                </section>
                <section>
                  <h4 class="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <span class="text-rose-500">●</span> Risk
                  </h4>
                  <div class="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                    <Markdown content={f().riskDetail || '-'} class="text-sm text-slate-700 dark:text-slate-300" />
                  </div>
                </section>
                <section>
                  <h4 class="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <span class="text-violet-500">●</span> File Structure
                  </h4>
                  <FileTree files={f().files || []} />
                </section>
                <section class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <h4 class="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <span>✨</span> AI Enhance
                  </h4>
                  <p class="mb-2 text-xs text-slate-500 dark:text-slate-400">พิมพ์ prompt แล้วกด Enter เพื่อให้ AI ปรับแต่ง feature นี้ (ต้องเชื่อม LLM backend)</p>
                  <input
                    type="text"
                    value={prompt()}
                    onInput={e => setPrompt(e.currentTarget.value)}
                    onKeyDown={onPromptKey}
                    disabled={props.app.enhancing() === f().number}
                    placeholder="เช่น เพิ่ม dark mode, ทำให้สั้นลง..."
                    class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                  <Show when={props.app.enhanceNumber() === f().number}>
                    <div class="mt-2 text-xs text-amber-600 dark:text-amber-400">{props.app.enhanceMessage()}</div>
                  </Show>
                </section>
              </div>
            </div>
          </td>
        </tr>
      </Show>
    </>
  )
}
