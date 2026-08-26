---
name: report-ansi
description: สร้างรายงาน terminal ด้วย ANSI colors, progress bars, status symbols, และ box-drawing sketches/diagrams
---

## Goal

สร้างรายงาน terminal ด้วย ANSI colors, progress bars, status symbols, box-drawing characters, และ summary สำหรับ logs, status, progress, UX/UI sketches และ architecture diagrams

## Scope

ใช้สำหรับรายงานความคืบหน้า, สถานะ, error summary, UX/UI sketches, และ architecture diagrams ใน terminal ทีอ่านง่าย

## Execute

### 1. Collect Status

> Goal: รวบรวมข้อมูลทีต้องรายงาน

1. อ่าน logs หรือ status จาก file/stdout
2. ระบุ categories ของข้อมูล
3. นับจำนวน pass/fail/warning

### 2. Format With ANSI

> Goal: จัดรูปแบบด้วย ANSI escape codes

1. ใช้สี green สำหรับ success, red สำหรับ error, yellow สำหรับ warning, blue สำหรับ info
2. ใช้ bold สำหรับ headers
3. ใช้ progress bars สำหรับ percentage (ถ้ามี)
4. ใช้ symbols ✅ ❌ ⚠️ ℹ️ สำหรับ status

### 3. Render Summary

> Goal: แสดงสรุปด้านบน

1. สรุปจำนวนรายการตาม status
2. แสดง key findings สั้นๆ
3. แสดง progress ถ้ามี
4. แยกรายละเอียดด้านล่าง

### 4. Draw Box Diagrams And Sketches

> Goal: วาด diagram/sketch ด้วย ANSI box-drawing characters

1. ทำ `/scan-codebase` เพื่อหา components, routes, modules ที่เกี่ยวข้อง
2. เลือก view type: full page, dialog/modal, component, flow, system overview, module dependency
3. กำหนด target device: desktop, mobile, หรือ both และความกว้างสูงสุดไม่เกิน 80 characters
4. วาด frame ด้วย `┌─┐│└─┘` (single-line) หรือ `╔═╗║╚═╝` (double-line) สำหรับ outer container
5. วาด sections หลัก: header, content area, sidebar, footer, layers, modules
6. ใช้ `├─┤`, `┬─┴`, `├─`, `└─`, `│` สำหรับ dividers/branching
7. ใช้ `[Button]`, `[Input]`, `[____]`, `[✓]`, `[ ]`, `[Select ▼]`, `[×]` สำหรับ interactive elements
8. ใช้ arrows `→ ↓ ↑ ⇄ ↔ ⇢` แสดง flow/dependency
9. ใช้ `◇` สำหรับ decision, `○` start, `●` end, หรือ numbered steps `① ② ③`
10. แสดง mobile view ด้วย single column, bottom navigation, touch targets `[  Button  ]`
11. ใช้ `//` สำหรับ inline annotations, `⚠` สำหรับ concerns, `✨` สำหรับ new components
12. ตรวจสอบว่า layout ไม่กว้างเกิน 80 characters, alignment สมมาตร, และอ้างอิง codebase จริง

## Rules

### 1. ANSI Safety

- ใช้ ANSI codes ที support common terminals
- ถ้า output ถูก redirect ให้รองรับ NO_COLOR
- ไม่ใช้ 256 colors ถ้าไม่จำเป็น

### 2. Readability

- summary อยู่ด้านบน
- จัดกลุ่มตาม category
- ใช้ symbols คู่กับสี
- ความกว้างสูงสุด 80 characters สำหรับ chat readability
- ใช้ 2 spaces สำหรับ indentation
- แยก sections ด้วย blank lines

### 3. Consistency

- ใช้ชุดสีเดียวกันกับ `report-table`
- ไม่ผสมหลาย color scheme
- ใช้ box-drawing characters อย่างสม่ำเสมอ

### 4. Sketch/Diagram Accuracy

- อ้างอิง components, routes, modules ที่มีอยู่จริงใน codebase เท่านั้น
- ห้ามประดิษฐ์ UI elements หรือ services ที่ไม่มี
- ใช้ labels สั้นๆ ไม่เกิน 1 บรรทัดต่อ box/section
- ระบุ route path/technology names ใน boxes ถ้ามี

## Expected Outcome

- terminal report พร้อม ANSI colors และ status summary
- box-drawing sketches/diagrams ที่อ่านง่ายบน chat
- component structure และ user flow ที่อ้างอิง codebase จริง
- รองรับ common terminals และ NO_COLOR
