# Use Case — Multi-File Viewer With CodeView

> One virtualized scroll area for a whole patchset, with sidebar navigation that jumps to a file. Source: `@pierre/diffs@1.6.1` (`CodeView`, `parsePatchFiles`).

## 1. Parse the patchset

```ts
import { parsePatchFiles, type FileDiffMetadata } from '@pierre/diffs'

const patches = parsePatchFiles(patch, 'rev-abc123')
const files: FileDiffMetadata[] = patches.flatMap((patch) => patch.files)
```

Keep the cache key prefix tied to the revision (`rev-<sha>`), so switching revisions invalidates highlight caches instead of reusing stale tokens.

## 2. Mark up the host

```html
<div class="viewer">
  <aside class="sidebar"><!-- file list --></aside>
  <div class="diff-host"><!-- CodeView mounts here --></div>
</div>
```

```css
.viewer { display: flex; height: 100%; min-height: 0; }
.sidebar { width: 288px; overflow: auto; }
.diff-host {
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow-y: auto;      /* required */
  overflow-x: hidden;    /* with overflow: 'wrap' */
}
```

The host itself must scroll. `CodeView` never sets `overflow` on its root — a host with `overflow: visible` will clamp `scrollTo()` to 0 while the view caches the intended position.

## 3. Create the viewer

```ts
import { CodeView } from '@pierre/diffs'

const host = document.querySelector<HTMLElement>('.diff-host')!

const view = new CodeView({
  theme: { light: 'github-light', dark: 'github-dark' },
  themeType: 'system',
  diffStyle: 'split',
  diffIndicators: 'bars',
  hunkSeparators: 'line-info',
  overflow: 'scroll',
  enableLineSelection: true,
})

view.setup(host)
view.setItems(
  files.map((fileDiff) => ({
    id: `f:${fileDiff.name}`,
    type: 'diff',
    fileDiff,
  })),
)
```

For Solid, keep the instance out of reactive state:

```tsx
let host!: HTMLDivElement
let view: CodeView | undefined

onMount(() => {
  view = new CodeView(options)
  view.setup(host)
  view.setItems(items())
})
onCleanup(() => view?.cleanUp())
```

## 4. Navigate from the sidebar

```ts
function jumpTo(fileName: string) {
  view.scrollTo({
    type: 'item',
    id: `f:${fileName}`,
    align: 'start',
    behavior: 'smooth',
  })
}
```

For line-level links (comments, review threads):

```ts
view.scrollTo({ type: 'line', id: `f:${fileName}`, lineNumber: 42, side: 'right' })
```

An unknown id logs `CodeView.scrollTo: unknown item id` — validate the id against `files` before calling.

## 5. Update without remounting

```ts
function setItems(next: FileDiffMetadata[]) {
  view.setItems(
    next.map((fileDiff) => ({
      id: `f:${fileDiff.name}`,
      type: 'diff',
      fileDiff,
      version: revisionOf(fileDiff),
    })),
  )
}
```

Rules that keep updates cheap:

- stable `id` per file path
- bump `version` whenever `fileDiff` changes
- never mutate `fileDiff.hunks` in place

When only one file changes, prefer `updateItem` over `setItems` to preserve scroll anchoring.

## 6. Teardown

```ts
view.cleanUp()
```

Also terminate any worker pool you created (`terminateWorkerPoolSingleton()`). Hiding the host with `display: none` instead of unmounting leaves the `ResizeObserver` measuring a zero-height root.
