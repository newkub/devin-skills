# Performance Best Practices

## Best Practices สำหรับ Performance

### ใช้ Connection Pooling

```typescript
// ✅ Good: ใช้ connection pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// ❌ Bad: สร้าง connection ใหม่ทุก query
// Overhead สูง
```

### Batch Operations

```typescript
// ✅ Good: Batch inserts
await prisma.user.createMany({
  data: users,
});

// ❌ Bad: Insert ทีละตัว
for (const user of users) {
  await prisma.user.create({ data: user });
}
```

### ใช้ Materialized Views

```sql
-- ✅ Good: Materialized view สำหรับ complex queries
CREATE MATERIALIZED VIEW user_stats AS
SELECT user_id, COUNT(*) as order_count
FROM orders
GROUP BY user_id;

-- Refresh เป็นระยะ
REFRESH MATERIALIZED VIEW user_stats;
```
