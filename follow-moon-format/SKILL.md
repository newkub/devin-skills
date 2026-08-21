---
name: follow-moon-format
description: Format code ด้วย moonrepo และแก้ไข errors จนไม่มีเหลือ
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
  - loop-until-complete
  - resolve-errors
  - follow-moonrepo
---

## Goal

Format code ด้วย moonrepo และแก้ไข errors อัตโนมัติ

## Scope

Use `follow-moon-format` for the specific tasks and workflows it covers

## Execute

### 1. Run Format Task
> Goal: Run Format Task

รัน format task ด้วย moonrepo

1. รัน `moon run :format` สำหรับ format ทุก projects
2. หรือรัน `moon run <project>:format` สำหรับ project เดียว
3. ตรวจสอบ output สำหรับ format errors
4. รวบรวม errors ทั้งหมด

### 2. Apply Fix Error
> Goal: Apply Fix Error

แก้ไข format errors ทั้งหมด

1. ทำ `/resolve-errors` สำหรับแต่ละ error
2. รัน format task อีกครั้ง
3. ทำซ้ำจนไม่มี errors เหลือ

### 3. Verify Format
> Goal: Verify Format

ตรวจสอบว่า format ผ่าน

1. รัน `moon run :format` อีกครั้ง
2. ตรวจสอบว่าไม่มี errors
3. ตรวจสอบ code style consistency

## Rules

### 1. Moonrepo Commands

ใช้ moonrepo commands สำหรับ format tasks

ใช้ moonrepo commands สำหรับ format tasks ใน monorepo

- ใช้ `moon run :format` สำหรับ format ทุก projects
- ใช้ `moon run <project>:format` สำหรับ project เดียว
- ใช้ `moon check` สำหรับตรวจสอบ configuration
- ใช้ `moon run :format -- --write` สำหรับ auto-fix ถ้ารองรับ

### 2. Error Handling

แก้ไข format errors อย่าง systematic

แก้ไข format errors อย่าง systematic ตาม /resolve-errors

- ระบุ root cause ของ format error
- แก้ไขที่จุดเดียวที่เป็นปัญหา
- ทำการเปลี่ยนแปลงน้อยที่สุด
- ตรวจสอบว่าไม่สร้าง side effects
- รัน format อีกครั้งเพื่อ verify

### 3. Verification

ตรวจสอบว่า format ผ่าน

ตรวจสอบว่า format ผ่านและไม่มี errors

- รัน format task อีกครั้งหลังแก้ไข
- ตรวจสอบว่าไม่มี errors เหลือ
- ตรวจสอบ code style consistency
- ตรวจสอบ formatting rules

### 4. Related Workflows

ใช้ workflows ที่เกี่ยวข้อง

ใช้ workflows ที่เกี่ยวข้องสำหรับการแก้ไข errors

- ใช้ `/resolve-errors` สำหรับแก้ไข errors
- ใช้ `/follow-moonrepo` สำหรับ moonrepo best practices
- ใช้ `/loop-until-complete` สำหรับทำซ้ำจนสำเร็จ

## Expected Outcome

- Format tasks ผ่านทั้งหมด
- ไม่มี format errors เหลือ
- Code style consistent
