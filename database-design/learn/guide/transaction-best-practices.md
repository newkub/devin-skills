# Transaction Best Practices

## Best Practices สำหรับ Transaction Management

### ทำให้ Transactions สั้น

```sql
-- ✅ Good: Transaction สั้น
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- ❌ Bad: Transaction ยาว
BEGIN;
-- การดำเนินการมากมาย
-- เวลานาน
COMMIT;
```

### ใช้ Isolation Level ที่เหมาะสม

```sql
-- ✅ Good: ใช้ isolation ที่เหมาะสม
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- Query
COMMIT;

-- ❌ Bad: ใช้ SERIALIZABLE เสมอ
-- จำกัดมากเกินไป, performance แย่
```
