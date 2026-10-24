---
name: follow-lib-gpuix
description: Use GPUIX — React/Solid renderers for Zed's GPUI with native GPU windows
argument-hint: "[element|event|feature]"
related:
  - follow-lib-gpui-kit
  - follow-lib-solidjs
  - follow-lib-react
  - follow-create-desktop-tauri
  - follow-lib-native-sdk
  - learn-from-web
  - deep-research
  - deep-validate
---

## Goal

Build desktop applications with GPUIX — a React reconciler and a Solid universal renderer that share one mutation-based runtime over Zed's GPUI — where JSX renders into a real GPU-native window on macOS, Windows, and Linux, or into a browser wasm build, with no Electron and no webview

## Scope

When a project depends on `@gpuix/react`, `@gpuix/solid`, `@gpuix/native`, or `@gpuix/cli` — app shells, elements, styles, events, overlays, headless primitives, automation, testing, packaging

- docs site: <https://gpuix.dev> (all docs are one file: <https://gpuix.dev/docs.zip>; single-page source of truth for elements, events, styles, and automation)
- two adapters, one runtime: pick React (`jsxImportSource: "@gpuix/react"`) or Solid (`jsxImportSource: "@gpuix/solid"`) — API names are identical, only the framework idiom differs
- element, event, style, and automation surface: [references/apis.md](references/apis.md)
- `gpuix` CLI (scaffold + shell completions): [references/cli.md](references/cli.md)
- recommended patterns and pitfalls:
  - [runtime-and-rendering.md](best-practices/runtime-and-rendering.md) — reconciler, retained tree, host contracts
  - [styling-and-events.md](best-practices/styling-and-events.md) — GPUI style keys, events, focus, pointer capture
  - [overlays-and-focus.md](best-practices/overlays-and-focus.md) — layer stacking, dismissal, focus traps
  - [text-and-collections.md](best-practices/text-and-collections.md) — text merging, markdown/diff, virtual lists
  - [testing-and-automation.md](best-practices/testing-and-automation.md) — test root, locators, native simulate
  - [shipping-and-hot-reload.md](best-practices/shipping-and-hot-reload.md) — hot reload, compile, packaging, updates
- end-to-end recipes: `usecases/` — see the Use Cases table at the end of `## Execute`
- not this skill: Rust-native GPUI apps → `/follow-lib-gpui-kit`; webview shells → `/follow-create-desktop-tauri`; `.native` markup compiled AOT → `/follow-lib-native-sdk`

- References: [apis](references/apis.md) · [cli](references/cli.md) · best-practices/

## Execute

### 1. Check Manifest And Pin Version

> Goal: one exact version across every `@gpuix/*` package before writing code

1. Run `cargo`-style install through Bun: `bun add --exact @gpuix/react @gpuix/native` (React) or `bun add --exact @gpuix/solid @gpuix/native` (Solid); React 19.2+ / `solid-js` 1.9 are peer deps
2. Pin the adapter and `@gpuix/native` to the same exact version — the packages are pre-1.0 and the JS side calls straight into the napi-rs/wasm binding, so a floating `^` range can pair mismatched JS and native code
3. `@gpuix/native` resolves the platform binary from optional deps (`native-darwin-arm64`, `native-win32-x64-msvc`, `native-win32-arm64-msvc`, `native-linux-x64-gnu`) — a missing platform package fails at import, not at install
4. Confirm the live version with `/deep-research` or `/check-update` before pinning; latest stable published ≥7 days is the pin (see [references/apis.md](references/apis.md))

### 2. Scaffold App Skeleton

> Goal: a renderable window in one entry file

1. Scaffold with `bunx @gpuix/cli new my-app`; `gpuix completions install` adds shell completions
2. `tsconfig.json` for React: `jsx: "react-jsx"`, `jsxImportSource: "@gpuix/react"`, `moduleResolution: "bundler"`, `strict: true`, `noEmit: true`; for Solid: `jsx: "preserve"`, `jsxImportSource: "@gpuix/solid"`, plus `preload = ["@gpuix/solid/preload"]` in `bunfig.toml` so Bun compiles JSX through babel-preset-solid
3. Entry file ends with a single `render(<App />, { title, width, height })` — never call `createRenderer()`/`init()` there; `render()` is idempotent
4. Run with `bun --hot app.tsx` — the saved file remounts inside the same window; Node.js runs the app but gives no hot reload
5. Build a binary with `bun build --compile app.tsx --outfile dist/app`; ship it with cargo-packager per `usecases/distribution-and-updates.md`

