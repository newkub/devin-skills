# Constraints

## Primary Key (คีย์หลัก)

**วัตถุประสงค์**: ตัวระบุที่ไม่ซ้ำกันสำหรับแต่ละแถว

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY
);
```

## Unique Constraint (ข้อจำกัดความไม่ซ้ำ)

**วัตถุประสงค์**: รับประกันค่าใน column ไม่ซ้ำกัน

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE
);
```

## Check Constraint (ข้อจำกัดตรวจสอบ)

**วัตถุประสงค์**: ตรวจสอบความถูกต้องของข้อมูล

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    price DECIMAL(10,2) CHECK (price > 0)
);
```
