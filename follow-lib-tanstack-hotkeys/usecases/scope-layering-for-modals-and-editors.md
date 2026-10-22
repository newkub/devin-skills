# Use Case — Scope Layering for Modals, Editors, and the Global App

> Keep the same key meaning different things per surface, with the innermost scope winning and no shortcut leaking behind a dialog. Source: https://tanstack.com/hotkeys/latest (accessed 2026-10-20)

## 1. One provider per surface, not one global bucket

```tsx
// src/app/Shortcuts.tsx
import { HotkeysProvider } from "@tanstack/react-hotkeys"

export function Shortcuts() {
  return (
    <HotkeysProvider>            {/* global app scope */}
      <AppShell />
      <ComposerModal />
    </HotkeysProvider>
  )
}

function ComposerModal() {
  const open = useComposerStore((s) => s.open)
  return open ? (
    <HotkeysProvider>          {/* modal scope: innermost wins */}
      <ModalBody />
    </HotkeysProvider>
  ) : null
}
```

Mounting the modal's provider only while it is open means its bindings do not exist when the dialog is closed — no `enabled` flag to keep in sync with the UI.

## 2. Bind the same key differently per scope

| Key | Global scope | Modal scope | Editor scope |
|-----|--------------|-------------|--------------|
| `Enter` | — | submit comment | insert newline |
| `Mod+Enter` | — | submit | run query |
| `Escape` | close palette | close modal | leave fullscreen |
| `Mod+K` | open palette | — (inherits nothing) | command popover |

Inside the modal, `Mod+Enter` submits; on the page it does nothing. That is the whole point of scoping — the same chord is free for a different meaning.

## 3. Let inputs swallow shortcuts by default

```tsx
function Editor() {
  useHotkey("Mod+Enter", runQuery)
  useHotkey("Mod+S", save, { preventDefault: true })
  useHotkey("Enter", insertNewline, { enableOnFormTags: true })   // opt in explicitly
  return <textarea aria-label="SQL" />
}
```

The default input guard is what stops `G>H` from navigating while the user types a name. Opt in with `enableOnFormTags` only for bindings that belong inside the editor, and never for navigation.

## 4. Guard against a binding firing twice

```tsx
function SearchBox() {
  useHotkey("Escape", () => {
    if (hasQuery()) clearQuery()      // local meaning first
    else blur()                        // then the outer meaning
  }, { target: inputRef })
  return <input ref={inputRef} />
}
```

Tie the local handler to the element that owns it (`target`) instead of registering a second global `Escape`; two global handlers both run and the user sees two actions.

## 5. Verify

1. `/run-test` — inside the modal, `Mod+Enter` submits; behind it, the same chord reaches nothing
2. Focus the search input — navigation sequences do not fire; `Escape` clears the query first
3. Unmount the modal — its handlers are gone (dispatch the key again, nothing happens)
4. `/run-typecheck` — binding strings and options stay typed
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- One `HotkeysProvider` at the root and `enabled` flags everywhere → the flags drift from the UI state; scope where the surface lives.
- A modal registering global bindings instead of its own scope → `Escape` closes the dialog *and* the page behind it.
- Leaving `enableOnFormTags` on for every binding → typing a `j`/`k` in a text field scrolls the list under the caret.
- Registering a hotkey inside a list row → one handler per row; register once at the list level and read the focused item.
- Relying on the shortcut alone → keyboard-only users without a documented cheat sheet never find it.

## Related

- `references/apis.md`
- `best-practices/tanstack-hotkeys.md`
- `usecases/command-palette-mod-k.md`
- `usecases/shortcut-cheatsheet-and-conflict-audit.md`
