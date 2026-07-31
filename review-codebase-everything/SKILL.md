---
name: review-codebase-everything
description: Deep Review codebase ครบทุกมิติ ผ่าน group orchestrators และ category workflows พร้อม validate issues
---

## Goal

Deep Review codebase ครบทุกมิติอย่างลึกซึ้ง ตั้งแต่ foundation ไปจนถึง delivery โดยจัดกลุ่มตามลำดับความสำคัญ และ validate issues ที่พบ

## Scope

ใช้สำหรับ comprehensive Review ครอบคลุมทุก dimension ผ่าน 2 group orchestrators (`review-frontend`, `review-backend`) และ 11 category orchestrator workflows พร้อม validate issues ที่พบ

## Execute

### 1. Prepare And Read Context

ตรวจสอบคุณภาพ codebase และอ่าน context ก่อนเริ่ม review

> Goal: Codebase ผ่าน pre-check และเข้าใจ review dimensions

1. ทำ `/run-check` เพื่อรัน lint, typecheck และ scan — ถ้าพบ errors ให้ทำ `/resolve-errors` ก่อน — ถ้าไม่ผ่าน stop และ report
2. ทำ `/read-related-workflows`, `/follow-agents-md`, ทำ `/update-codebase-health-cli` — ระบุ review dimensions, อ่าน workspace guidelines, และอัปเดต analyzers
3. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server ก่อน review
4. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
5. ทำ `/run-health` เพื่อรัน health CLI และดึง metrics ล่าสุด

### 2. Run Group And Category Reviews

ทำ 2 group orchestrators และ 11 category orchestrator workflows แบบ parallel — group orchestrators เรียก sub-review workflows ภายในตัวเอง ถ้าพบ critical issues ให้หยุดและ validate ก่อนดำเนินต่อ

> Goal: ครอบคลุมทุก dimension ผ่าน 2 group orchestrators และ 11 category orchestrators

1. ทำ `/review-frontend`, `/review-backend`, `/review-code-quality`, `/review-security`, `/review-auth` — `review-frontend` เรียก 15 frontend sub-reviews — `review-backend` เรียก 13 backend sub-reviews — `review-code-quality` เรียก `/review-types`, `/review-naming`, `/review-refactor`, `/review-bug-prone`, `/review-techstack`, `/review-realize-implementation`, `/review-delivery`, `/review-config`, `/review-lib`, `/review-concurrency`, `/review-error-handling`
2. ทำ `/review-infrastructure`, `/review-business`, `/review-delivery`, `/review-platform`, `/review-performance`, `/review-config`, `/review-test`, `/review-formal-verification`
3. ถ้า group, category หรือ sub-review ไม่เกี่ยวข้องกับ project → ข้าม workflow นั้น

### 3. Validate Findings

ตรวจสอบและ validate issues ที่พบจากทุก category

> Goal: Issues ถูก validate ครบถ้วนตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง — จัดลำดับตาม severity: Critical → High → Medium → Low
3. ทำ `/implement-all` สำหรับ issues ที่ต้องการ refactor หรือ realize implementation
4. ทำ `/update-reference` หลังจากแก้ไขไฟล์ — ทำ `/git-commit` เมื่อ validate issues กลุ่มเสร็จ — ถ้า validate fail ให้ทำ `/resolve-errors` ก่อนดำเนินต่อ

### 4. Report And Verify

รายงานผลและวัด health score หลัง validate

> Goal: รายงาน before-after health score และสรุปผลการ review

1. ทำ `/report-codebase-health` เพื่อวัด health score หลัง validate — เปรียบเทียบ before-after score
2. ทำ `/report-format-terminal`, `/report-format-table` — รายงานความคืบหน้าและสรุปผลลัพธ์ before-after
3. ทำ `/report` เพื่อสรุปผลการ review และ validate — ถ้า report fail ให้ retry (max 3 → stop/report)
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Delegation And Scope

- Orchestrator เรียก group orchestrators และ category workflows โดยตรง ไม่ทำ review เอง — Group orchestrators เรียก sub-review workflows ภายในตัวเอง
- ไม่ duplicate เนื้อหา inline sections, group/category workflows หรือ sub-review workflows — Skip conditions ของแต่ละ workflow อยู่ใน workflow เอง
- ถ้า project ไม่มี dimension ใด → ข้าม workflow นั้น

### 2. Execution Governance

- ทำ category orchestrator workflows ตามลำดับ Step 2 ถ้าพบ issues ทำ `/resolve-errors` ก่อนดำเนินต่อ
- ทำ `/update-reference` หลังแต่ละ category orchestrator workflow
- รัน tests หลังแต่ละ improvement และตรวจสอบ coverage ไม่ลดลง — ใช้ `/report-codebase-health` score เป็น before-after metric
- ไม่ข้ามขั้นตอน Review หรือ validate

### 3. Severity And Evidence

- จัดลำดับ issues ตาม severity: Critical → High → Medium → Low — validate Critical ก่อน
- ทุก finding ต้องมี evidence: file path, line number, code snippet, คำอธิบาย
- รายงาน false positives และ mark ว่าไม่ใช่ issue จริง

### 4. Health Score

- คำนวณ health score เป็น percentage (0-100) จาก `/report-codebase-health`
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ category และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- Findings และ recommendations จาก 2 group orchestrators และ 11 category orchestrator workflows
- Issues ที่พบถูก validate ครบถ้วนตาม severity
- Before-after health score ผ่าน `/report-codebase-health`
- รายงานในแชทเป็นตารางตาม `/report` และ `/report-format-table`
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