### 3. Apply The Runtime Model

> Goal: correct state and frame behavior

1. JSX is reconciled in JS and committed as one atomic `applyBatch([...])` into a Rust `RetainedTree`; each frame the Rust side calls `GpuixView::render()`, rebuilds ephemeral GPUI elements, and lays them out with Taffy inside GPUI
2. Element IDs are plain incrementing numbers; React concurrent work that gets abandoned never reaches Rust, because host nodes stay in JS until the accepted subtree commits
3. One renderer drives exactly one root — a second `createRoot()` mount throws; keep `render()` as the single entry and use `createRenderer()`/`createRoot()`/`startFrameLoop()` only for tests or a custom host
4. Events exist in Rust only as a boolean (`setEventListener`); the actual closures live in a JS registry keyed by `(elementId, eventType)` and Rust calls back with `emit_event_full(...)`
5. Adapter-agnostic host surfaces are `MutationHost` (`Pick<GpuixRenderer, "applyBatch">`), `WindowSizeHost`, and `SelectionHost`; `NativeRenderer` is `MutationHost` plus window and selection — use these types when writing a custom host

### 4. Compose Elements And Styles

> Goal: layout that matches GPUI semantics, not CSS muscle memory

1. Choose from the element set: `div`, `text`, `code`, `diff`, `markdown`, `input`, `textarea`, `virtual-list`, `img`, `svg`, `anchored` (`canvas` is planned)
2. `div` is block by default — set `display: "flex"` before `flexDirection`/`gap`/`alignItems`; a flex child needs `minWidth: 0` to shrink below content size
3. No shorthand CSS: write `padding`/`paddingLeft` individually, `borderWidth`/`borderColor` separately, and drop `calc()` — shorthand strings are ignored, not parsed
4. Adjacent `<text>` siblings merge into one line; never nest `<text>` inside `<text>` — split multi-line content into separate `<text>` elements in a flex column (`white-space: pre` is unsupported)
5. There is no `<button>`: use `<div onClick>` with `cursor: "pointer"`; `<input>` has no default inner padding
6. Use `hover`/`active`/`focusVisible` nested style objects — they apply natively with no JS round trip, one level deep, on every element except `<virtual-list>`

### 5. Wire Events, Focus, And Overlays

> Goal: interaction that survives outside-window drags and paints in the right order

1. A node with both `onMouseDown` and `onMouseMove` captures the pointer, so move/up keep firing outside the window; hooks exist for every event in [references/apis.md](references/apis.md)
2. Keyboard and focus listeners auto-create a `FocusHandle` but add no tab order — set `tabIndex={0}` explicitly
3. Tree order is paint order: GPUIX has no `z-index`. Render overlays through `<anchored>` (deferred for a later pass) and give every overlay an opaque fill (`#232323`, not `#23232399`)
4. Full-window modal: portal via `<anchored fill="window">` — it paints over `<virtual-list>` and blocks pointer and wheel input; pair it with `DismissableLayer` (`onEscapeKeyDown` + `initialFocus()`) from `@gpuix/react` or `@gpuix/solid`, or `pushDismissLayer(renderer, layer, { previousFocus })` without a framework
5. While a control holds keyboard focus every other focusable element renders at 40% opacity; opt out per element with `style.keyboardFocusDim: false` or per window with `render(..., { keyboardFocusDim: false })`

### 6. Test, Automate, And Verify

> Goal: prove behavior without a human at the mouse

