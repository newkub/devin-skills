# Use Case — Typed Data Pipeline with pipe

> Replace a chain of loops and temporaries with one top-to-bottom pipeline that keeps literal types. Source: https://remedajs.com/docs (accessed 2026-10-20)

## 1. Start from the shape you have

```ts
import { pipe, filter, map, groupBy, sortBy, firstBy, sumBy, prop } from "remeda";

type Order = {
  id: string;
  customerId: string;
  status: "paid" | "pending" | "refunded";
  total: number;
};
```

## 2. Compose with data-last functions inside `pipe`

```ts
const revenueByCustomer = (orders: readonly Order[]) =>
  pipe(
    orders,
    filter((o) => o.status === "paid"),
    groupBy(prop("customerId")),
    map((group, customerId) => ({
      customerId,
      orders: group.length,
      revenue: sumBy(group, prop("total")),
    })),
    sortBy([prop("revenue"), "desc"]),
  );
```

Every function inside `pipe` is called data-last; `sortBy` takes projection rules, and a `[projection, "desc"]` tuple sorts descending.

## 3. Use lazy functions for early exit

```ts
const firstBigPaidOrder = (orders: readonly Order[]) =>
  pipe(
    orders,
    filter((o) => o.status === "paid"),   // lazy
    map((o) => o.total),                   // lazy
    firstBy((total) => total > 1_000),     // stops at the first match
  );
```

`filter` → `map` → a terminal such as `firstBy`, `find`, or `take` fuse into one pass with early termination, so a 100k-row array stops as soon as the condition is met.

## 4. Reach for O(n) helpers instead of sorting

```ts
const topOrder = pipe(orders, firstBy(prop("total")));            // max, O(n)
const top3 = pipe(orders, takeFirstBy(3, prop("total")));         // O(n log k)
```

`firstBy` replaces `sortBy(...)[0]` and avoids a full sort when you only need one value.

## 5. Keep types narrow

```ts
const ids = pipe(orders, map(prop("id")));          // string[]
const statuses = pipe(orders, map(prop("status"))); // ("paid" | "pending" | "refunded")[]
const paid = pipe(orders, filter((o) => o.status === "paid"));
```

`prop("status")` and inline guards keep the literal union; a manual `as string[]` widens it and loses the exhaustiveness check downstream.

## Pitfalls

- Mixing data-first calls inside a `pipe` (`filter(orders, fn)`) discards the piped value and silently analyses the wrong array.
- Zero-arg data-last functions must be invoked: `entries()` not `entries`.
- Inserting a non-lazy transform between lazy ones breaks fusion and loses early termination.
- `conditional` throws when no case matches — always pass a fallback such as `constant(undefined)`.
- `piped(...)` is for passing a pipeline as a callback, not a function factory; TypeScript cannot infer its input type.
- v1 names (`uniq`, `toPairs`, `compact`, `maxBy`) do not exist in v2 — import errors here mean an unfinished migration.

## Related

- `references/apis.md`
- `best-practices/remedajs.md`
- `usecases/migrate-from-lodash.md`
