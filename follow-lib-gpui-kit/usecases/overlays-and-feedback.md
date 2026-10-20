# Use Case — Overlays, Dialogs, Notifications & Command Palette

> Modal surfaces, transient feedback, and `⌘K` navigation. Source: https://gpui-kit.com/component/dialog, /component/notification, /component/command (accessed 2026-10-20)

## 1. Where overlays render

The window's `Root` automatically mounts dialogs, sheets, and notifications. Open windows with `gpui_kit::open_window` (wraps your view) — application views do not render overlay layers themselves.

## 2. Dialog & Sheet (verified from docs)

```rust
use gpui_kit::component::dialog::DialogButtonProps;
use gpui_kit::component::WindowExt;

let input = cx.new(|cx| InputState::new(window, cx).placeholder("URL"));
let initial_focus = std::cell::Cell::new(true);

window.open_dialog(cx, move |dialog, window, cx| {
    if initial_focus.replace(false) {
        input.focus_handle(cx).focus(window, cx); // one-time guard
    }
    dialog.title("Import").child(Input::new(&input))
        .footer(|_, _, _, _| vec![
            Button::new("ok").primary().label("Submit")
                .on_click(|_, window, cx| window.close_dialog(cx)),
            Button::new("cancel").label("Cancel")
                .on_click(|_, window, cx| window.close_dialog(cx)),
        ])
});
```

- the builder may run again when the dialog layer rebuilds — keep it cheap and idempotent; create persistent entities (`InputState`) before opening and capture handles
- unconditional focusing on every rebuild steals focus from other controls or nested dialogs
- same contract for `open_alert_dialog`, `open_sheet`, `open_sheet_at`
- `DialogButtonProps` types the footer button closures

## 3. Toast notifications (verified from docs)

```rust
use gpui_kit::component::notification::{Notification, NotificationType, NotificationDelivery};

window.push_notification("This is a notification.", cx);
window.push_notification((NotificationType::Error, "Failed to save file."), cx);

Notification::new().title("Update Available")
    .message("A new version is ready to install.")
    .with_type(NotificationType::Info)
    .autohide(false)                                  // default: auto-hide after 5s
    .action(|_, cx| Button::new("retry").primary().label("Retry")
        .on_click(cx.listener(|this, _, window, cx| { /* ... */ this.dismiss(window, cx); })));
```

- placement: default top-right; per-notification `.placement(Anchor::BottomLeft)` or global `Theme::update(cx, |t| t.notification.placement = ...)`; stacks are separate per placement
- the auto-hide countdown pauses on hover/keyboard focus but keeps running while the window is inactive — messages that must not be missed need `autohide(false)` or system delivery
- unique/manual: `Notification::new().id::<UpdateNotification>()` then `window.remove_notification::<UpdateNotification>(cx)`; `.id1::<TaskNotification>("task-123")` for multiple of one kind
- OS delivery: `.system()` / `.in_app_and_system()` (`NotificationDelivery`); Windows needs `cx.set_app_identity(identifier, name)` early; macOS requires a bundled `.app`; clicking a system notification activates the window and fires `on_click`
- don't register your own `on_system_notification_response` handler after `component::init` — gpui keeps only one

## 4. Command palette (verified from docs)

`Command` owns entries/presentation; `CommandState` owns query, focus, selection, scrolling, loading. Create the state once, rebuild `Command` from the owner's data each render.

```rust
use gpui_kit::component::command::{Command, CommandGroup, CommandItem, CommandState};

let state = cx.new(|cx| CommandState::new(window, cx));

Command::new(&state)
    .group(CommandGroup::new().label("Settings")
        .item(CommandItem::new().label("Profile").icon(IconName::User)
            .action(Box::new(OpenProfile))))          // kbd hint auto-resolves from bindings
    .separator()
    .placeholder("Type a command or search...")
    .empty(|_, _, cx| v_flex().items_center().child("No results found."))
    .on_query(|query, window, cx| { /* start app-owned search */ })
    .on_confirm(|index, window, cx| { /* finish with this IndexPath */ });
```

- keybinding hints render only when a `KeyBinding` for the Action exists in the `Command` focus context (then application scope) — never pass a manually formatted shortcut string
- inline, or compose into a dialog: `dialog.close_button(false).p_0().content(...)` with `Command::new(&state).bordered(false)`; let the Dialog dismiss — `on_cancel` records local cleanup only
- `.searchable(false)` gives a compact action list; `state.focus(window, cx)` then focuses the frame, keeping arrows/Enter/Escape
- async search: update owner-held entries in `on_query`, `state.set_loading(true, window, cx)` while waiting; dynamic entries live in the owner view — no entry-builder mutation of the state
- callbacks fire after the current `CommandState` update lease releases; an Action that closes the window prevents `on_confirm` delivery

## Pitfalls

- storing `Entity` state inside the `open_dialog` builder closure body — re-runs recreate it and lose editing state
- calling `window.close_dialog(cx)` from Command's `on_cancel` — double dismissal races the Dialog's own Cancel handling
- pushing the same toast in a retry loop — use `.id::<T>()` so re-push replaces instead of stacking
- spawning the palette list unbounded — Command measures every flattened row; keep entry counts sane or paginate in `on_query`

## Related

- `references/apis.md`
- `best-practices/components.md`
- `best-practices/state-model.md`
