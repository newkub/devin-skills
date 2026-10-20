# Use Case — Forms & Data Entry

> Collect user input with validated state. Source: https://gpui-kit.com/component/input, /component/input-group, /component/form, /component/editor, /component/combobox, /component/select, /component/date-picker, /component/otp-input (accessed 2026-10-20)

## 1. Choose the control

| Need | Use |
|---|---|
| single-line value | `Input` |
| ordinary multi-line text | `Textarea` |
| source code (highlighting, gutter, folding) | `Editor` |
| pick from a list | `Select` |
| searchable single/multi select | `Combobox` |
| number with increment/decrement | `NumberInput` |
| calendar date | `DatePicker` |
| segmented time-of-day | `TimeField` |
| one-time password | `OtpInput` |
| boolean toggle | `Switch` / `Checkbox` / `Toggle` |
| single choice from several | `Radio` / `Rating` |
| addons/toolbar around a field | `InputGroup` |

## 2. Input + retained state (verified from /component/input)

```rust
use gpui_kit::component::input::{Input, InputState};

// create ONCE in the owner view's constructor — never in render
let input = cx.new(|cx|
    InputState::new(window, cx)
        .placeholder("Enter your name...")
        .default_value("John Doe")
);

Input::new(&input)
    .cleanable(true)                                  // clear button when non-empty
    .prefix(Icon::new(IconName::Search).small())      // icon / button addons
    .suffix(Button::new("btn").ghost().icon(IconName::Info).xsmall())
```

Masked password field: `InputState::new(window, cx).masked(true)`.

React to edits: subscribe with `cx.subscribe_in(&input_state, window, ...)` on `InputEvent::Change` (or `InputEvent::Edit`) — store the `Subscription` in the view struct.

## 3. Form layout (verified from /component/form)

```rust
use gpui_kit::component::form::{field, v_form, h_form, Form, Field};

// vertical, labels above
v_form()
    .child(field().label("Name").child(Input::new(&name_input)))
    .child(field().label("Email").child(Input::new(&email_input)).required(true))

// horizontal, fixed label width
h_form().label_width(px(120.))
    .child(field().label("First Name").child(Input::new(&first_name)))

// multi-column with footer actions
Form::new()
    .label_layout(Axis::Horizontal)
    .columns(2)
    .child(Field::new().label("Name").child(Input::new(&name_input)))
    .child(Field::new().label("Bio").col_span(2).child(Input::new(&bio_input)))
    .footer(Button::new("save").label("Save").on_click(cx.listener(|v, _, _, _| v.submit())))
```

- `Form` owns layout only — the application owns values, validation, submission; `footer` spans all columns and does NOT auto-submit

## 4. Dialog form pattern

Open a form in a dialog (see `overlays-and-feedback.md`): create the `InputState` entities BEFORE `window.open_dialog(...)`, capture handles in the builder, validate in the Submit button's click, then `window.close_dialog(cx)`.

## 5. Complete tested recipe

The docs point to compiled examples: https://github.com/longbridge/gpui-kit/tree/main/examples/ai_recipes (`settings.rs` + its interaction test) — retained input state + subscriptions verified by `cargo test`.

## Pitfalls

- creating `InputState` inside `render` → text/cursor reset every frame
- ignoring the `Subscription` return → callback silently detaches
- expecting `Form` to submit → attach your own handler to the footer button
- `on_change` gives the requested value — apply it yourself + `cx.notify()` (controlled pattern)

## Related

- `references/apis.md`
- `best-practices/components.md`
- `best-practices/state-model.md`
- `usecases/overlays-and-feedback.md`
