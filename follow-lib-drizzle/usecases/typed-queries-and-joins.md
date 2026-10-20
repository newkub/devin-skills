# Use Case — Filtering, Joins and Pagination

> Build list endpoints with the SQL builder: filters, joins, counts and keyset pagination, all typed from the schema. Source: https://orm.drizzle.team/docs/select (accessed 2026-10-20)

## 1. Filtered list with a join

```ts
import { and, desc, eq, ilike, sql } from "drizzle-orm"

const rows = await db
  .select({ id: posts.id, title: posts.title, author: users.email })
  .from(posts)
  .innerJoin(users, eq(posts.authorId, users.id))
  .where(and(eq(posts.published, true), ilike(posts.title, `%${q}%`)))
  .orderBy(desc(posts.id))
  .limit(20)
```

`ilike` is Postgres-only; other dialects use `like`/`lower()`.

## 2. Count plus page

```ts
const where = and(eq(posts.published, true), q ? ilike(posts.title, `%${q}%`) : undefined)

const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(posts).where(where)
const page = await db.select().from(posts).where(where).orderBy(desc(posts.id)).limit(limit).offset(offset)
```

`offset` still scans the skipped rows — past a few thousand rows switch to keyset pagination (`where(lt(posts.id, lastId))` + `orderBy(desc(posts.id))`).

## 3. Reusable filter fragment

```ts
const filters = [eq(posts.published, true)]
if (authorId) filters.push(eq(posts.authorId, authorId))
const where = and(...filters)
```

## 4. Raw SQL only when the typed helpers run out

```ts
sql`${posts.title} @@ websearch_to_tsquery(${q})`
```

The tagged template parameterizes interpolated values — never build SQL by string concatenation.

## Pitfalls

- `db.select()` with no `where` in an endpoint → a full table scan exposed as an API.
- `limit` before `orderBy` → non-deterministic pages between requests.
- `sql.raw()` with user input → SQL injection; use the tagged template.
- `count(*)` without a cast → the driver returns `bigint` as a string; cast to `int`.
- Querying the author per post instead of joining → N+1 queries.

## Related

- `references/apis.md`
- `usecases/schema-and-relations.md`
- `usecases/transactions-and-migrations.md`
