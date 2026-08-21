---
name: request-math-formular
description: แปลง code หรือ description ให้เป็นสูตรคณิตศาสตร์ที่กระชับและเข้าใจง่าย
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - follow-request-math-formular
---

## Goal

แปลง code หรือ description ที่ผู้ใช้ให้มาให้เป็นสูตรคณิตศาสตร์ (math formula) ที่กระชับ เข้าใจง่าย และนำไปใช้ได้จริง

## Scope

ใช้สำหรับแปลง code, algorithm, หรือ description ที่อธิบายการคำนวณให้เป็น math formula

ไม่รวม: ขอสูตรใหม่จากปัญหา (ใช้ `/follow-request-math-formular`)

## Execute

### 1. Analyze Input
> Goal: Analyze Input

วิเคราะห์ input ที่ผู้ใช้ให้มาเพื่อเข้าใจสิ่งที่ต้องการแปลง

1. ระบุ input type: code, algorithm, description, หรือ mixed
2. ระบุตัวแปรและความสัมพันธ์ที่พบใน input
3. ระบุการคำนวณหรือ logic ที่ต้องแปลง
4. ถ้า input ไม่ชัดเจน ให้ถามผู้ใช้ ถ้าผู้ใช้ไม่ตอบให้ stop และ report

### 2. Extract Variables And Relationships
> Goal: Extract Variables And Relationships

สกัดตัวแปรและความสัมพันธ์ทางคณิตศาสตร์จาก input

1. กำหนดตัวแปรแต่ละตัวด้วยสัญลักษณ์ที่กระชับ (เช่น `x`, `n`, `r`)
2. ระบุความสัมพันธ์ระหว่างตัวแปร (linear, exponential, recursive, etc.)
3. ระบุเงื่อนไขและข้อจำกัดของแต่ละตัวแปร
4. ถ้ามีหลายสูตรที่เกี่ยวข้องกัน ให้จัดกลุ่มตามลำดับการใช้งาน

### 3. Convert To Math Formula
> Goal: Convert To Math Formula

แปลงเป็นสูตรคณิตศาสตร์ตามมาตรฐาน

1. เขียนสูตรหลักด้วยสัญลักษณ์ทางคณิตศาสตร์มาตรฐาน (summation, product, integral, etc.)
2. ใช้ LaTeX notation สำหรับ rendering ใน markdown: `$formula$` สำหรับ inline, `$$formula$$` สำหรับ block
3. เขียนคำอธิบายแต่ละสัญลักษณ์ในตาราง: สัญลักษณ์ | ความหมาย | หน่วย/ประเภท
4. ถ้ามีหลายขั้นตอน ให้เขียนเป็นลำดับสูตรพร้อมเลขกำกับ

### 4. Validate And Simplify
> Goal: Validate And Simplify

ตรวจสอบความถูกต้องและทำให้กระชับที่สุด

1. ทดสอบสูตรกับค่าตัวอย่างจาก input เดิม
2. ตรวจสอบว่าผลลัพธ์ตรงกับการคำนวณใน code/description เดิม
3. ลดรูปสูตรให้กระชับที่สุดโดยไม่สูญเสียความหมาย
4. ถ้าผลไม่ตรง ให้กลับไป Step 2 และ re-extract

### 5. Report
> Goal: Report

รายงานผลลัพธ์ในรูปแบบที่อ่านง่าย

1. แสดงสูตรหลักใน `$$...$$` block
2. แสดงตารางสัญลักษณ์และความหมาย
3. แสดงตัวอย่างการคำนวณพร้อมผลลัพธ์
4. ระบุเงื่อนไขและข้อจำกัด
5. ถ้ามีสูตรย่อย ให้แสดงเป็นลำดับพร้อมเลขกำกับ
Termination: workflow จบเมื่อสูตรผ่าน validation ใน Step 4 และ report ใน Step 5

## Rules

### 1. Formula Standards

- ใช้ LaTeX notation เสมอ: `$...$` inline, `$$...$$` block
- ใช้สัญลักษณ์ทางคณิตศาสตร์มาตรฐาน: `\sum`, `\prod`, `\int`, `\frac`, `\sqrt`, `\leq`, `\geq`, `\neq`
- ตัวแปรใช้ตัวอักษรกรีกหรือละตินตามธรรมเนียม (เช่น `\alpha`, `\beta`, `n`, `x`, `f(x)`)
- ถ้ามีหลายสูตร ให้เลขกำกับเช่น `(1)`, `(2)`, `(3)`

### 2. Conversion Rules

- แปลง loop เป็น `\sum` หรือ `\prod`
- แปลง condition เป็น piecewise function ด้วย `\begin{cases}`
- แปลง recursion เป็น recurrence relation
- แปลง rate/percentage เป็น `\frac` หรือ exponential
- รักษา semantics ของ code เดิม ห้ามเปลี่ยนความหมาย

### 3. Quality Rules

- สูตรต้องกระชับที่สุดเท่าที่จะทำได้
- ต้องมีตารางสัญลักษณ์และความหมายเสมอ
- ต้องมีตัวอย่างการคำนวณอย่างน้อย 1 ตัวอย่าง
- ต้องระบุเงื่อนไขและข้อจำกัด
- ห้ามแปลงเป็นสูตรที่ซับซ้อนเกินความจำเป็น

## Expected Outcome

- สูตรคณิตศาสตร์ใน LaTeX notation ที่กระชับและถูกต้อง
- ตารางสัญลักษณ์และความหมาย
- ตัวอย่างการคำนวณพร้อมผลลัพธ์
- เงื่อนไขและข้อจำกัดที่ชัดเจน
