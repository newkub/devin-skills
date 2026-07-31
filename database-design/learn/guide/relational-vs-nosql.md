# Relational vs NoSQL

## การเปรียบเทียบประเภท Database

| ด้าน | Relational (SQL) | NoSQL |
|--------|-----------------|-------|
| **Schema** | Schema คงที่ | Schema ยืดหยุ่น |
| **Data Model** | Tables พร้อม relationships | Documents, key-value, graphs |
| **Scalability** | Vertical scaling | Horizontal scaling |
| **Consistency** | ACID | BASE (ความสอดคล้องแบบ eventual) |
| **Query Language** | SQL | แตกต่างตาม database |
| **Use Case** | ข้อมูลมีโครงสร้าง, transactions | ข้อมูลไม่มีโครงสร้าง, throughput สูง |

**ตัวอย่าง**:

```sql
-- Relational (PostgreSQL)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

-- NoSQL (MongoDB)
db.users.insertOne({
    name: "John Doe",
    email: "john@example.com"
});
```
