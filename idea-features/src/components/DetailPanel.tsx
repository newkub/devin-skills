import { Show } from 'solid-js'
import type { Feature } from '../types'
import { Badge, impactColor, riskColor } from '../ui'
import Markdown from './Markdown'

interface DetailPanelProps {
  feature: Feature | null
}

export default function DetailPanel(props: DetailPanelProps) {
  return (
    <section class="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Show when={props.feature} fallback={
        <div class="text-sm text-gray-500 dark:text-gray-400">เลือก feature เพื่อดู details</div>
      }>
        <div class="mb-4 border-b border-gray-200 pb-4 dark:border-gray-700">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">{props.feature!.feature}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">{props.feature!.description}</p>
          <div class="mt-2 flex flex-wrap gap-1">
            <Badge class="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">{props.feature!.type}</Badge>
            <Badge class={impactColor(props.feature!.impact)}>{props.feature!.impact}</Badge>
            <Badge class="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{props.feature!.phase}</Badge>
            <Badge class="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">{props.feature!.effort}</Badge>
            <Badge class="bg-gray-100 font-mono text-gray-700 dark:bg-gray-700 dark:text-gray-300">MVP {props.feature!.mvpScore}</Badge>
            <Badge class={riskColor(props.feature!.risk)}>{props.feature!.risk}</Badge>
          </div>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto pr-1">
          <div>
            <h3 class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Description</h3>
            <Markdown content={props.feature!.description} />
          </div>
          <div>
            <h3 class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Why</h3>
            <Markdown content={props.feature!.reason || '-'} />
          </div>
          <div>
            <h3 class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">How</h3>
            <Markdown content={props.feature!.how || '-'} />
          </div>
          <div>
            <h3 class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Risk</h3>
            <Markdown content={props.feature!.riskDetail || '-'} />
          </div>
        </div>
      </Show>
    </section>
  )
}
