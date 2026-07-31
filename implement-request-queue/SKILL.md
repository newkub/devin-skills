---
name: implement-request-queue
description: อ่าน request queue ทำงานทั้งหมดให้ครบด้วย deep-plan และ realize-implementation
triggers: ['user']
allowed-tools: ['read', 'edit', 'write', 'exec']
related:
  - add-request-to-queue
  - deep-plan
  - realize-implementation
  - implement-all
  - run-verify
---

## Goal

อ่าน request ทั้งหมดใน `.devin/request-queue/` วางแผนและ implement ให้ครบถ้วนตามลำดับ priority

## Scope

- ใช้กับคิว request ที่ยัง pending
- ทำ `/deep-plan` หรือ `/realize-implementation` ตามแต่ละ request
- อัปเดต status และลบไฟล์เมื่องานเสร็จ

## Execute

### 1. Discover Requests

> Goal: รู้ว่ามี request อะไรบ้าง

1. อ่านรายการไฟล์ใน `.devin/request-queue/`
2. กรองเฉพาะไฟล์ที่ `status: pending`
3. เรียงลำดับตาม `created` หรือ priority
4. ถ้าไม่มี request → รายงานและหยุด

### 2. Plan Each Request

> Goal: ทุก request มีแผนครบ

1. อ่าน request file
2. ถ้างานซับซ้อน → ทำ `/deep-plan` พร้อม `/create-plan`
3. ถ้างานง่าย → สร้าง plan สั้นในไฟล์ request
4. อัปเดต status เป็น `in-progress`

### 3. Implement Each Request

> Goal: ทำงานให้ครบตามแผน

1. ทำ `/realize-implementation` ตามแผน
2. ถ้าพบ TODO/MOCK/STUB → ทำ `/implement-all`
3. ถ้าเกิด error → ทำ `/resolve-errors` แล้ว retry (max 3)
4. อัปเดต task status ในไฟล์แผน

### 4. Verify And Complete

> Goal: ทุก request ผ่าน verification

1. ทำ `/run-verify` เพื่อตรวจสอบคุณภาพ
2. ถ้าไม่ผ่าน → แก้ไขและรันซ้ำ (max 3)
3. อัปเดต request status เป้น `completed`
4. ลบไฟล์ `.devin/plan/<title>-<date>.md` และ `.devin/request-queue/<title>-<date>.md`
5. ทำ `/suggest-next-action`

## Rules

### 1. Order

- ทำทีละ request ตามลำดับ priority
- ไม่ข้าม request ที่ high priority
- ถ้ามี dependency ระหว่าง request → ระบุและจัดลำดับก่อน

### 2. Plan First

- ทุก request ต้องมี plan ก่อน implement
- งานซับซ้อนต้องทำ `/deep-plan`
- งานง่ายอาจใช้ plan สั้นใน request file

### 3. Verify Before Cleanup

- ทำ `/run-verify` ก่อนลบไฟล์
- ถ้าไม่ผ่าน ให้ระบุ reason และ retry
- ไม่ลบ request ก่อนยืนยันว่างานเสร็จ

## Expected Outcome

- ทุก request ใน queue ถูก implement ครบ
- ไม่มี TODO/MOCK/STUB/placeholder เหลือ
- ผ่าน `/run-verify`
- ไฟล์แผนและ request ถูกลบหลังเสร็จ
- รายงานผลสรุป
