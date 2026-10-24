# Best Practices — Testing And Automation

GPUIX tests drive the real runtime: the same `GpuixView`, `build_element()`,
style application, and event handlers as production, rendered offscreen by
Metal or DirectX. There is no DOM to query, so locate by `testId`, assert on
numbers, and freeze the clock when animation matters.

## 1. Use The Real Test Renderer

`createTestRoot()` plus `connectTest(renderer)` is the supported path. The
lower-level renderer API exists for cases a locator cannot cover.

```ts
import { createTestRoot } from '@gpuix/react'
import { connectTest } from '@gpuix/react/automation'
import { ChatApp } from './chat'

const { render, renderer } = createTestRoot()
render(<ChatApp />)
const app = await connectTest(renderer)
```

| Platform | Test renderer | PNG capture |
|----------|---------------|-------------|
| macOS    | Metal         | Yes         |
| Windows  | DirectX       | Yes         |
| Linux    | Not yet       | Waiting for GPUI's wgpu headless renderer |

Do not try to emulate the renderer in jsdom. Style application, layout, and
paint all happen in Rust; a mocked tree proves nothing about what a user sees.

## 2. Mark Elements With testId

```tsx
<div testId="sidebar-collapse" onClick={onCollapse}>‹</div>
<textarea testId="composer" value={draft} onChange={...} />
<div testId="send" onClick={onSend}>↑</div>
```

Every element that accepts `testId` records painted bounds, including `<img>`,
`<svg>`, and `<anchored>`. An `<anchored>` reports the box of the overlay, not
of its trigger, so `click()` lands on the menu even when it is deferred and
snapped back inside the window.

`<virtual-list>` is the exception and takes no `testId`: GPUI's list is not an
interactive element, so there is no box to record. Put the locator on a
wrapping `<div>`.

## 3. Locators Are Strict

| Call                        | Matches                         |
|-----------------------------|---------------------------------|
| `app.getByTestId('send')`   | The `testId` prop               |
| `app.getByText('New chat')` | A node's own text               |
| `app.getByType('textarea')` | The host element type           |
| `locator.getByText('...')`  | A descendant of another locator |

- Chained locators search strict descendants, never the matching parents.
- Overlapping parent roots return each element id once, in tree order.
- `all()` returns the nodes, `count()` their number, and `element()` rejects
  zero matches or more than one distinct match.
- `waitFor()` polls until exactly one match exists; assert with it instead of
  sleeping.
- `textContent()` concatenates the node's own text and every descendant's,
  like DOM `textContent`.

## 4. Drive Mouse, Wheel, And Keyboard

| Call                                 | What it does                                                       |
|--------------------------------------|--------------------------------------------------------------------|
| `locator.hover()`                    | Moves to the center so hover styles and tooltips fire              |
| `locator.wheel(dx, dy)`              | One wheel event over the center                                    |
| `locator.dragBy(dx, dy)`             | Press on the center, travel, release                               |
| `locator.dragTo(target)`             | Same, ending on another locator or a `{ x, y }` point              |
| `app.mouse.move / down / up / click` | Raw pointer input in window coordinates                            |
| `app.mouse.wheel(target, dx, dy)`    | A wheel over a point or a locator                                  |
| `app.mouse.drag(from, to)`           | A drag between two points, two locators, or a mix                  |

- A drag sends interpolated moves, not one jump, because snapping, live
  previews, and per-move commits only appear when the pointer travels. Pass
  `steps` to control the count and `offset` to press away from the center.
- Every mouse call accepts `modifiers` in the same syntax as `press('cmd-a')`,
  so cmd-wheel zoom, shift-click range selection, and alt-drag duplication
  are testable.
- `fill(text)` replaces the focused editor contents; `press('enter')` sends one
  key. Both go through GPUI's input pipeline, so IME and native editing behave
  as they do for a user.

## 5. Freeze Time For Animation

`app.clock.pause()`, `set(ms)`, and `fastForward(ms)` stop native motion time.
Capture deterministic frames at known timestamps:

```ts
const startedAt = await app.clock.pause()
await app.getByTestId('sidebar-collapse').click()
await app.captureFrames('review/sidebar', [
  startedAt,
  startedAt + 100,
  startedAt + 200,
])
```

