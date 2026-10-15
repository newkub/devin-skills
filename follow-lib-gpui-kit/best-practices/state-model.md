# GPUI Kit — State Model And Async Tasks

## Recommended Patterns

### Entity/Render Mental Model

- `Entity<T>` = state retained across frames — create once with `cx.new(|cx| ...)` then reuse
- when `T: Render` → the entity is a persistent view that rebuilds the element tree every render pass
- `RenderOnce` component = a temporary value taking state + handlers from the caller — fits reusable pieces with no permanent state (Button, Checkbox, Label)
- simple rule: state that must survive across renders → `Entity`; just rendering per props → `RenderOnce`

### Ownership Of State And Handles

- stateful inputs (Input, Editor) are created as `Entity<InputState>` and stored in the owner view's struct fields — never create them anew in `render`
- `cx.subscribe_in(&state, window, |view, state, ev, window, cx| ...)` returns a `Subscription` — always store it in a field, because drop = detach
- `Task<T>` handles likewise — keep in a field if it must continue running; drop = cancel
- callbacks use `cx.listener(|this, ev, _, cx| { this.field = ...; cx.notify(); })` — mutate the state then always call `cx.notify()`, otherwise the UI won't redraw

### Foreground Vs Background Work

- `cx.spawn(async move |this, cx| ...)` — foreground task on the UI context; update the entity via `this.update(cx, |view, cx| ...)` or a `WeakEntity`
- `cx.background_spawn(async move { ... })` — heavy CPU work on the worker pool; returns only owned `Send` data — never touch an entity/window inside
- standard pattern: spawn foreground → delegate heavy work to `background_spawn` → await → `this.update()` to bring the result back into state → `cx.notify()`
- guard against stale results with a `request_id` or sequence counter in the struct — check before applying an async result

## Do / Don't

| Do | Don't |
|---|---|
| store `Entity<InputState>`, `Task`, `Subscription` in struct fields | create entities/subscriptions anew in `render` |
| `cx.notify()` after every state mutation | forget notify then wonder why the UI doesn't update |
| do heavy computation with `cx.background_spawn` and send the result back | modify an entity directly from a background task |
| check `request_id`/`WeakEntity` before applying an async result | assume the received result is always fresh |
| read the theme via `cx.theme()` | hardcode colors like raw `rgb(0x...)` |

## Common Pitfalls

- creating `InputState` in `render` → state lost every frame, cursor/text reset — it must be hoisted to the constructor
- `Task`/`Subscription` not stored → cancelled/detached immediately, making it look like the callback never fires
- updating state in `cx.spawn` without going through `this.update(cx, ...)` → panic or borrow error — use `WeakEntity` if the view may be dropped first
- `on_change` is the requested value — the owner must apply it itself (controlled component); the component doesn't change the state for you

## Performance Notes

- `render` rebuilds the element tree every time `cx.notify()` fires — keep render cheap: prepare derived data in the state or cache it, don't compute heavily in render
- `cx.notify()` has a cost — batch updates when possible; don't notify round by round in a loop
- slow async results (search, file IO) should be debounced in the caller before spawning a new task

## Ecosystem / Integration

- `init(cx)` must be called before creating components or opening windows — it sets up Kit layers + themes
- `open_window` wraps in a `Root` automatically — the overlays (dialog/sheet/notification) rely on it
- keyboard shortcuts use the `Action` derive + `KeyBinding`/`cx.bind_keys` per the guide docs
- test through the GPUI test harness — mount the view in a test window then simulate events
