# Performance Troubleshooting

## Problem: Slow Queries

**Symptoms**:
- Queries take long time
- High CPU usage
- Timeout errors

**Causes**:
1. Missing indexes
2. Full table scans
3. Inefficient joins
4. Large result sets

**Solutions**:

```sql
-- ✅ Good: Add index
CREATE INDEX idx_users_email ON users(email);

-- ✅ Good: Use EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@example.com';

-- ✅ Good: Optimize query
SELECT id, name FROM users WHERE email = 'john@example.com';
```

## Problem: High Lock Contention

**Symptoms**:
- Transactions blocked
- Timeout waiting for locks
- Poor throughput

**Causes**:
1. Long transactions
2. Lock held too long
3. Hot row contention

**Solutions**:

```sql
-- ✅ Good: Keep transactions short
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- ✅ Good: Use appropriate isolation level
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- Query
COMMIT;
```

## Problem: Connection Exhaustion

**Symptoms**:
- Cannot connect to database
- Connection refused
- Too many connections error

**Causes**:
1. Connection leaks
2. Too many connections
3. No connection pooling

**Solutions**:

```typescript
// ✅ Good: Use connection pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// ✅ Good: Release connections
async function query() {
  const user = await prisma.user.findUnique({ where: { id: 1 } });
  return user;
  // Connection released automatically
}
```
