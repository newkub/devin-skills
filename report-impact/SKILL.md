---
name: report-impact
description: "วิเคราะห์ผลกระทบของการเปลี่ยนแปลง: ไฟล์ที่กระทบ, ผู้ใช้, breaking changes"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - report-format-table
  - report-git-diff
  - scan-codebase
  - rename
  - suggest-next-action
---

## Goal

วิเคราะห์ผลกระทบของการเปลี่ยนแปลงใน codebase: ไฟล์ที่กระทบ, consumers, breaking changes และความเสี่ยง

## Scope

ใช้สำหรับการวิเคราะห์ impact ก่อนหรือหลังการเปลี่ยนแปลง — ไม่รวมการแก้ไข code (ใช้ `/resolve-errors` หรือ `/refactor` สำหรับการแก้ไข)

## Execute

### 1. Identify Change Scope

ระบุขอบเขตของการเปลี่ยนแปลง

> Goal: รู้ว่าจะวิเคราะห์ impact ของการเปลี่ยนแปลงใด

1. ระบุการเปลี่ยนแปลงที่ต้องการวิเคราะห์:
   - Before change: วิเคราะห์จาก plan หรือ proposed changes
   - After change: วิเคราะห์จาก `git diff`
2. ถ้าวิเคราะห์หลังเปลี่ยน → ทำ `/report-git-diff` เพื่อดู changes
3. ระบุไฟล์ที่เปลี่ยนแปลงและประเภทการเปลี่ยนแปลง
4. ระบุ symbols ที่เปลี่ยนแปลง: functions, classes, types, exports

### 2. Find Affected Files

ค้นหาไฟล์ที่กระทบจากการเปลี่ยนแปลง

> Goal: รู้ไฟล์ทั้งหมดที่กระทบจากการเปลี่ยนแปลง

1. ทำ `/scan-codebase` เพื่อค้นหา call sites ของ symbols ที่เปลี่ยนแปลง
2. ค้นหา imports ของ modules ที่เปลี่ยนแปลง
3. ค้นหา references ของ types ที่เปลี่ยนแปลง
4. ค้นหา tests ที่เกี่ยวข้องกับ symbols ที่เปลี่ยนแปลง
5. ระบุไฟล์ที่กระทบทั้ง direct และ indirect

### 3. Identify Breaking Changes

ระบุ breaking changes

> Goal: รู้การเปลี่ยนแปลงที่ไม่ backward compatible

1. ระบุ API changes: signature changes, removed exports, renamed symbols (ใช้ `/rename` สำหรับ rename)
2. ระบุ type changes: changed types, removed types, narrowed types
3. ระบุ behavior changes: changed return values, changed side effects
4. ระบุ config changes: changed config format, removed options
5. ระบุ database changes: schema changes, migration required

### 4. Assess Risk

ประเมินความเสี่ยงของการเปลี่ยนแปลง

> Goal: รู้ระดับความเสี่ยงและส่วนที่ต้องระวัง

1. จัดประเภทความเสี่ยงต่อไฟล์: high (direct dependency), medium (indirect), low (unlikely affected)
2. ระบุส่วนของระบบที่กระทบ: frontend, backend, database, API, config
3. ประเมินความเสี่ยงต่อผู้ใช้: end users, developers, operators
4. ระบุความเสี่ยงด้าน performance, security, compatibility

### 5. Format Report

จัดรูปแบบรายงานให้อ่านง่าย

> Goal: รายงานครบ อ่านง่าย มี insights

1. ทำ `/report-format-table` เพื่อจัดรูปแบบเป็นตาราง
2. แสดงผลตามลำดับ: Summary → Affected Files → Breaking Changes → Risk Assessment
3. กำหนด columns สำหรับตาราง affected files:
   - No. ลำดับ
   - File ชื่อไฟล์
   - Impact direct / indirect
   - Risk high / medium / low
   - Reason เหตุผลที่กระทบ
4. แยกตาราง: Affected Files, Breaking Changes, Risk Assessment

### 6. Provide Insights

ให้ insights และ recommendations

> Goal: ผู้อ่านรู้ว่าต้องระวังอะไรและทำอะไรต่อ

1. สรุปจำนวนไฟล์ที่กระทบแยกตามระดับ
2. ระบุ breaking changes ที่ต้อง migration plan
3. ระบุ tests ที่ต้องอัปเดต
4. แนะนำ next steps: อัปเดต consumers, เขียน migration guide, รัน tests

## Rules


### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-format-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-format-terminal` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Read-Only

- ไม่แก้ไข code — รายงานเท่านั้น
- ใช้ `/resolve-errors` หรือ `/refactor` สำหรับการแก้ไข
- ใช้ `/resolve-errors` สำหรับการแก้ errors
- ใช้ `/rename` สำหรับ rename code identifiers

### Output Format

- ทำ `/report-format-table` สำหรับจัดรูปแบบผลลัพธ์
- แยกตาราง: Affected Files, Breaking Changes, Risk Assessment
- ใช้ symbols: 🔴 high risk, 🟡 medium risk, 🟢 low risk

### High Impact Content

- ชี้เน้น breaking changes ก่อนเสมอ
- ชี้เน้น high risk files ที่กระทบโดยตรง
- ถ้ามีมากกว่า 50 affected files → แสดงเฉพาะ high และ medium risk
- ชี้เน้น tests ที่ต้องอัปเดต

### Non-Redundancy

- รายละเอียด git diff อยู่ใน `/report-git-diff` แล้ว
- รายละเอียด code search อยู่ใน `/scan-codebase` แล้ว
- การแก้ไข code อยู่ใน `/resolve-errors` และ `/refactor` แล้ว

## Expected Outcome

- รายการไฟล์ที่กระทบพร้อมระดับความเสี่ยง
- ระบุ breaking changes ที่ต้อง migration
- ระบุ tests ที่ต้องอัปเดต
- มี recommendations ชัดเจน
- ไม่มีการแก้ไข code — read-only report
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
