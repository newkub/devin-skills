---
name: update-review-cli
description: สร้างหรืออัปเดต tools/review-codebase CLI ครบถ้วน
argument-hint: "[target-or-iteration]"
related:
  - run-review
  - improve-review-cli
  - update-create-analyze-cli
  - report-table
  - resolve-errors
  - suggest-next-action
  - ask-me
---

## Goal

สร้างหรืออัปเดต `tools/review-codebase` CLI แล้วรัน review เพื่อวัด metrics ของ codebase ครบทุกมิติ โดย keep up กับ codebase features แล้วรัน review ใหม่ถ้า metrics ไม่ผ่านเกณฑ์ จนกว่าจะผ่านหรือครบ 3 รอบ

## Scope

ใช้สำหรับ monorepo ที่มีหรือกำลังสร้าง `tools/review-codebase` CLI ที project root ครอบคลุม 60+ categories ตาม 5 domains จาก `run-review` พร้อม review score, severity, action items และ production readiness

## Execute

### 1. Prepare And Keep Up With Codebase

> Goal: อัปเดต rules, skills และ CLI ให้ทันสมัยก่อนรัน review

1. ทำ `/scan-codebase` ใน `tools/review-codebase/` ถ้ามีอยู่
2. ทำ `/update-project-rules` เพื่อสร้าง skills ทีขาดจาก dependencies และ features
3. ทำ `/update-create-analyze-cli` เพื่ออัปเดต `tools/analyze` ให้ครอบคลุม features ปัจจุบัน
4. ทำ `/check-should-update` โดยระบุ target paths: `tools/review-codebase/`, `AGENTS.md`, `apps/*/AGENTS.md`, `apps/website/src/`
5. ถ้าผลเป้น `skip` → ไป Step 9
6. ถ้าผลเป้น `update` หรือ `create` → ไป Step 2
7. อ่าน `AGENTS.md`, `.devin/rules.md`, `tools/review-codebase/README.md` ถ้ามี
8. ถ้า `tools/review-codebase` มีอยู่ → ทำ pre-review ตาม `references/review-checklist.md` ตรวจ Clean Architecture, analyzers, CLI interface, package scripts, analyze integration, line count และ evidence
9. ถ้า pre-review score < 70 → ทำ Step 2-8 ก่อน Step 9

### 2. Plan Analyzer Categories

> Goal: รู้ว่าจะ expose analyzers อะไรบ้าง

1. ทำตาม `/run-review` เพื่อดู 60+ categories จัดกลุ่มตาม 5 domains
2. สร้าง mapping แต่ละ category ไปยัง analyzer file ใน `src/domain/analyzers/`
3. ระบุ analyzers ทีมีอยู่, ต้องสร้างใหม่ หรือต้องอัปเดท
4. ดู `references/review-codebase-cli.md` สำหรับ category structure

### 3. Create Or Update Workspace Package

> Goal: มี workspace `tools-review-codebase` พร้อมใช้

1. สร้าง directory `tools/review-codebase/` ถ้ายังไม่มี
2. เขียน `package.json` กำหนด `name: "tools-review-codebase"`, `type: "module"`, scripts `review-codebase`, `review-codebase:json`, `lint`, `typecheck`
3. เขียน `tsconfig.json`, `biome.jsonc`, `README.md`
4. เพิ่ม `tools-review-codebase` เข้า root `package.json` workspaces ถ้ายังไม่มี
5. ใช้ `bun install` เพื่ออัปเดต `bun.lock`

### 4. Setup Clean Architecture Structure

> Goal: มีโครงสร้าง Clean Architecture สำหรับ review CLI

1. สร้าง `src/adapters/file-utils.ts` สำหรับ `walk`, `readText`, `getRel`
2. สร้าง `src/adapters/git-grep.ts` สำหรับ `gitGrep`, `gitGrepCount`
3. สร้าง `src/domain/models.ts` สำหรับ `CategoryFinding`, `CategoryResult`, `ReviewReport`
4. สร้าง `src/application/review.ts` สำหรับ import `runAllAnalyzers` จาก `tools-analyze` แล้วเพิ่ม review scoring, grading และ report
5. สร้าง `src/presentation/cli.ts` เป้น entry point
6. สร้าง `src/index.ts` export `runReview`, `createReviewPorts`

### 5. Integrate Analyzers From tools-analyze

> Goal: `tools/review-codebase` ใช้ analyzers จาก `tools/analyze` โดยไม่ duplicate logic

1. ทำตาม `/deep-analyze-by-use-scripts` เพื่อประมวลผล patterns ซับซ้อนใน `tools/analyze` ไม่ใช่ใน `tools/review-codebase`
2. import `runAllAnalyzers` จาก `tools-analyze` ใน `src/application/review.ts`
3. แปลงผล `CategoryResult` ของแต่ละ analyzer เป้น `ReviewReport` พร้อม score, grade, domain breakdown
4. กำหนด `reviewWorkflow` map ไปยัง review skills ทีเกี่ยวข้อง
5. ถ้า analyzer ยัง implement ไม่เสร็จ ให้ comment `// TODO` พร้อมรายละเอียดใน `tools/analyze`

### 6. Update Package Scripts

> Goal: เรียกใช้งาน `tools/review-codebase` ได้สะดวก

1. ใน `tools/review-codebase/package.json` เพิ่ม `review-codebase` และ `review-codebase:json`
2. ใน root `package.json` เพิ่ม `review-codebase` และ `review-codebase:json` ชี้ไป `bun --filter tools-review-codebase ...`
3. ทำ `/follow-tasks` เพื่อเพิ่ม `review-codebase` scripts ตาม tech stack
4. ถ้ามี script ใหม่ทีต้อง orchestration → register task ใน `turbo.json`

