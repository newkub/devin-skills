---
name: follow-moon-watch-build
description: Watch และแก้ไข build errors ด้วย moonrepo
---

Run build task ด้วย moonrepo และแก้ไข errors จนไม่มีเหลือ

## Goal

Watch build tasks ด้วย moonrepo และแก้ไข errors อัตโนมัติ

## Execute

### 1. Run Build Task

รัน build task ด้วย moonrepo

1. รัน `moon run :build` สำหรับ build ทุก projects
2. หรือรัน `moon run <project>:build` สำหรับ project เดียว
3. ตรวจสอบ output สำหรับ build errors
4. รวบรวม errors ทั้งหมด

### 2. Apply Fix Error

แก้ไข build errors ทั้งหมด

1. ทำ `/resolve-errors` สำหรับแต่ละ error
2. รัน build task อีกครั้ง
3. ทำซ้ำจนไม่มี errors เหลือ

### 3. Verify Build

ตรวจสอบว่า build สำเร็จ

1. รัน `moon run :build` อีกครั้ง
2. ตรวจสอบว่าไม่มี errors
3. ตรวจสอบ output files ที่สร้างขึ้น

## Rules

### 1. Moonrepo Commands

ใช้ moonrepo commands สำหรับ build tasks

ใช้ moonrepo commands สำหรับ build tasks ใน monorepo

- ใช้ `moon run :build` สำหรับ build ทุก projects
- ใช้ `moon run <project>:build` สำหรับ project เดียว
- ใช้ `moon check` สำหรับตรวจสอบ configuration
- ใช้ `moon project-graph` สำหรับดู project dependencies

### 2. Error Handling

แก้ไข build errors อย่าง systematic

แก้ไข build errors อย่าง systematic ตาม /resolve-errors

- ระบุ root cause ของ error
- แก้ไขที่จุดเดียวที่เป็นปัญหา
- ทำการเปลี่ยนแปลงน้อยที่สุด
- ตรวจสอบว่าไม่สร้าง side effects
- รัน build อีกครั้งเพื่อ verify

### 3. Verification

ตรวจสอบว่า build สำเร็จ

ตรวจสอบว่า build สำเร็จและไม่มี errors

- รัน build task อีกครั้งหลังแก้ไข
- ตรวจสอบว่าไม่มี errors เหลือ
- ตรวจสอบ output files ที่สร้างขึ้น
- ตรวจสอบ dependencies ของ projects

### 4. Related Workflows

ใช้ workflows ที่เกี่ยวข้อง

ใช้ workflows ที่เกี่ยวข้องสำหรับการแก้ไข errors

- ใช้ `/resolve-errors` สำหรับแก้ไข errors
- ใช้ `/moonrepo` สำหรับ moonrepo best practices
- ใช้ `/loop-until-complete` สำหรับทำซ้ำจนสำเร็จ

## Expected Outcome

- Build tasks สำเร็จทั้งหมด
- ไม่มี build errors เหลือ
- Output files ถูกสร้างขึ้นอย่างถูกต้อง
