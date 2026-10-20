# Use Case — Live Queries: Filter, Join, Order

> De-normalize loaded into one reactive result — load normalized data into collections, then join across them in a live query that re-evaluates incrementally when any side changes. Source: https://tanstack.com/db/latest/docs/guides/live-queries (accessed 2026-10-20)

## 1. Query pipeline

```tsx
import { useLiveQuery, eq } from '@tanstack/react-db'

const { data } = useLiveQuery({
  query: (q) =>
    q
      .from({ todo: todoCollection })
      .join({ list: listCollection }, ({ todo, list }) => eq(list.id, todo.list_id), 'inner')
      .where(({ list }) => eq(list.active, true))
      .orderBy(({ todo }) => todo.created_at, 'asc')
      .limit(50)
      .select(({ todo, list }) => ({
        id: todo.id,
        text: todo.text,
        listName: list.name,
      })),
})
```

- `.from({ alias: collection })` names the source; every callback destructures by that alias.
- `.join({ alias: collection }, onFn, 'inner' | 'left' | 'right')` — the `type` arg is optional (defaults to inner).
- The result is itself a collection → it can be queried again (see `derived-collections.md`).

## 2. Operators (import from `@tanstack/db`)

```ts
import { eq, gt, gte, lt, lte, like, ilike, inArray, and, or, not } from '@tanstack/db'
```

| Op | Example |
|---|---|
| comparison | `eq(a, b)`, `gt`, `gte`, `lt`, `lte` |
| pattern | `like(name, '%foo%')`, `ilike` (case-insensitive) |
| set | `inArray(id, [1, 2, 3])` |
| logic | `and(...)` / `or(...)` / `not(...)` |

```ts
.where(({ todo }) => not(todo.completed))                       // boolean column
.where(({ todo }) => and(eq(todo.list_id, id), gt(todo.priority, 0)))
.where(({ todo }) => inArray(todo.status, ['open', 'pending']))
```

## 3. Reactivity model

Live queries run on differential dataflow (d2ts): when a source row changes, the result updates incrementally, not by re-running the query (≈0.7 ms to update one row in a sorted 100k collection). Any component reading the query re-renders only for rows that actually affected the result.

## 4. Conditional / Suspense variants

```tsx
// Guarantee `data` is defined (suspends on initial load)
import { useLiveSuspenseQuery } from '@tanstack/react-db'
const { data: todos } = useLiveSuspenseQuery({
  query: (q) => q.from({ todo: todoCollection }).where(({ todo }) => eq(todo.completed, false)),
})
// wrap the parent in <Suspense fallback={...}>
```

## 5. Composable queries

`.where/.select/.orderBy/...` each return a `Query`, so a base query is reusable and extended per view:

```ts
const active = q.from({ todo: todoCollection }).where(({ todo }) => not(todo.completed))
const byDate = active.orderBy(({ todo }) => todo.created_at, 'desc')
```

## Pitfalls

- Reading a `join`/`includes` child field directly in a parent without `useLiveQuery` in the subscriber → you get the raw collection object and NO re-render on child change; subscribe where you read.
- `.select` referencing an alias you never `.from`/`.join` → type error / empty column.
- Forgetting the join predicate returns an operator expression (not a JS `===`) → always `eq(...)`.
- Applying `.limit` before `.orderBy` intent → limit picks arbitrary rows; order first.
