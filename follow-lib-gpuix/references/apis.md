# GPUIX API

| key | value |
|-----|-------|
| package | `@gpuix/react`, `@gpuix/solid`, `@gpuix/native`, `@gpuix/cli` |
| install | `bun add --exact @gpuix/react @gpuix/native` · `bun add --exact @gpuix/solid @gpuix/native` |
| peer deps | `react ^19.2.0` (React) · `solid-js >=1.9 <2` (Solid) · Bun runtime for dev/build |
| stable version | `0.11.0` (published 2026-10-20; use `0.10.0` while a release is younger than 7 days) |
| version rule | every `@gpuix/*` package at the same exact version |
| license | Apache-2.0 |
| docs | <https://gpuix.dev> · all docs in one download: <https://gpuix.dev/docs.zip> |
| repo | <https://github.com/remorses/gpuix> |
| platform binaries | `@gpuix/native-darwin-arm64`, `@gpuix/native-win32-x64-msvc`, `@gpuix/native-win32-arm64-msvc`, `@gpuix/native-linux-x64-gnu` (optional deps of `@gpuix/native`) |
| browser target | wasm (WebGPU / WebGL2); `globalThis.gpuix` exposed after `render()` |
| CLI | `@gpuix/cli` → `gpuix` (`bunx @gpuix/cli new <dir>`) |

## Entry Points

| api | description | signature/example |
|-----|-------------|-------------------|
| `render` | mount (idempotent) and start the frame loop; call once at file end | `render(<App />, { title: "App", width: 1000, height: 700 })` |
| `render` (Solid) | same options, root is a function | `render(() => <App />, { title: "Solid GPUIX" })` |
| `createRenderer` | create a renderer without mounting an app | `const renderer = createRenderer()` |
| `createRoot` | create a root bound to one renderer; a second root throws | `const root = createRoot(renderer)` |
| `startFrameLoop` | drive frames for custom hosts/tests | `startFrameLoop({ frameMs: 16 })` |
| `flushSync` | force a synchronous commit before a native read | `flushSync(() => setState(next))` |
| `createTestRoot` | test root returning `{ render, renderer }` | `const { render, renderer } = createTestRoot()` |

## Render Options

| option | description | type |
|--------|-------------|------|
| `title` | window title | `string` |
| `width` / `height` | initial logical size | `number` |
| `appName` | app name shown by the OS | `string` |
| `titlebarTransparent` | transparent titlebar | `boolean` |
| `windowBackground` | window material | `"opaque" \| "transparent" \| "blurred"` |
| `trafficLightX` / `trafficLightY` | macOS traffic-light offset | `number` |
| `transparent` | transparent window surface | `boolean` |
| `focus` | focus the window on open (default `true`) | `boolean` |
| `show` | show the window on open (default `true`) | `boolean` |
| `terminal` | run in terminal render mode (default `GPUIX_TERMINAL=1`) | `boolean` |
| `keyboardFocusDim` | dim non-focused focusable elements (default `true`) | `boolean` |

## Elements

| element | description | notes |
|---------|-------------|-------|
| `div` | block container, flex opt-in | `style={{ display: "flex" }}` for flex layout |
| `text` | selectable text | never nest; adjacent siblings merge into one line |
| `code` | syntax-highlighted source | `<code code={src} language="typescript" showLineNumbers />` |
| `diff` | unified diff viewer | `patch`, `wordDiff`, `maxLines`, `collapsedPaths`, `onToggleFile`, `onShowMore`, `onLineClick` |
| `markdown` | GFM renderer | `source`, `onLinkClick` |
| `input` | native single-line input | no default inner padding |
| `textarea` | native multiline, auto-growing | `onChange` |
| `virtual-list` | builds only visible rows | no `testId`, no `hover`/`active` |
| `img` | local / data URL / http(s) image | PNG, JPEG, WebP, GIF, SVG, BMP, TIFF, ICO, Netpbm |
| `svg` | tintable monochrome icon | — |
| `anchored` | positioned overlay layer | `deferred`, `fill="window"` |
| `canvas` | planned | — |

## Events

| event | payload | notes |
|-------|---------|-------|
| `onClick` | `x, y, button, clickCount, isRightClick, modifiers` | primary button only |
| `onAuxClick` | mouse payload | non-primary button |
| `onMouseDown` / `onMouseUp` | mouse payload | with `onMouseMove` ⇒ pointer capture |
| `onMouseEnter` / `onMouseLeave` | hover payload | hover state |
| `onMouseMove` | `pressedButton`, coordinates | pointer capture keeps firing outside the window |
| `onMouseDownOutside` | mouse payload | dismiss-on-outside-click |
| `onKeyDown` / `onKeyUp` | `key, keyChar, isHeld, modifiers` | auto-creates a `FocusHandle`; `tabIndex` still needed |
| `onFocus` / `onBlur` | — | auto-creates a `FocusHandle` |
| `onScroll` | `deltaX, deltaY, precise, touchPhase` | — |
| `onScrollChange` | `scrollX, scrollY` | requires `overflow: "scroll"` |
| `onLayout` | `width, height, x, y` | `div`/`text` only; fires one frame after layout |
| `onFileDrop` | `paths, x, y` | not on `virtual-list` |
| `onChange` | value | `input`, `textarea` |
| `onSubmit` | value | `input` |
| `onSelectionChange` | selection range | window-level, on `render()` |
| `onLinkClick` | `value` (href) | `markdown` |
| `onToggleFile` / `onShowMore` / `onLineClick` | event payload | `diff` |

