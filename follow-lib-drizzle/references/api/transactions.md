# Transactions

## Basic Transaction

```ts
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  await tx.update(accounts).set({ balance: sql`${accounts.balance} + 100.00` }).where(eq(users.name, 'Andrew'));
});
```

## Conditional Rollback

```ts
await db.transaction(async (tx) => {
  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
  if (account.balance < 100) {
    tx.rollback(); // throws and reverts all changes
  }
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
});
```

## Nested Transactions (Savepoints)

```ts
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));

  await tx.transaction(async (tx2) => {
    await tx2.update(users).set({ name: 'Mr. Dan' }).where(eq(users.name, 'Dan'));
  });
});
```

## Sources

- Transactions: https://orm.drizzle.team/docs/transactions
