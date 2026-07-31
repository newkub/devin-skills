# Materialized Views

## Use for Complex Queries

```sql
-- Create materialized view
CREATE MATERIALIZED VIEW user_order_stats AS
SELECT 
    u.id,
    u.name,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- Refresh periodically
REFRESH MATERIALIZED VIEW user_order_stats;

-- Query materialized view (fast)
SELECT * FROM user_order_stats WHERE order_count > 10;
```
