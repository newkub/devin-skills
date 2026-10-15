# .native Markup Patterns

markup is purely declarative UI — no logic besides binding expressions derived from the `Model`

## Recommended patterns

- **Layout with flex primitives:** `<row>`/`<column>` with `gap padding grow` + `main` (cross-axis alignment: `center`) and `cross` — e.g. a header row:
  ```xml
  <column gap="12" padding="16">
    <row gap="8" cross="center">
      <text grow="1">Counter</text>
      <button size="sm" variant="ghost" on-press="reset">Reset</button>
    </row>
    <text>{count}</text>
    <status-bar>total: {total} | stamped: {stampedMs}ms</status-bar>
  </column>
  ```
- **Binding syntax:** `{expr}` — exactly one expression per attribute; text nodes bind directly (`<text>{count}</text>`)
- **Event = dispatch Msg:** `on-press="increment"`, parameterised: `on-press="toggle:{t.id}"` — markup never calls functions, it only sends msgs to `update`; other events: `on-toggle on-change on-submit on-input on-scroll on-resize on-drag on-dismiss on-hold on-hover-enter on-hover-leave on-double-press`
- **Control flow is limited to what exists:** `<for each="{items}" key="{it.id}" as="t">`, `<if test="{model.loading}">…<else>…` — no switch/computed in markup → derive a field in the Model instead
- **The expression language is a closed lib:** operators `+ - * / == != < <= > >= and or not ++` + 17 functions: `upper lower trim min max abs round floor ceil plural pad fixed thousands percent date time datetime` — no method calls, no ternary, limits: 256B/64 terms/16 levels → if an expression runs longer than this, move it into a computed field in the core
- **Component reuse:** `<template name="row-item" args="title subtitle">…<slot/></template>` + `<use template="row-item" title="{x}">` + `<import src="src/components/row-item.native">` — convention: shared components live under `src/components/`
- **Always theme with token names** (never hardcode colors): `background surface surface_subtle text text_muted border accent destructive success warning info focus_ring scrim disabled` + radii `sm md lg xl none` — the pack is chosen in `app.json` (`house`/`geist`), runtime overrides go through `themeState(model): ThemeState {pack?, colorScheme, accent, highContrast, reduceMotion}`
- **Widget identity is structural** — duplicates need `key` (in `<for>`) or `global-key`, otherwise automation/state mapping goes wrong
- **Native controls when you want OS feel:** `toolbar titlebar_accessory sidebar statusbar split stack button icon_button list_item checkbox toggle segmented_control text_field search_field label progress_indicator webview` — text pipelines use `|` separators

## Pitfalls

- **the `switch` element in the counter template** is not a Msg — it's an element named `switch` (like a toggle); don't confuse it with control-flow
- **attribute values are strings** — numbers/booleans in bindings must match the type the core expects (`checked="{ticking}"` must yield a Bool from the Model)
- **lists/grids need virtualization awareness** — for large datasets use `<scroll>` + `<list>`, not nested `<for>` inside a `stack`
- **the terminal element** `<terminal pty="{key}">` pairs with `Cmd.ptySpawn/Write/Resize/Kill` (libghostty-vt; Windows ConPTY requires 1809+) — never send bytes before the spawn succeeds
- **dynamic images** must be model-owned `ImageId`s through `Cmd.imageLoad(id,…)` — cap of 16 slots, unregister when done
- **markup reload under `native dev`** hot-reloads while state is kept — but bindings referencing new fields must pass `native check` first, since the checker runs on the core side
- **debug tools:** `native markup check|dump|lsp` — use `dump` to see the parse result before guessing where the markup went wrong
