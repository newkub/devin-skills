# @pierre/diffs — Best Practices

Shiki-highlighted diff rendering — one virtualized `CodeView` for patchsets, small components for single diffs

## Recommended Patterns

- Patchset UI → one `CodeView` with `{ id, type: 'diff', fileDiff }` items; sidebar navigation calls `scrollTo({ type: 'item', id })`
- Parse with `parsePatchFiles(patch, stableCacheKeyPrefix)` once per revision; cache `FileDiffMetadata` by revision + path
- Keep `id` stable per file and bump `version` on content change — `setItems`/`updateItem` diff by id
- Theme pair `{ light, dark }` + `themeType` — switching light/dark/system never re-parses or re-highlights
- Style through CSS variables on the host (`--diffs-font-size`, `--diffs-line-height`, `--diffs-font-family`, `--diffs-tab-size`) instead of patching component CSS
- Large repos/patches → worker pool (`WorkerPoolContextProvider` or `getOrCreateWorkerPoolSingleton`) and SSR preload to cut first paint
- Review UIs → `DiffLineAnnotation` for comments, `enableLineSelection` for ranges, `diffAcceptRejectHunk` for hunk actions

## Common Pitfalls

- Host without `overflow: auto` → `CodeView.scrollTo()` clamps to 0 while the cached target is recorded and considered settled; navigation appears broken (the console logs `unknown item id` only for bad ids, not for clamped scrolls)
- Scroll container placed on a wrapper above the host → same clamp, because the view scrolls its own root
- Mutating `fileDiff.hunks` or `file.contents` in place → stale render; re-parse and bump `version`
- Recreating `CodeView` on every state change → lost scroll position and editor state; update items instead
- Forgetting `cleanUp()` on unmount → retained `ResizeObserver`s, detached DOM, duplicate workers
- `display: none` on the host during layout → zero-height measurements; show it before calling `render()`
- Passing `throwOnError = true` in production → an invalid patch crashes the viewer instead of falling back
- `transform: scale()` for font zoom → virtualization row metrics drift; scale the CSS variables instead
- Rendering one `FileDiff` per file for a 200-file patchset → thousands of DOM nodes; use `CodeView`
- Relying on shiki auto-loading arbitrary languages → slow first render; set `preferredHighlighter` and keep the language set bounded

## UX/UI Integration

- Use in `/improve uxui` when a viewer shows raw `<pre>` diffs, loses dark-mode styling, or cannot jump between files
- The reference implementation is `/report-diff-in-web` (`src/` app inside the skill) — sidebar, options sheet, focus layout, font zoom, source switching
- Pair `/follow-unocss-theme` tokens with the diff CSS variables so diff colors/fonts follow the product theme
- Keep file headers, sticky headers, and the sidebar visually consistent: one accent color, one type scale, tabular numerals for +/− counts

## Do / Don't

| Do | Don't |
|----|-------|
| make the CodeView host the scroll container | wrap it in a scroller above the host |
| stable item ids + version bumps | regenerate ids or mutate metadata in place |
| one theme pair + `themeType` | re-parse diffs when toggling theme |
| worker pool + SSR preload for large inputs | highlight a 200-file patch on the main thread |
| `cleanUp()` + terminate workers on unmount | leak instances across route changes |
| annotations/selection through component props | query and mutate rendered rows directly |
| scale typography via CSS variables | `transform: scale()` the whole diff |
| verify scroll + keyboard nav in a browser | trust unit tests for virtualization behavior |
