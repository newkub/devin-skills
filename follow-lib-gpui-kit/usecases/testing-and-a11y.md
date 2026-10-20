# Use Case — Testing a GPUI Kit App (incl. Accessibility)

> Pick the right test level and drive the real UI headlessly. Source: https://gpui-kit.com/docs/test (accessed 2026-10-20)

## Choose the test level (verified from docs)

| Behavior | Tool |
|---|---|
| Pure data transforms, validation, state transitions | ordinary `#[test]` |
| Entities, actions, subscriptions, async tasks | `#[gpui_kit::test]` + `TestAppContext` (create a window when needed) |
| UI integration: clicks, input, focus, layout, callbacks | `gpui_kit::test::TestWindowExt` on a headless window rendering the production view |
| Pixel checks | separate offscreen renderer |
| Native window / platform integration | keep native tests alongside |

Kit exposes the test types and macro through its root — no extra GPUI dependency, no testing crate, no Cargo patch.

## Setup (verified from docs)

```toml
# dev-dependencies only — ordinary app builds must not enable observation
gpui-kit = { path = "...", features = ["test-support"] }
```

Keep the app's normal `gpui-kit` dependency resolving to the same source/version (features unify for tests). Using the component crate directly? Enable `gpui-component/test-support` instead.

GOTCHA: `use gpui_kit::*;` also imports the GPUI `test` macro and can shadow Rust's `#[test]` — use explicit imports in test modules.

## UI integration test (verified from docs)

```rust
use gpui_kit::test::{TestSupportExt, TestWindowExt};
use gpui_kit::{component::{button::Button, input::{Input, InputState}}, Role, TestAppContext};

#[gpui_kit::test]
fn saves_a_profile_through_the_ui(cx: &mut TestAppContext) {
    cx.update(gpui_kit::init);
    let (handle, profile) = common::open_window(cx, Some(size(px(640.), px(480.))), |window, cx| {
        cx.new(|cx| Profile { name: cx.new(|cx| InputState::new(window, cx)), submitted: None })
    });

    cx.update_window(handle.into(), |_, window, cx| {
        window.render_frame(cx);
        assert_eq!(window.find("status").role(), Some(Role::Status));
        assert_eq!(window.find("status").label(), Some("Not saved"));

        window.click("name", cx);
        window.input("Ada José", cx);
        assert_eq!(window.find("name").value(), Some("Ada José"));
        window.press("backspace", cx);
        assert_eq!(window.find("name").value(), Some("Ada Jos"));

        window.click("save", cx);
        assert_eq!(window.find("status").label(), Some("Saved: Ada Jos"));
        assert!(window.find("status").bounds().top() >= window.find("save").bounds().bottom());
    }).unwrap();

    cx.update(|cx| assert_eq!(profile.read(cx).submitted.as_deref(), Some("Ada Jos")));
}
```

- controls are found by `ElementId` — use constructor IDs (`.id("name")` on `Input`/`Select`) or keyed tuples; Select's trigger is its `"input"` child: `window.within("language").click("input", cx)`
- assert native properties (role/label/value/focus/bounds/visibility) with ordinary Rust assertions; the fixture wraps the view in `gpui_kit::base::Root` and opens via public `gpui_kit::open_window`
- plain divs opt into observation with `.test_support()` (`TestSupportExt`) — no second state description needed
- import your production view in tests; a separate test view drifts from the app

## What observation exposes (condensed from the docs table)

Button: label, focus scope · Input: value, label, focus · Checkbox/Switch/Radio: checked/selected · Tab: selected · Combobox/Select: expanded + value · Table/DataTable: native parts, row selection · Dialog/Sheet: host focus scope, surface bounds · Menu: item label/selection · Notification: alert role, bounds · Progress: indicator role/label · TitleBar: `title-bar`/`window-controls` bounds · Dock: area/group/content bounds, tab selection · Slider/Stepper/Progress: bounds only — numeric values are not exposed by `ElementSnapshot::value()`, verify resulting app content.

## Accessibility checks

- these tests read the AccessKit-derived properties (`role`, `label`, focus) — they do not verify what a screen reader announces; check that in the running app per platform
- give interactive elements stable IDs and `aria_label`s from object identity, not displayed text (labels get translated)
- WASM canvas apps need browser-level verification — GPUI a11y properties do not automatically become web semantics

## Pitfalls

- leaving `test-support` in normal dependencies — production builds ship observation
- copying only the docs' `tests/ui.rs` — it needs `tests/common/mod.rs` too (`mod common;` fails otherwise)
- busy-waiting on async work in tests — drive the test executor, not sleeps
- asserting `ElementSnapshot::value()` on Slider/Progress — not exposed; assert the application effect instead
