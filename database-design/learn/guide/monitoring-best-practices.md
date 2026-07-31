# Monitoring Best Practices

## Best Practices สำหรับ Monitoring

### Monitor Slow Queries

```sql
-- ✅ Good: Enable slow query log
ALTER SYSTEM SET log_min_duration_statement = 1000;

-- ตรวจสอบเป็นระยะ
```

### Monitor Connection Usage

```sql
-- ✅ Good: Monitor connections
SELECT count(*) FROM pg_stat_activity;

-- ตั้ง max_connections ที่เหมาะสม
```
