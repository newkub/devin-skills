---
name: update-create-analyze-cli
description: ตรวจสอบและสร้าง/อัปเดต tools/analyze CLI สำหรับ deep codebase analysis
---

## Goal

Review แล้วสร้างหรืออัปเดต `tools/analyze` CLI ให้เป็น deep-analysis engine อิสระ แล้วให้ `tools/review-codebase` นำมาใช้ผ่าน Bun workspace เมื่อใช้ `/deep-analyze-by-use-scripts` ให้แก้ไข analyzer logic ใน `tools/analyze` ไม่ใช้ใน `tools/review-codebase`

## Scope

- ใช้กับ monorepo ที่มีหรือกำลังสร้าง `tools/review-codebase`
- แยก `analyze` ออกจาก `review` ให้เป็น `tools-analyze`
- ไม่แก้ไข source ของ `apps/` หรือ `packages/`
- ใช้ Bun, TypeScript strict, Clean Architecture

## Execute

### 1. Review Existing Analyze CLI

> Goal: ตรวจสอบ `tools/analyze` ก่อน update

1. ทำ `/scan-codebase` ใน `tools/analyze/`
2. ตรวจว่า `tools/analyze/` มีอยู่ ถ้าไม่ → flag เป็น critical
3. อ่าน `package.json` ของ `tools/analyze`
4. ตรวจ root `package.json` workspaces รวม `tools-analyze`
5. ตรวจ `package.json` มี `name: "tools-analyze"`, `type: "module"`
6. ตรวจ scripts: `analyze`, `analyze:json`, `lint`, `typecheck`
7. ตรวจ `exports` field สำหรับ workspace API
8. ตรวจ directories: `src/adapters/`, `src/domain/`, `src/application/`, `src/presentation/`
9. ตรวจ `src/domain/analyzers/` มี `user-facing.ts`, `security.ts`, `backend-data.ts`, `infrastructure.ts`, `code-arch.ts`
10. ตรวจว่าทุก analyzer return `CategoryResult` พร้อม `status`, `score`, `findings`
11. ตรวจ `tools/review-codebase` import จาก `tools-analyze` ผ่าน workspace ไม่ duplicate logic
12. บันทึก findings พร้อม evidence คำนวณ score และ grade
13. ถ้า score < 70 → ดำเนินการ Step 2 ต่อไป ถ้า score >= 70 → ไป Step 8

### 2. Check Existing Analyze

> Goal: รู้จุดเริ่มต้นก่อนสร้าง

1. ใช้ `find_file_by_name` หา `tools/analyze/` หรือ analyze scripts ใน `tools/review-codebase/`
2. ใช้ `grep` ค้นหา `analyze` ใน `package.json` workspaces
3. ถ้าพบ analyzer code ใน `tools/review-codebase` ให้วางแผนย้ายมา `tools/analyze`
4. ถ้าไม่พบ ให้เริ่มสร้างใหม่

### 3. Plan Analyzer Categories

> Goal: รู้ว่าจะ expose analyzers อะไรบ้าง

1. ทำตาม `run-review` หรือ `update-review-codebase-cli-and-run` เพื่อดู category catalog
2. จัดกลุ่มเป็น 5 domains: `user-facing`, `security-compliance`, `backend-data`, `infrastructure`, `code-architecture`
3. สร้างรายชื่อ analyzer files ที่จะ implement

### 4. Create Workspace Package

> Goal: มี workspace `tools-analyze` พร้อมใช้

1. สร้าง directory `tools/analyze/`
2. เขียน `tools/analyze/package.json` กำหนด `name: "tools-analyze"`, `type: "module"`, scripts `analyze`, `analyze:json`, `lint`, `typecheck`
3. เขียน `tools/analyze/tsconfig.json`, `biome.jsonc`, `moon.yml`, `README.md`
4. เพิ่ม `tools-analyze` เข้า `package.json` workspaces ถ้ายังไม่มี

### 5. Setup Clean Architecture Structure

> Goal: มีโครงสร้าง Clean Architecture สำหรับ analyzer

