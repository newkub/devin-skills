# Use Case — Command Palette on Mod+K

> Wire one cross-platform shortcut to a palette, plus navigation shortcuts that never fire while typing. Source: https://tanstack.com/hotkeys/latest (accessed 2026-10-20)

## 1. Install the framework adapter

```bash
bun add @tanstack/react-hotkeys
```

Use the adapter for the framework actually in the project — the hook names are framework-specific, and the package is `0.x`, so confirm the current signatures before writing them.

## 2. Put the provider at the app root

```tsx
// src/main.tsx
import { HotkeysProvider } from "@tanstack/react-hotkeys";

root.render(
  <HotkeysProvider>
    <App />
  </HotkeysProvider>,
);
```

The provider owns scope resolution. Mounting it inside a route means shortcuts registered above it have no scope to belong to.

## 3. Register the palette shortcut

```tsx
// src/CommandPalette.tsx
import { useState } from "react";
import { useHotkey } from "@tanstack/react-hotkeys";

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useHotkey("Mod+K", () => setOpen((v) => !v), {
    preventDefault: true,
    enabled: !isTypingInRichEditor(),
  });

  return open ? <Palette onClose={() => setOpen(false)} /> : null;
}
```

`Mod` resolves to Cmd on macOS and Ctrl elsewhere, so one binding covers both. Writing `Ctrl+K` matches only the non-Mac half of the users.

## 4. Add shortcuts that must not collide

| Action | Binding | Note |
|--------|---------|------|
| open palette | `Mod+K` | toggle, `preventDefault` |
| close palette | `Escape` | owned by the palette scope, not global |
| go home | `G>H` | two-key sequence |
| open help | `Shift+?` | `preventDefault` or the browser opens quick-find |

Keep sequences at two keys. `G>G>H` reads like a cheat code, not a shortcut.

## 5. Test the handler, not the visual

```tsx
fireEvent.keyDown(document, { key: "k", ctrlKey: true });
expect(screen.getByRole("dialog")).toBeVisible();
```

1. `/run-test` — assert the palette opens on `Mod+K`
2. Focus a `<textarea>` and repeat — the palette must stay closed
3. Press `Escape` while the palette is open — it closes and the global scope is unchanged
4. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Registering the same combo in two components so both handlers run; one action fires twice.
- Binding `Mod+T`/`Mod+W`/`Mod+N`, which are the browser's own tab and window shortcuts and cannot be reliably overridden.
- `preventDefault` on every shortcut, which kills the browser's find and reload during normal typing.
- Hotkeys that exist only as shortcuts, with no button or menu path — unusable on touch and for screen-reader users.

## Related

- `references/apis.md`
- `best-practices/tanstack-hotkeys.md`
- `usecases/scoped-shortcuts-and-remapping.md`
