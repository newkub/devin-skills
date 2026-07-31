# JOIN Optimization

## Use Appropriate Join Types

```sql
-- INNER JOIN: Only matching rows
SELECT * FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN: All from left, matching from right
SELECT * FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Use only when needed
```

## Join Order Matters

```sql
-- Smaller table first
SELECT * FROM small_table s
JOIN large_table l ON s.id = l.small_id;
```
