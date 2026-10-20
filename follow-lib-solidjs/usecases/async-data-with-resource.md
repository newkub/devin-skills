# Use Case — Async Data with createResource and Suspense

> Fetch per-route data that re-runs when an id changes, with Suspense for the pending UI and a real error boundary. Source: https://docs.solidjs.com/reference/basic-reactivity/create-resource (accessed 2026-10-20)

## 1. A resource keyed by a signal

```tsx
import { createResource, createSignal, Show, Suspense, ErrorBoundary } from "solid-js"

const [id, setId] = createSignal(1)

const [post, { refetch, mutate }] = createResource(id, async (postId, { signal }) => {
  const res = await fetch(`/api/posts/${postId}`, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<Post>
})
```

Passing the source signal makes the resource re-run on change; `signal` is aborted when the source changes again, so stale responses cannot land.

## 2. Render states explicitly

```tsx
<ErrorBoundary fallback={(err, reset) => <button onClick={reset}>Retry: {err.message}</button>}>
  <Suspense fallback={<Skeleton />}>
    <Show when={post()} keyed>
      {(p) => <article><h1>{p.title}</h1></article>}
    </Show>
  </Suspense>
</ErrorBoundary>
```

`keyed` re-creates the block when the value identity changes — the right default for a whole record. Without it, `Show` only toggles on truthiness.

## 3. Avoid a fetch waterfall

Start independent resources together and read them in the same `Suspense`:

```tsx
const [post] = createResource(id, fetchPost)
const [comments] = createResource(id, fetchComments)
// both read inside one <Suspense> → single pending state
```

Mutations go through `mutate` for an optimistic update, then `refetch()` to reconcile:

```ts
mutate({ ...post()!, title: "New" })
await fetch(`/api/posts/${id()}`, { method: "PATCH", body: JSON.stringify({ title: "New" }) })
refetch()
```

## Pitfalls

- Creating the resource inside an event handler → it never re-runs; keep it at component scope and drive it with a signal.
- `if (post.loading) return <Skeleton/>` before `Suspense` → the boundary never sees the pending state; use `Suspense` (`createResource` in a transition or `latest` keeps previous data).
- Throwing inside the fetcher and catching locally → the error never reaches the boundary; let it propagate.
- Fetching in `createEffect` → runs after render and can loop; `createResource` is the primitive for async reads.

## Related

- `references/apis.md`
- `best-practices/rendering-and-async.md`
- `usecases/nested-form-state-with-store.md`
