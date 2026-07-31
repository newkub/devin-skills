# Batch Operations

## Use Bulk Insert

```typescript
// ✅ Good: Bulk insert
await prisma.user.createMany({
  data: users,
});

// ❌ Bad: Insert one by one
for (const user of users) {
  await prisma.user.create({ data: user });
}
```

## Use Bulk Update

```sql
-- ✅ Good: Bulk update
UPDATE users
SET status = 'active'
WHERE created_at < '2023-01-01';

-- ❌ Bad: Update one by one
-- Loop through users and update each
```
