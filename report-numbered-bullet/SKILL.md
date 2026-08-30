---
name: report-numbered-bullet
description: รายงานผลในรูปแบบ numbered, bullet, หรือ numbered + bullet ตามความเหมาะสม
argument-hint: "[content]"
related:
  - report-table
  - report-plan
  - report-in-html
  - follow-single-responsibility
---

## Goal

จัดรูปแบบ output ให้เป็น numbered list, bullet list, หรือผสมระหว่าง numbered กับ bullet ตาม context

## Scope

ใช้สำหรับ report ทั่วไปที่ไม่จำเป็นต้องเป็นตาราง โดยเลือก format ตามลำดับ ความสัมพันธ์ของข้อ และความต้องการ action

## Execute

### 1. Choose Format

> Goal: เลือกรูปแบบรายงานทีเหมาะสม

1. ถ้าต้องการลำดับก่อนหลังหรือ priority → ใช้ numbered list
2. ถ้าต้องการรายการทีไม่มีลำดับ → ใช้ bullet list
3. ถ้ามีหัวข้อหลักหลายข้อ และแต่ละหัวข้อมีรายละเอียดย่อย → ใช้ numbered + bullet
4. ถ้าต้องการผสมกับตาราง → ทำ `/report-table` คู่กัน

### 2. Numbered List

> Goal: แสดงลำดับทีชัดเจน

1. ใช้รูปแบบ `N. <ข้อความสั้น>`
2. เรียงลำดับตาม priority, dependency, หรือลำดับเวลา
3. ไม่ให้ข้อเดียวมีหลายงาน — ถ้ามี → ทำ `/follow-single-responsibility` ก่อน
4. ใช้เมื่อ reader ต้องทำตาม step

### 3. Bullet List

> Goal: แสดงรายการทีไม่ต้องเรียงลำดับ

- ใช้ `-` หรือ `*` สำหรับแต่ละรายการ
- แต่ละ bullet ควรย่อยากระชับ
- ใช้เมื่อข้อมูลมีความสำคัญเท่ากัน
- สามารถจัดกลุ่มด้วย sub-heading ถ้ามีหลายหมวด

### 4. Numbered + Bullet

> Goal: แสดงหัวข้อหลักพร้อมรายละเอียดย่อย

1. ใช้ numbered list สำหรับหัวข้อหลัก
2. ใช้ bullet list สำหรับรายละเอียดภายใต้แต่ละหัวข้อ
3. ทำให้ single responsibility: หัวข้อหลัก 1 ข้อ = 1 หน่วยงาน
4. ใช้เมื่อมี plan, รายงาน findings, หรือ action items

## Rules

### 1. Single Responsibility

- หัวข้อหลักหนึ่งข้อต้องมี single responsibility
- ถ้าพบคำว่า "และ" หรือ "," หลายตัวในข้อเดียว → ทำ `/follow-single-responsibility` ก่อน

### 2. Reference Support

- ถ้ามี URL → ใส่เป็น `<url>` หรือ markdown link
- ถ้ามี skill → ใช้ `/<skill-name>`
- ถ้ามี file path → ใช้ backticks
- ถ้ามี code/command → ใช้ code block

### 3. Consistency

- ใช้ภาษาเดียวกันในรายการเดียวกัน
- ตัวหนังสือเริ่มต้นสัมผัสกัน (sentence case หรือ title case ตลอด)
- ไม่ผสม `1.` กับ `1)` หรือ `-` กับ `*` ในหมวดเดียวกัน

### 4. Output Length

- ไม่เกิน 250 บรรทัดต่อ report ถ้าเกิน → แยกหัวข้อไป `references/` หรือ `/report-in-html`
- แต่ละ bullet/number ไม่ยาวเกิน 2 บรรทัดถ้าไม่จำเป็น

- ใช้ /report-plan ถ้าจำเป็น

## Expected Outcome

- Output ในรูปแบบ numbered, bullet หรือ numbered + bullet ตาม context
- แต่ละข้อมี single responsibility
- มี references ครบ: URL, skills, paths
- อ่านง่าย กระชับ และพร้อม action
