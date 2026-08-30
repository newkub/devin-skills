---
name: review-codebase-everything
description: รีวิว codebase ครบทุกมิติ พร้อมอัปเดต project rules และ review CLI ให้ทันสมัย
related:
  - update-review-cli
  - update-project-rules
  - update-create-analyze-cli
  - run-review
  - deep-analyze-by-use-scripts
  - deep-review
  - deep-validate
---

## Goal

สร้างหรืออัปเดต `tools/review-codebase` CLI แล้วรัน review เพื่อวัด metrics ของ codebase ครบทุกมิติ โดย keep up กับ codebase features ด้วย `/update-project-rules` และ `/update-review-cli` ถ้า metrics ไม่ผ่านเกณฑ์ให้ update CLI อัตโนมัติและรันใหม่ จนกว่าจะผ่านหรือครบ 3 รอบ

## Scope

ใช้สำหรับ monorepo ที่มีหรือกำลังสร้าง `tools/review-codebase` CLI ที่ project root ครอบคลุม 60+ categories ตาม 5 domains จาก `run-review` พร้อม review score, severity, action items, และ production readiness

## Execute

ดำเนินการ 10 ขั้นตอนต่อไปนี้ รายละเอียด checklist อยู่ใน `references/execution-checklist.md`

### 1. Prepare And Keep Up With Codebase

อัปเดต rules, skills และ `tools/review-codebase` ให้ทันสมัย ทำ pre-review ถ้ามี CLI อยู่ แล้วตัดสินใจว่าจะ update หรือรัน review
- ดูรายละเอียดใน `references/execution-checklist.md` และ `references/review-checklist.md`

### 2. Plan Analyzer Categories

วางแผน categories ตาม 5 domains ของ `run-review` และ map แต่ละ category ไปยัง analyzer file
- ดูรายละเอียดใน `references/execution-checklist.md` และ `references/analyzers.md`

### 3. Create Or Update Workspace Package

สร้างหรืออัปเดต workspace `tools-review-codebase` พร้อม `package.json`, `tsconfig.json`, `biome.jsonc`, และ `README.md`
- ดูรายละเอียดใน `references/execution-checklist.md` และ `references/package-scripts.md`

### 4. Setup Clean Architecture Structure

สร้างโครงสร้าง Clean Architecture สำหรับ `src/domain/`, `src/application/`, `src/adapters/`, `src/presentation/`
- ดูรายละเอียดใน `references/execution-checklist.md` และ `references/clean-architecture.md`

### 5. Integrate Analyzers From tools-analyze

เชื่อมต่อ `tools/review-codebase` กับ `tools-analyze` โดย import `runAllAnalyzers` แล้วแปลงผลเป็น `ReviewReport`
- ดูรายละเอียดใน `references/execution-checklist.md` และ `references/analyze-integration.md`

### 6. Update Package Scripts

เพิ่ม `review-codebase` และ `review-codebase:json` scripts ใน workspace และ root `package.json`
- ดูรายละเอียดใน `references/execution-checklist.md` และ `references/package-scripts.md`

### 7. Validate CLI

รัน `lint`, `typecheck`, `--help`, `review-codebase`, `review-codebase:json` เพื่อตรวจว่า CLI ทำงานได้
- ดูรายละเอียดใน `references/execution-checklist.md` และ `references/cli-interface.md`

### 8. Run Review CLI And Capture Metrics

รัน `review-codebase` แล้วบันทึก before score, grade, domain breakdown, category coverage, findings count, analyzerErrors, falsePositiveRate
- ดูรายละเอียดใน `references/execution-checklist.md`, `references/review-codebase-cli.md`, และ `references/scoring.md`

### 9. Decide Update From Metrics

ถ้า metrics ไม่ผ่านเกณฑ์ ให้เรียก `/update-create-analyze-cli` แล้วทำ Step 3-7 ซ้ำไม่เกิน 3 รอบ
- ดูรายละเอียดใน `references/execution-checklist.md`, `references/review-codebase-cli.md`, และ `references/scoring.md`

### 10. Review Findings And Report

ตรวจสอบ findings, ระบุ severity, root cause, false positives, วัด after score, แล้วรายงานด้วย `/report-table`
- ดูรายละเอียดใน `references/execution-checklist.md`, `references/issue-detection.md`, และ `references/scoring.md`

## Rules

### 1. CLI-Driven Review

- ใช้ `tools/review-codebase` CLI เป็นแหล่งหลักของ findings ไม่ manual อ่าน references ทีละ dimension
- ถ้า metrics บ่งชี้ให้ update CLI → ทำ Step 2-8 ก่อนรีวิวต่อ
- `tools/review-codebase` สร้างที่ project root เท่านั้น ไม่ใช่ `tools/review`

### 2. Metric Triggers

- `categories < 60` → เพิ่ม analyzers ด้วย `/update-create-analyze-cli` Step 5-6
- `score < 70` หรือ `grade D/F` → ปรับปรุง analyzers ด้วย `/update-create-analyze-cli`
- `domain score < 50` → ปรับปรุง domain นั้นใน `tools/analyze`
- `analyzerErrors > 0` → แก้ไข analyzer errors ด้วย `/update-create-analyze-cli`
- `falsePositiveRate > 20%` → tune rules ใน `tools/analyze`
- `reviewWorkflow` ไม่ถูกต้อง → แก้ไข mapping ใน Step 5 ของ `/update-create-analyze-cli`

### 3. Execution Governance

- สร้าง/อัปเดต CLI แล้วรัน review ใหม่ ไม่เกิน 3 รอบ
- ทำ `/update-references` หลังจากแก้ไขไฟล์
- รัน tests หลังแต่ละ improvement

### 4. Evidence-Based Findings

- ทุก finding ต้องมี evidence (file path, line number, code snippet, หรือ section)
- ไม่เดา ใช้ tools สำหรับ verification
- อ้างอิง standards หรือ best practices ที่ตรวจสอบได้
- จัดลำดับ issues ตาม severity: Critical → High → Medium → Low
- แต่ละ finding ต้อง map ไปยัง review workflow ที่เหมาะสม

### 5. Review Independence

- ทำ review เท่านั้น ไม่แก้ไขระหว่าง review
- แยก review process จาก fix process
- ใช้ `/deep-review` สำหรับ comprehensive quality gate review

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

- ใช้ /deep-analyze-by-use-scripts ถ้าจำเป็น
- ใช้ /deep-validate ถ้าจำเป็น

## Expected Outcome

- `tools/review-codebase` CLI มีอยู่และรันได้ที่ project root
- Review ทำงานผ่าน `bun run review-codebase` ไม่ manual อ่าน references ทีละ dimension
- Findings จาก CLI ครอบคลุม 60+ categories พร้อม evidence และ severity
- ทุก finding มี severity rating, root cause และ actionable recommendation
- Before-after review score ผ่าน `/run-review`
- Issues ถูก validate และจัดลำดับตาม severity
- Codebase ปรับปรุงตาม findings และลด redundancy โดยไม่มี regression
- รายงานในแชทเป็นตารางพร้อม action ถัดไป
