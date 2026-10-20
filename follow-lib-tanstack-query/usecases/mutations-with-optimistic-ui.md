# Use Case — Mutations with Optimistic UI and Rollback

> Apply the change before the server answers, undo it on failure, and reconcile when the real row arrives. Source: https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates (accessed 2026-10-20)

## 1. Optimistic toggle

```tsx
const qc = useQueryClient()

const toggle = useMutation({
  mutationFn: (todo: Todo) => api.todos.update(todo.id, { done: !todo.done }),
  onMutate: async (todo) => {
    await qc.cancelQueries({ queryKey: ["todos"] })          // stop in-flight refetch overwriting us
    const previous = qc.getQueryData<Todo[]>(todosQuery("all").queryKey)
    qc.setQueryData<Todo[]>(todosQuery("all").queryKey, (old = []) =>
      old.map(t => (t.id === todo.id ? { ...t, done: !t.done } : t)),
    )
    return { previous }                                       // context passed to onError
  },
  onError: (_err, _todo, ctx) => {
    if (ctx?.previous) qc.setQueryData(todosQuery("all").queryKey, ctx.previous)
  },
  onSettled: () => qc.invalidateQueries({ queryKey: ["todos"] }),   // server truth wins
})
```

## 2. Optimistic insert

```tsx
onMutate: async (draft) => {
  const optimistic = { ...draft, id: `tmp-${crypto.randomUUID()}` }
  qc.setQueryData<Todo[]>(todosQuery("all").queryKey, (old = []) => [optimistic, ...old])
  return { id: optimistic.id }
},
onSuccess: (created, _draft, ctx) => {
  qc.setQueryData<Todo[]>(todosQuery("all").queryKey, (old = []) =>
    old.map(t => (t.id === ctx?.id ? created : t)),
  )
}
```

The temporary id must be replaced by the server id, otherwise the next refetch duplicates the row.

## 3. State you get for free

`mutation.variables` = last payload, `mutation.isPending` = gate the button, `mutation.error` + `mutation.reset()` = error banner.

## Pitfalls

- Skipping `cancelQueries` → a refetch started earlier lands after the optimistic write and reverts the UI.
- Returning nothing from `onMutate` → `onError` has no snapshot to restore.
- Rolling back a request the server actually applied → distinguish network failures; `onSettled` refetch reconciles.
- Optimistic insert whose server id is never reconciled → duplicate rows after refetch.

## Related

- `references/apis.md`
- `usecases/query-with-cache-invalidation.md`
- `usecases/infinite-scroll-and-prefetch.md`
