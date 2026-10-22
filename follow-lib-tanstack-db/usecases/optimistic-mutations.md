# Use Case — Optimistic Mutations, Transactions & Rollback

> Writes the UI sees instantly, persisted in the background, reverted on failure. Source: https://tanstack.com/db/latest/docs/guides/mutations (accessed 2026-10-20)

## 1. Collection-level (simple single-row CRUD)

`insert`/`update`/`delete` apply optimistic state immediately and fire the collection's `onInsert`/`onUpdate`/`onDelete`; a throw there rolls the row back automatically.

```ts
todoCollection.update(todo.id, (draft) => { draft.completed = true })
todoCollection.insert({ id: crypto.randomUUID(), text: 'New', completed: false })
todoCollection.delete(todo.id)
```

- `update` mutates a draft (produce-style), don't return a new object.
- For an insert the id is often local (`crypto.randomUUID()`); reconcile with the server id in the handler / via the sync refetch.

## 2. Intent-based custom action (`createOptimisticAction`)

Use when one user intent touches several rows/collections and commits immediately. `onMutate` = the optimistic guess; `mutationFn` = the real persist.

```tsx
import { createOptimisticAction } from '@tanstack/react-db'

const likePost = createOptimisticAction<string>({
  onMutate: (postId) => {
    postCollection.update(postId, (draft) => { draft.likeCount += 1 })
  },
  mutationFn: async (postId, { transaction }) => {
    await api.posts.like(postId)
    await postCollection.utils.refetch() // optional: wait for server truth
  },
})

// onClick={() => likePost(postId)}
```

With runtime validation, infer the generic from a schema:

```tsx
const addTodo = createOptimisticAction<z.infer<typeof addTodoSchema>>({
  onMutate: (params) => {
    const v = addTodoSchema.parse(params)
    todoCollection.insert({ id: crypto.randomUUID(), ...v })
  },
  mutationFn: async (params) => api.todos.create(params),
})
```

## 3. Manual transaction (`createTransaction`) — draft/batch workflows

Batch several mutations, persist only on Save, discard on Cancel. `autoCommit: false` waits for `commit()`.

```ts
import { createTransaction } from '@tanstack/react-db'

const draftTx = createTransaction({
  autoCommit: false,
  mutationFn: async ({ transaction }) => {
    await Promise.all(transaction.mutations.map((m) => api.saveTodo(m.modified)))
  },
})

draftTx.mutate(() => todoCollection.insert({ id: '1', text: 'First', completed: false }))
// user keeps typing / editing, optimistic UI updates each mutate()...
draftTx.mutate(() => todoCollection.update('1', (d) => { d.text = 'Edited' }))

draftTx.commit()    // Save → mutationFn runs on the whole batch
// draftTx.rollback()  // Cancel → optimistic changes discarded, UI reverts
```

Key rules (verified):
- Mutations made inside `tx.mutate()` do NOT call the collection's `onInsert/onUpdate/onDelete` — the transaction's `mutationFn` owns persistence for `transaction.mutations`.
- Each `tx.mutate()` updates optimistic state instantly; `commit()` fires `mutationFn` once for the accumulated batch; `rollback()` reverts.
- If a `tx.mutate()` callback throws, that call's optimistic changes are removed before the error reaches you (earlier successful calls stay pending).

## 4. Pending / commit state

Track whether a mutation has synced — use `tx.when('settled')` (the pre-1.0 `tx.isPersisted.promise` is deprecated, removed in the 1.0 RC). A resolved handler only proves the code ran; it proves a server upload/confirm only if the handler awaits that before returning (e.g. Electric `awaitTxId`, Query `refetch`).

## Pitfalls

- Returning a fresh object from `update(draft)` instead of mutating the draft → change lost.
- Using `tx.isPersisted.promise` → deprecated; switch to `tx.when('settled')`.
- Expecting collection `onInsert` to run for mutations queued in a manual `tx.mutate()` → it won't; the transaction `mutationFn` must persist them.
- Leaving optimistic rows keyed by a local uuid and never reconciling the server id → duplicate on next fetch.
- Persisting server state that then needs a query refetch but never calling `collection.utils.refetch()` → UI shows guessed state only.

## Related

- `references/apis.md`
- `best-practices/tanstack-db.md`
- `usecases/query-rest-crud.md`
- `usecases/sync-engine-electric.md`
