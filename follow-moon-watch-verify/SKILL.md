---
name: follow-moon-watch-verify
description: Watch และแก้ไข verify errors ด้วย moonrepo
---

Run verify task ด้วย moonrepo และแก้ไข errors จนไม่มีเหลือ

## Goal

Watch verify tasks ด้วย moonrepo และแก้ไข errors อัตโนมัติ

## Execute

### 1. Run Verify Task

รัน verify task ด้วย moonrepo

1. รัน `moon run :verify` สำหรับ verify ทุก projects
2. หรือรัน `moon run <project>:verify` สำหรับ project เดียว
3. ตรวจสอบ output สำหรับ verify errors
4. รวบรวม errors ทั้งหมด

### 2. Apply Fix Error

แก้ไข verify errors ทั้งหมด

1. ทำ `/resolve-errors` สำหรับแต่ละ error
2. รัน verify task อีกครั้ง
3. ทำซ้ำจนไม่มี errors เหลือ

### 3. Verify Verify

ตรวจสอบว่า verify ผ่าน

1. รัน `moon run :verify` อีกครั้ง
2. ตรวจสอบว่าไม่มี errors
3. ตรวจสอบทุก verification checks

## Rules

### 1. Moonrepo Commands

ใช้ moonrepo commands สำหรับ verify tasks

ใช้ moonrepo commands สำหรับ verify tasks ใน monorepo

- ใช้ `moon run :verify` สำหรับ verify ทุก projects
- ใช้ `moon run <project>:verify` สำหรับ project เดียว
- ใช้ `moon check` สำหรับตรวจสอบ configuration
- ใช้ `moon ci` สำหรับ CI verification

### 2. Error Handling

แก้ไข verify errors อย่าง systematic

แก้ไข verify errors อย่าง systematic ตาม /resolve-errors

- ระบุ root cause ของ verify error
- แก้ไขที่จุดเดียวที่เป็นปัญหา
- ทำการเปลี่ยนแปลงน้อยที่สุด
- ตรวจสอบว่าไม่สร้าง side effects
- รัน verify อีกครั้งเพื่อ verify

### 3. Verification

ตรวจสอบว่า verify ผ่าน

ตรวจสอบว่า verify ผ่านและไม่มี errors

- รัน verify task อีกครั้งหลังแก้ไข
- ตรวจสอบว่าไม่มี errors เหลือ
- ตรวจสอบทุก verification checks
- ตรวจสอบ CI readiness

### 4. Related Workflows

ใช้ workflows ที่เกี่ยวข้อง

ใช้ workflows ที่เกี่ยวข้องสำหรับการแก้ไข errors

- ใช้ `/resolve-errors` สำหรับแก้ไข errors
- ใช้ `/moonrepo` สำหรับ moonrepo best practices
- ใช้ `/loop-until-complete` สำหรับทำซ้ำจนสำเร็จ

## Expected Outcome

- Verify tasks ผ่านทั้งหมด
- ไม่มี verify errors เหลือ
- CI ready
