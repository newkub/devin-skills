---
name: write-explicit
description: เขียนหรือแก้ instructions ให้ชัดเจน วัดผลได้ และมี single responsibility
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - consider-use-in-another-skills
  - improve-devin-skills
  - follow-write-devin-skills
  - validate
---

## Goal

เขียนหรือแก้ไข instructions, prompts, rules, หรือ documentation ให้ชัดเจน อ่านแล้วลงมือได้ทันที โดยไม่ต้องเดา

## Scope

ใช้เมื่องานต้องการปรับปรุง clarity ของ skill, prompt, rule, หรือเอกสารใดๆ

## Execute

### 1. Identify Target

> Goal: ระบุเนื้อหาที่ต้องแก้ให้ชัดเจน

1. อ่าน target ทีต้องการปรับ (prompt, skill, rule, doc)
2. ระบุจุดที ambiguous, implicit, หรือมีหลายความหมาย
3. บันทึกลงรายการ ไฟล์/บรรทัด/คำที่ไม่ชัด

### 2. Extract Core Intents

> Goal: กำหนดสิ่งที่อ่านต้องรู้ก่อนอ่าน

1. ระบุ `action` ที reader ต้องทำ
2. ระบุ `condition` หรือ `if` ก่อนการกระทำ
3. ระบุ `expected result` ทีวัดผลได้
4. ถ้าไม่มีครบ 3 อย่าง → ถือว่า ambiguous

### 3. Rewrite Explicit Instructions

> Goal: เปลี่ยนเป็นลำดับชัดเจน ไม่ต้องตีความ

1. แยก step ละหน่วยงานเดียว (single responsibility)
2. ใช้กริยา active: `ทำ`, `รัน`, `ตรวจสอบ`, `หยุด` ไม่ใช่ `พิจารณา` อย่างเดียว
3. ระบุ input/output หรือตัวอย่าง command เสมอ
4. ใช้ backticks สำหรับ `tools`, `commands`, `file paths`, `skill-name`
5. ลบคำ filler: "ถ้าเป็นไปได้", "อาจจะ", "ควร", "โดยทั่วไป" ถ้าไม่จำเป็นจริง
6. ถ้ามีหลายทางเลือก → ระบุ criteria ตัดสินใจก่อนแต่ละ branch

### 4. Validate Clarity

> Goal: ตรวจสอบว่าผู้ใช้งานสามารถทำตามได้

1. อ่านทั้งหมดแล้วตอบคำถาม: ทำอะไร? ทำเมื่อไหร่? ผลที่ต้องการคืออะไร?
2. ถ้ามีข้อใดตอบไม่ได้ → กลับไปแก้ข้อนั้น
3. ทำ `/validate` เพื่อตรวจ structure และ references

## Rules

### 1. No Ambiguity

- ทุก instruction ต้องระบุ action + condition + expected result
- ห้ามใช้ "จัดการ", "ดูแล", "ประมาณนี้" โดยไม่ระบุรายละเอียด

### 2. One Thought Per Step

- 1 step = 1 หน่วยงาน ไม่ผสมหลายเรื่อง
- ถ้าพบ "และ" หรือ "/" ในคำสั่ง → แยก step

### 3. Measurable Outcomes

- ทุก expected outcome ต้องตรวจสอบได้
- ใช้ "ผ่าน X", "สร้าง Y", "มี Z" ไม่ใช่ "ดีขึ้น" หรือ "เหมาะสม"

### 4. No Placeholder Filler

- ห้ามมี "TODO", "...", "เช่น", หรือ generic examples ที่ไม่ระบุของจริง
- ถ้าต้องมี placeholder → ใส่หมายเหตุชัดเจนว่าต้องแทนค่าอะไร

### 5. Consistent Terminology

- ใช้ชื่อ tool/skill เหมือนกันทั้งไฟล์
- skill name อยู่ใน backticks เสมอ

## Expected Outcome

- Target สามารถทำตามได้ทันทีโดยไม่ต้องถามเพิ่ม
- ทุก step มี single responsibility ชัดเจน
- ไม่มี ambiguous words, filler, หรือ placeholders ที่ไม่จำเป็น
- ผ่าน `/validate` และ check ด้วยตนเอง