### 7. Validate CLI

> Goal: ตรวจสอบว่า `tools/review-codebase` รันได้ก่อน loop

1. รัน `bun --filter tools-review-codebase lint`
2. รัน `bun --filter tools-review-codebase typecheck`
3. รัน `bun --filter tools-review-codebase review-codebase --help`
4. รัน `bun --filter tools-review-codebase review-codebase`
5. รัน `bun --filter tools-review-codebase review-codebase:json` แล้วตรวจสอบ `reports/review-report.json`
6. ถ้า fail → ทำ `/resolve-errors` แล้ว re-validate (max 3)

### 8. Run Review CLI And Capture Metrics

> Goal: รัน review CLI เพื่อวัด before score และ metrics

1. ทำ `/run-review` สำหรับ table output หรือรัน `bun --filter tools-review-codebase review-codebase`
2. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อเขียน JSON ลง `reports/review-report.json`
3. บันทึก before score, grade, domain breakdown, category coverage, findings count, analyzerErrors, falsePositiveRate
4. ถ้า CLI error → ทำ Step 5-7 แล้วกลับมา Step 8

### 9. Decide Update From Metrics

> Goal: ตัดสินใจอัปเดต CLI อัตโนมัติตาม metrics

ถ้า metrics ตรงเงื่อนไขใดข้างล่าง → ทำ `/update-create-analyze-cli` แล้วทำ Step 3-7 เพื่อ integrate กลับไป Step 8 (ไม่เกิน 3 รอบ):

1. `categories` น้อยกว่า 60
2. overall `score` ต่ำกว่า 70 หรือ `grade` เป้น `D`/`F`
3. domain ใด `score` ต่ำกว่า 50
4. `analyzerErrors` > 0
5. `falsePositiveRate` สูงกว่า 20%
6. findings จำนวนมากไม่มี `evidence` หรือ `severity` ไม่ชัดเจน
7. `reviewWorkflow` ไม่ map ไปยัง review skills ทีมีอยู่
8. `tools/review-codebase/package.json` หรือ `src/presentation/cli.ts` ไม่อยู่

ถ้าทุก metrics ผ่านหรือไม่มีการเปลี่ยนแปลงหลัง 3 รอบ → ไป Step 10

### 10. Review Findings And Report

> Goal: รายงานผล review พร้อม severity และ recommendations

1. ตรวจสอบความถูกต้อง คุณภาพ และความเหมาะสมของแต่ละ finding
2. ใช้ `grep` หรือ `ast-grep` สำหรับ pattern-based checks ถ้าเกี่ยวข้อง
3. ระบุ severity: Critical → High → Medium → Low
4. ระบุ root cause และ false positives ทีพบ
5. ทำ `/deep-validate` เพื่อ validate findings
6. ทำ `/run-review` เพื่อวัด after score
7. ทำ `/report-table` แสดง findings: Category, Finding, Severity, Location, Recommendation
8. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. CLI-Driven Review

- ใช้ `tools/review-codebase` CLI เป้นแหล่งหลักของ findings ไม่ manual อ่าน references ทีละ dimension
- ถ้า metrics บ่งชี้ให้ update CLI → ต้องทำ Step 2-8 ก่อนรีวิวต่อ
- `tools/review-codebase` สร้างที project root เท่านั้น ไม่ใช่ `tools/review`

### 2. Metric Triggers

- `categories < 60` → เพิ่ม analyzers ด้วย `/update-create-analyze-cli` Step 5-6
- `score < 70` หรือ `grade D/F` → ปรับปรุง analyzers ด้วย `/update-create-analyze-cli`
- `domain score < 50` → ปรับปรุง domain นั้นใน `tools/analyze`
- `analyzerErrors > 0` → แก้ไข analyzer errors
- `falsePositiveRate > 20%` → tune rules ใน `tools/analyze`
- `reviewWorkflow` ไม่ถูกต้อง → แก้ไข mapping ใน Step 5

### 3. Execution Governance

- สร้าง/อัปเดต CLI แล้วรัน review ใหม่ ไม่เกิน 3 รอบ
- ทำ `/update-references` หลังจากแก้ไขไฟล์
- รัน tests หลังแต่ละ improvement

### 4. Evidence-Based Findings

- ทุก finding ต้องมี evidence (file path, line number, code snippet หรือ section)
- ไม่เดา ใช้ tools สำหรับ verification
- อ้างอิง standards หรือ best practices ทีตรวจสอบได้
- จัดลำดับ issues ตาม severity: Critical → High → Medium → Low
- แต่ละ finding ต้อง map ไปยัง review workflow ทีเหมาะสม

### 5. Review Independence

- ทำ review เท่านั้น ไม่แก้ไขระหว่าง review
- แยก review process จาก fix process
- ใช้ `/deep-review` สำหรับ comprehensive quality gate review

### 6. Formatting

- ห้ามใช้ `**` ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป้นตารางด้วย `/report-table`

## Expected Outcome

- `tools/review-codebase` CLI มีอยู่และรันได้ที project root
- Review ทำงานผ่าน `bun run review-codebase` ไม่ manual อ่าน references ทีละ dimension
- Findings จาก CLI ครอบคลุม 60+ categories พร้อม evidence และ severity
- ทุก finding มี severity rating, root cause และ actionable recommendation
- Before-after review score ผ่าน `/run-review`
- Issues ถูก validate และจัดลำดับตาม severity
- Codebase ปรับปรุงตาม findings และลด redundancy โดยไม่มี regression
- รายงานในแชทเป้นตารางพร้อม action ถัดไป
