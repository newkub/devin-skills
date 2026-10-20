# Use Case — Data Fetching with Server Components and Suspense

> Render server data without a client cache, stream slow parts behind Suspense, and dedupe one request per render pass. Source: https://react.dev/reference/react/use (accessed 2026-10-20)

## 1. Server Component fetches — the token never reaches the browser

```tsx
// app/todos/page.tsx — Server Component (no "use client")
import { Suspense } from "react"
import { TodoList } from "./todo-list"

export default function Page() {
  return (
    <main>
      <h1>Todos</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <TodoList />
      </Suspense>
    </main>
  )
}

async function TodoList() {
  const todos = await db.todo.findMany()          // server only
  return <ul>{todos.map(t => <li key={t.id}>{t.title}</li>)}</ul>
}
```

## 2. `use()` a promise inside a Client Component

```tsx
"use client"
import { use } from "react"

export function Comments({ commentsPromise }: { commentsPromise: Promise<Comment[]> }) {
  const comments = use(commentsPromise)   // suspends until it resolves
  return <ul>{comments.map(c => <li key={c.id}>{c.text}</li>)}</ul>
}
```

`use` is not a Hook — it may be called conditionally, but the promise must be created outside render (or memoized), otherwise every render suspends on a new promise.

## 3. Dedupe with `cache()`

```tsx
import { cache } from "react"
export const getUser = cache(async (id: string) => db.user.find(id))
```

React 19 dedupes `fetch` automatically; `cache()` does the same for any function during one server render.

## Pitfalls

- Marking a component `"use client"` just to fetch → the request runs from the browser and any token passed in is exposed.
- Creating the promise inside the component that `use()`s it → new promise every render, infinite suspending.
- No Suspense boundary → the whole route blocks instead of streaming a fallback.
- Expecting `cache()` to persist across requests → it is per render pass; use TanStack Query or a KV cache for cross-request reuse.

## Related

- `references/apis.md`
- `usecases/forms-with-server-actions.md`
- `usecases/concurrent-ui-transitions.md`
