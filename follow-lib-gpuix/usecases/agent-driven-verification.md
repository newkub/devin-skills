# Use Case — Agent-Driven Verification

> Drive the same app from vitest, a browser page, or a child process with one automation client. Source: https://gpuix.dev/docs (accessed 2026-10-23).

## 1. Mark Every Interaction Point

Automation finds elements by `testId`, the same way Playwright finds them by test id.

```tsx
<div testId="sidebar-collapse" onClick={onCollapse}>‹</div>
<textarea testId="composer" value={draft} onChange={...} />
<div testId="send" onClick={onSend}>↑</div>
```

## 2. Drive A Test Root Inside vitest

`createTestRoot()` builds a GPU-backed renderer that runs the real `GpuixView`, `build_element()`, and event handlers. `connectTest()` gives you a Playwright-shaped client.

```ts
import { createTestRoot } from '@gpuix/react'
import { connectTest } from '@gpuix/react/automation'
import { ChatApp } from './chat'

const { render, renderer } = createTestRoot()
render(<ChatApp />)
const app = await connectTest(renderer)

await app.screenshot({ path: 'open.png' })

await app.clock.pause()
await app.getByTestId('sidebar-collapse').click()
await app.clock.fastForward(200)
await app.screenshot({ path: 'collapsed.png' })

await app.getByTestId('composer').fill('hello gpuix')
await app.getByTestId('send').click()
await app.screenshot({ path: 'sent.png' })
```

Locators cover `getByTestId`, `getByText`, and `getByType`; actions cover `click`, `fill`, `press`, `wheel`, and `drag`; assertions cover `waitFor`, `textContent`, and `count`.

## 3. Pause The Clock For Deterministic Frames

`app.clock.pause()` freezes animation and timers. `fastForward(ms)` advances by an exact amount instead of sleeping, so a 200 ms transition always lands on the same frame.

```ts
await app.clock.pause()
await app.getByTestId('send').click()
await app.clock.fastForward(200)
await app.getByText('hello gpuix').waitFor()
```

The same clock drives `recordVideo`, where `video.frame()` advances one frame at a time and `video.stop()` encodes with `ffmpeg`.

## 4. Drive A Browser Render

Every browser render installs the automation client as `globalThis.gpuix` after `render()` returns. No flag and no transport setup are needed.

```ts
await page.evaluate(async () => {
  await globalThis.gpuix.getByTestId('sidebar-collapse').click()
  await globalThis.gpuix.getByTestId('composer').fill('hello from Playwriter')
  await globalThis.gpuix.clock.pause()
  await globalThis.gpuix.clock.fastForward(200)
})
```

Browser pages cannot write an arbitrary screenshot path, so capture with the controlling browser tool. Bounds come back in canvas pixels, not CSS pixels; divide by `canvas.width / canvas.clientWidth` before passing a rectangle to a browser tool.

## 5. Drive A Live App As A Child Process

`launch()` starts the app and speaks the same commands over stdin as SSE `data:` lines. The app only listens when stdin is a pipe, so a normal terminal run is unchanged.

```ts
import { launch } from '@gpuix/react/automation'

const app = await launch({
  command: 'bun',
  args: ['examples/chat.tsx'],
  env: { GPUIX_BACKGROUND: '1' },
})
await app.getByTestId('composer').fill('hello')
await app.getByTestId('composer').press('enter')
await app.getByText('hello').waitFor()
await app.screenshot({ path: 'live.png' })
await app.close()
```

Set `GPUIX_BACKGROUND=1` and map it to `focus: false` in the app entry. Input then runs through the real window pipeline without taking the user's keyboard. `fill()` and `press()` reach native `<input>` and `<textarea>` handling, including IME.

## 6. Drop To The Renderer When A Locator Is Not Enough

`createTestRoot` from `@gpuix/react/testing` exposes the renderer directly.

```ts
import { createTestRoot } from '@gpuix/react/testing'

const { root, renderer } = createTestRoot()

root.render(<MyComponent />)
renderer.flush()  // triggers GpuixView::render() on the native GPU

renderer.nativeSimulateClick(50, 50)
renderer.nativeSimulateKeystrokes('enter')

const events = renderer.drainNativeEvents()
renderer.captureScreenshot('/tmp/test.png')
const text = renderer.getAllText()
```

Test windows render offscreen on Metal (macOS) and DirectX (Windows). Linux has no test renderer yet, so those specs need a different host or a browser build.

## 7. Assert On Painted Text And Selection

`getAllText()` only sees `<text>` nodes. `<code>`, `<diff>`, and `<markdown>` paint inside GPUI, so use `getPaintedText()`, which returns every string drawn in the last frame in paint order.

```ts
root.render(<code code={'a\nb'} language="ts" />)
expect(renderer.getPaintedText()).toEqual(['a', 'b'])
```

Selection has its own helper. Listeners register during paint, so `dragSelect` flushes between steps; calling `simulateMouseDown` / `Move` / `Up` by hand without flushes selects nothing.

```ts
expect(renderer.dragSelect(20, 30, 900, 300)).toBe('first line\nsecond line')
```

A highlight is a quad, invisible to `getPaintedText()`. Use `getPaintedHighlights()`, which reports the matched UTF-16 range plus one box per visual row.

```ts
root.render(
  <div highlight={{ query: 'quick' }}>
    <text>the quick brown fox</text>
  </div>,
)
const [hit] = renderer.getPaintedHighlights()
expect(hit.text.slice(hit.start, hit.end)).toBe('quick')
expect(hit.rects).toHaveLength(1)
```

## Pitfalls

- `app.screenshot()` captures the GPUI surface only, never the desktop or macOS blur. Capture the OS window when testing transparency and contrast.
- Browser screenshots must come from the browser tool. `globalThis.gpuix` cannot write a local path.
- A live-app run without `GPUIX_BACKGROUND=1` steals window focus and makes CI flaky.
- Asserting on text without `clock.pause()` races the animation that reveals it.
- `getAllText()` returns empty for rich elements. Reaching for it on a `<code>` block and concluding "nothing rendered" is the usual false negative.
- Linux has no test renderer yet. Do not gate CI on native screenshots there.

## Related

- [apis.md](../references/apis.md)
- [testing-and-automation.md](../best-practices/testing-and-automation.md)
- [headless-controls-and-overlays.md](./headless-controls-and-overlays.md)
- [chat-transcript.md](./chat-transcript.md)
- [desktop-quickstart.md](./desktop-quickstart.md)
