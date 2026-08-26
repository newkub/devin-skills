---
name: report-before-after
description: รายงานแผนการทำงานก่อนดำเนินการ และแสดง before-after comparison
---

## Goal

อธิบายแผนการทำงานก่อนดำเนินการ และแสดง before-after ให้เหมาะสมโดยไม่แก้ไขจริง

## Scope

ใช้สำหรับการอธิบายแผนการทำงานก่อนดำเนินการ และแสดง before-after comparison

## Execute

### 1. Analyze Request

> Goal: Analyze Request

วิเคราะห์สิ่งที่ผู้ใช้ต้องการ

1. ทำ `/analyze-project` เพื่อวิเคราะห์สิ่งที่ผู้ใช้ต้องการ
2. ระบุสิ่งที่จะเปลี่ยนแปลงและผลกระทบ
3. ทำ `/plan` เพื่อวางแผนการทำงาน

### 2. Explain Plan

> Goal: Explain Plan

ตอบว่าจะทำอะไร ทำอย่างไร

1. อธิบายแผนการทำงานอย่างชัดเจน
2. ระบุไฟล์ที่จะเกี่ยวข้องและผลกระทบ
3. ใช้ `/report-before-after` format สำหรับการแสดง

### 3. Show Before After

> Goal: Show Before After

แสดง before-after comparison

1. แสดงสภาพปัจจุบัน (`before`) และสภาพหลังเปลี่ยน (`after`)
2. ใช้ `table` หรือ `code block` เปรียบเทียบถ้าเหมาะสม
3. อธิบายเหตุผลและประโยชน์ที่จะได้รับ

### 4. Confirm With User

> Goal: Confirm With User

ถามผู้ใช้ยืนยันก่อนดำเนินการ

1. ถามผู้ใช้ยืนยันก่อนดำเนินการจริง
2. รอการอนุมัติจากผู้ใช้
3. ดำเนินการเมื่อได้รับอนุมัติ

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-markdown-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-markdown-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Explain First

ต้องอธิบายก่อนดำเนินการ

- บอกว่าจะทำอะไร
- บอกว่าจะทำอย่างไร
- บอกว่าจะกระทบอะไร
- รอการยืนยันจากผู้ใช้

### 2. Before After Format

รูปแบบการแสดง before-after

```markdown
### Before
[สภาพปัจจุบัน]

### After
[สภาพหลังเปลี่ยน]
```

ใช้ `Before` และ `After` เป็น headers ใน markdown

### 3. No Actual Changes

ยังไม่ต้องแก้ไขจริง

- แสดงแผนการเท่านั้น
- ไม่แก้ไขไฟล์จริง
- รอการยืนยันจากผู้ใช้ก่อน

### 4. Clear Comparison

ต้องแสดงความแตกต่างอย่างชัดเจน

- ใช้ `table` เปรียบเทียบถ้าเหมาะสม
- ใช้ `code block` แสดง before/after code
- ใช้ bullet points แสดงการเปลี่ยนแปลง

### 5. Use Workflows

ใช้ workflows ที่เกี่ยวข้อง

- ทำ `/plan` เพื่อวางแผน
- ทำ `/analyze-project` เพื่อวิเคราะห์
- ทำ `/follow-write-devin-skills` เพื่อสร้าง workflow

## Expected Outcome

- ผู้ใช้เข้าใจแผนการทำงาน
- แสดง before-after อย่างชัดเจน
- ไม่มีการแก้ไขจริงจนกว่าจะได้รับอนุมัติ
- ผู้ใช้ยืนยันก่อนดำเนินการต่อ
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน