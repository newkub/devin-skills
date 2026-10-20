# Use Case — Async Work, Cancellation & Streaming

> Task ownership model for I/O, heavy computation, and streamed UI updates. Source: https://gpui-kit.com/docs/task (accessed 2026-10-20)

## 1. Choose the spawn API (verified table from docs)

| Start from | Runs on | Async callback receives | Use for |
|---|---|---|---|
| `cx.spawn(...)` in `Context<T>` | Foreground thread | `WeakEntity<T>`, `&mut AsyncApp` | Await I/O/timers, then update an Entity |
| `cx.spawn_in(window, ...)` | Foreground thread | `WeakEntity<T>`, `&mut AsyncWindowContext` | Completion needs the same `Window` (focus, prompts) |
| `cx.spawn(...)` in `App` | Foreground thread | `&mut AsyncApp` | App-level work without a current Entity |
| `cx.background_spawn(...)` | Background executor | No GPUI context | Expensive parsing/computation on owned `Send` data |

Core property: dropping a `Task` handle cancels unfinished work — the handle's lifetime is part of your View's state design.

## 2. Canonical start/cancel/fail pattern (verified from docs)

```rust
struct TaskLab {
    status: String,
    request_id: u64,
    task: Option<Task<()>>,   // storing the handle keeps the task alive
}

impl TaskLab {
    fn start(&mut self, cx: &mut Context<Self>) {
        self.request_id = self.request_id.wrapping_add(1);
        let request_id = self.request_id;
        self.task = None;      // drop previous handle = cancel previous work
        self.status = "Loading...".into();
        cx.notify();

        self.task = Some(cx.spawn(async move |this, cx| {
            let result = cx.background_spawn(async move {
                // owned Send work; blocks a worker, not the UI thread
                Ok::<_, String>("done".into())
            }).await;
            _ = this.update(cx, |view, cx| {
                if view.request_id != request_id { return; }  // stale-result guard
                view.status = result.unwrap_or_else(|e| format!("Failed: {e}"));
                cx.notify();
            });
        }));
    }

    fn cancel(&mut self, cx: &mut Context<Self>) {
        self.request_id = self.request_id.wrapping_add(1);
        self.task = None;      // prevents future polls
        self.status = "Cancelled".into();
        cx.notify();
    }
}
```

Runnable drills: `cargo run -p example-stream-markdown` (streamed chunks + replay ID) and the docs' task_lab exercise — save the full listing as `examples/hello_world/src/bin/task_lab.rs` in a Kit checkout, then `cargo run -p hello_world --bin task_lab`.

## 3. Lifetime choice

- store it on the owning Entity for search/refresh/debounce/stream — replacing the `Option<Task<_>>` cancels the previous run
- await it from another task when the next step needs the result
- `.detach()` for one-off work that must finish regardless of the owner — the owner can no longer cancel it
- `Task::detach()` ≠ `Subscription::detach()` — the first lets work run on, the second keeps a callback subscribed until its source Entity drops

## 4. Re-enter GPUI after await

- `this.update(cx, ...)` when the Window is irrelevant; failed update = View is gone — treat as ordinary cancellation
- `cx.spawn_in(window, ...)` + `this.update_in(cx, ...)` restores `&mut Window` for focus changes and prompts — handle the case where the window closed
- never hold `&mut Context<T>` or `Window` across an `await`; extract owned inputs before spawning
- heavy CPU: clone owned `Send` input into `background_spawn`, await its `Task` from the foreground task, apply the result back with a revision check — no UI mutation inside a background future

## 5. Streaming into the UI

Producer (background, owns nothing GPUI) sends chunks over a bounded channel; receiver (foreground `Task` owned by the View) checks the current replay/request ID, then updates state (`TextViewState` in the example) and `cx.notify()`. For real network streams await the async read and a bounded send so a slow UI can't queue unbounded data.

## Pitfalls

- `cx.spawn(...);` as a bare statement — the handle drops at the end of the statement and the task may never do useful work; store, await, or `.detach()` explicitly
- starting a task unconditionally in `render` — every render launches another copy; start in event handlers/lifecycle
- `while !ready {}` polling — occupies the UI thread and can starve the awaited work; await the Task/timer/channel instead
- blocking sleep or blocking I/O in a foreground task — the poll owns the UI thread until it returns
- capturing a strong `Entity` handle back to the owner inside a task the owner stores — retention cycle; use the `WeakEntity` from `spawn` or `cx.weak_entity()`
- dropping a task and assuming side effects stopped — cancellation is cooperative; already-started I/O finishes, and synchronous worker code can't be interrupted mid-call; the request-ID guard rejects late results

## Related

- `references/apis.md`
- `best-practices/components.md`
- `best-practices/state-model.md`
