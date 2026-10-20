---
name: follow-lib-gpui-kit
description: Use GPUI Kit (gpui-kit) for Rust/GPUI desktop apps — components, themes, Entity/Render model
argument-hint: "[component-or-feature]"
related:
  - follow-lang-rust
  - deep-research
  - learn-from-web
  - deep-validate
---

## Goal

Use GPUI Kit — Longbridge's component library on GPUI (the UI framework from Zed) — to build desktop applications in Rust correctly per the official docs

## Scope

When a project installs or develops the `gpui-kit` crate (Rust) — components, themes, the Entity/Render model, window/app shell, input state, testing

- docs site: <https://gpui-kit.com> (has an `llms-full.txt` combining all docs into one file)
- the `gpui-kit` crate bundles GPUI + GPUI Base + GPUI Component + default icon assets in a single dependency — `use gpui_kit::*` re-exports GPUI essentials, components live under `gpui_kit::component::*`
- API reference: `docs.rs/gpui-kit` and `docs.rs/gpui-component`
- full component catalog, feature flags, API tables, and platform requirements are in `references/apis.md`
- recommended patterns and pitfalls are in `best-practices/components.md` and `best-practices/state-model.md`
- end-to-end usage recipes per application domain (code verified against official docs) are in `usecases/`: app shell, forms/inputs, data tables & charts, chat UIs, overlays & command palette, dock + editor, settings/theme/i18n, async/streaming, testing/a11y, WebAssembly

## Execute

### 1. Check Manifest And Version

> Goal: confirm the real version before writing code

1. Check the project's `Cargo.toml` for `gpui-kit`
2. Run `cargo search gpui-kit --limit 3` or `cargo info gpui-kit` (or `/deep-research`) to confirm the latest version — verify live every time, no version pin in this skill
3. Install with `cargo add gpui-kit`
4. Pull metadata + links from the official docs via `/learn-from-web`

### 2. Scaffold App Skeleton

> Goal: boot the app correctly per the official pattern

1. `main()` calls `application().with_assets(assets::Assets).run(|cx| { init(cx); open_window(WindowOptions::default(), cx, |_, cx| cx.new(|_| MyView)).expect(...) })` — full skeleton in `best-practices/components.md` (`### App Shell`), API tables in `references/apis.md`
2. `init(cx)` must be called before opening a window or creating components — it initializes Kit layers + component themes
3. `open_window` wraps the view in a `Root` automatically (Root owns the dialog/sheet/notification overlays) — return the content view directly, never build a `Root` yourself
4. the view struct implements `Render` — `render(&mut self, _: &mut Window, cx: &mut Context<Self>) -> impl IntoElement`

### 3. Apply Entity/Render Mental Model

> Goal: use the state model correctly

1. `Entity<T>` = retained state across frames; when `T: Render` the entity is a persistent View that rebuilds its element tree on every render
2. A `RenderOnce` component = a value the caller passes state + handlers into — use for reusable pieces with no permanent state
3. Stateful inputs (Input, Editor, etc.) are stored as `Entity<InputState>` in the owner view — `cx.new(|cx| InputState::new(window, cx))` then subscribe via `cx.subscribe_in(&state, window, ...)` keeping the `Subscription` in the struct
4. Callbacks use `cx.listener(|this, ev, _, cx| { ...; cx.notify(); })` — always update state then `cx.notify()`
5. Read theme colors via `cx.theme()`, e.g. `.bg(cx.theme().background)` `.text_color(cx.theme().foreground)`

### 4. Select And Compose Components

> Goal: pick the right component and use its API correctly

1. Choose from the catalog in `references/apis.md` — import pattern `use gpui_kit::component::<name>::<Type>;`
2. Building a whole feature (sidebar shell, chat thread, DataTable, command palette, settings screen, dock workspace, streaming tasks)? Start from the matching `usecases/<domain>.md` — it has the verified wiring and pitfalls
3. Builder pattern: `Checkbox::new("id").label("...").checked(self.flag).on_change(cx.listener(|v, checked, _, cx| { v.flag = *checked; cx.notify(); }))`
4. Shared traits: `Sizable` (`text_xs`/`text_sm`/`text_base`/`text_lg`) and `Disableable` (`disabled(bool)`) — import the trait with `use gpui_kit::component::Sizable as _;`
5. Layout with `div()`/`v_flex()`/`h_flex()` + tailwind-style methods (`flex_col`, `size_full`, `gap_2`, `p_4`, `items_center`, `justify_center`)
6. `on_change` emits the requested value — the owner stores the value itself and calls `cx.notify()` (controlled component pattern)

### 5. Background Work And Events

> Goal: handle async/tasks correctly

1. `cx.spawn(async move |this, cx| ...)` = a foreground task on the UI thread — update the entity via `this.update(cx, |view, cx| ...)` or a `WeakEntity`
2. `cx.background_spawn(async move { ... })` = heavy work on the worker pool — return owned `Send` data only, never mutate the entity directly
3. `Task<T>` handle: drop = cancel — always keep the handle in a struct field if the work must continue; use a request_id to guard against stale results — full pattern in `usecases/async-and-streaming.md`
4. keyboard/action: `Action` derive + `cx.bind_keys`/`KeyBinding` per the guide docs

### 6. Verify

> Goal: build + test pass

1. `cargo build` — fix errors until it passes (GPUI needs platform deps: see `/docs/installation`)
2. UI tests use the GPUI test harness (`#[gpui_kit::test]` + `test-support` dev-dep — levels, wiring, and gotchas in `usecases/testing-and-a11y.md`)
3. Run `/deep-validate` before shipping

## Rules

### 1. Official Docs First

- Main docs: `gpui-kit.com` — fetch `llms-full.txt` when you need the whole site's docs
- Component page pattern: `gpui-kit.com/component/<name>` — check the real page before using an unfamiliar component
- Never guess props — if unsure, read the docs page or `docs.rs` first

### 2. Ownership

- `Task`/`Subscription` must be stored in struct fields — dropping means cancel/detach
- Input component state lives in `Entity<*State>` owned by the view — never recreate it inside `render`
- `on_change` = requested value only — the owner applies it

### 3. Single Dependency

- Use `gpui-kit` alone — don't add `gpui`, `gpui-component`, `gpui-base` separately (the kit re-exports them as `gpui_kit::component`, `gpui_kit::base`, `gpui_kit::assets`, `gpui_kit::platform`)
- Platform system deps (fontconfig, x11, vulkan, etc. on Linux; MSVC + CMake on Windows) per `/docs/installation` — table in `references/apis.md`
- Engine selection is a Cargo feature (`gpui-fast`), never a separate dependency — same imports, no `[patch]`

### 4. Licensing

- Code is Apache-2.0; docs prose CC BY 4.0 — credit GPUI Kit + link the source when copying documentation

- Use /deep-research if needed
- Use /follow-lang-rust if needed
- See best-practices/ for recommended patterns and pitfalls
- See usecases/ for feature-level recipes with doc-verified code

## Expected Outcome

- `gpui-kit` installed at the latest stable version
- The app skeleton boots with `application()` + `init(cx)` + `open_window`
- Components follow the controlled pattern correctly (`on_change` + owner state + `cx.notify()`)
- Tasks/subscriptions have owners and never leak
- `cargo build` passes, ready for desktop use (and the WebAssembly target as well)
