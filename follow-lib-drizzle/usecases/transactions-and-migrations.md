# Use Case — Transactions, Constraints and Migrations

> Make multi-row writes atomic, surface constraint violations as 4xx, and ship schema changes as generated SQL. Source: https://orm.drizzle.team/docs/transactions (accessed 2026-10-20)

## 1. Transaction — always use `tx` inside

```ts
await db.transaction(async (tx) => {
  const [order] = await tx.insert(orders).values({ userId, total }).returning()
  await tx.insert(orderItems).values(items.map(i => ({ ...i, orderId: order.id })))
})
```

Throwing inside the callback rolls back; returning commits. Using the outer `db` client inside the callback escapes the transaction.

## 2. Map constraint errors to 4xx instead of 500

```ts
try {
  await db.insert(users).values({ email })
} catch (err) {
  if (isUniqueViolation(err)) return Response.json({ error: "Email already used" }, { status: 409 })
  throw err
}
```

Postgres `23505` = unique violation, `23503` = foreign key. Check the SQLSTATE code (on Drizzle-wrapped errors it can sit on `err.cause.code`); never match on message text.

## 3. Migrations

```bash
bunx drizzle-kit generate   # writes ./drizzle/*.sql from the schema diff
bunx drizzle-kit migrate    # applies pending files, records them in __drizzle_migrations
```

Read the generated SQL before applying: a column rename is generated as drop + add and loses data — split it into add → backfill → drop. Full workflow: `/follow-tool-drizzle-kit`.

## 4. Zero-downtime order

1. Ship an additive migration (nullable column, index, new table).
2. Deploy code that writes both shapes.
3. Backfill, then tighten (`NOT NULL`, drop the old column) in a second migration.

## Pitfalls

- Using `db` instead of `tx` inside `db.transaction` → partial writes survive the rollback.
- Holding a transaction open across HTTP calls → long locks; keep the transaction around writes only.
- `drizzle-kit push` against production → it can drop data; use generated migrations outside local dev.
- Editing an already-applied migration file → checksum drift; add a new migration instead.

## Related

- `references/apis.md`
- `usecases/schema-and-relations.md`
- `usecases/typed-queries-and-joins.md`
