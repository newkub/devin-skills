---
name: report-todo
description: ตอบ action plan ในแชทเป็นตาราง No., Action, Before, After, Why, File Change, Risk พร้อมสรุป numbered
argument-hint: "[actions-or-context]"
related:
  - report-in-numbered
  - suggest-next-action
  - report
---

## Goal

ตอบ action plan ในแชทเป็นตารางทีมีคอลัมน์ `No.`, `Action`, `Before`, `After`, `Why`, `File Change`, `Risk` และสรุปด้านล่างด้วย `/report-in-numbered`

## Scope

ใช้เมื่อต้องตอบคำถาม/แนะนำ actions โดยยังไม่ลงมือทำ หรือต้องสรุปสถานะปัจจุบันก่อนดำเนินการ

## Execute

### 1. Collect Actions

> Goal: รวบรวม actions ทีต้องรายงาน

1. รับ context หรือ actions จาก user/skill
2. ทำ `/suggest-next-action` ถ้ายังไม่มี actions
3. แยกแต่ละ action ให้มี single responsibility
4. กำหนด priority ตาม impact/risk

### 2. Build Table

> Goal: สร้างตาราง action plan

1. คอลัมน์:
   - `No.` เรียง 1, 2, 3, ...
   - `Action` สั้น ชัดเจน
   - `Before` สถานะก่อนทำ
   - `After` สถานะหลังทำ
   - `Why` เหตุผลทีควรทำ
   - `File Change` ไฟล์ทีคาดว่าจะเปลี่ยน
   - `Risk` ความเสี่ยงหรือข้อควรระวัง
2. เรียงลำดับตาม priority
3. ใช้ backticks สำหรับ paths, skill names, commands
4. ไม่ใช้ bold markers

### 3. Add Numbered Summary

> Goal: สรุปด้านล่างตาราง

1. ใช้ `/report-in-numbered` สรุปลำดับ actions ทั้งหมด
2. เน้น next action แรก
3. ระบุ dependencies ระหว่าง actions ถ้ามี

### 4. Validate

> Goal: ตรวจความครบถ้วน

1. ตรวจทุกคอลัมน์มีข้อมูล
2. ตรวจ `No.` เรียงถูกต้อง
3. ตรวจสรุป numbered อยู่ด้านล่างตาราง

## Rules

- ใช้เมื่อ user ถามหรือต้องการ plan โดยยังไม่ลงมือ
- ทุก action ต้องมี single responsibility
- ไฟล์ทีระบุต้องพอจะเดาได้ ถ้าไม่แน่ใจให้ระบุ `TBD`
- ด้านล่างต้องมี `/report-in-numbered` เสมอ
- ตอบในแชทเท่านั้น

## Expected Outcome

- ตารางครบ 7 คอลัมน์: No., Action, Before, After, Why, File Change, Risk
- สรุป numbered list ด้านล่าง
- ระบุ next action และ dependencies
