import { Show } from "solid-js"

interface SummaryPanelProps {
  summary: { markdown: string; json: string } | null
}

export function SummaryPanel(props: SummaryPanelProps) {
  return (
    <Show
      when={props.summary}
      fallback={
        <div class="card text-center">
          <span class="i-mdi-clipboard-text-outline text-5xl text-gray-500 block mb-3" />
          <p class="text-gray-400">เลือก Project Level เพื่อสร้างสรุป</p>
        </div>
      }
    >
      <div class="card">
        <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span class="i-mdi-clipboard-text text-primary text-xl" />
          Summary
        </h3>
        <pre class="text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto bg-black/30 p-3 rounded-lg">
          {props.summary?.markdown}
        </pre>
        <div class="mt-3 pt-3 border-t border-border">
          <p class="text-xs text-gray-400 mb-1">JSON Output</p>
          <pre class="text-xs text-gray-500 whitespace-pre-wrap overflow-x-auto max-h-48 overflow-y-auto bg-black/20 p-2 rounded">
            {props.summary?.json}
          </pre>
        </div>
      </div>
    </Show>
  )
}
