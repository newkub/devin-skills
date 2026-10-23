---
name: follow-lib-diffs
description: Use @pierre/diffs to render diffs in web UIs — CodeView, themes, workers, annotations
argument-hint: "[scope]"
related:
  - report-diff-in-web
  - follow-lib-shiki
  - follow-lib-solidjs
  - follow-lib-react
  - follow-tool-vite
---

## Goal

Render git patches and file comparisons in the browser with `@pierre/diffs` (diffs.com) — Shiki-highlighted split/unified diffs, a virtualized multi-file `CodeView`, theme pairs, annotations, line selection, and worker-based highlighting

## Scope

For web apps, docs, and dev tools that display diffs: PR/commit viewers, code-review UIs, changelogs, file-history panels, playgrounds

- Boundary: the diff UI layer only — syntax highlighting internals → `/follow-lib-shiki`; the end-to-end diff report viewer skill → `/report-diff-in-web`; arbitrary text diffing → `jsdiff` (already the parser baseline inside `@pierre/diffs`)
- Surfaces: vanilla DOM (`CodeView`), React (`FileDiff`, `MultiFileDiff`, `PatchDiff`, `File`), SSR preload helpers, Web Worker pool
- Latest: `@pierre/diffs@1.6.1` (verified 2026-10-23)

## Execute

### 1. Install And Pick A Surface

> Goal: choose the smallest component that fits the screen

1. `bun add @pierre/diffs`
2. Choose by input:

   | You have | Use |
   |----------|-----|
   | one `git diff` patch string | `PatchDiff` (React) or `getSingularPatch` → `FileDiff` |
   | old + new file contents | `parseDiffFromFile` → `FileDiff` |
   | many files in one scroll area | `CodeView` (vanilla or React) |
   | a whole patchset | `parsePatchFiles` → `ParsedPatch[].files` |
   | a non-diff file view | `File` / `UnresolvedFile` |
   | server-rendered HTML | `@pierre/diffs/ssr` preload helpers |

3. React entry: `@pierre/diffs/react`; root entry is framework-agnostic DOM, so Solid/Vue/Svelte render `new CodeView()` into an element ref — React setup in `/follow-lib-react`, Solid setup in `/follow-lib-solidjs`, bundling in `/follow-tool-vite`
4. The library injects its own core/theme `<style>` nodes (`data-core-css`, `data-theme-css`) — don't strip or duplicate them

### 2. Parse Inputs

> Goal: turn raw text into `FileDiffMetadata`

1. Single patch: `getSingularPatch(patch)` or `parsePatchFiles(patch, cacheKeyPrefix)[0].files[0]`
2. Old/new contents: `parseDiffFromFile({ name, contents }, { name, contents })`
3. `parsePatchFiles(data, cacheKeyPrefix?)` returns `ParsedPatch[]` — `{ patchMetadata?, files: FileDiffMetadata[] }`, one entry per contiguous patch group; keep the prefix stable so highlight caching survives re-renders
4. `FileDiffMetadata` holds `name`, `prevName`, `hunks`, `splitLineCount`, `unifiedLineCount`, `cacheKey` — treat it as immutable, re-parse to change content
5. `throwOnError = true` only in tests; production falls back to plain-text rendering

### 3. Render One Diff

> Goal: a correct first render in a few lines

```tsx
import { FileDiff } from '@pierre/diffs/react'
import { getSingularPatch } from '@pierre/diffs'

const fileDiff = getSingularPatch(patch)

<FileDiff
  fileDiff={fileDiff}
  options={{
    theme: { light: 'pierre-light', dark: 'pierre-dark' },
    themeType: 'system',
    diffStyle: 'split',
  }}
/>
```

Options that matter most: `theme` (name or `{ light, dark }`), `themeType` (`'system' | 'light' | 'dark'`), `diffStyle` (`'split' | 'unified'`), `diffIndicators` (`'classic' | 'bars' | 'none'`), `lineDiffType` (`'word-alt' | 'word-line' | 'word' | 'char' | 'none'`), `hunkSeparators` (`'simple' | 'metadata' | 'line-info' | 'line-info-basic'`), `expandUnchanged`, `collapsedContextThreshold`, `overflow` (`'scroll' | 'wrap'`), `disableLineNumbers`, `disableBackground`. Full table: [references/api.md](references/api.md).

### 4. Build A Multi-File Viewer

> Goal: one virtualized scroller for every changed file

1. Create a host element that is the scroll container — `overflow-y: auto` (plus `overflow-x: hidden` when wrapping) goes on that element, not a parent
2. `const view = new CodeView<Meta>(options); view.setup(host); view.setItems(items)`
3. Items: `{ id, type: 'diff', fileDiff }` or `{ id, type: 'file', file }`; ids are the navigation keys
4. Update with `updateItem` / `addItem` / `removeItem` / `setItems`; bump `version` when content changes
5. Navigate: `view.scrollTo({ type: 'item', id, align: 'start', behavior: 'smooth' })`, also `'line'`, `'position'`, `'range'` targets
6. Teardown: `view.cleanUp()` on unmount; don't hide the host with `display: none` and expect measurements to stay valid
7. Full recipe: [usecases/multi-file-viewer.md](usecases/multi-file-viewer.md)

