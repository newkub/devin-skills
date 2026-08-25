import { For } from "solid-js"

interface StringListEditorProps {
  items: string[]
  placeholder: string
  onAdd: () => void
  onRemove: (i: number) => void
  onUpdate: (i: number, val: string) => void
  addLabel: string
}

export function StringListEditor(props: StringListEditorProps) {
  return (
    <>
      <For each={props.items}>
        {(_item, i) => (
          <div class="flex gap-2 mb-2">
            <input
              type="text"
              placeholder={props.placeholder}
              value={props.items[i()]}
              onInput={(e) => props.onUpdate(i(), e.currentTarget.value)}
              class="input-base"
            />
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
        {props.addLabel}
      </button>
    </>
  )
}
