# Performance

## Performance Tips

- **Query Optimization** - ใช้ indexes และ optimize queries
- **Connection Pooling** - ใช้ connection pooling
- **Batch Operations** - ใช้ batch operations สำหรับ multiple inserts
- **Lazy Loading** - ใช้ lazy loading สำหรับ large datasets

## Optimization

### Indexes

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
}));
```

### Batch Inserts

```typescript
await db.insert(users).values([
  { name: 'John', email: 'john@example.com' },
  { name: 'Jane', email: 'jane@example.com' },
]);
```
