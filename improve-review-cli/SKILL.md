---
name: improve-review-cli
description: สร้างหรืออัปเดต `tools/review-codebase` CLI ให้ครอบคลุม features ปัจจุบัน แล้วรัน review จนผ่าน
argument-hint: "[target-or-iteration]"
related:
  - run-review
  - deep-review-codebase
  - deep-review
  - update-create-analyze-cli
  - check-should-update
  - scan-codebase
  - update-project-rules
  - resolve-errors
  - report-table
---

## Goal

สร้างหรืออัปเดต `tools/review-codebase` CLI ให้ครอบคลุม features ปัจจุบัน แล้วรัน review เพื่อวัด metrics ครบทุกมิติ จนผ่านหรือครบ 3 รอบ

## Scope

ใช้กับ monorepo ที่มีหรือกำลังสร้าง `tools/review-codebase` CLI ที project root ครอบคลุม 60+ categories ตาม 5 domains

## Execute

### 1. Prepare And Keep Up With Codebase

> Goal: อัปเดต rules, skills และ CLI ให้ทันสมัยก่อนรัน review

1. ทำ `/scan-codebase` ใน `tools/review-codebase/` ถ้ามีอยู่
2. ทำ `/update-project-rules` เพื่อสร้าง skills ที่ขาดจาก dependencies และ features
3. ทำ `/update-create-analyze-cli` เพื่ออัปเดต `tools/analyze` ให้ครอบคลุม features ปัจจุบัน
4. ทำ `/check-should-update` โดยระบุ target paths: `tools/review-codebase/`, `AGENTS.md`, `apps/*/AGENTS.md`, `apps/website/src/`
5. ถ้าผลเป้น `skip` → ไป Step 8
6. ถ้าผลเป้น `update` หรือ `create` → ดำเนินขั้นตอนถัดไป
7. อ่าน `AGENTS.md`, `.devin/rules.md`, `tools/review-codebase/README.md` ถ้ามี
8. ถ้า `tools/review-codebase` มีอยู่ → ทำ pre-review ตาม `references/review-checklist.md` ตรวจ Clean Architecture, analyzers, CLI interface, package scripts, analyze integration, line count และ evidence
9. ถ้า pre-review score < 70 → ทำ Step 2-7 ก่อน Step 8

### 2. Scan Codebase Features

> Goal: เข้าใจ features ที่มีใน codebase

1. ทำ `/scan-codebase` เพื่อดู structure, tech stack, packages
2. ทำ `/analyze-project` เพื่อดู features หลัก
3. อ่าน `AGENTS.md` และ `docs/project/features.md` ถ้ามี
4. ระบุ features ใหมที่ยังไม่มี analyzer ครอบคลุม

### 3. Update Project Rules

> Goal: มั่นใจว่า skills/rules ครอบคลุม dependencies และ features

1. ทำ `/update-project-rules` เพื่อสร้าง skills ที่ขาดจาก dependencies
2. ตรวจ `AGENTS.md` และ `.devin/rules` อัปเดตตาม features ใหม
3. ถ้ามี skill หรือ rule ขาด → สร้างหรืออัปเดต

### 4. Update Analyze CLI

> Goal: เพิ่ม/อัปเดต analyzers ตาม features ใหม

1. ทำ `/update-create-analyze-cli` เพื่ออัปเดต `tools/analyze`
2. ตรวจ categories ครอบคลุม features ทั้งหมด
3. ถ้า categories น้อยกว่า 60 หรือ feature ใหมไม่มี analyzer → เพิ่ม analyzer

### 5. Create Or Update Workspace Package

> Goal: มี workspace `tools-review-codebase` พร้อมใช้

1. สร้าง `tools/review-codebase/` ถ้ายังไม่มี
2. เขียน `package.json` กำหนด name, scripts `review-codebase`, `review-codebase:json`, `lint`, `typecheck`
3. เขียน `tsconfig.json`, `biome.jsonc`, `README.md`
4. เพิ่ม `tools-review-codebase` เข้า root `package.json` workspaces ถ้ายังไม่มี
5. ใช้ `bun install` เพื่ออัปเดต `bun.lock`

### 6. Setup Clean Architecture

> Goal: โครงสร้าง Clean Architecture สำหรับ review CLI

1. สร้าง `src/adapters/file-utils.ts` สำหรับ `walk`, `readText`, `getRel`
2. สร้าง `src/adapters/git-grep.ts` สำหรับ `gitGrep`, `gitGrepCount`
3. สร้าง `src/domain/models.ts` สำหรับ `CategoryFinding`, `CategoryResult`, `ReviewReport`
4. สร้าง `src/application/review.ts` import `runAllAnalyzers` จาก `tools-analyze`
5. สร้าง `src/presentation/cli.ts` เป็น entry point
6. สร้าง `src/index.ts` export `runReview` หรือ `createReviewPorts`