`app.recordVideo({ path, fps })` turns the same clock into a recorder: each
frame is a screenshot at an exact timestamp, so output is smooth at any `fps`
regardless of render time. `video.frame()` advances one frame, `video.wait(ms)`
captures idle time, and `video.stop()` encodes with `ffmpeg` (must be on `PATH`)
then resumes the clock.

## 6. Assert Numbers, Not Pixels

Paint the state you want to assert into a readout element and read it with
`textContent()`. A screenshot tells you something changed; a readout tells you
what, and the failure message names the number.

```tsx
<text testId="readout">{`x=${scrollX} y=${scrollY} zoom=${zoom} sel=${selected}`}</text>
```

```ts
const readout = await app.getByTestId('readout').textContent()
expect(readout).toBe('x=140 y=60 zoom=24 sel=clip-7')
```

Keep the screenshot too, for a human to inspect after the run. `app.screenshot`
captures GPUI's rendered surface only, not the desktop or the macOS blur behind
a translucent window.

## 7. Reach Into Paint For Rich Content

`getAllText()` sees `<text>` nodes only. `<code>`, `<diff>`, and `<markdown>`
paint their text inside GPUI, so use `getPaintedText()`, which returns every
string painted in the last frame in paint order.

```ts
root.render(<code code={'a\nb'} language="ts" />)
expect(renderer.getPaintedText()).toEqual(['a', 'b'])
```

Selection and highlight have their own helpers because listeners register
during paint:

- `dragSelect(x1, y1, x2, y2)` flushes between every step; calling
  `simulateMouseDown` / `Move` / `Up` by hand without those flushes selects
  nothing.
- A highlight is a quad, so `getPaintedText()` cannot show it. Use
  `getPaintedHighlights()`, which reports the matched UTF-16 range plus the
  boxes actually drawn, one per visual row.

## 8. Drive Live Apps And Browser Pages

`launch({ command, args, env })` starts a real app and speaks the same commands
over stdin as SSE `data:` lines. The app listens only when stdin is a pipe, so
a normal terminal run is unchanged.

```ts
const app = await launch({
  command: 'bun',
  args: ['examples/chat.tsx'],
  env: { GPUIX_BACKGROUND: '1' },
})
await app.getByTestId('composer').fill('hello')
await app.getByTestId('composer').press('enter')
await app.getByText('hello').waitFor()
await app.close()
```

- Every live-app check sets `GPUIX_BACKGROUND=1`, and the entry maps that flag
  to `focus: false`. Linux currently ignores `focus`.
- Every browser render installs the same `App` as `globalThis.gpuix` after
  `render()` returns; no setup flag is required.
- Bounds come back in canvas pixels, not CSS pixels. On a 2x display a locator
  at `x: 44` sits at CSS `x: 22`. Convert with
  `canvas.width / canvas.clientWidth` before clipping a browser screenshot, and
  do not read `window.devicePixelRatio` — the viewport scale factor can change
  after GPUI sized the canvas, and the two then disagree.
- Browser pages cannot write an arbitrary local screenshot path; use the
  controlling browser tool for that.

## Pitfalls

- Asserting against a mocked tree instead of the GPU renderer — layout and
  paint never run, so the test proves nothing.
- Putting `testId` on `<virtual-list>` and expecting bounds — wrap it in a
  `<div>` instead.
- Using `getAllText()` for `<code>`, `<diff>`, or `<markdown>` and finding
  nothing — those paint inside GPUI; use `getPaintedText()`.
- Calling `simulateMouseDown` / `Move` / `Up` without flushes between steps —
  no selection is recorded; use `dragSelect`.
- Screenshot-diffing as the only assertion — a failure says "pixels changed",
  not which number moved.
- Skipping `GPUIX_BACKGROUND=1` for live apps — the test steals the user's
  keyboard for no benefit.
- Dividing bounds by `window.devicePixelRatio` — use the canvas ratio.
- Relying on the test renderer on Linux — it is not implemented yet.

## Related

- [apis.md](../references/apis.md)
- [runtime-and-rendering.md](runtime-and-rendering.md)
- [text-and-collections.md](text-and-collections.md)
- [../usecases/agent-driven-verification.md](../usecases/agent-driven-verification.md)
