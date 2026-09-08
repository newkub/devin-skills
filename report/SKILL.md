---
name: report
description: "เลือก format รายงานทีเหมาะสม: table หรือ numbered list"
argument-hint: "[scope]"
related:
  - report-in-table
  - report-in-numbered
  - report-in-codeblock
  - report-todo
  - report-progress
  - report-scan-todo
  - suggest-next-action
  - review-writing
---

## Goal

เลือกและ execute format รายงานทีเหมาะสมกับ context

## Scope

ใช้สำหรับรายงานผลในแชท โดย `/report` จะ dispatch ไปยัง `report-in-table` หรือ `report-in-numbered` ตามประเภทข้อมูล

## Execute

### 1. Select Format

> Goal: เลือกรูปแบบรายงาน

1. ถ้าข้อมูลเหมาะกับตารางหลาย columns → ใช้ `/report-in-table`
2. ถ้าข้อมูลเหมาะกับลำดับ steps/priority → ใช้ `/report-in-numbered`
3. ถ้าเป็น action plan จาก chat โดยยังไม่ลงมือ → ใช้ `/report-todo`
4. ถ้าเป็น commands, code snippets, config, logs, diff → ใช้ `/report-in-codeblock`
5. ถ้าเป็น progress/status → ใช้ `/report-progress`
6. ถ้าเป็น TODO markers → ใช้ `/report-scan-todo`

### 2. Execute Selected Skill

> Goal: รายงานตาม format

1. ส่งข้อมูลให้ skill ทีเลือก
2. ตรวจ output ว่าตรง format
3. ถ้าจำเป็น ใช้ `/review-writing`

### 3. Apply UX/UI Format

> Goal: ทำให้ report อ่านง่าย

1. ทำตาม `[references/uxui.md](references/uxui.md)`
2. ใช้ emoji ตาม legend ทีกำหนด
3. เรียงลำดับตาม status ให้ `completed` อยู่บนสุด
4. ไม่ใช้ bold markers

### 4. Finalize

> Goal: สรุปและชี้ next action

1. ทำ `/suggest-next-action` ถ้ามี next steps
2. ถ้า output มาจาก `/report-todo` ต้องมีตาราง + สรุป numbered list

## Rules

- `/report` ไม่ใช่รายงานเอง แต่ dispatch ไปยัง format ย่อย
- ใช้ `/report-in-table` เมื่องานมี comparison/status หลาย columns
- ใช้ `/report-in-numbered` เมื่องานเน้นลำดับ steps
- ใช้ `/report-todo` เมื่องานยังไม่ลงมือ ต้องการ action plan
- ทุกตารางต้องมีคอลัมน์ `No.` เป็นคอลัมน์แรก
- ทุก report ต้องสรุป key findings ด้านบน
- ใช้ emoji ตาม legend ใน `references/uxui.md`
- ไม่ใช้ bold markers

## Expected Outcome

- รายงานออกมาตาม format ทีเหมาะสม
- `/report-todo` สำหรับ action plan จาก chat
- สรุป key findings และ next action ชัดเจน
