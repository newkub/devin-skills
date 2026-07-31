---
name: enhance-prompt
description: ปรับปรุง prompt ให้กระชับ ชัดเจน แยกออกเป็นข้อๆ พร้อมบันทึกลง .devin/request-queue/<title-date>.md
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'write', 'grep', 'ask_user_question']
related:
  - create-request
  - improve-ux-writing
  - follow-content-quality
  - plan
  - ask-me
---

## Goal

ปรับปรุง prompt ที่ user ให้มาให้กระชับ ชัดเจน แยกเป็นข้อๆ อ่านง่าย บันทึกลง `.devin/request-queue/<title-date>.md` และไม่เริ่มทำงานจนกว่า user จะ approve

## Scope

ใช้กับ prompt ทั่วไปที่ user ถามมา เช่น request, task, หรือคำถามที่มีเนื้อหายาว/ไม่ชัดเจน

## Execute

### 1. Understand Original Prompt

เข้าใจ prompt ต้นฉบับ

> Goal: รู้ว่า user ต้องการอะไรจริง

1. อ่าน prompt ทั้งหมด
2. หา goal หลัก
3. แยก constraints, scope, และ deliverables
4. ระบุสิ่งที่คลุมเครือ ที่ต้องถามเพิ่ม

### 2. Restructure Into Bullets

แยกเนื้อหาออกเป็นข้อๆ

> Goal: prompt ใหม่อ่านง่ายและทำตามได่ทีละข้อ

1. ลดประโยคยาวๆ ให้เหลือ bullet สั้น
2. แต่ละ bullet มี action ชัดเจน
3. จัดกลุ่มตามลำดับ: goal → scope → steps → expected outcome
4. ใช้ numbered list ถ้ามีลำดับก่อนหลัง
5. ใช้ bullet list ถ้าไม่มีลำดับ

### 3. Enhance Clarity

เพิ่มความชัดเจน

> Goal: ไม่มีคำกำกวม ไม่ต้องเดา

1. เปลี่ยนคำทั่วไปเป็น specific term
2. ระบุ file paths, directories, หรือ tools เฉพาะ
3. ใส่ criteria ว่าอะไรถือว่า success
4. ลบ filler หรือประโยคทักทายที่ไม่จำเป็น
5. ถ้ามี ambiguity → ถาม user ก่อน continue

### 4. Save Enhanced Prompt

บันทึก prompt ที่ปรับแล้วลง request queue

> Goal: มี request file พร้อมใช้งาน

1. สร้าง title จาก 3-5 คำสำคัญใน prompt แปลงเป็น kebab-case
2. ใช้ date ปัจจุบัน `YYYYMMDD`
3. สร้าง `.devin/request-queue/<title>-<date>.md` ด้วย frontmatter:
   - `title`, `description`, `status: pending`, `created`
   - sections: `## Original Prompt`, `## Enhanced Prompt`, `## Goal`, `## Scope`, `## Expected Outcome`
4. ใช้ `write` tool
5. รายงาน path

### 5. Output Enhanced Prompt

ส่ง prompt ที่ปรับแล้วให้ user

> Goal: user ได้ prompt ที่สามารถ approve หรือแก้ไขก่อนดำเนินการ

1. สรุป goal เป็นประโยคสั้น
2. แสดง scope เป็น bullet
3. แสดง steps/criteria เป็น list
4. ไม่ตอบคำถามหรือเริ่มทำงานจนกว่า user จะ approve

## Rules

### 1. Concise

- ลดเนื้อหาซ้ำซ้อน
- แต่ละ bullet ไม่เกิน 1-2 ประโยค
- เก็บเฉพาะสิ่งที่มีผลต่อผลลัพธ์

### 2. Specific

- ใช้ชื่อไฟล์/โฟลเดอร์จริงถ้ามี
- ระบุ tools/library เฉพาะ
- ไม่ใช้ "ทำให้ดี" โดยไม่มีเกณฑ์

### 3. Structured

- เรียง: Goal → Scope → Steps → Expected Outcome
- ใช้ heading ชัดเจน
- ใช้ backticks สำหรับ `code`, `paths`, `tools`

### 4. No Extra Actions

- ไม่ลงมือ implement
- ไม่เพิ่ม step ที่ user ไม่ได้ขอ
- ถ้า scope ไม่ชัด ให้ถามก่อน

## Expected Outcome

- prompt ถูกแยกเป็นข้อๆ ชัดเจน
- เนื้อหากระชับลงแต่ครบถ้วน
- มี request file ใน `.devin/request-queue/<title>-<date>.md`
- user สามารถ approve หรือแก้ไขก่อนดำเนินการ
- สามารถนำ prompt ไปใช้ดำเนินการต่อได่ทันทีหลัง approve
