import { For } from "solid-js"
import type { CustomDataField } from "@ask-requirement/shared"

interface CustomDataSectionProps {
  items: CustomDataField[]
  onAdd: () => void
  onRemove: (i: number) => void
  onUpdate: (i: number, field: "key" | "value" | "icon", val: string) => void
}

export function CustomDataSection(props: CustomDataSectionProps) {
  return (
    <>
      <For each={props.items}>
        {(_d, i) => (
          <div class="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="key (เช่น budget)"
              value={props.items[i()].key}
              onInput={(e) => props.onUpdate(i(), "key", e.currentTarget.value)}
              class="input-base w-1/4"
            />
            <input
              type="text"
              placeholder="value (เช่น $5000)"
              value={props.items[i()].value}
              onInput={(e) => props.onUpdate(i(), "value", e.currentTarget.value)}
              class="input-base flex-1"
            />
            <input
              type="text"
              placeholder="icon (mdi-*)"
              value={props.items[i()].icon || ""}
              onInput={(e) => props.onUpdate(i(), "icon", e.currentTarget.value)}
              class="input-base w-1/4"
            />
            <span class={`i-${props.items[i()].icon || "mdi-tag"} text-xl shrink-0 text-primary`} />
            <button
              type="button"
              onClick={() => props.onRemove(i())}
              class="btn-ghost text-red-400 shrink-0"
            >
              <span class="i-mdi-delete text-xl" />
            </button>
          </div>
        )}
      </For>
      <button type="button" onClick={props.onAdd} class="btn-primary flex items-center gap-2 mt-2">
        <span class="i-mdi-plus" />
        Add Custom Data
      </button>
    </>
  )
}
