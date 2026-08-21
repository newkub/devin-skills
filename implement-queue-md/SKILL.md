---
name: implement-queue-md
description: อ่าน QUEUE.md ทำงานทั้งหมดให้ครบด้วย deep-plan และ realize-implementation
triggers:
- user
allowed-tools:
- read
- write
- edit
- exec
- ask_user_question
related:
- add-to-queue
- deep-plan
- realize-implementation
- implement-all
- run-verify
---

## Goal

อ่าน request ทั้งหมดใน `QUEUE.md` วางแผนและ implement ให้ครบถ้วนตามลำดับ priority

## Scope

- ใช้กับคิว request ที่ยัง pending ใน `QUEUE.md`
- ทำ `/deep-plan` หรือ `/realize-implementation` ตามแต่ละ request
- อัปเดท status ใน `QUEUE.md`

## Execute

### 1. Discover Requests

> Goal: รู้ว่ามี request อะไรบ้าง

1. อ่าน `QUEUE.md` ที่ project root
2. ถ้าไม่มี → รายงานและหยุด
3. ดึงรายการจากตารางที่ `Status` เป็น `pending`
4. เรียงลำดับตาม `Created` หรือ `Priority`
5. ถ้าไม่มี request pending → รายงานและหยุด

### 2. Plan Each Request

> Goal: ทุก request มีแผนครบ

1. อ่าน title และ description ของ request ถัดไป
2. ถ้างานซับซ้อน → ทำ `/deep-plan` พร้อม `/create-plan`
3. ถ้างานง่าย → สร้าง plan สั้นใน `QUEUE.md` หรือ `.devin/plan/<title>-<date>.md`
4. อัปเดท status ของ request เป็น `in-progress`

### 3. Implement Each Request

> Goal: ทำงานให้ครบตามแผน

1. ทำ `/realize-implementation` ตามแผน
2. ถ้าพบ TODO/MOCK/STUB → ทำ `/implement-all`
3. ถ้าเกิด error → ทำ `/resolve-errors` แล้ว retry (max 3)

### 4. Verify And Complete

> Goal: ทุก request ผ่าน verification

1. ทำ `/run-verify` เพื่อตรวจสอบคุณภาพ
2. ถ้าไม่ผ่าน → แก้ไขและรันซ้ำ (max 3)
3. อัปเดท `QUEUE.md` status ของ request เป้น `completed`
4. ถ้าต้องการลบ completed ออกจาก queue → ใช้ `/report` หรือ `/suggest-next-action`

## Rules

### 1. Order

- ทำทีละ request ตามลำดับ priority
- ไม่ข้าม request ที่ high priority
- ถ้ามี dependency ระหว่าง request → ระบุและจัดลำดับก่อน

### 2. Plan First

- ทุก request ต้องมี plan ก่อน implement
- งานซับซ้อนต้องทำ `/deep-plan`
- งานง่ายอาจใช้ plan สั้นใน queue file

### 3. Verify Before Complete

- ทำ `/run-verify` ก่อน mark complete
- ถ้าไม่ผ่าน ให้ระบุ reason และ retry
- ไม่ลบ request ก่อนยืนยันว่างานเสร็จ

## Expected Outcome

- ทุก request ใน `QUEUE.md` ถูก implement ครบ
- ไม่มี TODO/MOCK/STUB/placeholder เหลือ
- ผ่าน `/run-verify`
- `QUEUE.md` อัปเดท status ถูกต้อง
- รายงานผลสรุป
