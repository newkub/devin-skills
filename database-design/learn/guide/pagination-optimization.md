# Pagination Optimization

## Use Keyset Pagination

```sql
-- ✅ Good: Keyset pagination (faster)
SELECT * FROM orders
WHERE id > last_seen_id
ORDER BY id
LIMIT 100;

-- ❌ Bad: OFFSET pagination (slower for large offsets)
SELECT * FROM orders
ORDER BY id
LIMIT 100 OFFSET 10000;
```
