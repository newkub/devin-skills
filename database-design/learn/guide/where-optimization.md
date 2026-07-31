# WHERE Optimization

## Use Indexable Conditions

```sql
-- ✅ Good: Indexable conditions
SELECT * FROM users WHERE email = 'john@example.com';
SELECT * FROM users WHERE created_at > '2023-01-01';

-- ❌ Bad: Non-indexable conditions
SELECT * FROM users WHERE LOWER(email) = 'john@example.com';
SELECT * FROM users WHERE email LIKE '%john%';
```

## Use EXISTS Instead of IN

```sql
-- ✅ Good: Use EXISTS
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- ❌ Bad: Use IN (may be slower)
SELECT * FROM users u
WHERE u.id IN (SELECT user_id FROM orders);
```

## Avoid Functions on Indexed Columns

```sql
-- ❌ Bad: Function on indexed column
SELECT * FROM users WHERE DATE(created_at) = '2023-01-01';

-- ✅ Good: Range query
SELECT * FROM users 
WHERE created_at >= '2023-01-01' AND created_at < '2023-01-02';
```