### 7. Integrate Analyzers

> Goal: ใช้ analyzers จาก `tools-analyze` โดยไม่ duplicate logic

1. import `runAllAnalyzers` จาก `tools-analyze`
2. แปลง `CategoryResult` ของแต่ละ analyzer เป็น `ReviewReport` พร้อม score, grade, domain breakdown
3. กำหนด `reviewWorkflow` map ไปยัง review skills
4. ถ้า analyzer ยัง implement ไม่เสร็จ ให้ comment `// TODO` พร้อมรายละเอียด

### 8. Validate CLI

> Goal: ตรวจสอบว่า CLI รันได้

1. รัน `bun --filter tools-review-codebase lint`
2. รัน `bun --filter tools-review-codebase typecheck`
3. รัน `bun --filter tools-review-codebase review-codebase --help`
4. รัน `bun --filter tools-review-codebase review-codebase`
5. รัน `bun --filter tools-review-codebase review-codebase:json` แล้วตรวจสอบ `reports/review-report.json`
6. ถ้า fail → ทำ `/resolve-errors` แล้ว retry (max 3)

### 9. Run Review And Decide

> Goal: รัน review CLI แล้วตัดสินใจอัปเดตตาม metrics

1. รัน `bun --filter tools-review-codebase review-codebase` สำหรับ table output
2. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อเขียน `reports/review-report.json`
3. บันทึก score, grade, domain breakdown, category coverage, findings count, analyzerErrors, falsePositiveRate
4. ถ้าผลตรงเงื่อนไขใดข้างล่าง → ทำ `/update-create-analyze-cli` แล้วทำ Step 4-8 เพื่อ integrate กลับไป Step 9 ใหม่ (ไม่เกิน 3 รอบ):
   - `categories` น้อยกว่า 60
   - overall `score` ต่ำกว่า 70 หรือ `grade` เป้น `D`/`F`
   - domain ใด `score` ต่ำกว่า 50
   - `analyzerErrors` > 0
   - `falsePositiveRate` สูงกว่า 20%
   - findings จำนวนมากไม่มี `evidence` หรือ `severity` ไม่ชัดเจน
   - `reviewWorkflow` ไม่ map ไปยัง review skills ทีมีอยู่
5. ถ้าหลัง 3 รอบยังไม่ผ่าน → stop และ report

### 10. Report

> Goal: สรุปผล review

1. ทำ `/run-review` สำหรับ table output
2. ใช้ `/report-table` แสดง findings: Category, Finding, Severity, Location, Recommendation
3. ทำ `/suggest-next-action`

## Rules

### 1. CLI-Driven

- ใช้ `tools/review-codebase` CLI เป็นแหล่งหลักของ findings
- ไม่ manual อ่าน references ทีละ dimension
- ถ้า metrics บ่งชี้ให้ update CLI → ต้องทำ Step 4-8 ก่อนรีวิวต่อ

### 2. Metric Triggers

- `categories < 60` → เพิ่ม analyzers
- `score < 70` หรือ `grade D/F` → ปรับปรุง analyzers
- `domain score < 50` → ปรับปรุง domain นั้น
- `analyzerErrors > 0` → แก้ไข analyzer errors
- `falsePositiveRate > 20%` → tune rules

### 3. No Duplicate Logic

- ไม่ duplicate analyzer logic ระหว่าง `tools/analyze` และ `tools/review-codebase`
- ใช้ `runAllAnalyzers` จาก `tools/analyze` ใน `tools/review-codebase`

### 4. Evidence-Based

- ทุก finding ต้องมี evidence (file path, line number, code snippet)
- ไม่เดา ใช้ tools สำหรับ verification
- จัดลำดับ issues ตาม severity: Critical → High → Medium → Low

### 5. Review Independence

- ทำ review/improve CLI เท่านั้น ไม่แก้ไข business logic
- แยก review process จาก fix process
- ใช้ `/deep-review` หรือ `/deep-review-codebase` สำหรับ comprehensive quality gate

### 6. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- `tools/review-codebase` CLI มีอยู่และรันได้ที project root
- Review ทำงานผ่าน `bun run review-codebase`
- Findings ครอบคลุม 60+ categories พร้อม evidence และ severity
- Before-after review score ผ่าน `/run-review`
- ไม่มี analyzer errors
