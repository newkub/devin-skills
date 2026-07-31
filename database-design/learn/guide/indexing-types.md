# ประเภทของ Indexing

## B-Tree Index

**วัตถุประสงค์**: Range queries และ equality queries ที่รวดเร็ว

**ตัวอย่าง**:

```sql
CREATE INDEX idx_users_email ON users(email);
```

## Hash Index

**วัตถุประสงค์**: Equality queries เท่านั้นที่รวดเร็ว

**ตัวอย่าง**:

```sql
CREATE INDEX idx_users_id_hash ON users USING HASH (id);
```

## Composite Index

**วัตถุประสงค์**: Queries หลาย columns

**ตัวอย่าง**:

```sql
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
```