1. `src/adapters/file-utils.ts` - walk, readText
2. `src/adapters/git-grep.ts` - gitGrep, gitGrepCount
3. `src/domain/models.ts` - CategoryFinding, CategoryResult, AnalyzeReport
4. `src/domain/analyzers/{user-facing,security,backend-data,infrastructure,code-arch}.ts`
5. `src/application/analyze.ts` - รวม analyzers
6. `src/presentation/cli.ts` - entry point

### 6. Implement Analyzers With Use-Scripts

> Goal: มี analyzers ที่ detect ปัญหาได้จริง

1. ทำตาม `/deep-analyze-by-use-scripts` เพื่อประมวลผล patterns ซับซ้อน
2. ใส่ specific checks ตาม domain ที่กำหนดใน Step 3
3. ให้แต่ละ analyzer return `CategoryResult` กับ `status`, `score`, `findings`
4. กำหนด `reviewWorkflow` ให้ตรงกับ `update-review-codebase-cli-and-run` references

### 7. Expose Workspace API And Update tools/review-codebase

> Goal: `tools/review-codebase` ใช้ `tools-analyze` ผ่าน workspace

1. เพิ่ม `exports` ใน `tools/analyze/package.json`
2. สร้าง `src/index.ts` export `runAllAnalyzers`, `createAnalyzePorts`
3. ใช้ `process.env.ANALYZE_BASE` เพื่อให้ analyzer รู้ repo root
4. แก้ `tools/review-codebase` ให้ import จาก `tools-analyze`
5. เปลี่ยน dynamic imports จาก local `src/health` เป็น `tools-analyze`
6. เพิ่ม `tools-analyze` เป็น dependency ของ `tools/review-codebase`
7. ลบ analyzer code ที่ duplicate ออกจาก `tools/review-codebase` ถ้ามี

### 8. Update Package Scripts

> Goal: เรียกใช้งานได้สะดวก

1. ใน `tools/analyze/package.json` เพิ่ม `analyze`, `analyze:json`
2. ใน root `package.json` เพิ่ม `analyze: bun --filter tools-analyze analyze`
3. อัปเดต `bun.lock` ด้วย `bun install`

### 9. Validate

> Goal: ไม่มี regression

1. รัน `bun --filter tools-analyze typecheck`
2. รัน `bun --filter tools-analyze lint`
3. รัน `bun --filter tools-analyze analyze`
4. รัน `bun --filter tools-review-codebase review-codebase`
5. ถ้า fail ให้ทำ `/resolve-errors` แล้ว re-validate (max 3)

### 10. Report

> Goal: user ทราบสถานะ

1. แสดงไฟล์ที่สร้าง/แก้ไข
2. รายงาน categories ที่ implement
3. ระบุคำสั่งที่ใช้งานได้

## Rules

### 1. Separation Of Concerns

- `tools/analyze` ทำหน้าที่ analyze เท่านั้น
- `tools/review-codebase` ทำหน้าที่ orchestrate + report
- ไม่เขียน analyzer logic ซ้ำใน `tools/review-codebase`

### 2. Side Effects

- ไม่แก้ไข `apps/`, `packages/`, หรือ database source
- เปลี่ยนแปลงที่เกิดขึ้นใน `tools/analyze`, `tools/review-codebase`, `package.json`, `bun.lock`

### 3. Deterministic

- analyzers ต้อง reproduce ได้
- ใช้ `git grep` และ `walk` ที่ stable
- ระบุไฟล์/บรรทัดใน findings เสมอ

### 4. Review And Score

- ทำ review ก่อนแก้ไข บันทึก findings พร้อม evidence
- คำนวณ review score ตาม severity: Critical=0, High=25, Medium=50, Low=75, Info=100
- ถ้า score < 70 → ต้อง update ก่อนดำเนินการ

## Expected Outcome

- `tools/analyze` เป็น workspace `tools-analyze` ที่รัน standalone ได้
- `tools/review-codebase` import `tools-analyze` ผ่าน workspace
- `/deep-analyze-by-use-scripts` แก้ไข analyzer logic ใน `tools/analyze`
- `bun --filter tools-review-codebase review-codebase` ครอบคลุม analyze categories
