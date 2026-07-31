# คุณสมบัติ ACID

## Atomicity (ความเป็นอะตอมิก)

**คำนิยาม**: การดำเนินการทั้งหมดใน transaction ต้องสำเร็จหรือล้มเหลวด้วยกัน

**ตัวอย่าง**:

```sql
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- การอัปเดตทั้งสองต้องสำเร็จหรือล้มเหลวด้วยกัน
```

## Consistency (ความสอดคล้อง)

**คำนิยาม**: Database ต้องเปลี่ยนจากสถานะที่ถูกต้องไปยังสถานะที่ถูกต้อง

**ตัวอย่าง**:

```sql
-- Constraint ช่วยรักษาความสอดคล้อง
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10,2) CHECK (amount > 0)
);
```

## Isolation (การแยกตัว)

**คำนิยาม**: Transaction ที่ทำพร้อมกันต้องไม่รบกวนกัน

**ระดับ**:
- **Read Uncommitted**: การแยกตัวต่ำสุด
- **Read Committed**: ค่าเริ่มต้นในหลาย database
- **Repeatable Read**: อ่านค่าเดิมภายใน transaction เดียวกัน
- **Serializable**: การแยกตัวสูงสุด

## Durability (ความทนทาน)

**คำนิยาม**: Transaction ที่ commit แล้วต้องรอดจากความล้มเหลว

**ตัวอย่าง**:

```sql
-- Write-ahead logging ช่วยรักษาความทนทาน
-- ข้อมูลถูกเขียนลง disk ก่อนยืนยัน commit
```
