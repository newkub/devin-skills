# Use Case — Dynamic Filters, Sorting, and Pagination

> A search endpoint has optional filters, a user-chosen sort, and a page — all three can be built from `sql` fragments without ever concatenating strings. Source: https://github.com/porsager/postgres#building-queries (accessed 2026-10-20)

## 1. Keep every value a parameter

```ts
// src/products/search.ts
import { sql } from "@/db";

const SORTABLE = {
  name: sql`name`,
  price: sql`price`,
  created: sql`created_at`,
} as const;

const DIRECTIONS = {
  asc: sql`asc`,
  desc: sql`desc`,
} as const;

export type SearchInput = {
  q?: string;
  categoryId?: string;
  skus?: string[];
  sort?: keyof typeof SORTABLE;
  direction?: keyof typeof DIRECTIONS;
  page?: number;
  pageSize?: number;
};
```

`sql`name`` is a fragment — raw SQL produced by the library, not a string. Identifiers that come from user input go through `sql(value)`, which quotes and escapes them; everything else stays a `$1` parameter.

## 2. Build the `WHERE` once, call it per query

```ts
function buildWhere(input: SearchInput) {
  const q = input.q ? `%${input.q}%` : null;
  const categoryId = input.categoryId ?? null;
  const skus = input.skus?.length ? input.skus : null;

  return sql`
    where (${q}::text is null or name ilike ${q})
      and (${categoryId}::uuid is null or category_id = ${categoryId})
      and (${skus}::text[] is null or sku = any(${skus}))
  `;
}
```

The `(${value}::type is null or ...)` pattern makes a filter disappear when its value is absent, while keeping one static SQL shape for the planner and the prepared-statement cache. A function (rather than one shared constant) gives each query its own parameters.

## 3. Filter by a list with one placeholder

```ts
// inside buildWhere
// and (${skus}::text[] is null or sku = any(${skus}))
```

`sql([1, 2, 3])` expands to a value list, so `where id in ${sql(ids)}` is available — but `= any(${array})` sends the array as one parameter and avoids a statement that changes shape with every list length. Prefer `any` for lists that vary in size.

## 4. Sort from a whitelist, never from the request string

```ts
export async function searchProducts(input: SearchInput) {
  const orderBy = SORTABLE[input.sort ?? "created"];
  const direction = DIRECTIONS[input.direction ?? "desc"];
  const pageSize = Math.min(Math.max(input.pageSize ?? 25, 1), 100);
  const offset = (Math.max(input.page ?? 1, 1) - 1) * pageSize;

  const [rows, [counted]] = await Promise.all([
    sql<Product[]>`
      select id, sku, name, price, created_at
      from products
      ${buildWhere(input)}
      order by ${orderBy} ${direction}
      limit ${pageSize} offset ${offset}
    `,
    sql`select count(*)::int as total from products ${buildWhere(input)}`,
  ]);

  return { rows, total: counted.total, page: input.page ?? 1, pageSize };
}
```

`order by ${sql("name")} ${sql("desc")}` produces `order by "name" "desc"` — the keyword would be quoted as an identifier and fail. Keywords are fragments; identifiers go through `sql(string)`. `limit`/`offset` are values and are parameterized like any other number.

## 5. Order the two queries deliberately

```ts
const [rows, [counted]] = await Promise.all([...]);
```

Both statements run on separate pool connections. On a large table the `count(*)` can dominate; if an approximate total is acceptable, keep the exact count behind a `withCount` flag, or cache it for a few seconds. `count(*)` is `bigint`, hence the `::int` cast — otherwise it arrives as a string.

## 6. When `sql.unsafe` is legitimate

```ts
const TABLES = new Set(["products", "products_archive"]);
if (!TABLES.has(table)) throw new Error("unknown table");

const rows = await sql`select * from ${sql(table)} limit ${pageSize}`;
```

`sql(table)` already quotes the identifier. Reach for `sql.unsafe(text, params)` only when a whole statement is composed elsewhere (a `.sql` file, an admin console) — and still never pass user input into `text`.

## 7. Verify

1. Call the endpoint with no filters — the SQL has no `where` value, and every row comes back
2. Add `q`, `categoryId`, and `skus` one at a time — each narrows the result set and no error mentions a type mismatch
3. Pass `sort=name&direction=asc` — rows are ordered by name; pass an unknown sort — the default ordering is applied, not an error
4. Request `page=2&pageSize=25` — the second page starts at row 26, and `total` is unchanged
5. `EXPLAIN` the generated query (`.describe` shows the final string) — it uses an index rather than a sequential scan
6. `pageSize=10000` — the cap returns 100 rows, proving the input is clamped
7. `/run-test` — a table-driven test over the filter combinations

## Pitfalls

- Concatenating `"order by " + req.query.sort` — the one injection point a parameterized query cannot protect.
- Putting a direction through `sql(direction)`, which quotes `"desc"` and breaks the clause.
- Building a different SQL string per filter combination, which defeats prepared statements and the plan cache.
- `count(*)` without a cast, then `total + 1` producing string concatenation.
- An unbounded `pageSize`, which lets one request pull the whole table.
- `offset` pagination over millions of rows — deep pages scan everything before them; use keyset pagination for those.
- Sharing one `sql` fragment object across concurrent queries instead of rebuilding it per call.

## Related

- `references/apis.md`
- `best-practices/postgres-js.md`
- `usecases/transactions-with-rollback.md`
- `usecases/result-types-and-transforms.md`
