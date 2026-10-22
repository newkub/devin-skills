# Use Case — Result Types, bigint, and Column Mapping

> postgres.js hands back what PostgreSQL sends: `numeric` and `bigint` as strings, `jsonb` already parsed, `timestamptz` as a `Date`. Typing rows to match that reality is what prevents silent precision loss. Source: https://github.com/porsager/postgres#numbers-bigint-numeric (accessed 2026-10-20)

## 1. Type rows from what the driver returns

```ts
// src/products/types.ts
export type Product = {
  id: string;          // uuid
  name: string;
  price: string;       // numeric → string, not number
  stock: number;       // int4 → number
  metadata: Record<string, unknown>; // jsonb → already parsed
  createdAt: Date;     // timestamptz → Date
};
```

```ts
import { sql } from "@/db";
import type { Product } from "./types";

const [product] = await sql<Product[]>`
  select id, name, price, stock, metadata, created_at
  from products
  where id = ${id}
`;
```

The generic is an assertion, not a conversion — nothing is validated at runtime. `price: number` in that type would compile and still hold `"19.99"` at runtime, so read the column type before writing the row type.

## 2. Handle `bigint` and `numeric` at the boundary

```ts
// numeric stays a string to keep its precision
const priceCents = Math.round(Number(product.price) * 100);

// count(*) is bigint → string unless you cast it
const [{ total }] = await sql<{ total: number }[]>`select count(*)::int as total from products`;
```

`Number` is only safe up to 2^53−1, which is why the driver returns `bigint` and `numeric` as strings. Convert once, in a mapper, and keep the raw string on the row. If the values must be real `BigInt`:

```ts
import postgres from "postgres";

export const sql = postgres(process.env.DATABASE_URL!, {
  types: { bigint: postgres.BigInt },
});
```

`BigInt` does not survive `JSON.stringify` — an API that returns it needs an explicit serializer, which is why the default is a string.

## 3. Map snake_case in one place

```ts
import postgres from "postgres";

export const sql = postgres(process.env.DATABASE_URL!, {
  transform: { ...postgres.camel, undefined: null },
});

const [row] = await sql<{ createdAt: Date; displayName: string }[]>`
  select created_at, display_name from users where id = ${id}
`;
```

`postgres.camel` converts result keys to camelCase and input keys to snake_case for the `sql(object)` helpers. Use `postgres.toCamel` when only results should change, or keep `snake_case` row types and skip the transform entirely — either is consistent, mixing both is not.

## 4. Do not re-parse `jsonb`, and do not pass `undefined`

```ts
// metadata is already an object
const tags = (product.metadata.tags as string[] | undefined) ?? [];

// undefined is rejected with UNDEFINED_VALUE unless transform maps it
await sql`update products set notes = ${notes ?? null} where id = ${id}`;
```

`json`/`jsonb` values arrive parsed; `JSON.parse` on them throws. `undefined` is never accepted as a parameter — either pass `null` explicitly or enable `undefined: null` in `transform`, which is what the snippet in section 3 does.

## 5. Use the result array's metadata

```ts
const updated = await sql`update products set stock = stock - 1 where id = ${id}`;
if (updated.count === 0) throw new Error("not found");

const grid = await sql`select id, name from products limit 10`.values();
```

`.count` is the affected-row count for `insert`/`update`/`delete` — `length` is 0 without `returning`. `.values()` returns rows as arrays, useful for CSV export where duplicate column names would otherwise collide.

## 6. Verify

1. `typeof row.price` on a `numeric` column — `"string"`, and the mapper yields the expected cents
2. A row with `metadata = '{"tags":["a"]}'` — `row.metadata.tags` is an array without any parse call
3. `select count(*)` without a cast — the value is a string; with `::int` it is a number
4. `tsc --noEmit` — the row type matches every property the query selects
5. An insert with `notes: undefined` — it throws `UNDEFINED_VALUE`; with `undefined: null` it stores `NULL`
6. An `update` matching no rows — `.count` is `0` and the handler returns 404
7. `/run-test` — a mapper test for `price`, `createdAt`, and `metadata`

## Pitfalls

- Declaring `price: number` because TypeScript accepts it; the runtime value is a string.
- `Number(bigintString)` on ids or totals above 2^53 — precision loss that only shows up on large datasets.
- `JSON.parse(row.metadata)` — it is already an object.
- `timestamp` without a time zone, which is parsed in the process's local zone; use `timestamptz` for anything that crosses machines.
- Selecting `*` and typing a subset — a new column silently changes the row shape.
- Enabling `postgres.camel` in one module and not another, producing two shapes for the same table.
- Returning `BigInt` from an API handler without a serializer — `JSON.stringify` throws.
- Relying on `result.length` after an `update` — use `.count`.

## Related

- `references/apis.md`
- `best-practices/postgres-js.md`
- `usecases/dynamic-filters-and-pagination.md`
- `usecases/errors-and-retries.md`
