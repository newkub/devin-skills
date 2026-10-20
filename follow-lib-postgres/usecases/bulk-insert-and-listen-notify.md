# Use Case — Bulk Insert and Live Notifications

> Load thousands of rows in one statement instead of N round trips, and push changes to other processes with `LISTEN`/`NOTIFY`. Source: https://github.com/porsager/postgres#bulk-insert (accessed 2026-10-20)

## 1. Bulk insert with the object helper

```ts
const rows = parsedCsv.map((r) => ({ sku: r.sku, price: Number(r.price), stock: Number(r.stock) }))

await sql`
  insert into products ${sql(rows, "sku", "price", "stock")}
  on conflict (sku) do update set price = excluded.price, stock = excluded.stock
`
```

`sql(rows, ...columns)` builds one multi-row `VALUES` list — one statement, one round trip, one transaction boundary.

## 2. Chunk when the payload is huge

```ts
const CHUNK = 1_000
for (let i = 0; i < rows.length; i += CHUNK) {
  await sql`insert into products ${sql(rows.slice(i, i + CHUNK))} on conflict (sku) do nothing`
}
```

A single massive statement can exceed the parameter limit (65 535) — chunking keeps it predictable.

## 3. Listen for changes

```ts
// worker process
await sql.listen("product_changed", (payload) => {
  cache.invalidate(JSON.parse(payload))
})

// writer process, after the transaction commits
await sql.begin(async (tx) => {
  await tx`update products set price = ${price} where sku = ${sku}`
  await tx`select pg_notify('product_changed', ${JSON.stringify({ sku, price })})`
})
```

`LISTEN` needs a dedicated connection — postgres.js keeps one reserved for the listener, so do not share it with a `max: 1` pool.

## 4. Clean shutdown

```ts
process.on("SIGTERM", async () => {
  await sql.end({ timeout: 5 })     // stops the listener and closes the pool
})
```

## Pitfalls

- Sending the payload as the whole row → notifications are limited to 8 kB; send an id and refetch.
- Calling `NOTIFY` before commit → listeners may read stale data; notify inside the transaction (it fires on commit).
- `sql.listen` on a short-lived connection → the subscription dies with the process; run it in a long-lived worker.
- Skipping `on conflict` in an upsert-style import → the whole batch fails on one duplicate key.

## Related

- `references/apis.md`
- `best-practices/postgres-js.md`
- `usecases/transactions-with-rollback.md`
