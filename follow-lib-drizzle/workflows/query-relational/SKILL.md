---
name: follow-lib-drizzle-query-relational
description: Drizzle relational queries — db.query API, with/columns/extras, nested selects, joins vs RQB
argument-hint: "[scope]"
related:
  - follow-lib-drizzle
  - run-test
  - resolve-errors
---

## Goal

ใช้ Drizzle Relational Query Builder (RQB) — `db.query.<table>` API, `with`/`columns`/`extras`, nested relations, pagination

## Scope

`db.query` API (schema-first nested fetching) vs SQL-style `select().from().leftJoin()` — selection strategies, N+1 avoidance, pagination

## Execute

### 1. RQB Basics

```ts
const db = drizzle(client, { schema })   // schema required for db.query API

await db.query.users.findMany()
await db.query.users.findFirst({ where: eq(users.email, email) })
await db.query.users.findMany({
  where: and(eq(users.active, true), gt(users.createdAt, cutoff)),
  orderBy: [desc(users.createdAt)],
  limit: 20, offset: 40,
})
```

### 2. Selection And Relations

```ts
await db.query.users.findMany({
  columns: { id: true, email: true },          // pick cols (false = exclude)
  extras: { lowerEmail: sql`lower(${users.email})`.as('lower_email') },
  with: {
    posts: {
      columns: { title: true },
      with: { comments: { limit: 5 } },        // nested
      orderBy: [desc(posts.createdAt)],
    },
  },
})
```

- `with` = auto-join + nested structure — RQB generates separate optimized queries ไม่ใช่ N+1
- `columns`/`where`/`orderBy`/`limit`/`offset` ใช้ได้ใน nested levels
- `extras` — computed SQL fields เข้า result type

### 3. When To Use SQL-Style Instead

```ts
// joins manual, aggregations, unions, subqueries → select() API
await db.select({ u: users, count: count(posts.id) })
  .from(users).leftJoin(posts, eq(posts.authorId, users.id))
  .groupBy(users.id)
```

- RQB: entity graphs, nested fetching; `select()`: aggregations/reporting/complex joins/unions
- `count()`, `avg()`, `sum()`, `sql<>` raw expressions, `getViewSelectedFields`

### 4. Pagination Patterns

- Offset: `limit`+`offset` (simple); cursor: `where(gt(id, cursor))` + `limit` + orderBy (scalable)
- RQB `limit`ใน `with` levels = per-parent limit (v0.31+ `limit` semantics — ตรวจ docs เวอร์ชัน)

## Rules

- `db.query` ต้อง `drizzle(client, { schema })` — ไม่มี schema → RQB ใช้ไม่ได้
- `with` ต้องมี `relations()` ใน schema ครบ — ไม่มี relations → error
- เลือก RQB vs select(): nested entity graphs → RQB; aggregations/joins manual → `select()`
- `extras` SQL ต้อง parameterized — `sql` template ปลอดภัย, อย่า string concat

## Expected Outcome

- RQB nested queries ทำงานกับ relations schema
- รู้ขอบเขต RQB vs SQL-style selection
