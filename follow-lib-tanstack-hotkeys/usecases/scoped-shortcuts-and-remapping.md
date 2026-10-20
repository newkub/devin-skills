# Use Case — Scoped Shortcuts and User Remapping

> Keep modal, editor, and global shortcuts from fighting, then let a user rebind one. Source: https://tanstack.com/hotkeys/latest (accessed 2026-10-20)

## 1. Give each surface its own scope

```tsx
// src/Editor.tsx
import { HotkeysProvider, useHotkey } from "@tanstack/react-hotkeys";

export function Editor() {
  return (
    <HotkeysProvider>
      <EditorCanvas />
    </HotkeysProvider>
  );
}

function EditorCanvas() {
  // Inside the editor scope, so the palette's Mod+K is not affected
  useHotkey("Mod+S", () => save(), { preventDefault: true });
  return <canvas />;
}
```

The innermost scope wins on a duplicate combo. That is the mechanism that lets an editor own `Mod+S` while the app keeps `Mod+K`.

## 2. Decide where form inputs are allowed

| Surface | Behaviour |
|---------|-----------|
| global navigation | never fire while typing — the default |
| editor canvas | fire, since it is not a form control |
| rich-text block | only fire on non-character keys |

`enableOnFormTags` opts a binding in. Turning it on globally means every letter a user types in a search box is also a shortcut.

## 3. Record a new binding

```tsx
function ShortcutRow({ action, binding, onRebind }: RowProps) {
  const { startRecording, isRecording } = useHotkeysRecorder({
    onRecord: (combo) => onRebind(combo),
  });

  return (
    <button onClick={startRecording} aria-pressed={isRecording}>
      {isRecording ? "Press a key…" : binding}
    </button>
  );
}
```

Confirm the recorder's hook name in the current docs — `0.x` naming is still moving. What matters is the flow: record a combo, store it, feed it back as the binding.

## 4. Store the binding, then apply it

```ts
// src/hotkeys/bindings.ts
export const DEFAULT_BINDINGS = {
  palette: "Mod+K",
  save: "Mod+S",
} as const;

export type ActionId = keyof typeof DEFAULT_BINDINGS;

export function loadBindings(): Record<ActionId, string> {
  const raw = localStorage.getItem("hotkeys");
  return raw ? { ...DEFAULT_BINDINGS, ...JSON.parse(raw) } : DEFAULT_BINDINGS;
}
```

Read the map once at startup and pass each action's combo into `useHotkey(action.combo, ...)`. A hardcoded string at the call site makes remapping impossible without touching components.

## 5. Audit conflicts before shipping

1. List every registered combo per scope in a table — two actions with the same combo in the same scope is a bug, not a feature
2. Grep the binding map for browser-owned combos (`Mod+T`, `Mod+W`, `Mod+N`, `Mod+P`)
3. `/run-test` — dispatch each combo and assert exactly one handler ran
4. Test a partial sequence: press `G` then wait past the window, then `H` — the sequence must reset, not fire

## Pitfalls

- A recorder that accepts `Mod+T`, which the browser consumes before the page sees it.
- Persisting a remapped combo but keeping the default in the help overlay, so the cheat sheet lies.
- Clearing the user's `localStorage` on every release, silently reverting their bindings.
- Nesting two providers where the outer one also binds the same combo, producing a double fire that looks like a race.

## Related

- `references/apis.md`
- `best-practices/tanstack-hotkeys.md`
- `usecases/command-palette-mod-k.md`