### 5. Theme And Typography

> Goal: match product tokens without forking CSS

1. `theme: { light, dark }` + `themeType` — `'system'` follows `prefers-color-scheme`, `'light'`/`'dark'` pin it; switching needs no re-parse
2. Bundled themes include `pierre`, `github`, `one`, `vitesse`, `catppuccin` variants; custom themes via `registerCustomTheme` / `createCSSVariablesTheme`
3. CSS variables on the host: `--diffs-font-size`, `--diffs-line-height`, `--diffs-font-family`, `--diffs-tab-size`
4. `useCSSClasses: true` moves colors into classes (smaller DOM, CSS-driven theme switch); inline styles are the default
5. Font scaling multiplies the variables — `transform: scale()` breaks virtualization metrics

### 6. Performance And Workers

> Goal: keep large diffs responsive

1. `CodeView` virtualizes rows — give the host a real height inside a flex/grid area
2. Parse once per source revision; cache `FileDiffMetadata` by revision + path
3. Large inputs: highlight in a worker pool — `WorkerPoolContextProvider` (React) or `getOrCreateWorkerPoolSingleton({ poolOptions: { workerFactory: () => new Worker(new URL('@pierre/diffs/worker/worker.js', import.meta.url), { type: 'module' }) } })`
4. Worker entries: `@pierre/diffs/worker/worker.js` (bundler-friendly) or `worker-portable.js`
5. `preferredHighlighter`: `'shiki-js'` (default) | `'shiki-wasm'` | `'highlights'`
6. SSR: `@pierre/diffs/ssr` exposes `preloadFileDiff`, `preloadMultiFileDiff`, `preloadPatchDiff`, `preloadPatchFile`, `preloadFile`, `preloadUnresolvedFile`, `renderHTML`; pass `prerenderedHTML` to React components to skip the first client render

### 7. Annotations, Selection, Accept/Reject

> Goal: wire review interactions without touching the DOM

1. Annotations: `DiffLineAnnotation<Meta>` (`{ side, lineNumber, metadata }`) passed as `annotations` on an item or `lineAnnotations` on React components; render with `renderAnnotation`
2. Line selection: `enableLineSelection: true` + `onLineSelected`; controlled mode via `controlledSelection` + `selectedLines`
3. Accept/reject: `diffAcceptRejectHunk(fileDiff, hunkIndex, 'accept' | 'reject' | 'both')` returns the next `FileDiffMetadata`; wire it to `renderGutterUtility` buttons
4. Editing: `edit: true` on an item with an editor factory (`EditProvider` in React, `createEditor` in vanilla); `onItemEditComplete` returns `'accept' | 'reject'`

## Rules

### 1. Host Owns Scrolling

- `CodeView` does not set `overflow` on its root. A host without `overflow: auto` clamps `scrollTo()` to 0 while the internal cache records the target — sidebar navigation silently stops working
- Never move the scroll container above the CodeView host; the view measures and scrolls its own root
- `getScrollTop()` reads the cached value unless marked dirty — trust the DOM element for immediate checks

### 2. Stable Identity, Explicit Versions

- `id` must be stable across updates; reuse one id per file and bump `version` when the diff content changes
- Never mutate `FileDiffMetadata` / `FileContents` in place — re-parse and replace

### 3. Explicit Themes And Highlighters

- Pass an explicit `theme` (or light/dark pair) and `preferredHighlighter`; don't depend on per-file auto-loading in production
- Keep one theme pair across the app; a theme switch must not re-parse diffs
- Highlighting outside diffs belongs to `/follow-lib-shiki`

### 4. Clean Teardown

- Call `cleanUp()` and terminate worker pools on unmount; leaked instances retain `ResizeObserver`s and detached DOM
- Create a new `CodeView` per host — `setup()` binds that instance to one root

### 5. Accessibility And Performance

- Keep the diff host keyboard-reachable and announce file counts outside the virtualized region — virtualized rows are not in the tab order
- Don't render a patchset as a list of unvirtualized `FileDiff`s; one `CodeView` beats N components
- Verify large inputs (200+ files, 10k-line files) in a real browser before shipping (`/follow-tool-playwright`)

### Use Cases

| Scenario | Use case |
|----------|----------|
| Multi-file viewer with sidebar navigation and `scrollTo` | `usecases/multi-file-viewer.md` |
| Single patch or old/new file comparison | `usecases/patch-and-file-diff.md` |
| Theme pair, dark mode, typography variables | `usecases/themes-and-typography.md` |
| Line annotations and selection for review comments | `usecases/annotations-and-selection.md` |
| Worker pool and SSR preload for large diffs | `usecases/worker-and-ssr.md` |

## References

- [API reference](references/api.md)
- See `best-practices/` for recommended patterns and pitfalls
- References: [@pierre/diffs — Best Practices](best-practices/diffs.md)

## Expected Outcome

- A surface chosen per input (single patch, file pair, patchset, non-diff file) with correct parsing
- `CodeView` configured as the scroll container, with stable ids, version bumps, and working `scrollTo`
- Light/dark themes and typography variables wired to product tokens
- Workers and SSR preload used where input size demands it
- No leaked viewers; navigation and interactions verified in a real browser
