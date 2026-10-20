# Use Case — Multi-Statement Transactions

> Wrap related writes so a failure leaves no half-written order, and use savepoints for optional steps. Source: https://github.com/porsager/postgres#transactions (accessed 2026-10-20)

## 1. One client, reused

```ts
// src/db.ts
import postgres from "postgres"

export const sql = postgres(process.env.DATABASE_URL!, {
  max: 10,
  idle_timeout: 20,
  transform: { undefined: null },
})
```

`max` must stay below the server's connection limit × replicas — the usual cause of "too many clients".

## 2. All-or-nothing

```ts
export async function placeOrder(input: { userId: string; items: { sku: string; qty: number }[] }) {
  return sql.begin(async (tx) => {
    const [order] = await tx`
      insert into orders ${tx({ user_id: input.userId, status: "pending" })}
      returning id
    `

    await tx`
      insert into order_items ${tx(
        input.items.map((i) => ({ order_id: order.id, sku: i.sku, qty: i.qty })),
      )}
    `

    await tx`update stock set qty = qty - ${input.items.length} where sku in ${tx(input.items.map((i) => i.sku))}`

    return order.id as string
  })
}
```

Throwing anywhere inside the callback rolls back every statement; the return value is what the callback resolves to.

## 3. Savepoint for an optional step

```ts
await sql.begin(async (tx) => {
  const [user] = await tx`insert into users ${tx({ email })} returning id`

  try {
    await tx.savepoint(async (sp) => {
      await sp`insert into referral_credits ${sp({ user_id: user.id, amount: 5 })}`
    })
  } catch {
    // referral credit failed — the outer transaction continues
  }

  await tx`insert into audit_log ${tx({ user_id: user.id, event: "signup" })}`
})
```

`savepoint` isolates the failure so one optional insert cannot abort the whole flow.

## Pitfalls

- Using the global `sql` inside `sql.begin` → statements escape the transaction; always use the `tx` passed to the callback.
- `await`-ing a query built but not executed (`const q = tx\`...\``) → postgres.js is lazy; the call is the execution.
- Long transactions that call external APIs → locks held for the full round trip; do I/O before `begin`.
- `sql.begin` without a `return` → the caller receives `undefined`, not the inserted id.

## Related

- `references/apis.md`
- `best-practices/postgres-js.md`
- `usecases/bulk-insert-and-listen-notify.md`
