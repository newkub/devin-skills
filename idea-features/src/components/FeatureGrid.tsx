import { For, Show } from 'solid-js'
import type { Component } from 'solid-js'
import FeatureCard from './FeatureCard'
import type { useFeatureApp } from '../hooks/useFeatureApp'

type App = ReturnType<typeof useFeatureApp>

interface FeatureGridProps {
  app: App
}

const FeatureGrid: Component<FeatureGridProps> = (props) => {
  const isSelected = (id: number) => props.app.selectedIds().has(id)

  return (
    <Show
      when={props.app.visibleFeatures().length > 0}
      fallback={
        <div class="py-20 text-center">
          <div class="mb-3 text-4xl text-slate-300 dark:text-slate-600">🔍</div>
          <div class="text-sm font-medium text-slate-900 dark:text-white">ไม่พบ feature</div>
          <div class="text-xs text-slate-500 dark:text-slate-400">ลองเปลี่ยน search หรือ filter ดู</div>
        </div>
      }
    >
      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <For each={props.app.visibleFeatures()}>
          {(feature) => (
            <FeatureCard
              feature={feature}
              selected={isSelected(feature.number)}
              onToggleSelect={props.app.toggleSelect}
              onHover={props.app.setHoveredId}
            />
          )}
        </For>
      </div>
    </Show>
  )
}

export default FeatureGrid
