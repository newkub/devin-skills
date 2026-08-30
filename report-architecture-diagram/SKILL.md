---
name: report-architecture-diagram
description: วาด architecture diagram ด้วย ANSI box-drawing characters ในแชทจาก codebase จริง
related:
  - scan-codebase
  - report-table
  - report-ansi
  - suggest-next-action
---

## Goal

วาด architecture diagram ด้วย ANSI box-drawing characters ในแชท เพื่อ visualize system structure, data flow, และ component relationships จาก codebase จริง

## Scope

ใช้สำหรับรายงาน architecture ของระบบหรือส่วนที่จะสร้างใหม่ ครอบคลุม: system overview, module dependencies, data flow, API layer, database schema relationships, และ integration points

## Execute

### 1. Analyze System Structure

> Goal: Analyze System Structure

1. ทำ `/scan-codebase` เพื่อหา modules, services, และ entry points
2. ระบุ layers หลัก: frontend, API, server, database, external services
3. ระบุ dependencies ระหว่าง modules และ packages
4. ระบุ external integrations (Stripe, Supabase, Resend, OpenAI, etc.)
5. จดกลุ่มของ components ตาม domain (auth, booking, payment, etc.)

### 2. Define Diagram Scope

> Goal: Define Diagram Scope

1. เลือกระดับ abstraction: system overview, module-level, หรือ feature-level
2. กำหนด boundary: แสดงเฉพาะส่วนที่เกี่ยวข้องกับ task ปัจจุบัน
3. ระบุ data flow direction: top-down, left-right, หรือ mixed
4. กำหนดความกว้างสูงสุดไม่เกิน 80 characters สำหรับ chat readability

### 3. Draw System Overview

> Goal: Draw System Overview

1. วาด outer container ด้วย double-line borders (`╔═╗║╚═╝`)
2. วาด layers หลักเป็น boxes ด้วย single-line borders (`┌─┐│└─┘`)
3. เชื่อม layers ด้วย arrows (`│`, `→`, `↓`) แสดง data flow
4. วาด external services เป็น separate boxes เชื่อมด้วย arrows
5. ใส่ labels สั้นๆ ในแต่ละ box: ชื่อ layer และ key components

### 4. Draw Module Dependencies

> Goal: Draw Module Dependencies

1. วาด modules เป็น boxes ในระดับเดียวกัน
2. เชื่อมด้วย arrows แสดง dependency direction
3. ใช้ `├─` และ `└─` สำหรับ branching dependencies
4. ระบุ dependency type: `→` (uses), `⇄` (bidirectional), `↔` (sync)
5. วาด database schema groups เป็น nested boxes

### 5. Draw Data Flow

> Goal: Draw Data Flow

1. ระบุ entry points: routes, API endpoints, server functions
2. วาด flow จาก entry point ผ่าน layers จนถึง database
3. ใช้ numbered arrows (`①→`, `②→`) สำหรับ sequence
4. ระบุ async operations ด้วย `⇢` และ sync ด้วย `→`
5. แสดง error paths ด้วย `✗` และ success paths ด้วย `✓`

### 6. Add Annotations

> Goal: Add Annotations

1. ใช้ `//` สำหรับ inline comments
2. ใช้ `⚠` สำหรับ risk points หรือ bottlenecks
3. ใช้ `✨` สำหรับ new components ที่จะสร้าง
4. ระบุ technology names ใน boxes (เช่น `oRPC`, `Drizzle`, `Stripe`)
5. เพิ่ม legend ด้านล่างถ้าใช้ symbols หลายชนิด

### 7. Validate And Present

> Goal: Validate And Present

1. ตรวจสอบว่าทุก box มี label ชัดเจน
2. ตรวจสอบว่า arrows เชื่อมถูก direction
3. ตรวจสอบว่า diagram ไม่กว้างเกิน 80 characters
4. ตรวจสอบว่าอ้างอิง components และ modules ที่มีอยู่จริงใน codebase
5. ตอบ diagram ในแชทโดยตรง ไม่สร้างไฟล์

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้คอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... โดย headers ชัดเจน จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Accuracy

- อ้างอิง components, modules, และ routes ที่มีอยู่จริงใน codebase เท่านั้น
- ห้ามประดิษฐ์ modules หรือ services ที่ไม่มี
- ตรวจสอบชื่อไฟล์และ paths จาก codebase ก่อนวาด
- ระบุเฉพาะส่วนที่เกี่ยวข้องกับ context ปัจจุบัน

### Box Drawing Characters

- Outer container: `╔═╗║╚═╝` (double-line)
- Layer boxes: `┌─┐│└─┘` (single-line)
- Section dividers: `├─┤` หรือ `┬─┴`
- Arrows: `→ ↓ ↑ ⇄ ⇢ ↔`
- Branches: `├─ └─ │`
- Markers: `✓ ✗ ⚠ ✨ ① ② ③`

### Layout

- ความกว้างสูงสุด 80 characters สำหรับ chat readability
- ใช้ 2 spaces สำหรับ indentation
- ใช้ consistent spacing ระหว่าง boxes
- จัด alignment ให้สมมาตร
- แยก sections ด้วย blank lines

### Content

- ใช้ labels สั้นๆ ไม่เกิน 1 บรรทัดต่อ box
- ระบุ technology names ใน boxes
- แสดงเฉพาะ essential relationships ไม่ใส่ทุก detail
- เพิ่ม legend ถ้าใช้ symbols พิเศษ
- ไม่สร้างไฟล์ .md, .html หรือ .json

## Expected Outcome

- ANSI architecture diagram ในแชทที่อ่านง่ายและเข้าใจ system structure
- Data flow ที่ชัดเจนจาก entry point ถึง database
- Component relationships ที่อ้างอิง codebase จริง
- Module dependencies ที่ visible และ traceable
- External integrations ที่แสดงชัดเจน
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน