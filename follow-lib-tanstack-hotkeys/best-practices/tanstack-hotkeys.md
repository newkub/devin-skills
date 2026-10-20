# TanStack Hotkeys — Best Practices

Type-safe keyboard shortcuts — modifiers, sequences, scopes

## Recommended Patterns

- Bind with `Mod` so one definition covers Cmd on macOS and Ctrl elsewhere
- Scope bindings with the provider (global, modal, editor) and rely on the innermost scope winning
- Leave the default input guard on so typing in inputs and contentEditable does not fire app shortcuts; opt in with form-tag support only where intended
- Keep sequences to two or three keys; a partial sequence should reset cleanly
- Call `preventDefault` only for combinations the app truly owns
- Maintain a shortcut registry and render a help overlay so users can discover bindings
- Treat shortcuts as accelerators — every action also needs a pointer path
- Test by dispatching keydown events and asserting the handler ran in the right scope

## Common Pitfalls

- Binding Ctrl and Cmd separately instead of `Mod`, which drifts across platforms
- Two scopes binding the same combination with no intended precedence
- Stealing browser-reserved combinations (`Mod+T`, `Mod+W`, `Mod+N`) and blocking the user
- Shortcuts firing while the user types in a search box
- No cleanup on unmount leaves stale handlers after navigation
- Sequences longer than three keys, which users cannot discover or remember
- Relying on shortcuts as the only way to trigger an action

## Perf Notes

- Register bindings once at the scope level rather than per row or per item
- Avoid re-creating handler closures on every render; pass stable callbacks
- Keep global listeners few — heavy key tracking costs on every keydown

## Do / Don't

| Do | Don't |
|----|-------|
| `Mod` for cross-platform | separate Ctrl and Cmd bindings |
| scoped providers | one global bucket for everything |
| ignore inputs by default | shortcut firing inside a text field |
| short sequences | long chord chains |
| help overlay + registry | hidden, undocumented shortcuts |
