# SELECT Optimization

## Avoid SELECT *

```sql
-- ❌ Bad: Select all columns
SELECT * FROM users WHERE id = 1;

-- ✅ Good: Select only needed columns
SELECT id, name, email FROM users WHERE id = 1;
```

## Use LIMIT

```sql
-- ✅ Good: Limit results
SELECT * FROM orders ORDER BY created_at DESC LIMIT 100;

-- Use pagination
SELECT * FROM orders 
ORDER BY created_at DESC 
LIMIT 100 OFFSET 0;
```
