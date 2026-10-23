# @pierre/diffs — API Reference

Verified against `@pierre/diffs@1.6.1` on 2026-10-23.

## Entry Points

| Entry | Exposes |
|-------|---------|
| `@pierre/diffs` | DOM components (`CodeView`, `FileDiff`, `MultiFileDiff`, `PatchDiff`, `File`, `UnresolvedFile`), parsers, themes, utilities |
| `@pierre/diffs/react` | React components, `WorkerPoolContextProvider`, `EditProvider`, hooks (`useVirtualizer`, `useFileDiffInstance`, `useWorkerPool`) |
| `@pierre/diffs/ssr` | `preloadFileDiff`, `preloadMultiFileDiff`, `preloadPatchDiff`, `preloadPatchFile`, `preloadFile`, `preloadUnresolvedFile`, `renderHTML` |
| `@pierre/diffs/worker` | `WorkerPoolManager`, `getOrCreateWorkerPoolSingleton`, `terminateWorkerPoolSingleton` |
| `@pierre/diffs/worker/worker.js` | Worker entry (bundler-friendly) |
| `@pierre/diffs/worker/worker-portable.js` | Portable worker entry |
| `@pierre/diffs/edit` | Editor integration for the edit mode |

## Parsing

| Function | Signature | Returns |
|----------|-----------|---------|
| `parsePatchFiles` | `(data: string, cacheKeyPrefix?: string, throwOnError?: boolean)` | `ParsedPatch[]` = `{ patchMetadata?: string; files: FileDiffMetadata[] }[]` |
| `getSingularPatch` | `(patch: string)` | `FileDiffMetadata` for a single-file patch |
| `parseDiffFromFile` | `(oldFile: FileContents \| null, newFile: FileContents \| null, options?, throwOnError?)` | `FileDiffMetadata` |
| `processPatch` / `processFile` | internal per-file processors | `FileDiffMetadata` |

`FileContents` = `{ name, contents, lang?, header?, cacheKey? }`.

`FileDiffMetadata` = `{ name, prevName?, lang?, hunks, splitLineCount, unifiedLineCount, cacheKey, ... }` — immutable; re-parse to change content.

## Components

| Component | Props that matter | Input |
|-----------|-------------------|-------|
| `FileDiff` | `fileDiff`, `options`, `lineAnnotations`, `selectedLines`, `renderAnnotation`, `prerenderedHTML`, `disableWorkerPool` | one `FileDiffMetadata` |
| `MultiFileDiff` | `oldFile`, `newFile`, `options` | two `FileContents` |
| `PatchDiff` | `patch`, `options` | one patch string |
| `CodeView` (React) | controlled `items` or uncontrolled `initialItems`, `options`, `containerRef`, `onScroll`, `onSelectedLinesChange`, `ref` → `CodeViewHandle` | many items |
| `File` | `file`, `options` | non-diff file |
| `UnresolvedFile` | `file`, `options` | file with merge conflicts |

`CodeViewHandle`: `addItems`, `getItem`, `removeItem`, `updateItem`, `updateItemId`, `scrollTo`, `setSelectedLines`, `getSelectedLines`, `clearSelectedLines`, `getEditor`, `getInstance`.

## CodeView (vanilla)

| Method | Purpose |
|--------|---------|
| `setup(root)` | bind the instance to a host element (host must be the scroll container) |
| `setItems(items)` | replace all items |
| `addItem` / `updateItem` / `removeItem` | granular updates; bump `version` on content change |
| `getItem(id)` | read an item |
| `scrollTo(target)` | item / line / position / range targets |
| `getScrollTop()` | cached scroll top (may be dirty) |
| `setOptions(options)` | update options without remounting |
| `render(immediate?)` | force a render pass |
| `cleanUp()` | release observers, editors, DOM |

Item shapes:

```ts
type CodeViewItem = {
  id: string
  type: 'diff'
  fileDiff: FileDiffMetadata
  annotations?: DiffLineAnnotation<Meta>[]
  version?: number
  collapsed?: boolean
  edit?: boolean
} | {
  id: string
  type: 'file'
  file: FileContents
  annotations?: LineAnnotation<Meta>[]
  version?: number
  collapsed?: boolean
  edit?: boolean
}
```

Scroll targets:

```ts
{ type: 'item', id, align?, offset?, behavior? }
{ type: 'line', id, lineNumber, side?, align?, offset?, behavior? }
{ type: 'position', position, behavior? }
{ type: 'range', id, range, align?, offset?, behavior? }
```

`behavior` = `'instant' | 'smooth' | 'auto'` style values (`CodeViewScrollBehavior`).

