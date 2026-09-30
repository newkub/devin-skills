# GPUI Kit — Getting Started

Source: <https://gpui-kit.com/docs/getting-started>

## Install

```sh
cargo new gpui-hello && cd gpui-hello
cargo add gpui-kit
```

Single dependency includes GPUI + GPUI Base + GPUI Component + default icon assets. Access GPUI via `use gpui_kit::*;` and components via `gpui_kit::component::*`. Platform system deps: see `/docs/installation`.

## Minimal App

```rust
use gpui_kit::component::button::{Button, ButtonVariants};
use gpui_kit::*;

struct HelloWorld;

impl Render for HelloWorld {
    fn render(&mut self, _: &mut Window, _: &mut Context<Self>) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .size_full()
            .items_center()
            .justify_center()
            .gap_2()
            .child("Hello, World!")
            .child(
                Button::new("hello")
                    .primary()
                    .label("Click me")
                    .on_click(|_, _, _| println!("Clicked!")),
            )
    }
}

fn main() {
    application()
        .with_assets(assets::Assets)
        .run(|cx| {
            init(cx);
            open_window(WindowOptions::default(), cx, |_, cx| {
                cx.new(|_| HelloWorld)
            })
            .expect("Failed to open window");
        });
}
```

Boot sequence:

1. `application()` creates the desktop app; `.with_assets(assets::Assets)` registers default icons
2. `init(cx)` initializes Kit layers incl. component themes — call once before windows/components
3. `open_window(...)` wraps the returned view in `Root` (owns dialogs/sheets/notifications) — return content view, never construct `Root` yourself

## Mental Model

```
app shell → feature (model, commands, view)
              ├─ Entity<Model>   retained state
              └─ Entity<View>    retained view; View implements Render
                    └─ element tree   rebuilt per render
                         └─ RenderOnce values for reusable pieces
```

- `Entity<T>` — retained across frames; `T: Render` → persistent View
- `RenderOnce` — value type for reusable, caller-supplied state/handlers
- Complex state/subscriptions/tasks need a lasting owner (Entity), not render-time values

## Tasks

| Spawn | Thread | Callback gets | Use |
|-------|--------|---------------|-----|
| `cx.spawn(...)` in `Context<T>` | Foreground | `WeakEntity<T>`, `&mut AsyncApp` | I/O → update Entity |
| `cx.spawn_in(window, ...)` | Foreground | `WeakEntity<T>`, `&mut AsyncWindowContext` | needs same Window |
| `cx.spawn(...)` in `App` | Foreground | `&mut AsyncApp` | app-level work |
| `cx.background_spawn(...)` | Background pool | none | heavy compute on `Send` data |

`Task<T>`: **dropping the handle cancels** — keep it in a struct field. Guard stale results with a `request_id` counter.

## Testing

GPUI test harness mounts a view in a test window:

```sh
cargo test -p <pkg> --test <name>
```

Verify subscriptions/state with `cx.subscribe_in` + `InputEvent::Change` — see the settings recipe test in repo (`gpui-kit-recipes`).

## Theme

```rust
.bg(cx.theme().background)
.text_color(cx.theme().foreground)
```

~25 bundled themes (Catppuccin, Gruvbox, Tokyo Night, Solarized, Flexoki, ...). Theme switcher docs: `/component/theme`.

## WebAssembly

Browser target supported — see `/docs/webassembly`.
