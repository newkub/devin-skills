# Runtime And Rendering

How a React or Solid tree becomes GPU pixels, and the invariants that keep it
fast and predictable.

## 1. One Batch Per Commit

The adapter does not call the native side per property. It collects mutations
and ships one atomic batch:

```text
React/Solid commit
  → counter add / set_style / insert / remove / set_event_listener
  → applyBatch([...])            one native call
  → RetainedTree.apply(mutation)  Rust keeps a retained tree
  → next frame: GpuixView::render() → build_element() → ephemeral GPUI elements
```

Consequences:

- A commit never paints half-applied state. Either the batch lands or it does
  not.
- Work is proportional to changes, not to tree size. Re-rendering a large app
  does not rebuild every node.
- Do not try to reach the renderer directly to "apply faster". Every shortcut
  outside `applyBatch` risks a tree the reconciler does not know about.

## 2. Retained Tree Vs Ephemeral Elements

Two layers exist and only one persists:

| Layer | Lifetime | Owner |
|-------|----------|-------|
| Retained tree | Until the node is removed | Native `RetainedTree` |
| GPUI elements | One frame | `build_element()` |

The retained tree stores element kind, style, children, text, and whether a
listener exists. GPUI elements are rebuilt each frame from that data. This is
why style changes are cheap and why anything that lives only in the GPUI layer
is lost on the next frame.

## 3. Ids And Abandoned Work

Element ids are incrementing numbers allocated in JS. The host keeps nodes in
JS until the accepted subtree commits, so React concurrent work that is thrown
away never sends mutations. Never fabricate ids, reuse ids across roots, or
unwrap to the native layer to read a "current id".

## 4. Host Boundary

The adapter depends on narrow host interfaces, not the whole renderer:

| Type | Covers |
|------|--------|
| `MutationHost` | `applyBatch` only |
| `WindowSizeHost` | window size observation |
| `SelectionHost` | selection observation |
| `NativeRenderer` | all of the above plus window control |

Keep app code above the adapter. Importing `@gpuix/native` inside components
pulls the native addon into places that could otherwise be tested with a fake
host.

## 5. Frame Loop

`render()` creates the window, mounts the tree, and starts the frame loop.
Rendering happens on GPUI's schedule:

- State changes mark work; the next frame paints it.
- `flushSync` forces a synchronous commit when a caller must observe the result
  before continuing, such as measuring before a second render.
- `startFrameLoop` and `createRenderer` are for hosts and tests that own the
  loop themselves.

Do not build timers that call render manually. Change state and let the loop
paint.

## 6. Cost Model

| Pattern | Effect |
|---------|--------|
| Local state near the leaf | Small batch, small repaint |
| State at the root re-rendered by a timer | Whole tree diff per tick |
| Long list rendered as plain children | Every row retained, every row laid out |
| Long list in `<virtual-list>` | Only the visible window retained |
| Animation by state at 60 Hz | One diff per frame; prefer a clock the renderer can drive |
| Deep style object literals recreated each render | New object identity, new mutations |

Rules of thumb:

- Keep state as low in the tree as the UI allows.
- Hoist static style objects and constant children out of render.
- Use `<virtual-list>` for anything user-scalable past a few hundred rows.
- Measure before optimizing. `createTestRoot` plus `getPaintedText()` and
  `captureFrames` show what actually painted.

## Pitfalls

- Assuming CSS semantics. Layout is Taffy flexbox/grid; `div` is block until
  `display: "flex"` is set.
- Holding a GPUI element or a native handle across frames. It is gone on the
  next rebuild.
- Calling the native addon from component code. It couples the UI to the
  platform and breaks the fake-host path in tests.
- Reading `window.devicePixelRatio` for coordinate conversion. Bounds are in
  canvas pixels; derive the scale from the canvas itself.

## Related

- [apis.md](../references/apis.md)
- [styling-and-events.md](styling-and-events.md)
- [testing-and-automation.md](testing-and-automation.md)
