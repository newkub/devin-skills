# Schema Best Practices

## Best Practices สำหรับ Schema Design

### ใช้ Data Types ที่เหมาะสม

```sql
-- ✅ Good: ใช้ types ที่เหมาะสม
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP,
    is_active BOOLEAN
);

-- ❌ Bad: ใช้ generic types
CREATE TABLE users (
    id TEXT,
    name TEXT,
    email TEXT,
    created_at TEXT,
    is_active TEXT
);
```

### Normalize ก่อน, Denormalize ทีหลัง

```sql
-- ✅ Good: Normalized
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    city TEXT,
    state TEXT,
    zip TEXT
);

-- Denormalize ถ้าจำเป็นสำหรับ performance
CREATE TABLE users_denorm (
    id SERIAL PRIMARY KEY,
    city TEXT,
    state TEXT,
    zip TEXT,
    city_state TEXT  -- Denormalized
);
```

### ใช้ Foreign Keys สำหรับ Integrity

```sql
-- ✅ Good: Foreign key constraint
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- ❌ Bad: ไม่มี foreign key
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER  -- ไม่มี constraint
);
```

### เพิ่ม Constraints

```sql
-- ✅ Good: เพิ่ม constraints
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) CHECK (price > 0),
    sku VARCHAR(50) UNIQUE
);
```
