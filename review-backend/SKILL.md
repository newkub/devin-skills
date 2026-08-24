---
name: review-backend
description: Orchestrator สำหรับ backend review ครอบคลุม 14 sub-review workflows แบบ parallel
---

## Goal

Orchestrate backend review ครอบคลุม 14 sub-review workflows แบบ parallel พร้อม validate findings

## Scope

ใช้สำหรับ backend review ทั้งหมด — เรียก sub-review workflows โดยตรง ไม่ทำ review เอง — ไม่รวม frontend, infrastructure, หรือ security reviews

## Execute

### 1. Prepare And Update Rules

เตรียม context และอัปเดต rules ก่อนรัน sub-reviews

> Goal: rules และ analyzers ครอบคลุมล่าสุด พร้อมรัน sub-reviews

1. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในเพื่ออัปเดต ast-grep rules
2. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
3. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้

### 2. Run Backend Sub-Reviews

รัน 14 backend sub-review workflows แบบ parallel

> Goal: ครอบคลุมทุก backend dimension ผ่าน 14 sub-review workflows

1. ทำ `/review-codebase`
2. ทำ `/review-codebase`
3. ถ้า sub-review ไม่เกี่ยวข้องกับ project → ข้าม sub-review นั้น
4. ถ้าพบ critical issues → หยุดและทำ `/validate` ก่อนดำเนินต่อ

### 3. Validate And Report

ตรวจสอบ findings และรายงานผล

> Goal: findings ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues จากทุก sub-review
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Delegation

- Orchestrator เรียก sub-review workflows โดยตรง ไม่ทำ review เอง
- ไม่ duplicate เนื้อหา inline — Skip conditions ของแต่ละ workflow อยู่ใน workflow เอง
- ถ้า project ไม่มี dimension ใด → ข้าม sub-review นั้น

### 2. Update Before Run

- ทำ `/update-create-review-cli` ก่อนรัน sub-reviews เสมอ — `/update-create-review-cli` เรียก `/update-rules` ภายใน
- ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก

### 3. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- Findings และ recommendations จาก 14 backend sub-review workflows
- Issues ที่พบถูก validate ครบถ้วนตาม severity
- Review score ต่อ dimension และ overall
- รายงานในแชทเป็นตารางตาม `/report-table`
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
