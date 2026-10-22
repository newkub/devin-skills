# Use Case — Aggregations & Group By (Dashboards / Summary)

> Compute counts/sums/averages reactively so a stat tile updates the instant a row changes. Source: https://tanstack.com/db/latest/docs/guides/live-queries#groupby-and-aggregations (accessed 2026-10-20)

## 1. groupBy + aggregate functions

```tsx
import { useLiveQuery, count, avg } from '@tanstack/react-db'
// count/sum/avg/max/min are exported alongside the operators

const { data } = useLiveQuery({
  query: (q) =>
    q
      .from({ user: usersCollection })
      .groupBy(({ user }) => user.departmentId)
      .select(({ user }) => ({
        departmentId: user.departmentId,
        userCount: count(user.id),
        avgAge: avg(user.age),
      })),
})
```

- Aggregate over the whole set (single group) → use an aggregate in `select` without `groupBy`.
- Multiple group keys → return an array from the grouper: `.groupBy(({ t }) => [t.listId, t.status])`.

## 2. Rule that trips people up

In a `groupBy` query (or an aggregate-without-groupBy), every `select` property must be one value per group — i.e. an aggregate function, a grouped key, or an expression built only from those. Selecting a plain non-grouped column is invalid.

```ts
// ✅ group key + aggregates only
.select(({ todo }) => ({ listId: todo.listId, n: count(todo.id), maxPri: max(todo.priority) }))

// ❌ todo.text isn't grouped or aggregated → rejected
.select(({ todo }) => ({ listId: todo.listId, n: count(todo.id), text: todo.text }))
```

## 3. Subquery aggregate (count children per parent)

Correlate a count of a related collection into the parent row via a subquery `includes`-style select, then read it reactively:

```ts
const q
  .from({ p: projectsCollection })
  .select(({ p }) => ({
    name: p.name,
    issueCount: q
      .from({ i: issuesCollection })
      .where(({ i }) => eq(i.projectId, p.id))
      .select(({ i }) => ({ total: count(i.id) })),
  }))
```

> To render the child rows, pass the child collection into a subcomponent and `useLiveQuery` there — reading the nested collection in the parent won't re-render on child changes.

## 4. Reactive total without a group

```ts
const { data: totals } = useLiveQuery({
  query: (q) =>
    q.from({ order: ordersCollection }).select(({ order }) => ({
      revenue: sum(order.amount),
      orders: count(order.id),
    })),
})
// one row: recomputes incrementally on every insert/update/delete
```

## Pitfalls

- Importing `count`/`sum`/`avg` from the wrong package → they ship with the query exports (`@tanstack/react-db` adapter / `@tanstack/db` core), same place as operators.
- Selecting a raw column alongside aggregates → invalid query (violates the one-value-per-group rule).
- Expecting a stale summary → aggregates ARE live; a `collection.insert` re-derives them on the next tick, no refetch.
- Grouping on a value the schema transformed (e.g. string→Date) → group the transformed type consistently across rows.

## Related

- `references/apis.md`
- `best-practices/tanstack-db.md`
- `usecases/live-queries-joins.md`
- `usecases/derived-collections.md`