## Style Keys

| group | keys |
|-------|------|
| layout | `display` (`flex`/`grid`), `flexDirection`, `flexWrap`, `flexGrow`, `flexShrink`, `flexBasis`, `alignItems`, `alignSelf`, `alignContent`, `justifyContent`, `gap`, `rowGap`, `columnGap`, `gridTemplateColumns`, `gridTemplateRows`, `gridColumnMin`, `gridRowMin` |
| sizing | `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight` (number or `"100%"`), `aspectRatio` |
| spacing | `padding`, `paddingTop/Right/Bottom/Left`, `margin`, `marginTop/Right/Bottom/Left` |
| position | `position` (`relative`/`absolute`/`fixed`), `top`, `right`, `bottom`, `left` |
| visual | `background`, `backgroundColor`, `color`, `opacity`, `cursor`, `pointerEvents`, `borderRadius` + per-corner, `borderWidth` + per-side, `borderColor`, `borderStyle` (`solid`/`dashed`), `boxShadow`, `outlineWidth`, `outlineColor`, `outlineOffset` |
| overflow | `overflow: "hidden"` clips; `overflow: "scroll"` native scroll container |
| text | `fontSize`, `fontFamily`, `fontWeight`, `textAlign`, `lineHeight`, `whiteSpace`, `textOverflow`, `lineClamp`, `textDecoration` |
| selection | `userSelect`, `selectionColor` |
| interaction | `hover`, `active`, `focusVisible`, `keyboardFocusDim`, `tabIndex`, `highlight={{ query }}` |
| gradient | `background: { type: "linear-gradient", angle, stops: [a, b], colorSpace: "srgb" \| "oklab" }` |
| shadow | `boxShadow: { offsetX, offsetY, blurRadius, spreadRadius, color, inset }` or array |

## Headless Primitives

| namespace | parts |
|-----------|-------|
| `@gpuix/react/button` · `@gpuix/solid/button` | `Button`, `buttonProps` |
| `@gpuix/react/select` | `Root`, `Trigger`, `Value`, `Content`, `Item`, `Group` |
| `@gpuix/react/combobox` | `Root`, `Input`, `Content`, `List`, `Item`, `Empty` |
| `@gpuix/react/tooltip` | `Provider`, `Root`, `Trigger`, `Content` |
| `@gpuix/react/dialog` | `Root`, `Trigger`, `Portal`, `Backdrop`, `Popup`, `Title`, `Description`, `Close` |
| `@gpuix/react/floating` | `FloatingLayer`, `renderSlot` |
| `DismissableLayer` | escape/outside dismissal + `initialFocus()` |
| `pushDismissLayer` | framework-free variant: `pushDismissLayer(renderer, layer, { previousFocus })` |

## Automation

| api | description | signature/example |
|-----|-------------|-------------------|
| `connectTest` | connect to a renderer from a test | `const app = await connectTest(renderer)` |
| `getByTestId` / `getByText` / `getByType` | locators | `app.getByText("Send")` |
| `locator.click` / `fill` / `press` / `waitFor` | element actions | `await app.getByTestId("send").click()` |
| `locator.textContent` / `all` / `count` / `element` | reads | `await app.getByType("text").all()` |
| `app.mouse` | `move`, `down`, `up`, `click`, `wheel`, `drag`, `hover`, `dragBy`, `dragTo` | `modifiers`, `steps` |
| `app.screenshot` | PNG capture | `app.screenshot({ path: "shot.png" })` |
| `app.clock` | virtual clock | `pause()`, `set(ms)`, `fastForward(ms)` |
| `app.captureFrames` | frame series | `app.captureFrames(dir, timestamps)` |
| `app.recordVideo` | video recorder (ffmpeg) | `recordVideo({ path, fps })` → `frame()`, `wait(ms)`, `nowMs`, `stop()` |
| `launch` | drive a live app | `launch({ command: "bun", args: ["app.tsx"], env: { GPUIX_BACKGROUND: "1" } })` |
| `app.close` | close a launched app | `await app.close()` |

## Native Helpers

| api | description |
|-----|-------------|
| `checkUpdate(current, options)` | opt-in updater: `checkUpdate("0.1.0", { endpoints: ["https://github.com/OWNER/REPO/releases/latest"], pubkey })` |
| `update.downloadAndInstall()` | download + verify signature + install |
| `nativeSimulateClick` / `drainNativeEvents` | low-level event injection for tests |
| `captureScreenshot` / `getPaintedText` / `getPaintedHighlights` | low-level render assertions |
| `TestGpuixRenderer` | offscreen renderer sharing the production `GpuixView` |

## Type Surface

| type | shape |
|------|-------|
| `MutationHost` | `Pick<GpuixRenderer, "applyBatch">` |
| `WindowSizeHost` | window size read/write |
| `SelectionHost` | text selection read/write |
| `NativeRenderer` | `MutationHost` + window + selection |
| `applyBatch` | `applyBatch([...changes])` — atomic commit into the retained tree |
