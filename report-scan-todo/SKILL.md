---
name: report-scan-todo
description: รวบรวม TODO/FIXME/HACK/NOTE/XXX/BUG จาก code markers และไฟล์ TODO.md พร้อมตำแหน่ง ความสำคัญ และอายุ
argument-hint: "[scope]"
related:
  - update-todo-md
  - implement-to-production
  - scan-codebase
  - resolve-errors
  - report
  - suggest-next-action
---

## Goal

รวบรวมและรายงาน TODO, FIXME, HACK, NOTE และ comment markers อื่นๆ จาก codebase พร้อมตำแหน่งและความสำคัญ

## Scope

ใช้สำหรับการรายงาน TODO/FIXME/HACK/NOTE/XXX/BUG ทั้งจากไฟล์ `TODO.md` และจาก code markers ใน codebase — ไม่รวมการเพิ่ม TODO (ใช้ `/update-todo-md`) และไม่รวมการ implement TODO (ใช้ `/implement-to-production`)

(merged from: `report-todo`, `list-todo-md`)

## Execute

### 1. Scan TODO.md Files

> Goal: รวบรวม tasks จากไฟล์ `TODO.md`

1. หา `TODO.md`, `.devin/TODO.md`, `todo.md` ด้วย `find_file_by_name` หรือ `glob`
2. อ่านแต่ละไฟล์ แยก items ตาม:
   - `- [ ]` / `* [ ]` → pending
   - `- [x]` / `* [x]` → completed
   - `- [~]` → in-progress
3. ดึง `No.`, `Task`, `Status`, `File`, `Notes`
4. ถ้าไฟล์ใดไม่อยู่ในรูปแบบ checklist → แยกตาม section หรือ numbered list

### 2. Search For Code Markers

> Goal: ค้นหา TODO/FIXME/HACK markers ทั้งหมดใน codebase

1. ทำ `/scan-codebase` เพื่อค้นหา `TODO`, `FIXME`, `HACK`, `NOTE`, `XXX`, `BUG` ใน source files
2. ค้นหาในไฟล์: `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.vue`, `*.py`, `*.rs`, `*.go`, `*.java`
3. ไม่รวม `node_modules/`, `dist/`, `build/`, `.git/`
4. ระบุจำนวน markers ทั้งหมด

### 3. Categorize Markers

> Goal: จัดประเภท markers ตามชนิด

1. จัดประเภทตาม marker type:
   - TODO: สิ่งที่ต้องทำในอนาคต
   - FIXME: สิ่งที่ต้องแก้ไข
   - HACK: วิธีแก้แบบชั่วคราว
   - NOTE: หมายเหตุสำคัญ
   - XXX: สิ่งที่เป็นอันตรายหรือต้องระวัง
   - BUG: บั๊กที่ทราบ
2. จัดประเภทตาม priority ถ้าระบุใน comment (เช่น `TODO(high)`, `FIXME(critical)`)
3. จัดประเภทตาม category: code, config, docs, test

### 4. Collect Context

> Goal: รวบรวมบริบทของแต่ละ marker

1. อ่านบรรทัดรอบๆ marker เพื่อเข้าใจ context
2. ระบุ function หรือ class ที่ marker อยู่
3. ระบุ module หรือ feature ที่ marker เกี่ยวข้อง
4. ระบุไฟล์และบรรทัดที่ marker อยู่
5. ใช้ `git blame -L` ดูวันที่และ author ของแต่ละ marker line แล้วจัดกลุ่มตามอายุ: <30 วัน, 30-90 วัน, >90 วัน (stale)

### 5. Assess Priority

> Goal: ประเมินความสำคัญของแต่ละ marker

1. จัด priority ตาม marker type:
   - FIXME/BUG: high priority (ต้องแก้)
   - HACK/XXX: medium priority (ควรแก้)
   - TODO: low-medium priority (นice to have)
   - NOTE: informational (ไม่ต้องแก้)
2. ปรับ priority ตาม context: critical path, security, performance
3. ระบุ markers ที่เก่าเกิน 6 เดือน (stale)
4. จัดหมวด debt: stale (>90 วันไม่มีการแก้), orphaned (code ที่ comment อ้างถึงเปลี่ยนหรือถูกลบไปแล้ว), vague (marker เปล่าไม่มี owner/ticket reference), actionable (context ครบและยัง relevant)

### 6. Format Report

> Goal: จัดรูปแบบรายงานให้อ่านง่าย

1. ทำ `/report` เพื่อจัดรูปแบบเป็นตาราง
2. แสดงผลตามลำดับ: Summary → By Type → By Priority → Stale Markers
3. กำหนด columns:
   - No. ลำดับ
   - Type TODO / FIXME / HACK / NOTE / XXX / BUG
   - File ชื่อไฟล์
   - Line บรรทัด
   - Context function หรือ class
   - Priority high / medium / low
   - Stale ใช่ / ไม่ใช่
   - Message ข้อความใน marker
4. จัดกลุ่มตาม priority: high ก่อน แล้ว medium แล้ว low

### 7. Provide Insights

> Goal: ให้ insights และ recommendations

1. สรุปจำนวน markers แยกตาม type และ priority
2. ระบุ markers ที่ต้องจัดการด่วน (FIXME/BUG high priority)
3. ระบุ stale markers ที่เก่าเกิน 6 เดือน
4. แนะนำ next steps: `/implement-to-production` สำหรับ implement, `/resolve-errors` สำหรับแก้ FIXME

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report` สำหรับรายงานสถานะ/progress/logs
4. ใช้คอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... โดย headers ชัดเจน จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Read-Only

- ไม่เพิ่ม ไม่แก้ ไม่ลบ markers — รายงานเท่านั้น
- ใช้ `/update-todo-md` สำหรับเพิ่ม TODO
- ใช้ `/implement-to-production` สำหรับ implement TODO

### Output Format

- ทำ `/report` สำหรับจัดรูปแบบผลลัพธ์
- จัดกลุ่มตาม priority: high ก่อน
- ใช้ symbols: 🔴 high, 🟡 medium, 🟢 low, ℹ️ informational

### High Impact Content

- ชี้เน้น FIXME และ BUG ก่อนเสมอ
- ชี้เน้น stale markers ที่เก่าเกิน 6 เดือน
- ถ้ามีมากกว่า 100 markers → แสดงเฉพาะ high และ medium priority
- ไม่แสดง NOTE markers ในรายละเอียดถ้าเกิน 20 รายการ

### Non-Redundancy

- การเพิ่ม TODO อยู่ใน `/update-todo-md` แล้ว
- การ implement TODO อยู่ใน `/implement-to-production` แล้ว
- การค้นหา code อยู่ใน `/scan-codebase` แล้ว

## Expected Outcome

- รายการ TODO/FIXME/HACK/NOTE/XXX/BUG จาก code markers และไฟล์ `TODO.md` ในตารางที่อ่านง่าย
- จัดประเภทตาม type, priority และ staleness
- ชี้เน้น markers ที่ต้องจัดการด่วน
- ไม่มีการแก้ไข markers — read-only report
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: check-todo-comments)
