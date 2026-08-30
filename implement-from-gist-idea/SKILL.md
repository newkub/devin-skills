---
name: implement-from-gist-idea
description: นำ gist idea note ไป implement ตาม numbered list
argument-hint: "[gist-id-or-url]"
related:
  - save-to-gist-idea
  - list-gist-idea
  - continue
  - implement-plan
  - follow-plan
  - run-check
  - deep-validate
  - ship
---

## Goal

นำ gist idea note ไป implement ตาม numbered list ที่บันทึกไว้

## Scope

- รับ gist ID, URL, หรือ title ของ gist idea
- อ่านเนื้อหา idea จาก gist
- แยกงานออกเป็นหน่วยย่อยตาม numbered list
- ใช้ `/continue`, `/implement-plan`, `/follow-plan` ดำเนินการตามลำดับ
- รองรับ update TODO / task tracking

## Execute

### 1. Identify Gist Idea

> Goal: หา gist idea ที่ต้อง implement

1. รับ `gist-id`, URL, หรือ title จาก argument
2. ถ้าไม่มี่ → ใช้ `/list-gist-idea` เพื่อเลือก
3. ถ้ายังไม่ชัด → ถาม user ด้วย `/ask-me`

### 2. Fetch Idea Content

> Goal: อ่านเนื้อหา idea จาก gist

1. ใช้ `gh gist view <gist-id>` หรือ `gh gist view <gist-id> --files`
2. บันทึก content ที่ได้รับ
3. ถ้ามี่หลายไฟล์ → เลือกไฟล์ `.md` หลัก

### 3. Parse Action Items

> Goal: แปลงเนื้อหาเป็น action items

1. วิเคราะห์ numbered list ใน gist
2. สร้าง TODO list หรือ `.devin/plan/<title>.md` ถ้ามี่แผนละเอียด
3. ใช้ `todo_write` หรือ `/update-todo-md` เพื่อ track สถานะ

### 4. Implement

> Goal: ดำเนินการตาม action items จนครบ

1. เรียก `/continue` หรือ `/implement-plan` หรือ `/follow-plan`
2. ดำเนินการตามลำดับจาก numbered list
3. ถ้ามี่ข้อไหนซับซ้อน → แยก subtask หรือ subagent

### 5. Validate And Ship

> Goal: ส่งมอบงานที่ implement แล้ว

1. รัน `/run-check` ตาม ecosystem
2. ทำ `/deep-validate`
3. ทำ `/ship` ถ้าผ่าน
4. รายงานสิ่งที่ทำและ status

## Rules

### 1. Gist Selection

- ต้องได้รับ gist idea ก่อน implement
- ถ้าไม่พบ gist → ใช้ `/list-gist-idea` หรือ `/ask-me`
- ไม่เดาจาก partial title

### 2. Execution Order

- ทำตามลำดับ numbered list
- ไม่ skip ขั้นตอนที่ยังไม่ชัด
- ถ้า idea ไม่ชัด ให้ถาม user ก่อน

### 3. Decision Points

- ใช้ `/ask-me` สำหรับตัดสินใจสำคัญ
- ใช้ subagent ถ้างานมี่หลายด้านอิสระ

### 4. Validation

- ไม่ skip `/run-check` ก่อน ship
- ถ้า validation ไม่ผ่าน → แก้ไขก่อน continue

## Expected Outcome

- Gist idea ถูก implement ครบตาม numbered list
- ผ่าน `/run-check` และ `/deep-validate`
- รายงานผลและสิ่งที่ค้าง