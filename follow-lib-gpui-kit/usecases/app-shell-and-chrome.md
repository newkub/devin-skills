# Use Case — Desktop App Shell & Window Chrome

> Build the application window, chrome, navigation, and keyboard layer. Source: https://gpui-kit.com/docs/getting-started, /docs/multi-window, /component/sidebar, /component/toolbar, /component/status-bar, /component/title-bar, /docs/keybinding, /docs/action (accessed 2026-10-20)

## Scenario table

| Building | Components / APIs |
|---|---|
| Boot app + window | `application().with_assets(...).run`, `init(cx)`, `open_window` |
| App navigation | `Sidebar`, `SidebarHeader/Footer/Group/Menu/MenuItem`, `SidebarToggleButton` |
| Window chrome | `TitleBar`, `Toolbar`, `StatusBar` (see each `/component/<name>` page) |
| Multiple windows | second `open_window` call — each window owns its `Window` context, focus, input dispatch, geometry, and `Root` |
| Keyboard layer | `actions!` + `cx.bind_keys([KeyBinding::new(...)])` + Action dispatch |

## Skeleton (verified from docs/getting-started)

```rust
use gpui_kit::component::button::{Button, ButtonVariants};
use gpui_kit::*;

struct HelloWorld;

impl Render for HelloWorld {
    fn render(&mut self, _: &mut Window, _: &mut Context<Self>) -> impl IntoElement {
        div().flex().flex_col().size_full().items_center().justify_center().gap_2()
            .child("Hello, World!")
            .child(Button::new("hello").primary().label("Click me")
                .on_click(|_, _, _| println!("Clicked!")))
    }
}

fn main() {
    application()
        .with_assets(assets::Assets)
        .run(|cx| {
            init(cx); // once, before any window or component
            open_window(WindowOptions::default(), cx, |_, cx| cx.new(|_| HelloWorld))
                .expect("Failed to open window");
        });
}
```

Startup has exactly three parts: `application()` (shell) → `init(cx)` (Kit layers + component themes) → `open_window(...)` (wraps your view in a `Root`; return the content view, never a `Root`).

## Sidebar navigation (verified pattern)

```rust
use gpui_kit::component::sidebar::*;

Sidebar::new()
    .header(SidebarHeader::new().child("My Application"))
    .child(
        SidebarGroup::new("Navigation").child(
            SidebarMenu::new()
                .child(SidebarMenuItem::new("Dashboard").icon(IconName::LayoutDashboard)
                    .on_click(|_, _, _| {/* navigate */}))
                .child(SidebarMenuItem::new("Settings").icon(IconName::Settings)),
        ),
    )
    .footer(SidebarFooter::new().child("User Profile"))
```

- collapsible: `Sidebar::new().collapsible(true).collapsed(flag)` + `SidebarToggleButton` — render label text only when expanded via `.when(!collapsed, ...)`

## Keyboard actions (verified from /component/command)

```rust
use gpui_kit::{actions, KeyBinding};

actions!(my_app, [OpenProfile, OpenBilling]);

// during application setup:
cx.bind_keys([
    KeyBinding::new("cmd-p", OpenProfile, Some("Command")),
    KeyBinding::new("cmd-b", OpenBilling, Some("Command")),
]);
```

The third argument is the focus-context name — bindings resolve in the focused element's context first, then application scope.

## Multi-window notes

- call `open_window` again for each window — application data shared across windows via `Global` or entity handles
- each window keeps its own `Root` (its own dialogs/sheets/notifications layer)

## Pitfalls

- `init(cx)` after `open_window` → themes/components not registered — window opens with lost styling
- putting overlay calls (`open_dialog`, `push_notification`) on a view instead of the window — overlays are owned by the window's `Root`
- reading `/docs/multi-window` example requires the platform deps from `/docs/installation` first (Windows: MSVC + CMake)
