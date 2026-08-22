import { For } from "solid-js"

interface Option {
  value: string
  label: string
  icon: string
  description: string
}

interface OptionGridProps {
  options: Option[]
  selected: string[]
  onToggle: (val: string) => void
}

export function OptionGrid(props: OptionGridProps) {
  return (
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <For each={props.options}>
        {(opt) => (
          <button
            type="button"
            onClick={() => props.onToggle(opt.value)}
            classList={{
              "border-primary bg-primary/10": props.selected.includes(opt.value),
              "border-border bg-black/20": !props.selected.includes(opt.value),
            }}
            class="flex items-center gap-3 p-3 rounded-lg border transition-all hover:border-primary text-left"
          >
            <span class={`i-${opt.icon} text-2xl shrink-0`} />
            <div class="min-w-0">
              <div class="font-medium text-white text-sm">{opt.label}</div>
              <div class="text-gray-400 text-xs truncate">{opt.description}</div>
            </div>
          </button>
        )}
      </For>
    </div>
  )
}
