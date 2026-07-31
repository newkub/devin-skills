# Query Optimization Best Practices

## Best Practices สำหรับ Query Optimization

### ใช้ EXPLAIN ANALYZE

```sql
-- ✅ Good: วิเคราะห์ query plan
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'john@example.com';

-- ตรวจสอบ:
-- - Sequential scans
-- - Index usage
-- - Join methods
```

### หลีกเลี่ยง SELECT *

```sql
-- ✅ Good: Select เฉพาะ columns ที่ต้องการ
SELECT id, name, email FROM users WHERE id = 1;

-- ❌ Bad: Select ทุก columns
SELECT * FROM users WHERE id = 1;
```

### ใช้ LIMIT สำหรับ Results ขนาดใหญ่

```sql
-- ✅ Good: Limit results
SELECT * FROM orders ORDER BY created_at DESC LIMIT 100;

-- ใช้ pagination สำหรับ datasets ขนาดใหญ่
SELECT * FROM orders 
ORDER BY created_at DESC 
LIMIT 100 OFFSET 0;
```

### ใช้ EXISTS แทน IN

```sql
-- ✅ Good: ใช้ EXISTS
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- ❌ Bad: ใช้ IN (อาจช้ากว่า)
SELECT * FROM users u
WHERE u.id IN (SELECT user_id FROM orders);
```
