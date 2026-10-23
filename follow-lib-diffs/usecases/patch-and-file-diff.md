# Use Case — Single Patch And Old/New File Diff

> Pick the narrowest component: one patch string, two file contents, or a whole patchset. Source: `@pierre/diffs@1.6.1`.

## 1. From a `git diff` string

```tsx
import { PatchDiff } from '@pierre/diffs/react'

<PatchDiff
  patch={patch}
  options={{
    theme: { light: 'one-light', dark: 'one-dark' },
    themeType: 'system',
    diffStyle: 'unified',
    diffIndicators: 'classic',
  }}
/>
```

`PatchDiff` parses the patch itself. If the same patch is needed in multiple places, parse once and reuse the metadata:

```ts
import { parsePatchFiles } from '@pierre/diffs'

const [parsed] = parsePatchFiles(patch, 'pr-1234')
const fileDiff = parsed.files[0]
```

```tsx
import { FileDiff } from '@pierre/diffs/react'

<FileDiff fileDiff={fileDiff} options={options} />
```

## 2. From old and new contents

```ts
import { parseDiffFromFile } from '@pierre/diffs'

const fileDiff = parseDiffFromFile(
  { name: 'src/app.ts', contents: previousSource },
  { name: 'src/app.ts', contents: nextSource },
)
```

```tsx
<FileDiff fileDiff={fileDiff} options={options} />
```

`MultiFileDiff` wraps the same flow in one component:

```tsx
<MultiFileDiff
  oldFile={{ name: 'src/app.ts', contents: before }}
  newFile={{ name: 'src/app.ts', contents: after }}
  options={options}
/>
```

Use the two-content path when you already hold snapshots (editor previews, file history, draft vs saved). Use the patch path when git produced the diff — it preserves hunk headers and binary/rename metadata.

## 3. Vanilla (non-React) rendering

```ts
import { FileDiff, parseDiffFromFile } from '@pierre/diffs'

const fileDiff = parseDiffFromFile(oldFile, newFile)
const node = new FileDiff({ fileDiff, options })
document.querySelector('.diff-slot')!.append(node)
```

For Solid/Vue/Svelte, mount the returned element into a ref and call its cleanup on unmount. The DOM components accept `{ fileDiff | file | patch, options, lineAnnotations, renderAnnotation }`.

## 4. Non-diff previews

```tsx
import { File, UnresolvedFile } from '@pierre/diffs/react'

<File file={{ name: 'README.md', contents: readme }} options={{ theme: pair }} />
<UnresolvedFile file={{ name: 'merge.ts', contents: conflicted }} options={options} />
```

Use `File` when a file has no previous revision; `UnresolvedFile` for merge conflicts (it renders conflict markers with action slots).

## 5. Failure fallback

```ts
import { getSingularPatch } from '@pierre/diffs'

function safeFileDiff(patch: string) {
  try {
    return getSingularPatch(patch)
  } catch {
    return null
  }
}
```

Render a `<pre>` (or an `UnresolvedFile`) when parsing fails — a viewer should degrade to readable text, not an empty pane. Do not pass `throwOnError = true` in production code paths.

## 6. Picking between surfaces

| Situation | Surface | Why |
|-----------|---------|-----|
| One file, patch available | `PatchDiff` | least wiring |
| One file, two snapshots | `MultiFileDiff` / `parseDiffFromFile` | no patch needed |
| One file, metadata already parsed | `FileDiff` | reuse across views |
| Many files, one scroller | `CodeView` | virtualization + navigation |
| File without diff | `File` | syntax-highlighted preview |
| Merge conflicts | `UnresolvedFile` | conflict markers + actions |
