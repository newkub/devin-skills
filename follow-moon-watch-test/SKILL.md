---
name: follow-moon-watch-test
description: Watch และแก้ไข test errors ด้วย moonrepo
---

## Goal

Watch test tasks ด้วย moonrepo และแก้ไข errors อัตโนมัติ

## Scope

Use `follow-moon-watch-test` for the specific tasks and workflows it covers

## Execute

### 1. Run Test Task
> Goal: Run Test Task

รัน test task ด้วย moonrepo

1. รัน `moon run :test` สำหรับ test ทุก projects
2. หรือรัน `moon run <project>:test` สำหรับ project เดียว
3. ตรวจสอบ output สำหรับ test errors
4. รวบรวม errors ทั้งหมด

### 2. Apply Fix Error
> Goal: Apply Fix Error

แก้ไข test errors ทั้งหมด

1. ทำ `/resolve-errors` สำหรับแต่ละ error
2. รัน test task อีกครั้ง
3. ทำซ้ำจนไม่มี errors เหลือ

### 3. Verify Test
> Goal: Verify Test

ตรวจสอบว่า test ผ่าน

1. รัน `moon run :test` อีกครั้ง
2. ตรวจสอบว่าไม่มี errors
3. ตรวจสอบ test coverage ถ้าจำเป็น

## Rules

### 1. Moonrepo Commands

ใช้ moonrepo commands สำหรับ test tasks

ใช้ moonrepo commands สำหรับ test tasks ใน monorepo

- ใช้ `moon run :test` สำหรับ test ทุก projects
- ใช้ `moon run <project>:test` สำหรับ project เดียว
- ใช้ `moon check` สำหรับตรวจสอบ configuration
- ใช้ `moon run :test -- --watch` สำหรับ watch mode ถ้ารองรับ

### 2. Error Handling

แก้ไข test errors อย่าง systematic

แก้ไข test errors อย่าง systematic ตาม /resolve-errors

- ระบุ root cause ของ test error
- แก้ไขที่จุดเดียวที่เป็นปัญหา
- ทำการเปลี่ยนแปลงน้อยที่สุด
- ตรวจสอบว่าไม่สร้าง side effects
- รัน test อีกครั้งเพื่อ verify

### 3. Verification

ตรวจสอบว่า test ผ่าน

ตรวจสอบว่า test ผ่านและไม่มี errors

- รัน test task อีกครั้งหลังแก้ไข
- ตรวจสอบว่าไม่มี errors เหลือ
- ตรวจสอบ test coverage ถ้าจำเป็น
- ตรวจสอบ test reliability

### 4. Related Workflows

ใช้ workflows ที่เกี่ยวข้อง

ใช้ workflows ที่เกี่ยวข้องสำหรับการแก้ไข errors

- ใช้ `/resolve-errors` สำหรับแก้ไข errors
- ใช้ `/follow-moonrepo` สำหรับ moonrepo best practices
- ใช้ `/loop-until-complete` สำหรับทำซ้ำจนสำเร็จ

## Expected Outcome

- Test tasks ผ่านทั้งหมด
- ไม่มี test errors เหลือ
- Test coverage เพียงพอ
