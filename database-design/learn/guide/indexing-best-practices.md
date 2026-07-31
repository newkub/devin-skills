# Indexing Best Practices

## Best Practices สำหรับ Indexing

### Index Foreign Keys

```sql
-- ✅ Good: Index foreign keys
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- ❌ Bad: ไม่มี index บน foreign key
-- Queries จะช้า
```

### Index Query Columns

```sql
-- ✅ Good: Index columns ที่ใช้ใน WHERE, JOIN, ORDER BY
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- ❌ Bad: อย่า index ทุกอย่าง
-- Indexes มากเกินไปจะทำให้ writes ช้าลง
```

### ใช้ Composite Indexes อย่างชาญฉลาด

```sql
-- ✅ Good: Composite index สำหรับ multi-column queries
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- ลำดับสำคัญ: เลือกที่ selective ที่สุดก่อน
```
