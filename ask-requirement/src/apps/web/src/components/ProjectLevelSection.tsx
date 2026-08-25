import { For } from "solid-js"
import { PROJECT_LEVEL_OPTIONS } from "@ask-requirement/shared"
import type { ProjectLevelValue } from "@ask-requirement/shared"

interface ProjectLevelSectionProps {
  selected: string
  onSelect: (val: ProjectLevelValue) => void
}

export function ProjectLevelSection(props: ProjectLevelSectionProps) {
  return (
    <div class="space-y-3">
      <For each={PROJECT_LEVEL_OPTIONS}>
        {(opt) => (
          <button
            type="button"
            onClick={() => props.onSelect(opt.value)}
            classList={{
              "border-primary bg-primary/10": props.selected === opt.value,
              "border-border bg-black/20": props.selected !== opt.value,
            }}
            class="w-full flex items-start gap-3 p-4 rounded-lg border transition-all hover:border-primary text-left"
          >
            <span class={`i-${opt.icon} text-3xl shrink-0 mt-1`} />
            <div class="flex-1">
              <div class="font-semibold text-white">{opt.label}</div>
              <div class="text-gray-400 text-sm mb-2">{opt.description}</div>
              <div class="flex flex-wrap gap-1">
                <For each={opt.features}>
                  {(feat) => (
                    <span class="text-xs px-2 py-1 bg-white/5 rounded-md text-gray-300">{feat}</span>
                  )}
                </For>
              </div>
            </div>
          </button>
        )}
      </For>
    </div>
  )
}