1. `createTestRoot()` + `connectTest(renderer)` drives the real runtime — the same `GpuixView`, `build_element()`, style application, and event handlers as production, rendered offscreen by Metal/DirectX
2. Locate with `getByTestId`/`getByText`/`getByType`, act with `click`/`fill`/`press`/`wheel`/`drag`, wait with `waitFor`, and inspect with `textContent`/`count`/`screenshot`
3. Time-dependent UI: `app.clock.pause()/set(ms)/fastForward(ms)`; capture with `app.captureFrames(dir, timestamps)` or `app.recordVideo({ path, fps })` (needs ffmpeg)
4. Live apps: `launch({ command: "bun", args: [...], env: { GPUIX_BACKGROUND: "1" } })` then `app.close()`; browser builds expose `globalThis.gpuix` after `render()`
5. Run `/follow-tool-vitest` for the test runner and `/deep-test unit` for the suite; then `/deep-validate` before shipping

### Use Cases

| Scenario | Use case |
|----------|----------|
| First window, entry file, and dev loop | `usecases/desktop-quickstart.md` |
| Solid adapter instead of React | `usecases/solid-adapter.md` |
| Chat-style transcript with lists, diffs, Markdown | `usecases/chat-transcript.md` |
| Unstyled primitives, dialogs, menus, tooltips | `usecases/headless-controls-and-overlays.md` |
| Agent- or CI-driven UI verification | `usecases/agent-driven-verification.md` |
| Binary packaging and auto-update | `usecases/distribution-and-updates.md` |

## Rules

### 1. Official Docs First

- Read <https://gpuix.dev> (or the `docs.zip` dump) before using an unfamiliar element, event, or style key — every key is validated by the Rust side and unknown ones are dropped silently
- Never assume a CSS feature exists: no shorthands, no `calc()`, no `z-index`, no radial/conic gradients, exactly two gradient stops, no `<button>`
- Colors go through csscolorparser 0.8 (named, hex 3/4/6/8, rgb/rgba, hsl/hsla, hwb, hsv, lab/lch, oklab/oklch) and are clipped to sRGB; an invalid color string is dropped per property and does not reject the style object

### 2. Version And Host Discipline

- Keep every `@gpuix/*` package at one exact version — mismatched adapter and `@gpuix/native` is the most common pre-1.0 breakage
- Custom host: implement `MutationHost` (+ `WindowSizeHost`/`SelectionHost` when needed) and feed `applyBatch` batches into the retained tree; do not mutate the tree outside a batch
- Store the renderer/root handle outside `render()` when you need automation or frame control — `render()` remains the app entry

### 3. Performance

- Long lists go to `<virtual-list>` — only visible rows are built; never map thousands of `div`s
- Overlays must be opaque and deferred (`<anchored deferred>`); a transparent overlay still paints the layers below every frame
- `flushSync` forces a synchronous commit when a subsequent native read must see it; do not use it as a default render path
- `onLayout` fires one frame after layout and reports size only (no `ResizeObserver` callback content) — avoid layout feedback loops

### 4. Boundaries

- Rust-native GPUI component work → `/follow-lib-gpui-kit`; do not mix `gpui-kit` and GPUIX in one app
- Webview-based desktop → `/follow-create-desktop-tauri`; AOT `.native` markup → `/follow-lib-native-sdk`
- Browser-only React or Solid UI → `/follow-lib-react` / `/follow-lib-solidjs` / `/follow-solid-framework` — GPUIX is for windows (or a wasm canvas), not DOM parity

- Use `/deep-research` or `/learn-from-web` to confirm APIs before writing them
- Use `/follow-lang-typescript` for the surrounding toolchain
- See `best-practices/` for recommended patterns and pitfalls
- See `usecases/` for feature-level recipes with doc-verified code

## Expected Outcome

- `@gpuix/*` packages pinned to one exact, ≥7-day-stable version, with the platform binary resolving
- The app boots from a single `render()` call and hot-reloads under `bun --hot`
- Layout, styling, events, focus, and overlays follow GPUI semantics (flex opt-in, `minWidth: 0`, paint order, opaque deferred overlays)
- Automation and tests drive the real runtime through `createTestRoot` + `connectTest`
- A compiled binary ships through cargo-packager, with opt-in signed auto-update
- `bun build --compile` and the test suite pass; `/deep-validate` is clean
