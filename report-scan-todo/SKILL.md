---
name: report-scan-todo
description: รวบรวม TODO/FIXME/HACK markers จาก codebase พร้อมตำแหน่งและความสำคัญ
related:
  - update-todo-md
  - realize-implementation
  - scan-codebase
  - report-table
  - resolve-errors
  - report-ansi
  - suggest-next-action
---

## Goal

รวบรวมและรายงาน TODO, FIXME, HACK, NOTE และ comment markers อื่นๆ จาก codebase พร้อมตำแหน่งและความสำคัญ

## Scope

ใช้สำหรับการรายงาน TODO/FIXME/HACK ใน codebase — ไม่รวมการเพิ่ม TODO (ใช้ `/update-todo-md`) และไม่รวมการ implement TODO (ใช้ `/realize-implementation`)

## Execute

### 1. Search For Markers

> Goal: ค้นหา TODO/FIXME/HACK markers ทั้งหมดใน codebase

1. ทำ `/scan-codebase` เพื่อค้นหา `TODO`, `FIXME`, `HACK`, `NOTE`, `XXX`, `BUG` ใน source files
2. ค้นหาในไฟล์: `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.vue`, `*.py`, `*.rs`, `*.go`, `*.java`
3. ไม่รวม `node_modules/`, `dist/`, `build/`, `.git/`
4. ระบุจำนวน markers ทั้งหมด

### 2. Categorize Markers

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

### 3. Collect Context

> Goal: รวบรวมบริบทของแต่ละ marker

1. อ่านบรรทัดรอบๆ marker เพื่อเข้าใจ context
2. ระบุ function หรือ class ที่ marker อยู่
3. ระบุ module หรือ feature ที่ marker เกี่ยวข้อง
4. ระบุไฟล์และบรรทัดที่ marker อยู่

### 4. Assess Priority

> Goal: ประเมินความสำคัญของแต่ละ marker

1. จัด priority ตาม marker type:
   - FIXME/BUG: high priority (ต้องแก้)
   - HACK/XXX: medium priority (ควรแก้)
   - TODO: low-medium priority (นice to have)
   - NOTE: informational (ไม่ต้องแก้)
2. ปรับ priority ตาม context: critical path, security, performance
3. ระบุ markers ที่เก่าเกิน 6 เดือน (stale)

### 5. Format Report

> Goal: จัดรูปแบบรายงานให้อ่านง่าย

1. ทำ `/report-table` เพื่อจัดรูปแบบเป็นตาราง
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

### 6. Provide Insights

> Goal: ให้ insights และ recommendations

1. สรุปจำนวน markers แยกตาม type และ priority
2. ระบุ markers ที่ต้องจัดการด่วน (FIXME/BUG high priority)
3. ระบุ stale markers ที่เก่าเกิน 6 เดือน
4. แนะนำ next steps: `/realize-implementation` สำหรับ implement, `/resolve-errors` สำหรับแก้ FIXME

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้คอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... โดย headers ชัดเจน จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Read-Only

- ไม่เพิ่ม ไม่แก้ ไม่ลบ markers — รายงานเท่านั้น
- ใช้ `/update-todo-md` สำหรับเพิ่ม TODO
- ใช้ `/realize-implementation` สำหรับ implement TODO

### Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- จัดกลุ่มตาม priority: high ก่อน
- ใช้ symbols: 🔴 high, 🟡 medium, 🟢 low, ℹ️ informational

### High Impact Content

- ชี้เน้น FIXME และ BUG ก่อนเสมอ
- ชี้เน้น stale markers ที่เก่าเกิน 6 เดือน
- ถ้ามีมากกว่า 100 markers → แสดงเฉพาะ high และ medium priority
- ไม่แสดง NOTE markers ในรายละเอียดถ้าเกิน 20 รายการ

### Non-Redundancy

- การเพิ่ม TODO อยู่ใน `/update-todo-md` แล้ว
- การ implement TODO อยู่ใน `/realize-implementation` แล้ว
- การค้นหา code อยู่ใน `/scan-codebase` แล้ว

## Expected Outcome

- รายการ TODO/FIXME/HACK ทั้งหมดในตารางที่อ่านง่าย
- จัดประเภทตาม type, priority และ staleness
- ชี้เน้น markers ที่ต้องจัดการด่วน
- ไม่มีการแก้ไข markers — read-only report
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน