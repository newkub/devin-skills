# Normalization (การทำ Normalize)

## First Normal Form (1NF)

**กฎ**: ไม่มีกลุ่มที่ซ้ำกัน, ค่าเป็น atomic

**ตัวอย่าง**:

```sql
-- ❌ ไม่ใช่ 1NF
CREATE TABLE orders (
    id INTEGER,
    items TEXT  -- "item1,item2,item3"
);

-- ✅ 1NF
CREATE TABLE orders (
    id INTEGER PRIMARY KEY
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    item TEXT
);
```

## Second Normal Form (2NF)

**กฎ**: ไม่มี partial dependencies

**ตัวอย่าง**:

```sql
-- ❌ ไม่ใช่ 2NF
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    item_name TEXT,
    item_price DECIMAL  -- ขึ้นกับ item_name, ไม่ใช่ order_id
);

-- ✅ 2NF
CREATE TABLE items (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price DECIMAL
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    item_id INTEGER REFERENCES items(id)
);
```

## Third Normal Form (3NF)

**กฎ**: ไม่มี transitive dependencies

**ตัวอย่าง**:

```sql
-- ❌ ไม่ใช่ 3NF
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    city TEXT,
    state TEXT,  -- ขึ้นกับ city
    zip TEXT    -- ขึ้นกับ city
);

-- ✅ 3NF
CREATE TABLE cities (
    zip TEXT PRIMARY KEY,
    city TEXT,
    state TEXT
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    zip TEXT REFERENCES cities(zip)
);
```
