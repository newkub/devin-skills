---
name: follow-moon-watch-lint
description: Watch และแก้ไข lint errors ด้วย moonrepo
---

Run lint task ด้วย moonrepo และแก้ไข errors จนไม่มีเหลือ

## Goal

Watch lint tasks ด้วย moonrepo และแก้ไข errors อัตโนมัติ

## Execute

### 1. Run Lint Task

รัน lint task ด้วย moonrepo

1. รัน `moon run :lint` สำหรับ lint ทุก projects
2. หรือรัน `moon run <project>:lint` สำหรับ project เดียว
3. ตรวจสอบ output สำหรับ lint errors
4. รวบรวม errors ทั้งหมด

### 2. Apply Fix Error

แก้ไข lint errors ทั้งหมด

1. ทำ `/resolve-errors` สำหรับแต่ละ error
2. รัน lint task อีกครั้ง
3. ทำซ้ำจนไม่มี errors เหลือ

### 3. Verify Lint

ตรวจสอบว่า lint ผ่าน

1. รัน `moon run :lint` อีกครั้ง
2. ตรวจสอบว่าไม่มี errors
3. ตรวจสอบ warnings ถ้ามี

## Rules

### 1. Moonrepo Commands

ใช้ moonrepo commands สำหรับ lint tasks

ใช้ moonrepo commands สำหรับ lint tasks ใน monorepo

- ใช้ `moon run :lint` สำหรับ lint ทุก projects
- ใช้ `moon run <project>:lint` สำหรับ project เดียว
- ใช้ `moon check` สำหรับตรวจสอบ configuration
- ใช้ `moon run :lint -- --fix` สำหรับ auto-fix ถ้ารองรับ

### 2. Error Handling

แก้ไข lint errors อย่าง systematic

แก้ไข lint errors อย่าง systematic ตาม /resolve-errors

- ระบุ root cause ของ lint error
- แก้ไขที่จุดเดียวที่เป็นปัญหา
- ทำการเปลี่ยนแปลงน้อยที่สุด
- ตรวจสอบว่าไม่สร้าง side effects
- รัน lint อีกครั้งเพื่อ verify

### 3. Verification

ตรวจสอบว่า lint ผ่าน

ตรวจสอบว่า lint ผ่านและไม่มี errors

- รัน lint task อีกครั้งหลังแก้ไข
- ตรวจสอบว่าไม่มี errors เหลือ
- ตรวจสอบ warnings ถ้ามี
- ตรวจสอบ code quality

### 4. Related Workflows

ใช้ workflows ที่เกี่ยวข้อง

ใช้ workflows ที่เกี่ยวข้องสำหรับการแก้ไข errors

- ใช้ `/resolve-errors` สำหรับแก้ไข errors
- ใช้ `/moonrepo` สำหรับ moonrepo best practices
- ใช้ `/loop-until-complete` สำหรับทำซ้ำจนสำเร็จ

## Expected Outcome

- Lint tasks ผ่านทั้งหมด
- ไม่มี lint errors เหลือ
- Code quality ดีขึ้น
