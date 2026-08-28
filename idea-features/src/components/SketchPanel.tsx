import { Show } from 'solid-js'
import type { Feature } from '../types'
import { generateSketch } from '../sketch'

interface SketchPanelProps {
  feature: Feature | null
}

export default function SketchPanel(props: SketchPanelProps) {
  return (
    <section class="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-3 text-lg font-bold text-gray-900 dark:text-white">
        {props.feature ? `UX/UI Sketch: ${props.feature.feature}` : 'UX/UI Sketch'}
      </h2>
      <Show when={props.feature} fallback={
        <div class="flex-1 text-sm text-gray-500 dark:text-gray-400">เลือก feature เพื่อดู sketch</div>
      }>
        <pre class="flex-1 overflow-auto rounded border border-gray-200 bg-gray-900 p-3 text-xs leading-tight text-green-400 font-mono whitespace-pre">
          {generateSketch(props.feature!)}
        </pre>
      </Show>
    </section>
  )
}
