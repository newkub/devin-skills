# Aggregation Optimization

## Use Index on Group By Columns

```sql
-- ✅ Good: Index on group by column
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

SELECT user_id, COUNT(*) 
FROM orders 
GROUP BY user_id;
```

## Use HAVING After WHERE

```sql
-- ✅ Good: Filter before aggregation
SELECT user_id, COUNT(*) as order_count
FROM orders
WHERE created_at > '2023-01-01'
GROUP BY user_id
HAVING COUNT(*) > 10;

-- ❌ Bad: Filter after aggregation (slower)
SELECT user_id, COUNT(*) as order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 10 AND created_at > '2023-01-01';
```