## Base Diff Options

| Option | Values | Notes |
|--------|--------|-------|
| `theme` | theme name or `{ light, dark }` | default pair `pierre-light` / `pierre-dark` |
| `themeType` | `'system' \| 'light' \| 'dark'` | chooses which side of the pair is active |
| `diffStyle` | `'split' \| 'unified'` | layout |
| `diffIndicators` | `'classic' \| 'bars' \| 'none'` | gutter markers |
| `disableBackground` | boolean | drop add/remove tint |
| `disableLineNumbers` | boolean | hide gutters |
| `overflow` | `'scroll' \| 'wrap'` | long lines |
| `hunkSeparators` | `'simple' \| 'metadata' \| 'line-info' \| 'line-info-basic'` | `'custom'` deprecated |
| `expandUnchanged` | boolean | render full context |
| `collapsedContextThreshold` | number | context lines before collapsing |
| `lineDiffType` | `'word-alt' \| 'word-line' \| 'word' \| 'char' \| 'none'` | intra-line diffing |
| `maxLineDiffLength` | number | skip intra-line diff past this length |
| `expansionLineCount` | number | lines added per expand click |
| `preferredHighlighter` | `'shiki-js' \| 'shiki-wasm' \| 'highlights'` | default `shiki-js` |
| `useCSSClasses` | boolean | colors via classes instead of inline styles |
| `disableFileHeader` | boolean | hide the built-in header |
| `disableErrorHandling` | boolean | throw render errors |
| `loadDiffFiles` | loader | lazily fetch file contents for expansion |
| `parseDiffOptions` | object | tokenizer bounds (`tokenizeMaxLength`, `tokenizeMaxLineLength`) |

## CodeView-Only Options

| Option | Purpose |
|--------|---------|
| `hunkSeparators` | same values minus `'custom'` |
| `itemMetrics` | row/file height overrides for virtualization |
| `pointerEventsOnScroll` | disable pointer events while scrolling |
| `smoothScrollSettings` | smooth-scroll tuning |
| `stickyHeaders` | sticky file headers |
| `layout` | `'all'` / focus-style layouts |
| `controlledSelection` | keep selection in your state |
| `onSelectedLinesChange` | selection callback |
| `onLineSelected` / `onLineSelectionStart` / `onLineSelectionChange` / `onLineSelectionEnd` | selection lifecycle |
| `renderCustomHeader`, `renderHeaderPrefix`, `renderHeaderFilenameSuffix`, `renderHeaderMetadata` | header slots |
| `renderAnnotation` | annotation slot |
| `renderGutterUtility`, `onGutterUtilityClick` | gutter buttons |
| `onLineClick`, `onLineNumberClick`, `onLineEnter`, `onLineLeave` | line events |
| `onTokenClick`, `onTokenEnter`, `onTokenLeave` | token events |
| `onPostRender` | post-render hook |
| `renderCodeViewHeader` / `renderCodeViewFooter` | non-virtualized header/footer |
| `createEditor`, `getEditStateKey`, `onItemEditChange`, `onItemEditComplete` | edit mode |

## Annotations And Actions

- `DiffLineAnnotation<Meta>` = `{ side: 'left' | 'right' | 'both'?, lineNumber, metadata }`
- `LineAnnotation<Meta>` = `{ lineNumber, metadata }` for file items
- `enableLineSelection: true` → `onSelectedLinesChange(selection)`
- `diffAcceptRejectHunk(fileDiff, hunkIndex, 'accept' | 'reject' | 'both')` → next `FileDiffMetadata`; config form `{ type, changeIndex }`

## Theming

- Bundled theme families: `pierre`, `github`, `one`, `vitesse`, `catppuccin` in light/dark variants
- `registerCustomTheme(name, theme)` / `createCSSVariablesTheme(...)` for product themes
- CSS variables: `--diffs-font-size`, `--diffs-line-height`, `--diffs-font-family`, `--diffs-tab-size`, plus theme color variables
- Style nodes carry `data-core-css` / `data-theme-css` — injected by the library

## Workers And SSR

- `getOrCreateWorkerPoolSingleton({ poolOptions: { workerFactory, totalWorkers? }, highlighterOptions })`
- `terminateWorkerPoolSingleton()` on teardown
- React: `WorkerPoolContextProvider` + `useWorkerPool`; `disableWorkerPool` per component
- SSR: preload helpers return `{ fileDiff | file, options, annotations, prerenderedHTML }`; pass `prerenderedHTML` to the matching component; `renderHTML(children)` serializes the preloaded nodes
