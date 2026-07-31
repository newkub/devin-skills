# EXPLAIN ANALYZE

## Understanding Query Plans

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'john@example.com';
```

**Key Metrics**:
- **Seq Scan**: Sequential scan (bad for large tables)
- **Index Scan**: Index lookup (good)
- **Bitmap Scan**: Bitmap index scan (good for large tables)
- **Hash Join**: Hash-based join (good for large datasets)
- **Nested Loop**: Row-by-row join (good for small datasets)
- **Merge Join**: Sorted merge join (good for sorted data)
