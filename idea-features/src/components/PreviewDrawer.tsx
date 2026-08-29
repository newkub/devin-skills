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
  const f = props.app.previewFeature

  return (
    <div class="flex h-full w-full flex-col border-l border-border bg-surface lg:w-[26rem]">
      <Show
        when={f()}
        fallback={
          <div class="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <div class="text-3xl text-muted-foreground">🖼</div>
            <div class="text-sm font-medium text-surface-foreground">เลือก feature เพื่อดูรายละเอียด</div>
            <div class="text-xs text-muted-foreground">hover หรือคลิก card ฝั่งซ้ายเพื่อ preview</div>
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
              <Badge class="bg-muted text-surface-foreground">⭐ {f()!.mvpScore}</Badge>
            </div>
            <h2 class="text-base font-semibold text-surface-foreground">#{f()!.number} {f()!.feature}</h2>
            <p class="mt-1 text-sm text-muted-foreground">{f()!.description}</p>
          </div>

          <div class="mb-4 overflow-x-auto rounded-lg border border-border bg-background p-2.5">
            <pre class="whitespace-pre font-mono text-[10px] leading-snug text-accent">{generateSketch(f()!)}</pre>
          </div>

          <Show when={f()!.reason}>
            <div class="mb-3">
              <h4 class="mb-0.5 text-xs font-semibold text-surface-foreground">💡 Why</h4>
              <Markdown content={f()!.reason || ''} />
            </div>
          </Show>

          <Show when={f()!.how}>
            <div class="mb-3">
              <h4 class="mb-0.5 text-xs font-semibold text-surface-foreground">🛠 How</h4>
              <Markdown content={f()!.how || ''} />
            </div>
          </Show>

          <Show when={f()!.riskDetail}>
            <div class="mb-3">
              <h4 class="mb-0.5 text-xs font-semibold text-surface-foreground">⚠ Risk</h4>
              <Markdown content={f()!.riskDetail || ''} />
            </div>
          </Show>

          <Show when={(f()!.files || []).length > 0}>
            <div class="mb-4">
              <h4 class="mb-0.5 text-xs font-semibold text-surface-foreground">🗂 Files</h4>
              <FileTree files={f()!.files || []} />
            </div>
          </Show>

          <div class="rounded-lg border border-border bg-surface-elevated p-3">
            <div class="mb-2 text-xs font-medium text-surface-foreground">Prompt preview</div>
            <pre class="max-h-48 overflow-y-auto whitespace-pre-wrap break-words rounded-md bg-background p-2.5 text-[10px] text-muted-foreground border border-border">{props.app.promptText()}</pre>
            <button
              onClick={props.app.copyPrompt}
              class="mt-2 w-full rounded-md bg-primary py-2 text-xs font-medium text-primary-foreground hover:bg-primary-hover active:bg-primary-active"
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
