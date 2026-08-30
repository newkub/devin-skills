---
name: implement-from-notes-idea
description: นำ note idea จาก repo D:\newkub\notes ไป implement ตาม numbered list
argument-hint: "[note-title-or-file]"
related:
  - save-to-notes-idea
  - list-notes
  - continue
  - implement-plan
  - follow-plan
  - run-check
  - deep-validate
  - ship
---

## Goal

นำ note idea จาก `D:\newkub\notes` ไป implement ตาม numbered list ท่ีบันทึกไว้

## Scope

- รับ title หรือ filename ของ note idea
- อ่านเนื้อหา idea จาก `D:\newkub\notes`
- แยกงานออกเป้นหน่วยย่อยตาม numbered list
- ใช้ `/continue`, `/implement-plan`, `/follow-plan` ดำเนินการตามลำดับ

## Execute

### 1. Identify Note Idea

> Goal: หา note idea ท่ีต้อง implement

1. รับ `title` หรือ `filename` จาก argument
2. ถ้าไม่มี → ใช้ `/list-notes` เพื่อเลือก
3. ถ้ายังไม่ชัด → ถาม user ด้วย `/ask-me`

### 2. Fetch Idea Content

> Goal: อ่านเนื้อหา idea จาก note

1. หาไฟล์ `.md` ใน `D:\newkub\notes`
2. อ่านเนื้อหาด้วย `read`
3. ถ้ามีหลายไฟล์ → เลือกไฟล์ `.md` หลัก

### 3. Parse Action Items

> Goal: แปลงเนื้อหาเป้น action items

1. วิเคราะห์ numbered list ใน note
2. สร้าง TODO list หรือ `.devin/plan/<title>.md` ถ้ามีแผนละเอียด
3. ใช้ `todo_write` เพื่อ track สถานะ

### 4. Implement

> Goal: ดำเนินการตาม action items จนครบ

1. เรียก `/continue` หรือ `/implement-plan` หรือ `/follow-plan`
2. ดำเนินการตามลำดับจาก numbered list
3. ถ้ามีข้อไหนซับซ้อน → แยก subtask หรือ subagent

### 5. Validate And Ship

> Goal: ส่งมอบงานท่ี implement แล้ว

1. รัน `/run-check` ตาม ecosystem
2. ทำ `/deep-validate`
3. ทำ `/ship` ถ้าผ่าน
4. รายงานสิ่งท่ีทำและ status

## Rules

### 1. Note Selection

- ต้องได้รับ note idea ก่อน implement
- ถ้าไม่พบ note → ใช้ `/list-notes` หรือ `/ask-me`
- ไม่เดาจาก partial title

### 2. Execution Order

- ทำตามลำดับ numbered list
- ไม่ skip ขั้นตอนท่ียังไม่ชัด
- ถ้า idea ไม่ชัด ให้ถาม user ก่อน

### 3. Decision Points

- ใช้ `/ask-me` สำหรับการตัดสินใจสำคัญ
- ใช้ subagent ถ้างานมีหลายด้านอิสระ

### 4. Validation

- ไม่ skip `/run-check` ก่อน ship
- ถ้า validation ไม่ผ่าน → แก้ไขก่อน continue

- ใช้ /save-to-notes-idea ถ้าจำเป็น

## Expected Outcome

- Note idea ถูก implement ครบตาม numbered list
- ผ่าน `/run-check` และ `/deep-validate`
- รายงานผลและสิ่งท่ีค้าง
