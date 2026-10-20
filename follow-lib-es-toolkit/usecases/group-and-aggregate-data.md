# Use Case — Group, Sort, and Normalize API Data

> Turn a flat API response into grouped summaries and a typed view model with named imports only. Source: https://es-toolkit.dev/reference/array/groupBy.html (accessed 2026-10-20)

## 1. Install and import by name

```bash
bun add es-toolkit
```

```ts
import { groupBy, sumBy, sortBy, orderBy, keyBy, countBy } from "es-toolkit"
import { toCamelCaseKeys } from "es-toolkit/object"
```

## 2. Group and aggregate

```ts
type Order = { id: string; customerId: string; total: number; status: "paid" | "open" }

const byCustomer = groupBy(orders, (o) => o.customerId)

const revenueByCustomer = Object.entries(byCustomer).map(([customerId, list]) => ({
  customerId,
  orders: list.length,
  revenue: sumBy(list, (o) => o.total),
}))
```

## 3. Sort with a single criteria array

```ts
const ranked = sortBy(revenueByCustomer, ["revenue", "orders"]).reverse()

// mixed directions need orderBy
const timeline = orderBy(orders, [(o) => o.status, "total"], ["asc", "desc"])
```

Core `sortBy` takes one array of criteria, not variadic arguments like Remeda.

## 4. Index and count

```ts
const byId = keyBy(orders, (o) => o.id)          // O(1) lookup
const statusCounts = countBy(orders, (o) => o.status)
```

## 5. Normalize the wire format

```ts
const payload = toCamelCaseKeys(await response.json())
```

Use the same helper for requests with `toSnakeCaseKeys` so the boundary converts once instead of per field.

## Pitfalls

- Calling `sortBy` with variadic arguments → only the first is used; pass an array.
- Using `merge` when immutable data is expected → `merge` mutates the first argument; use `toMerged`.
- Re-implementing `groupBy` with `reduce` → loses the typed `Record<string, T[]>` result; use the utility.
- `isEmpty` does not exist in core → check `Object.keys(value).length` or use compat temporarily.

## Related

- `references/apis.md`
- `best-practices/es-toolkit.md`
- `usecases/replace-lodash-imports.md`
