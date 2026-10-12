# Playwriter Sandbox Reference

Source: https://playwriter.dev/docs/skill (official Agent Reference)

## Context Variables

| var | description |
|-----|-------------|
| `state` | object persisted between calls within the session — store pages, data, listeners |
| `context` | browser context — `context.pages()` (shared tabs), `context.newPage()` |
| `cloud` | list cloud browsers + `cloud.sendCookies({ from, to, urls? })` — local sessions only |
| `require` | sandboxed Node modules — `fs` writes limited to session cwd, `/tmp`, `os.tmpdir()` |
| `import()` | normal Node ESM (full perms — trusted code only); relative paths resolve from session cwd |
| `importModule` | restricted async import for allowlisted Node built-ins |

Not available: `page` (throws — assign `state.page` first), `__dirname`, `__filename`.

## Utilities

| utility | signature | description |
|---------|-----------|-------------|
| `snapshot` | `{ page, search?, locator?, frame?, showDiffSinceLastCall? }` | accessibility tree + Playwright locators; diffs after first call; starts with `URL:` line; `search` returns first 10 matching lines |
| `screenshotWithAccessibilityLabels` | `{ page }` | Vimium-style labeled screenshot + snapshot — spatial layouts only; color-coded by element type; use ~20s timeout on complex pages |
| `getLatestLogs` | `{ page, count?, search?, sinceLastCall? }` | console + page errors (buffered, survives navigation) — call after every action; never attach `page.on('console')` manually |
| `waitForPageLoad` | `{ page, timeout?, pollInterval?, minWait? }` | smart load detection ignoring ads/analytics → `{ success, readyState, pendingRequests, waitTimeMs, timedOut }` |
| `inspect` | `{ locator, properties? }` | layout, scroll, visibility, input state, aria attrs as text — use instead of `page.evaluate()` for inspection |
| `getCleanHTML` | `{ locator, search?, showDiffSinceLastCall?, includeStyles? }` | cleaned HTML (strips script/style/svg, keeps `href`/`name`/`aria-*`/`data-*`) |
| `getPageMarkdown` | `{ page, search?, showDiffSinceLastCall? }` | main content via Mozilla Readability — title, author, text |
| `getCDPSession` | `{ page }` | raw CDP channel — NEVER use `page.context().newCDPSession()` (fails through relay) |
| `refToLocator` | `{ ref, page }` | resolve `e3`-style ref from screenshot labels via last snapshot |
| `getLocatorStringForElement` | `(locator)` | stable Playwright selector string for an element |
| `getReactSource` / `getReactComponentInfo` | `{ locator }` | React component file:line + info (dev builds; returns `null` for non-React) |
| `inspectPinnedElement` | `(url, globalRef)` | inspect user-pinned elements (`globalThis.playwriterPinnedElemN` via right-click) |
| `getStylesForLocator` | `{ locator, cdp }` | DevTools Styles-panel inspect — fetch `resources/styles-api.md` first |
| `createDebugger` | `{ cdp }` | breakpoints/step/inspect vars — fetch `resources/debugger-api.md` first |
| `createEditor` | `{ cdp }` | live-edit page scripts/CSS in-memory — fetch `resources/editor-api.md` first |
| `resizeImageForAgent` | `{ input, width?, height?, maxDimension?, quality?, format?, output? }` | shrink image before reading into context (alias `resizeImage`) |
| `recording.start/stop` | `{ page, outputPath, frameRate?, audio?, videoBitsPerSecond?, aspectRatio?, maxDurationMs? }` | MP4 via `chrome.tabCapture` — survives navigation; extension mode only; stop returns `{ path, duration, executionTimestamps }` |
| `ghostCursor.show/hide` | `{ page, style? }` | cursor overlay — styles `minimal`/`dot`/`screenstudio` |
| `createDemoVideo` | `{ recordingPath, duration, executionTimestamps, speed? }` | speed up idle sections of a recording — needs ffmpeg + `--timeout 120000` |

## Hard Rules (from official agent reference)

| rule | reason |
|------|--------|
| `state.page` must be assigned first | no default `page`; helpers need `{ page: state.page }` or locator/frame |
| never `browser.close()`/`context.close()`/`bringToFront()` | user's real browser — disruptive |
| `getCDPSession({ page })` only | `newCDPSession()` doesn't work through relay |
| `waitForLoadState('domcontentloaded')` not `waitForEvent('load')` | waitForEvent times out if already loaded |
| click field before `fill()`/`keyboard` (extension mode) | CDP keyboard goes to OS-focused surface |
| no `{ force: true }`/`dispatchEvent`/`el.click()` in evaluate | bypasses checks but React/Vue handlers never fire |
| never `Network.clearBrowserCookies`/`clearBrowserCache` | profile-wide wipe — logs user out of everything |
| clean up own listeners only | `removeAllListeners()` kills Playwriter's own tracking |
| absolute paths for screenshot/pdf/download/saveAs | relative resolves against relay cwd, not session cwd |
| snapshot before screenshot; screenshot only for spatial layout | 5-20KB text vs 100KB+ image tokens |
| `page.evaluate()` = mutations/extraction only | use `inspect()`/`snapshot()` for reading DOM/layout |

## Common Patterns

| task | pattern |
|------|---------|
| JS-heavy/SPA scraping | `goto` → `waitForPageLoad` → `snapshot search: /consent\|cookie/i` → dismiss → `page.evaluate` extract |
| cookie/login wall | snapshot search `/cookie\|consent\|accept\|verify\|login/i` → click dismiss → re-snapshot confirm |
| authenticated fetch | `state.page.evaluate(fetch(...))` inside page context — cookies included |
| network API capture | `state.page.on('request'/'response')` → store in `state.requests/responses` → analyze; replay via in-page `fetch(url, { headers })` |
| popup/OAuth login | auto-relocated to tabs — `context.pages().at(-1)` after click |
| downloads | `Promise.all([waitForEvent('download'), click])` → `download.saveAs('/abs/path')` |
| large data export | in-page `fetch` → `Blob` → `a.download` click → lands in `~/Downloads` |
| canvas/drag/sliders | `mouse.down → move({ steps: 15 }) → up` — not `click()` |
| iframe | `frameLocator(sel)` for actions; `contentFrame()` for `snapshot({ frame })` |
| dialogs | `state.page.on('dialog', d => d.accept())` before triggering |
