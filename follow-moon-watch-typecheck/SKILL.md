---
name: follow-moon-watch-typecheck
description: Watch และแก้ไข typecheck errors ด้วย moonrepo
---

Run typecheck task ด้วย moonrepo และแก้ไข errors จนไม่มีเหลือ

## Goal

Watch typecheck tasks ด้วย moonrepo และแก้ไข errors อัตโนมัติ

## Execute

### 1. Run Typecheck Task

รัน typecheck task ด้วย moonrepo

1. รัน `moon run :typecheck` สำหรับ typecheck ทุก projects
2. หรือรัน `moon run <project>:typecheck` สำหรับ project เดียว
3. ตรวจสอบ output สำหรับ typecheck errors
4. รวบรวม errors ทั้งหมด

### 2. Apply Fix Error

แก้ไข typecheck errors ทั้งหมด

1. ทำ `/resolve-errors` สำหรับแต่ละ error
2. รัน typecheck task อีกครั้ง
3. ทำซ้ำจนไม่มี errors เหลือ

### 3. Verify Typecheck

ตรวจสอบว่า typecheck ผ่าน

1. รัน `moon run :typecheck` อีกครั้ง
2. ตรวจสอบว่าไม่มี errors
3. ตรวจสอบ type safety

## Rules

### 1. Moonrepo Commands

ใช้ moonrepo commands สำหรับ typecheck tasks

ใช้ moonrepo commands สำหรับ typecheck tasks ใน monorepo

- ใช้ `moon run :typecheck` สำหรับ typecheck ทุก projects
- ใช้ `moon run <project>:typecheck` สำหรับ project เดียว
- ใช้ `moon check` สำหรับตรวจสอบ configuration
- ใช้ `moon run :typecheck -- --watch` สำหรับ watch mode ถ้ารองรับ

### 2. Error Handling

แก้ไข typecheck errors อย่าง systematic

แก้ไข typecheck errors อย่าง systematic ตาม /resolve-errors

- ระบุ root cause ของ typecheck error
- แก้ไขที่จุดเดียวที่เป็นปัญหา
- ทำการเปลี่ยนแปลงน้อยที่สุด
- ตรวจสอบว่าไม่สร้าง side effects
- รัน typecheck อีกครั้งเพื่อ verify

### 3. Verification

ตรวจสอบว่า typecheck ผ่าน

ตรวจสอบว่า typecheck ผ่านและไม่มี errors

- รัน typecheck task อีกครั้งหลังแก้ไข
- ตรวจสอบว่าไม่มี errors เหลือ
- ตรวจสอบ type safety
- ตรวจสอบ type definitions

### 4. Related Workflows

ใช้ workflows ที่เกี่ยวข้อง

ใช้ workflows ที่เกี่ยวข้องสำหรับการแก้ไข errors

- ใช้ `/resolve-errors` สำหรับแก้ไข errors
- ใช้ `/moonrepo` สำหรับ moonrepo best practices
- ใช้ `/loop-until-complete` สำหรับทำซ้ำจนสำเร็จ

## Expected Outcome

- Typecheck tasks ผ่านทั้งหมด
- ไม่มี typecheck errors เหลือ
- Type safety ถูกรักษา
