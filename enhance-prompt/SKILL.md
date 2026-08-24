---
name: enhance-prompt
description: สรุป prompt เป็น numbered แต่ละข้อคือหน่วยงานเดียว (single responsibility)
---

## Goal

สรุป prompt ของผู้ใช้เป็น numbered list โดยแต่ละข้อมีหน่วยงานเดียว (single responsibility) เพื่อให้ทีมหรือ agent ดำเนินการต่อได้ชัดเจน

## Scope

ใช้หลังรับ prompt ทันที ก่อนวางแผนหรือลงมือ implement เพื่อแยกข้อกำหนดออกเป็นรายการทีไม่ซ้อนทับกัน

## Execute

### 1. Parse Prompt

> Goal: เข้าใจความต้องการทีผู้ใช้ระบุ

1. อ่าน prompt ล่าสุดของผู้ใช้จาก context
2. ระบุ goal หลัก ขอบเขตงาน และสิ่งทีคาดหวัง
3. ระบุ constraints, references, หรือ files ทีเกี่ยวข้อง

### 2. Decompose Into Single Responsibilities

> Goal: แยก prompt ออกเป็นหน่วยงานทีเล็กทีสุด

1. แยกแต่ละคำสั่งหรือคำขอออกเป็นข้อๆ
2. ตรวจสอบว่าแต่ละข้อทำสิ่งเดียวเท่านั้น (one thing per item)
3. ถ้าข้อไหนมีหลายงาน → แบ่งย่อยอีก
4. เรียงลำดับตาม dependency หรือลำดับการทำงานทีเหมาะสม

### 3. Format As Numbered List

> Goal: นำเสนอผลลัพธ์ในรูปแบบเข้าใจง่าย

1. สรุปแต่ละข้อด้วยประโยคสั้น กระชับ ชัดเจน
2. ใช้รูปแบบ `1. <responsibility> — <short detail>`
3. แต่ละข้อต้องมี single responsibility ชัดเจน
4. จัดลำดับตาม prepare → read → research → analyze → write → validate → report ถ้าเป็นไปได้

### 4. Hand Off

> Goal: พร้อมให้ step ถัดไปรับผิดชอบ

1. แสดง numbered list ในแชททันที
2. ไม่ลงมือ implement หรือแก้ไขไฟล์ใดๆ ในขั้นตอนนี้
3. ถ้า prompt ไม่ชัดเจน → ใช้ `/ask-me` ก่อนสรุป

## Rules

### 1. Single Responsibility Per Item

- ข้อเดียวทำสิ่งเดียว ห้ามรวมหลายคำขอในข้อเดียว
- ถ้าพบคำว่า "และ" หรือ "," หลายตัวในข้อเดียว → แบ่งย่อย

### 2. Preserve Original Intent

- รักษาความหมายและข้อกำหนดดั้งเดิมของ prompt
- ไม่เพิ่ม scope หรือลด scope โดยไม่มีเหตุผล

### 3. Use Same Language As User

- ใช้ภาษาเดียวกับ prompt ต้นทาง (ไทยหรืออังกฤษ)
- ไม่สลับภาษาระหว่างข้อ

### 4. No Execution

- ไม่แก้ไขไฟล์ ไม่รัน commands และไม่ลงมือ implement
- เป็นเพียงการสรุป prompt เท่านั้น

## Expected Outcome

- Numbered list ทีอ่านง่าย แต่ละข้อมี single responsibility
- ไฟล์/งานที่เกี่ยวข้องระบุชัดเจน
- ข้อกำหนดของผู้ใช้ถูกถ่ายทอดครบถ้วนโดยไม่เพิ่มหรือลด
- พร้อมส่งต่อให้ `/report-plan` หรือ `/continue` ต่อไป
