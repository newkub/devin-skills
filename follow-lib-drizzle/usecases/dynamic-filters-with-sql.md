# Use Case — Dynamic Filters and Prepared Statements

> Build a query from optional filters without string concatenation, then reuse it as a prepared statement on the hot path. Source: https://orm.drizzle.team/docs/dynamic-query-building (accessed 2026-10-20)

## 1. Collect conditions, then compose

```ts
import { and, eq, gte, lte, type SQL } from "drizzle-orm";
import { orders } from "./schema";

type OrderFilter = {
  status?: "pending" | "paid" | "refunded";
  minTotal?: number;
  maxTotal?: number;
  customerId?: string;
};

export function buildFilter(filter: OrderFilter): SQL | undefined {
  const conditions: SQL[] = [];

  if (filter.status) conditions.push(eq(orders.status, filter.status));
  if (filter.customerId) conditions.push(eq(orders.customerId, filter.customerId));
  if (filter.minTotal !== undefined) conditions.push(gte(orders.total, filter.minTotal));
  if (filter.maxTotal !== undefined) conditions.push(lte(orders.total, filter.maxTotal));

  return conditions.length ? and(...conditions) : undefined;
}

const rows = await db.select().from(orders).where(buildFilter(filter));
```

`and()` ignores `undefined` entries, and `where(undefined)` is valid — the query runs unfiltered. Do not build the SQL string by hand: the operators keep the values parameterised.

## 2. Use `$dynamic()` when the shape changes

```ts
import { asc, desc } from "drizzle-orm";

let query = db.select().from(orders).$dynamic();

const where = buildFilter(filter);
if (where) query = query.where(where);
if (sort === "total") query = query.orderBy(desc(orders.total));
else query = query.orderBy(asc(orders.createdAt));
if (page > 0) query = query.limit(20).offset(page * 20);

const rows = await query;
```

`$dynamic()` lets you reassign `.where()`, `.orderBy()`, and `.limit()` in any order. Without it, each call returns a new type and the reassignment fails to compile — the type system is telling you the query is static.

## 3. Prepare the hot path

```ts
const byCustomer = db
  .select()
  .from(orders)
  .where(eq(orders.customerId, sql.placeholder("customerId")))
  .prepare("orders_by_customer");

const rows = await byCustomer.execute({ customerId });
```

A prepared statement is parsed once and executed many times. Use it for a query that runs on every request with different values; for a one-off admin filter the preparation cost outweighs the benefit.

## 4. Verify

1. `/run-test` — an empty filter returns all rows; each single filter narrows correctly
2. Enable `logger: true` — the values appear as parameters, never interpolated into the SQL text
3. `EXPLAIN` the prepared variant — same plan as the ad-hoc one, without repeated parse time
4. `/deep-test api` — `minTotal > maxTotal` returns zero rows, not an error

## Pitfalls

- Concatenating values into `sql.raw()`, which reopens SQL injection.
- Reassigning a non-dynamic query builder and fighting the type error with `as any`.
- A prepared statement name reused with a different shape, which throws at startup.
- Building the query object once at module scope with request values baked in.
- Forgetting `and()` returns `undefined` for an empty list, then calling `.where(undefined ?? sql\`true\`)` needlessly.

## Related

- `references/apis.md`
- `best-practices/drizzle.md`
- `usecases/typed-queries-and-joins.md`
- `usecases/relational-queries-with.md`
