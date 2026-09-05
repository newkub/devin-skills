---
name: follow-coverage
description: ทำให้ครอบคลุม ตรวจและเติมส่วนที่ขาดใน content skill และ code
argument-hint: "[scope]"
related:
  - review-content-coverage
  - ask-me
  - scan-codebase
  - report-table
  - review-writing
  - use-scripts
  - check-reference
---

## Goal

ทำให้ content, skill, หรือ code ครอบคลุมทุก features, APIs, use cases, references, และ edge cases โดยตรวจหาส่วนที่ขาดแล้วเติมให้ครบ

## Scope

ใช้เมื่อต้องการ ensure coverage ของ skill package, documentation, หรือ codebase โดยวิเคราะห์ gaps และเติมส่วนที่ขาด ไม่ใช่ review quality (ใช้ `/review-content-coverage` สำหรับ review)

## Execute

### 1. Identify Target And Scope

> Goal: รู้ว่าจะทำให้อะไรครอบคลุม

1. รับ target จาก user (skill directory, documentation, codebase, หรือ file)
2. ระบุประเภท coverage: `features`, `apis`, `use-cases`, `references`, `examples`, `edge-cases`
3. ถ้า target ไม่ชัด → ทำ `/ask-me` ก่อนดำเนินการ
4. ถ้าเป็น skill package → อ่าน `SKILL.md`, `references/`, `guide/`, `examples/` ทั้งหมด

### 2. Inventory Existing Content

> Goal: รู้สิ่งที่มีอยู่แล้ว

1. ทำ `/scan-codebase` ใน target directory
2. จัดทำรายการ content ที่มีอยู่แบ่งตามประเภท (`features`, `apis`, `use-cases`, `references`, `examples`)
3. บันทึกเป็นตารางด้วย `/report-table`: ประเภท, ชื่อ, ไฟล์, สถานะ
4. ถ้าเป็น skill ที่มี dependencies → ตรวจว่าทุก dependency มี reference file ใน `references/`

### 3. Analyze Coverage Gaps

> Goal: ระบุส่วนที่ขาด

1. เปรียบเทียบ inventory กับ scope ที่ควรครอบคลุม
2. ระบุ gaps แบ่งตามประเภท:
   - `features` ที่ไม่มี guide หรือ documentation
   - `apis` ที่ไม่มี examples หรือ parameters ไม่ครบ
   - `use-cases` ที่ไม่มี documentation
   - `references` ที่ขาดสำหรับ dependencies
   - `examples` ที่ไม่ครอบคลุมทุก API
   - `edge-cases` ที่ไม่มีการกล่าวถึง
3. จัดลำดับ gaps ตาม impact และ priority
4. ทำ `/report-table` สรุป gaps: ประเภท, สิ่งที่ขาด, priority, impact

### 4. Fill Coverage Gaps

> Goal: เติมส่วนที่ขาดให้ครบ

1. เขียน content สำหรับ gaps ตามลำดับ priority
2. สำหรับ skill package:
   - เพิ่ม `references/` สำหรับ dependencies ที่ขาด
   - เพิ่ม `guide/` สำหรับ features ที่ขาด
   - เพิ่ม `examples/` สำหรับ APIs ที่ขาด
3. สำหรับ documentation: เพิ่ม sections ที่ขาด
4. สำหรับ code: เพิ่ม tests สำหรับ edge cases ที่ขาด
5. ทำ `/review-writing` สำหรับ content ใหม่ทุกชิ้น
6. ถ้าต้องเขียน >10 ไฟล์ → ทำ `/use-scripts`

### 5. Verify Completeness

> Goal: ยืนยันว่าครอบคลุมครบแล้ว

1. ทำ inventory ใหม่อีกครั้งเพื่อยืนยัน gaps ถูกเติมครบ
2. ทำ `/check-reference` เพื่อตรวจ references ครบถ้วน
3. ตรวจว่าทุกไฟล์ไม่เกิน 250 บรรทัด
4. ถ้ายังมี gaps → กลับไปขั้นตอน 4 (max 3 รอบ → stop และ report)
5. ทำ `/update-references` ถ้ามีการเพิ่มไฟล์ใหม่

### 6. Report Coverage

> Goal: รายงานผล coverage

1. ทำ `/report-table` เปรียบเทียบ before-after coverage
2. สรุปจำนวน gaps ที่เติม, ไฟล์ที่สร้าง, ไฟล์ที่แก้ไข
3. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

## Rules

### 1. Coverage Scope

- ครอบคลุมทุก `features`, `apis`, `use-cases`, `references`, `examples`, `edge-cases`
- ไม่ข้าม dependencies และ configs ที่เกี่ยวข้อง
- ถ้าเป็น monorepo → ตรวจทุก workspaces หรือระบุ workspace

### 2. Differentiate From Review

- `follow-coverage` เติมส่วนที่ขาด (implement)
- `review-content-coverage` วิเคราะห์ quality ของ content (review)
- ใช้ `follow-coverage` ก่อน แล้วใช้ `review-content-coverage` ตรวจทีหลังได้

### 3. Content Quality

- ทำ `/review-writing` สำหรับ content ใหม่ทุกชิ้น
- ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`
- ไม่เกิน 250 บรรทัดต่อไฟล์
- ไม่มี TODO/MOCK/placeholder

### 4. Safety

- ไม่ทำลาย references หรือ content เดิม
- ถ้ามีการ overwrite ไฟล์เดิม → user confirmation ก่อน
- Minimal changes เสมอ ไม่ rewrite ทั้งไฟล์ถ้าเปลี่ยนเฉพาะส่วน

## Expected Outcome

- content, skill, หรือ code ครอบคลุมทุก features, APIs, use cases, references, และ edge cases
- gaps ทั้งหมดถูกเติมให้ครบ พร้อม before-after comparison
- ไฟล์ใหม่ทุกไฟล์ผ่าน `/review-writing` ไม่เกิน 250 บรรทัด
- references ครบถ้วน ไม่มี missing/unused
- รายงาน coverage before-after ชัดเจน พร้อม next actions
