# Use Case — Workers And SSR

> Move highlighting off the main thread for large patchsets, and pre-render diff HTML on the server. Source: `@pierre/diffs@1.6.1`.

## 1. When to use a worker pool

| Input size | Strategy |
|------------|----------|
| A few files, < 1k lines each | default main-thread highlighter (`shiki-js`) |
| 20–200 files, large hunks | worker pool |
| 200+ files or 10k-line files | worker pool + `CodeView` + lazy expansion |
| SEO / first paint matters | SSR preload + hydrating components |

Workers only move Shiki tokenization — parsing and DOM rendering stay on the main thread, so keep `CodeView` virtualization on as well.

## 2. React: `WorkerPoolContextProvider`

```tsx
import { WorkerPoolContextProvider } from '@pierre/diffs/react'

<WorkerPoolContextProvider
  poolOptions={{
    workerFactory: () =>
      new Worker(new URL('@pierre/diffs/worker/worker.js', import.meta.url), {
        type: 'module',
      }),
    totalWorkers: 4,
  }}
  highlighterOptions={{ theme: { light: 'github-light', dark: 'github-dark' } }}
>
  <App />
</WorkerPoolContextProvider>
```

- `totalWorkers` defaults to 8; cap it at `navigator.hardwareConcurrency` or lower on laptops
- `useWorkerPool()` reads the pool if a component needs it
- `disableWorkerPool` per component opts out (useful for tiny diffs)

Vite/Rollup resolve `new URL('@pierre/diffs/worker/worker.js', import.meta.url)` into a bundled worker asset. If your bundler chokes on that specifier, copy the worker entry into your app or use `worker-portable.js`.

## 3. Vanilla: singleton pool

```ts
import { getOrCreateWorkerPoolSingleton, terminateWorkerPoolSingleton } from '@pierre/diffs/worker'
import { CodeView } from '@pierre/diffs'

const workerManager = getOrCreateWorkerPoolSingleton({
  poolOptions: {
    workerFactory: () =>
      new Worker(new URL('@pierre/diffs/worker/worker.js', import.meta.url), { type: 'module' }),
  },
  highlighterOptions: { theme: pair },
})

const view = new CodeView(options, workerManager)
view.setup(host)
view.setItems(items)

// teardown
view.cleanUp()
terminateWorkerPoolSingleton()
```

The singleton is process-wide — create it once at app boot and terminate only when the whole diff feature unmounts.

## 4. SSR preload

```ts
// server
import { preloadFileDiff, preloadPatchFile } from '@pierre/diffs/ssr'

const preloaded = await preloadFileDiff({ fileDiff, options, annotations })
// preloaded = { fileDiff, options, annotations, prerenderedHTML }
```

```tsx
// client
<FileDiff {...preloaded} />
```

Helpers:

| Helper | Input | Result |
|--------|-------|--------|
| `preloadFileDiff` | `{ fileDiff, options?, annotations? }` | `{ ..., prerenderedHTML }` |
| `preloadMultiFileDiff` | `{ oldFile, newFile, options?, annotations? }` | `{ ..., prerenderedHTML }` |
| `preloadPatchDiff` | `{ patch, options?, annotations? }` | `{ ..., prerenderedHTML }` |
| `preloadPatchFile` | `{ patch, options? }` | `PreloadFileDiffResult[]` (one per file) |
| `preloadFile` / `preloadUnresolvedFile` | file options | `{ ..., prerenderedHTML }` |
| `preloadDiffHTML` | same as `preloadFileDiff` | `prerenderedHTML: string` |
| `renderHTML(children)` | `Element[]` | serialized string |

The component sees `prerenderedHTML` and hydrates instead of rendering twice — output must be deterministic, so pin `themeType` on the server (e.g. `'dark'`) and let the client switch to `'system'` after hydration.

## 5. Large-input checklist

| Check | Target |
|-------|--------|
| First paint | shell + headers render before highlighting completes |
| Scroll | `CodeView` stays at 60fps while highlighting streams in |
| Worker count | ≤ hardware concurrency; no pool recreated per route |
| Memory | no `CodeView`/worker leak after 5 route switches |
| Hydration | no mismatch warning when `prerenderedHTML` is present |
| Errors | one malformed patch doesn't blank the whole viewer |
