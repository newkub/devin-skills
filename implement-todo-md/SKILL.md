---
name: implement-todo-md
description: แปลง TODO ในไฟล์ Markdown เป็น production code
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
---

## Goal

แปลง TODO ในไฟล์ Markdown (เช่น TODO.md) ให้กลายเป็น production code ที่ใช้งานได้จริง

## Scope

Use `implement-todo-md` for the specific tasks and workflows it covers

## Execute

### 1. Discovery And Inventory
> Goal: Discovery And Inventory

ค้นหาและรวบรวม TODO จากไฟล์ Markdown

1. ค้นหาไฟล์ Markdown ที่มี TODO (TODO.md, ROADMAP.md, ฯลฯ)
2. วิเคราะห์ TODO items แยกตาม priority และ dependencies
3. จัดกลุ่ม TODO items ตาม feature หรือ module
4. สร้าง plan สำหรับการ implement แต่ละ item

### 2. Implementation
> Goal: Implementation

Implement production code ตาม TODO items ใน Markdown

1. ทำ `/resolve-errors` เพื่อวิเคราะห์ root cause ก่อน implement
2. Implement features ตาม TODO items ที่ระบุ
3. เชื่อมต่อกับ dependencies ที่จำเป็น (database, API, services)
4. เขียน tests ตาม `/write-test`
5. ทำ `/loop-until-complete` จนกว่าจะผ่าน tests
6. ลบ TODO items ที่ implement เสร็จแล้ว

### 3. Verification
> Goal: Verification

ตรวจสอบว่าไม่มี TODO เหลือในไฟล์ Markdown

1. ตรวจสอบไฟล์ Markdown ว่าไม่มี TODO items เหลือ
2. ตรวจสอบว่า features ที่ implement ใช้งานได้จริง
3. อัพเดทไฟล์ Markdown ตามสถานะปัจจุบัน

## Rules

### Markdown Structure

โครงสร้างไฟล์ Markdown ต้องชัดเจน

- ใช้ numbered list สำหรับ TODO items
- ระบุ priority สำหรับแต่ละ item
- ระบุ dependencies ระหว่าง items
- ใช้ checkbox สำหรับ track progress

### Implementation Order

จัดลำดับ implement ตาม priority และ dependencies

- High priority items ก่อน
- Items ที่ไม่มี dependencies ก่อน
- Foundation items ก่อน
- Critical path ก่อน

### Test Coverage

ทุก implementation ต้องมี tests

- เขียน unit tests สำหรับ functions
- เขียน integration tests สำหรับ dependencies
- Tests ต้องครอบคลุม edge cases
- Tests ต้องผ่านทั้งหมด

### Documentation

อัพเดทไฟล์ Markdown ตามสถานะ

- ลบ TODO items ที่ implement เสร็จแล้ว
- เพิ่ม changelog สำหรับ features ที่ implement
- อัพเดท README ตาม `/follow-readme`

## Expected Outcome

- TODO items ในไฟล์ Markdown ถูกแปลงเป็น production code
- Features ที่ implement ใช้งานได้จริง
- Tests ครอบคลุมและผ่านทั้งหมด
- ไฟล์ Markdown อัพเดทตามสถานะปัจจุบัน
