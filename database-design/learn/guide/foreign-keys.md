# Foreign Keys (คีย์นอก)

## คำนิยาม

ความสัมพันธ์ระหว่าง tables เพื่อรับประกัน referential integrity

**ตัวอย่าง**:

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```
