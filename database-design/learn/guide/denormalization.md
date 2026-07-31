# Denormalization (การยกเลิกการทำ Normalize)

## เมื่อควรทำ Denormalize

- Workloads ที่อ่านข้อมูลหนัก
- การปรับปรุง performance
- ทำให้ queries ง่ายขึ้น
- Materialized views

**ตัวอย่าง**:

```sql
-- Normalized
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    total DECIMAL
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    amount DECIMAL
);

-- Denormalized สำหรับ performance
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    total DECIMAL,
    item_count INTEGER,  -- Denormalized
    last_updated TIMESTAMP
);
```
