# GPUI Kit — Component Composition

## Recommended Patterns

### Controlled Components

- main pattern: the component emits the requested value via `on_change` → the owner view stores the state itself → `cx.notify()`
- example: `Checkbox::new("id").label("...").checked(self.flag).on_change(cx.listener(|v, checked, _, cx| { v.flag = *checked; cx.notify(); }))`
- the owner is the single source of truth — the component holds no state of its own (except `*State` entities that the owner holds for it)

### Builder + Shared Traits

- every component uses a builder chain — `Component::new(id).prop(...).on_*(cx.listener(...))`
- trait `Sizable`: `text_xs`/`text_sm`/`text_base`/`text_lg` — must `use gpui_kit::component::Sizable as _;` to call the methods
- trait `Disableable`: `disabled(bool)` — imported the same way
- layout with `div()`/`v_flex()`/`h_flex()` + tailwind-style methods: `flex_col`, `size_full`, `gap_2`, `p_4`, `items_center`, `justify_center`

### App Shell

- skeleton: `main()` → `application().with_assets(assets::Assets).run(|cx| { init(cx); open_window(WindowOptions::default(), cx, |_, cx| cx.new(|_| MyView)).expect(...) })`
- `open_window` wraps the view in a `Root` automatically — return the content view directly, never create a `Root` yourself
- the view implements `Render` — `render(&mut self, _: &mut Window, cx: &mut Context<Self>) -> impl IntoElement`

### Imports And Dependency

- one dependency, `gpui-kit` — it re-exports `gpui`, components live under `gpui_kit::component::*`
- don't add `gpui`/`gpui-component`/`gpui-base` separately — the versions can conflict
- import pattern: `use gpui_kit::component::<name>::<Type>;`

## Do / Don't

| Do | Don't |
|---|---|
| apply the `on_change` value in the listener then `cx.notify()` | expect the component to change state itself |
| pick a component from the catalog then check its docs page before use | guess props/methods from the name |
| import the `Sizable`/`Disableable` trait before calling the method | call `.text_sm()` without importing the trait |
| compose with `v_flex`/`h_flex` + gap/padding | nest `div()` deeply without need |
| use the single `gpui-kit` crate | add `gpui`/`gpui-component` separately in `Cargo.toml` |

## Common Pitfalls

- creating `Root` yourself → the overlay system (dialog/sheet/notification) stacks or breaks — `open_window` already does it
- component `id`s must be unique within the parent — reusing an id collides focus/interaction state
- forgetting `init(cx)` → theme/component defaults aren't set up — runtime error or lost styling
- hardcoding custom colors instead of `cx.theme()` — dark/light theme won't follow

## Performance Notes

- components are `RenderOnce` — recreating them every render is normal and cheap
- what's expensive is `Entity` creation inside render (see `state-model.md`) — move it to the constructor
- for long lists use the kit's virtualized list component instead of rendering every row

## Ecosystem / Integration

- component catalog: `gpui-kit.com/component/<name>` — check the real page before using an unfamiliar component
- API reference: `docs.rs/gpui-component` and `docs.rs/gpui-kit`
- platform deps per `/docs/installation` — fontconfig/x11/vulkan on Linux, MSVC on Windows
- license: code Apache-2.0, docs CC BY 4.0 — credit when copying docs
