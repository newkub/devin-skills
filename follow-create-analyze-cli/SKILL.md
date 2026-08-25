---
name: follow-create-analyze-cli
description: ตรวจสอบ tools/analyze CLI ก่อน update-create-analyze-cli แก้ไข
---

## Goal

Review `tools/analyze` CLI ก่อนเรียก `update-create-analyze-cli` เพื่อยืนยันว่า workspace setup, Clean Architecture, analyzer structure, exports, และ deterministic behavior ครบถ้วนและถูกต้อง

## Scope

ใช้ก่อนเรียก `update-create-analyze-cli` — ตรวจ `tools/analyze` CLI ทำ review เท่านั้น ไม่แก้ไข CLI code ระหว่าง review

## Execute

### 1. Prepare Context

> Goal: เข้าใจ tools/analyze structure

1. ทำ `/scan-codebase` ใน `tools/analyze/`
2. ตรวจว่า `tools/analyze/` มีอยู่ ถ้าไม่ → flag เป็น critical
3. อ่าน `package.json` ของ `tools/analyze`
4. ตรวจ root `package.json` workspaces รวม `tools-analyze`

### 2. Check Workspace Package

> Goal: ตรวจ workspace package setup

1. ตรวจ `package.json` มี `name: "tools-analyze"`, `type: "module"`
2. ตรวจ scripts: `analyze`, `analyze:json`, `lint`, `typecheck`
3. ตรวจ `exports` field สำหรับ workspace API
4. ตรวจ root `package.json` มี `analyze: bun --filter tools-analyze analyze`
5. บันทึก findings พร้อม evidence

ดู [references/workspace-package.md](references/workspace-package.md) สำหรับ workspace package validation rules

### 3. Check Clean Architecture

> Goal: ตรวจ Clean Architecture structure

1. ตรวจ directories: `src/adapters/`, `src/domain/`, `src/application/`, `src/presentation/`
2. ตรวจ `src/adapters/file-utils.ts` มี `walk`, `readText`
3. ตรวจ `src/adapters/git-grep.ts` มี `gitGrep`, `gitGrepCount`
4. ตรวจ `src/domain/models.ts` มี `CategoryFinding`, `CategoryResult`, `AnalyzeReport`
5. ตรวจ `src/domain/analyzers/` มี `user-facing.ts`, `security.ts`, `backend-data.ts`, `infrastructure.ts`, `code-arch.ts`
6. ตรวจ `src/application/analyze.ts` รวม analyzers
7. ตรวจ `src/presentation/cli.ts` เป็น entry point
8. บันทึก findings พร้อม evidence

ดู [references/clean-architecture.md](references/clean-architecture.md) สำหรับ architecture validation rules

### 4. Check Analyzers

> Goal: ตรวจ analyzer structure และ behavior

1. ตรวจว่าทุก analyzer return `CategoryResult` พร้อม `status`, `score`, `findings`
2. ตรวจว่าทุก analyzer มี `reviewWorkflow` map ไปยัง `/review-codebase-everything` references
3. ตรวจว่า analyzers deterministic: ใช้ `git grep` และ `walk` ที่ stable
4. ตรวจว่า findings ระบุ file/line เสมอ
5. บันทึก findings พร้อม evidence

ดู [references/analyzers.md](references/analyzers.md) สำหรับ analyzer structure และ behavior rules

### 5. Check Exports

> Goal: ตรวจ workspace API exports

1. ตรวจ `src/index.ts` export `runAllAnalyzers`, `createAnalyzePorts`
2. ตรวจ `package.json` `exports` field ชี้ไปยัง `src/index.ts`
3. ตรวจ `process.env.ANALYZE_BASE` ใช้สำหรับ repo root
4. บันทึก findings พร้อม evidence

ดู [references/exports.md](references/exports.md) สำหรับ workspace API exports validation rules

### 6. Check Review Integration

> Goal: ตรวจ integration กับ tools/review

1. ตรวจว่า `tools/review` import จาก `tools-analyze` ผ่าน workspace
2. ตรวจว่าไม่มี duplicated analyzer logic ใน `tools/review`
3. ตรวจว่า `tools-analyze` เป็น dependency ของ `tools/review`
4. บันทึก findings พร้อม evidence

ดู [references/review-integration.md](references/review-integration.md) สำหรับ integration validation rules

### 7. Check Side Effects And Line Count

> Goal: ตรวจ side effects และ line count

1. ตรวจว่าไม่แก้ไข `apps/`, `packages/` source
2. ตรวจว่าทุกไฟล์ไม่เกิน 250 บรรทัด
3. บันทึก findings พร้อม evidence

### 8. Score And Report

> Goal: สรุป review score และ findings

1. คำนวณ review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100)
2. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)
3. ทำ `/report-table` พร้อม findings: Category, Severity, Finding, Evidence, Action
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

ดู [references/scoring.md](references/scoring.md) สำหรับ scoring formula และ grade thresholds
ดู [references/index.md](references/index.md) สำหรับ reference files mapping

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข CLI code ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-create-analyze-cli` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Severity Ratings

- `Critical`: ไม่มี tools/analyze, ขาด workspace setup, analyzers ไม่ทำงาน
- `High`: ขาด Clean Architecture, analyzer ไม่ return CategoryResult, ไม่มี exports
- `Medium`: scripts ขาด, duplicated logic, deterministic ไม่ได้
- `Low`: file names ไม่ kebab-case, line count เกิน
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน

### 3. Scoring

- review score = weighted average ของ findings ทั้งหมด
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้เรียก `update-create-analyze-cli` ก่อนดำเนินการ

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน tools/analyze CLI Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence และ action required
- ยืนยัน workspace setup, Clean Architecture, analyzer structure ครบถ้วน
- ยืนยัน exports และ integration กับ `tools/review` ไม่มี duplicated logic
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
