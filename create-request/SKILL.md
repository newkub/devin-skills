---
name: create-request
description: สร้าง raw request file ใน .devin/request-queue/<title-date>.md
argument-hint: "<title> <request>"
triggers: ['user']
allowed-tools: ['read', 'edit', 'write', 'exec']
related:
  - enhance-prompt
  - implement-plan
---

## Goal

รับ request จากผู้ใช้ บันทึกลง `.devin/request-queue/<title-date>.md` และแนะนำ next steps

## Scope

- ใช้กับทุก request ที่ผู้ใช้ต้องการคัดแยกหรือจัดคิว
- บันทึก request ดิบ
- ไม่ execute ทันที

## Execute

### 1. Capture Request

> Goal: มี title และ request ที่ชัดเจน

1. รับ `<title>` และ request content จาก argument
2. ถ้าขาด ให้ถาม user
3. ตรวจสอบ title เป็น kebab-case, ไม่มีอักขระพิเศษ

### 2. Write Request File

> Goal: บันทึก request ลงไฟล์

1. ใช้ date ปัจจุบัน `YYYYMMDD`
2. สร้าง `.devin/request-queue/<title>-<date>.md` ด้วย frontmatter:
   - `title`, `description`, `status: pending`, `created`
   - sections: `## Original Request`, `## Goal`, `## Scope`, `## Notes`
3. ใช้ `write` tool
4. รายงาน path

### 3. Suggest Next Steps

> Goal: ผู้ใช้รู้ว่าจะทำต่อยังไง

1. ถ้าต้องการปรับปรุง prompt → ใช้ `/enhance-prompt` กับ request นี้
2. ถ้าพร้อม implement → ใช้ `/create-plan` ตามด้วย `/implement-plan` หรือ `/follow-your-suggestion`

## Rules

### 1. Title

- ใช้ kebab-case
- ไม่มีอักขระพิเศษ
- สั้นและจำง่าย

### 2. File Location

- ต้องอยู่ใน `.devin/request-queue/`
- ชื่อ `<title>-<date>.md`
- สร้าง directory ถ้ายังไม่มี

### 3. Status

- ค่าเริ่มต้น `pending`
- อัปเดตเป้น `in-progress` หรือ `completed` ตามสถานะ

### 4. No Execution

- ไม่ execute request ทันที
- ถ้าผู้ใช้ต้องการทำทันที ให้ใช้ workflow อื่น

## Expected Outcome

- Request file ถูกสร้างใน `.devin/request-queue/<title>-<date>.md`
- มี original request, goal, scope, notes
- พร้อมสำหรับ enhance หรือ implement ต่อ
