# Subquery Optimization

## Use CTEs for Readability

```sql
-- ✅ Good: CTE
WITH user_stats AS (
    SELECT user_id, COUNT(*) as order_count
    FROM orders
    GROUP BY user_id
)
SELECT u.name, us.order_count
FROM users u
JOIN user_stats us ON u.id = us.user_id;
```

## Use JOIN Instead of Subquery

```sql
-- ✅ Good: JOIN
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- ❌ Bad: Subquery
SELECT u.name, (
    SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id
) as order_count
FROM users u;
```
