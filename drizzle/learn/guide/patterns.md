# Patterns

## Common Patterns

## Schema Definition

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});
```

## Query Builder

```typescript
const user = await db.select().from(users)
  .where(eq(users.email, 'test@example.com'))
  .limit(1);
```

## Transactions

```typescript
await db.transaction(async (tx) => {
  await tx.insert(users).values({ name: 'John' });
  await tx.insert(posts).values({ title: 'Hello' });
});
```
