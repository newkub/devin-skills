# Use Case — Chat & Conversation UIs

> Build message threads: virtualized scrolling, streaming updates, bubbles. Source: https://gpui-kit.com/component/message-scroller, /component/bubble (accessed 2026-10-20)

## Ownership boundary (verified from docs)

| Owner | Responsibilities |
|---|---|
| Application | message collection, stable IDs, unread meaning, row renderer, composer, empty/error states |
| `MessageScroller` | variable-height virtualization, follow-tail, anchor on history prepend, jump-to-latest affordance |

One state entity per scroller. The component keeps no index-to-ID map.

## Scroller wiring (verified from docs)

```rust
use gpui_kit::component::message_scroller::{MessageScroller, MessageScrollerState};

let scroller = cx.new(|cx| MessageScrollerState::new(messages.len(), cx));
cx.observe(&scroller, |_, _, cx| cx.notify()).detach();

// render — closure runs only for viewport rows
let messages = std::rc::Rc::new(messages.clone());
MessageScroller::new("conversation", scroller.clone(), move |index, _window, _cx| {
    let Some(message) = messages.get(index) else {
        return gpui_kit::div().into_any_element();
    };
    gpui_kit::div().id(("message-row", message.id)).min_w_0()
        .child(render_message(message)).into_any_element()
})
.w_full().h_96()
```

## Structural updates (verified table from docs)

| Change | State operation |
|---|---|
| New rows at the tail | `state.append(count, cx)` |
| Older history inserted at front | `state.prepend(count, cx)` — preserves visible anchor |
| Replacement/deletion elsewhere | `state.splice(old_range, count, cx)` (half-open, in range, else `false`) |
| Row grew (streaming token) | `state.remeasure_items(index..index + 1, cx)` |
| Width/theme changed many rows | `state.remeasure(...)` |
| Full reload | `state.reset(len, cx)` — re-engages tail following |

```rust
// streaming growth
messages[index].body.push_str(next_token);
scroller.update(cx, |state, cx| { let _ = state.remeasure_items(index..index + 1, cx); });
cx.notify();
```

## Follow-tail state and navigation

```rust
let following = scroller.read(cx).is_following_tail(); // appends keep latest visible
let scrolled_up = scroller.read(cx).is_scrolled_up();  // drive your own "new messages" indicator
scroller.update(cx, |state, cx| state.scroll_to_end(cx));

// unread / deep link / search hit — resolve ID to index in the app first
if let Some(i) = messages.iter().position(|m| m.id == unread_id) {
    scroller.update(cx, |state, cx| { let _ = state.scroll_to_item(i, cx); });
}
```

There is no `starting_position` field or persisted scroll offset: after load, call `reset(len, cx)` then `scroll_to_item(saved_index, cx)`.

## Bubbles (verified from docs)

`Bubble` is presentational — it owns alignment, max width, reaction region; it does not own a message record, collapsed state, or click. Compose with `Button`, `Link`, `Collapsible`, `Tooltip`, `Popover`.

```rust
use gpui_kit::component::bubble::{Bubble, BubbleContent, BubbleGroup, BubbleReactions, BubbleReactionSide, BubbleVariant};
use gpui_kit::component::message::MessageAlignment;

Bubble::new().alignment(MessageAlignment::End).child("Outgoing message");
Bubble::new().alignment(MessageAlignment::Start)
    .with_variant(BubbleVariant::Secondary)          // Filled default; Muted/Tinted/Outline/Ghost/Destructive
    .content(BubbleContent::new().child(h_flex().gap_2().child("Incoming message")));

// reactions region (defaults: Bottom side, End alignment)
Bubble::new().alignment(MessageAlignment::Start)
    .child("This response has feedback.")
    .reactions(BubbleReactions::new().side(BubbleReactionSide::Bottom)
        .action(Button::new("like").ghost().small().label("Like · 2")));
```

- defaults: max width 80% of parent, radius `cx.theme().radius_2xl()`, content padding `px_3()`/`py_2()`, root `min_w_0`
- `BubbleGroup` stacks bubbles from one sender; use `Message`/`MessageGroup` when the unit includes avatar/header/footer — inside `MessageContent::bubble(...)` leave alignment unset (the `Message` owns placement)
- a `TextView` child (Markdown replies) follows the variant's text color automatically

## Pitfalls

- calling `reset(...)` for ordinary history pagination — it returns to tail following and loses incremental anchors; use `prepend(...)`
- rendering empty/error/loading state inside the scroller — it never invents a placeholder; branch outside and mount the scroller only when rows exist
- `cx.observe(...)` without storing the subscription or `.detach()` — dropped handles unsubscribe silently
- long unbreakable text without `min_w_0()` on the row child — bubbles overflow instead of wrapping
