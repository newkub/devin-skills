---
name: update-create-analyze-cli
description: สร้างหรืออัปเดต tools/analyze CLI สำหรับ deep codebase analysis
allowed-tools:
  - read
  - edit
  - write
  - exec
  - grep
  - find_file_by_name
  - skill
permissions:
  allow:
    - Exec(bun)
    - Exec(moon)
    - Write(tools/analyze)
    - Write(package.json)
    - Write(bun.lock)
  ask:
    - Write(apps/)
    - Write(packages/)
triggers:
  - user
---

## Goal

สร้างหรืออัปเดต `tools/analyze` CLI ให้เป็น deep-analysis engine อิสระ แล้วให้ `tools/review` นำมาใช้ผ่าน Bun workspace เมื่อใช้ `/deep-analyze-by-use-scripts` ให้แก้ไข analyzer logic ใน `tools/analyze` ไม่ใช้ใน `tools/review`

## Scope

- ใช้กับ monorepo ที่มีหรือกำลังสร้าง `tools/review`
- แยก `analyze` ออกจาก `review` ให้เป็น `@booking/tools-analyze`
- ไม่แก้ไข source ของ `apps/` หรือ `packages/`
- ใช้ Bun, TypeScript strict, Clean Architecture

## Execute

### 1. Check Existing Analyze

ตรวจสอบว่ามี `tools/analyze` หรือ analyze code อยู่หรือไม่
> Goal: รู้จุดเริ่มต้นก่อนสร้าง

1. ใช้ `find_file_by_name` หา `tools/analyze/` หรือ analyze scripts ใน `tools/review/`
2. ใช้ `grep` ค้นหา `analyze` ใน `package.json` workspaces
3. ถ้าพบ analyzer code ใน `tools/review` ให้วางแผนย้ายมา `tools/analyze`
4. ถ้าไม่พบ ให้เริ่มสร้างใหม่

### 2. Plan Analyzer Categories

กำหนดหมวดหมู่การ analyze ที่ `tools/review` ต้องการ
> Goal: รู้ว่าจะ expose analyzers อะไรบ้าง

1. ทำตาม `/run-review` หรือ `/review-codebase` เพื่อดู category catalog
2. จัดกลุ่มเป็น 5 domains: `user-facing`, `security-compliance`, `backend-data`, `infrastructure`, `code-architecture`
3. สร้างรายชื่อ analyzer files ที่จะ implement

### 3. Create Workspace Package

สร้าง `tools/analyze` package
> Goal: มี workspace `@booking/tools-analyze` พร้อมใช้

1. สร้าง directory `tools/analyze/`
2. เขียน `tools/analyze/package.json` กำหนด `name: "@booking/tools-analyze"`, `type: "module"`, scripts `analyze`, `analyze:json`, `lint`, `typecheck`
3. เขียน `tools/analyze/tsconfig.json`, `biome.jsonc`, `moon.yml`, `README.md`
4. เพิ่ม `@booking/tools-analyze` เข้า `package.json` workspaces ถ้ายังไม่มี

### 4. Setup Clean Architecture Structure

สร้างโครงสร้าง `src/` ของ `tools/analyze`
> Goal: มีโครงสร้าง Clean Architecture สำหรับ analyzer

1. `src/adapters/file-utils.ts` - walk, readText
2. `src/adapters/git-grep.ts` - gitGrep, gitGrepCount
3. `src/domain/models.ts` - CategoryFinding, CategoryResult, AnalyzeReport
4. `src/domain/analyzers/{user-facing,security,backend-data,infrastructure,code-arch}.ts`
5. `src/application/analyze.ts` - รวม analyzers
6. `src/presentation/cli.ts` - entry point

### 5. Implement Analyzers With Use-Scripts

สร้าง analyzer logic โดยใช้ `/deep-analyze-by-use-scripts`
> Goal: มี analyzers ที่ detect ปัญหาได้จริง

1. ทำตาม `/deep-analyze-by-use-scripts` เพื่อประมวลผล patterns ซับซ้อน
2. ใส่ specific checks ตาม domain ที่กำหนดใน Step 2
3. ให้แต่ละ analyzer return `CategoryResult` กับ `status`, `score`, `findings`
4. กำหนด `reviewWorkflow` ให้ตรงกับ `/review-codebase` references

### 6. Expose Workspace API

ทำให้ `tools/review` import analyzers ได้
> Goal: `tools/review` ใช้ `@booking/tools-analyze` ผ่าน workspace

1. เพิ่ม `exports` ใน `tools/analyze/package.json`
2. สร้าง `src/index.ts` export `runAllAnalyzers`, `createAnalyzePorts`
3. ใช้ `process.env.ANALYZE_BASE` เพื่อให้ analyzer รู้ repo root

### 7. Update tools/review To Consume Analyze

แก้ `tools/review` ให้ import จาก `@booking/tools-analyze`
> Goal: review CLI รวม analyze results

1. แก้ `tools/review/src/domain/analyzers/health-adapter.ts` หรือสร้าง `analyze-adapter.ts` ใหม่
2. เปลี่ยน dynamic imports จาก local `src/health` เป็น `@booking/tools-analyze`
3. เพิ่ม `@booking/tools-analyze` เป็น dependency ของ `tools/review`
4. ลบ analyzer code ที่ duplicate ออกจาก `tools/review/src/health` ถ้ามี

### 8. Update Package Scripts

เพิ่ม scripts ที่จำเป็น
> Goal: เรียกใช้งานได้สะดวก

1. ใน `tools/analyze/package.json` เพิ่ม `analyze`, `analyze:json`
2. ใน root `package.json` เพิ่ม `analyze: bun --filter @booking/tools-analyze analyze`
3. อัปเดต `bun.lock` ด้วย `bun install`

### 9. Validate

ตรวจสอบว่า CLI ทั้งสองรันได้
> Goal: ไม่มี regression

1. รัน `bun --filter @booking/tools-analyze typecheck`
2. รัน `bun --filter @booking/tools-analyze lint`
3. รัน `bun --filter @booking/tools-analyze analyze`
4. รัน `bun --filter @booking/tools-review review`
5. ถ้า fail ให้ทำ `/resolve-errors` แล้ว re-validate (max 3)

### 10. Report

สรุปผลการทำงาน
> Goal: user ทราบสถานะ

1. แสดงไฟล์ที่สร้าง/แก้ไข
2. รายงาน categories ที่ implement
3. ระบุคำสั่งที่ใช้งานได้

## Rules

### 1. Separation Of Concerns

- `tools/analyze` ทำหน้าที่ analyze เท่านั้น
- `tools/review` ทำหน้าที่ orchestrate + report
- ไม่เขียน analyzer logic ซ้ำใน `tools/review`

### 2. Side Effects

- ไม่แก้ไข `apps/`, `packages/`, หรือ database source
- เปลี่ยนแปลงที่เกิดขึ้นใน `tools/analyze`, `tools/review`, `package.json`, `bun.lock`

### 3. Deterministic

- analyzers ต้อง reproduce ได้
- ใช้ `git grep` และ `walk` ที่ stable
- ระบุไฟล์/บรรทัดใน findings เสมอ

## Expected Outcome

- `tools/analyze` เป็น workspace `@booking/tools-analyze` ที่รัน standalone ได้
- `tools/review` import `@booking/tools-analyze` ผ่าน workspace
- `/deep-analyze-by-use-scripts` แก้ไข analyzer logic ใน `tools/analyze`
- `bun --filter @booking/tools-review review` ครอบคลุม analyze categories
