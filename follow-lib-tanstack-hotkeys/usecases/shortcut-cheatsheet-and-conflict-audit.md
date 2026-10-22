# Use Case — Cheat Sheet and Conflict Audit From One Registry

> Keep every shortcut discoverable in a help overlay and prove at test time that no two bindings collide. Source: https://tanstack.com/hotkeys/latest (accessed 2026-10-20)

## 1. Registry holds metadata, components hold handlers

```ts
// src/shortcuts/registry.ts
export type ShortcutGroup = "global" | "navigation" | "editor"

export const SHORTCUTS = [
  { id: "palette.open", keys: "Mod+K", label: "Open command palette", group: "global" },
  { id: "help.open",    keys: "Shift+?", label: "Show shortcuts",       group: "global" },
  { id: "nav.home",     keys: "G>H",     label: "Go home",              group: "navigation" },
  { id: "nav.top",      keys: "G>G",     label: "Go to top",            group: "navigation" },
  { id: "editor.save",  keys: "Mod+S",   label: "Save",                 group: "editor" },
] as const satisfies readonly { id: string; keys: string; label: string; group: ShortcutGroup }[]
```

The registry never calls a hook. Hooks cannot run in a loop over a list, so each surface registers its own binding and the registry stays pure data both the overlay and the tests can import.

## 2. Bind where the action lives

```tsx
// src/Editor.tsx
useHotkey("Mod+S", save, { preventDefault: true })
```

```tsx
// src/App.tsx
useHotkey("Mod+K", openPalette, { preventDefault: true })
useHotkey("Shift+?", openHelp, { preventDefault: true })
useHotkey("G>H", () => navigate("/"))
```

One binding per action, registered at the scope that owns it — the registry's `keys` string is documentation, not a second source that can drift, so keep them next to each other in review.

## 3. Render the overlay from the registry

```tsx
export function ShortcutSheet({ onClose }: { onClose: () => void }) {
  const groups = Object.groupBy(SHORTCUTS, (s) => s.group)

  return (
    <dialog open onClose={onClose} aria-label="Keyboard shortcuts">
      {Object.entries(groups).map(([group, items]) => (
        <section key={group}>
          <h3>{group}</h3>
          <dl>
            {items!.map((s) => (
              <div key={s.id}>
                <dt><kbd>{s.keys}</kbd></dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
      <button onClick={onClose}>Close</button>
    </dialog>
  )
}
```

`<kbd>` gives assistive tech the right semantics, and grouping by scope mirrors how the bindings are mounted.

## 4. Audit conflicts in a test, not by eye

```ts
import { SHORTCUTS } from "../src/shortcuts/registry"

test("no two global shortcuts share a key", () => {
  const seen = new Map<string, string>()
  for (const s of SHORTCUTS) {
    const key = normalize(s.keys)          // Mod → Meta/Ctrl handled separately below
    const prev = seen.get(key)
    expect(prev, `${s.keys} used by ${prev} and ${s.id}`).toBeUndefined()
    seen.set(key, s.id)
  }
})

function normalize(keys: string) {
  return keys.toLowerCase().replace(/\s+/g, "")
}
```

Duplicate keys across scopes are allowed by design; the audit only needs to prove uniqueness *within* a scope, so filter by `group` before comparing.

## 5. Verify

1. `/run-test` — the conflict test passes; add a deliberate duplicate and watch it fail
2. Press `Shift+?` — the sheet opens and lists every registry entry
3. Each listed row has a click path elsewhere in the UI (menu item or button)
4. Screen reader: the dialog has a label and `<kbd>` text is announced
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Rendering the overlay from a hard-coded list while bindings live in components → the sheet claims keys nobody handles.
- Registering all bindings in a `SHORTCUTS.map()` → hooks inside a loop; register per component.
- Comparing raw strings in the audit → `Mod+K` and `Ctrl+K` look different but collide on Windows; normalize before checking.
- Listing macOS-only chords on a cross-platform app → `Mod` renders as `⌘K` on Mac and `Ctrl+K` elsewhere; format per platform.
- A cheat sheet with no groups → 30 flat rows nobody reads; group by surface.

## Related

- `references/apis.md`
- `best-practices/tanstack-hotkeys.md`
- `usecases/command-palette-mod-k.md`
- `usecases/scope-layering-for-modals-and-editors.md`
