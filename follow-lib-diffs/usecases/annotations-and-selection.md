# Use Case — Annotations, Selection, And Hunk Actions

> Review-style interactions: comment threads anchored to diff lines, range selection, and accept/reject per hunk. Source: `@pierre/diffs@1.6.1`.

## 1. Anchor annotations to lines

```ts
import type { DiffLineAnnotation } from '@pierre/diffs'

type Comment = { id: string; author: string; body: string }

const annotations: DiffLineAnnotation<Comment>[] = [
  { side: 'right', lineNumber: 42, metadata: { id: 'c1', author: 'ana', body: 'Nit: rename' } },
  { side: 'left', lineNumber: 17, metadata: { id: 'c2', author: 'sam', body: 'Why removed?' } },
]
```

- `side`: `'left'` (old), `'right'` (new), or omit for a shared row
- `lineNumber: 0` renders a file-level annotation above the first hunk
- Pass on a CodeView item (`annotations`) or on `FileDiff` (`lineAnnotations`)

## 2. Render the annotation

```tsx
<FileDiff
  fileDiff={fileDiff}
  options={options}
  lineAnnotations={annotations}
  renderAnnotation={([annotation, file]) => (
    <div class="comment">
      <strong>{annotation.metadata.author}</strong>
      <p>{annotation.metadata.body}</p>
    </div>
  )}
/>
```

The callback receives the annotation plus the file/diff it belongs to — use the file to build permalinks (`path#L42`). Never query diff rows from the DOM to position comments; the virtualizer unmounts off-screen rows.

## 3. Selection for "comment on range"

```ts
const view = new CodeView({
  theme: pair,
  themeType: 'system',
  enableLineSelection: true,
  onLineSelected(range) {
    // range: SelectedLineRange | null
    setDraftComment(range)
  },
})
```

Controlled selection:

```ts
const view = new CodeView({ ..., controlledSelection: true })
view.setSelectedLines({ start: 40, end: 46, side: 'right' })
```

Keep selection in app state when a comment composer opens — clicking into the textarea must not clear the range.

## 4. Accept / reject hunks

```ts
import { diffAcceptRejectHunk, type FileDiffMetadata } from '@pierre/diffs'

function applyHunk(fileDiff: FileDiffMetadata, hunkIndex: number, action: 'accept' | 'reject') {
  return diffAcceptRejectHunk(fileDiff, hunkIndex, action)
}
```

`diffAcceptRejectHunk` returns the next `FileDiffMetadata` — it does not mutate. Swap it into the item and bump `version`:

```ts
view.updateItem({ id, type: 'diff', fileDiff: next, version: ++n })
```

For a single change inside a hunk use the config form: `diffAcceptRejectHunk(fileDiff, hunkIndex, { type: 'accept', changeIndex })`.

Wire buttons through the gutter utility:

```ts
const view = new CodeView({
  ...options,
  renderGutterUtility(getHoveredLine) {
    const button = document.createElement('button')
    button.textContent = 'Comment'
    button.onclick = () => openComposer(getHoveredLine())
    return button
  },
})
```

`getHoveredLine()` resolves at click time — the virtualizer may have recycled the row between render and interaction.

## 5. Edit mode

```ts
view.setOptions({
  createEditor: ({ value, language }) => createMyEditor({ value, language }),
  onItemEditComplete(event, item, nextItem) {
    return validate(nextItem) ? 'accept' : 'reject'
  },
})
```

- Set `edit: true` on the item to start a session; `collapsed: true` suspends editing
- Bump `version` alongside any value change
- `'accept'` installs `nextItem`; `'reject'` reverts

## 6. Interaction checklist

| Interaction | Verify |
|-------------|--------|
| Annotation click | opens the right thread after scrolling far away and back |
| Range selection | drag across hunks, then scroll and re-select |
| Accept hunk | file header +/− counts update, other hunks unchanged |
| Reject hunk | reverted hunk disappears from the pending list |
| Edit complete | undo history survives collapse, not unmount |
| Keyboard | diff host focusable, Escape closes the composer |
