---
name: deep-analyze-by-use-scripts
description: วิเคราะห์ codebase ลึกซึ้งด้วย review-codebase CLI, ast-grep napi, Bun scripts และ oxc parser
related:
  - use-scripts
  - use-bun-native-api
  - create-files-in-os-temp
  - deep-analyze
  - deep-report
  - scan-codebase
  - follow-clean-architecture
  - follow-create-cli
  - review-codebase-everythink
  - run-review
  - report-table
  - update-references
  - check-reference
---

## Goal

วิเคราะห์ codebase อย่างลึกซึ้งด้วย `tools/review-codebase` CLI, `tools/analyze` CLI, `@ast-grep/napi` และ scripts พร้อมรองรับ `/review-codebase-everythink` และ `/run-review`

## Scope

ใช้สำหรับ deep analysis ที่ต้องการ data processing ซับซ้อน หรือ metrics calculation ที่ต้อง aggregation ครอบคลุม structural analysis ด้วย AST และ cross-reference analysis — ไม่ใช่การวิเคราะห์ทั่วไป (ใช้ `/deep-analyze`)

## Execute

### 1. Analyze Project

> Goal: วิเคราะห์โปรเจกต์พื้นฐานและสร้าง structural overview

1. ทำ `/analyze-project` เพื่อวิเคราะห์โปรเจกต์พื้นฐาน
2. ถ้าต้องสร้าง scripts สำหรับ analysis → ทำ `/use-scripts` และ `/use-bun-native-api` เพื่อใช้ Bun native APIs
3. สร้าง temp directory สำหรับ output ด้วย `/create-files-in-os-temp` ถ้าต้องการไฟล์ชั่วคราว
4. รัน `bunx ast-grep outline <path>` เพื่อสร้าง structural overview ของ source files
5. ใช้ผลลัพธ์จาก step 1-4 เป็น foundation สำหรับ deep analysis

### 2. Setup Analyze CLI

> Goal: สร้าง `tools/analyze` CLI สำหรับ AST-based analysis

1. ถ้ายังไม่มี `tools/analyze/` → ทำ `/follow-create-cli` เพื่อสร้าง CLI project
2. ทำ `/follow-clean-architecture` เพื่อวางโครงสร้าง `src/domain/`, `src/application/`, `src/adapters/`, `src/presentation/`
3. เลือก stack: Rust ถ้าต้องการ binary performance, Bun ถ้าทีมใช้ TypeScript
4. ทำ `/review-codebase-everythink` เพื่อตรวจสอบคุณภาพก่อน integrate
5. ผสาน CLI เข้ากับ package manifest ด้วย `/follow-tasks`

### 3. Ensure Review CLI Ready

> Goal: ตรวจสอบและอัปเดท review CLI ก่อนรัน analysis

1. ทำ `/review-codebase-everythink` เพื่อให้แน่ใจว่า analyzers ครอบคลุม categories ล่าสุด
2. ถ้า review CLI มีอยู่แล้วและไม่ต้องอัปเดท → ข้ามไป Step 4
3. ถ้าต้องสร้างใหม่ → ทำ `/review-codebase-everythink` ก่อน แล้วกลับมาทำ Step 4

### 4. Run Review CLI And NAPI Analysis

> Goal: รัน review CLI และ `tools/analyze` พร้อมใช้ `@ast-grep/napi` สำหรับ AST-based deep analysis

1. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report เป็น JSON
2. รัน `bun --filter tools-analyze analyze:json` ถ้ามี `tools/analyze` ใน monorepo
3. ใช้ `@ast-grep/napi` สำหรับ programmatic AST analysis ใน scripts — Bun auto-install บน `import`
4. รวบรวม metrics จาก knip, biome, vitest, madge, `ast-grep scan`, `@ast-grep/napi`
5. รัน review CLI และ analyze CLI อีกครั้งหลังเพิ่มหรืออัปเดท analyzer แล้ว process results

### 5. Deep Report Findings

> Goal: จัดรูปแบบผลลัพธ์เป็น deep report ตาราง 7 columns พร้อม deep summary

1. ทำ `/deep-report` เพื่อจัดรูปแบบผลลัพธ์เป็นตาราง 7 columns: Scope, File, Cause, Solutions, Severity, Review Workflow, Evidence
2. จัดกลุ่มตาม `reviewWorkflow` และเรียงลำดับตาม severity: Critical > High > Medium > Low
3. สร้าง deep summary 5 ส่วน: Domain Breakdown, Severity Distribution, Analyzer Changes, False Positive Analysis, Recommended Actions
4. ระบุ action items จัดลำดับตาม priority: quick wins ก่อน, major improvements รองลงมา

### 6. Analyze Cross-References

> Goal: ระบุ workflows และ skills ที่ควรอ้างอิงจากผล deep analysis

1. ระบุ workflow หรือ skill ที่เกี่ยวข้องกับ findings จาก step 5
2. ทำ `/scan-codebase` เพื่อค้นหา references ปัจจุบัน
3. วิเคราะห์ไฟล์ที่ควรมี reference แต่ยังไม่มี: `AGENTS.md`, `README.md`, workflow files, skill files
4. ตรวจสอบว่าไฟล์ที่ควรอ้างอิงมีเงื่อนไขตรงกับ findings หรือไม่

### 7. Apply References And Report

> Goal: เพิ่ม references ที่ขาดและรายงานผลลัพธ์

1. ทำ `/update-references` เพื่อเพิ่ม references ในไฟล์ที่ขาด
2. ทำ `/check-reference` เพื่อตรวจสอบว่า references มีอยู่จริง
3. ทำ `/report-table` เพื่อสรุปผลลัพธ์เป็นตาราง
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review CLI Integration

- ทุกครั้งที่เรียก workflow นี้ ต้องตรวจสอบและรองรับ `/review-codebase-everythink` ก่อนรัน `/run-review`
- ถ้า review CLI ไม่มี → ทำ `/review-codebase-everythink` ก่อนเสมอ
- ถ้า review CLI มีอยู่ → รัน `bun --filter tools-review-codebase review-codebase:json` ได้เลย
- รัน review CLI อีกครั้งหลังเพิ่มหรืออัปเดท analyzer

### 2. Analyze CLI Integration

- ทุกครั้งที่เรียก workflow นี้ ต้องตรวจสอบ `tools/analyze/` ด้วย
- ถ้า `tools/analyze/` ไม่มี → ทำ `/follow-create-cli` ก่อนเสมอ
- `tools/analyze/` ต้อง follow `/follow-clean-architecture`
- ทำ `/review-codebase-everythink` ก่อนใช้งาน

### 3. Ast-Grep NAPI And OXC Parser Usage

- `@ast-grep/napi` เป็น native addon — Bun auto-install บน `import` โดยไม่ต้อง `bun add`
- `@ast-grep/wasm` เป็น WASM version — ใช้ผ่าน CDN ได้: `import { parse } from 'https://esm.sh/@ast-grep/wasm'`
- `oxc-parser` เป็น Rust-based JS/TS parser ทีเร็วมาก — ใช้ผ่าน CDN `https://esm.sh/oxc-parser` หรือ `bun add oxc-parser`
- ถ้าต้องการ AST ละเอียดหรือ speed สูงสุด → ใช้ `oxc-parser` แทน `@ast-grep/napi` หรือใช้คู่กัน
- `parse(Lang.TypeScript, source)` สร้าง `SgRoot`
- `root.find('console.log($A)')` ค้นหา pattern แรกที่ match
- `root.findAll('function $A($$$) { $$$ }')` ค้นหาทุก pattern ที่ match
- `node.getMatch('A')` ดึง single meta variable — `node.getMultipleMatches('ARGS')` ดึง multi meta variable
- `node.range()` ดึง start/end position (0-indexed)
- `node.replace(text)` สร้าง `Edit` object — `node.commitEdits(edits)` apply edits และ return new source string

### 4. Ast-Grep Outline Usage

- `bunx ast-grep outline <file>` — สรุป functions, classes, imports, exports, members
- `bunx ast-grep outline <directory>` — สรุป exported surface ของ directory
- `bunx ast-grep outline <file> --match <symbol> --view expanded` — focus ที่ symbol เฉพาะ
- ไม่มี index building, ไม่มี cross-file analysis — parse ใหม่ทุกครั้ง

### 5. Cross-Reference Quality

- เพิ่ม reference เฉพาะไฟล์ที่เกี่ยวข้องจริง — ไม่เพิ่มในไฟล์ที่ไม่เกี่ยวข้อง
- ถ้า project เป็น monorepo ตรวจสอบทุก workspace
- ตรวจสอบ `AGENTS.md` ใน root และแต่ละ workspace
- ใช้ `/check-reference` หลังเพิ่ม reference

### 6. Output Format

- Review CLI output เป็น JSON หรือ table format
- Analyze CLI output เป็น JSON หรือ table format
- Deep report ใช้ตาราง 7 columns: Scope, File, Cause, Solutions, Severity, Review Workflow, Evidence
- ทุก finding ต้องมี evidence ที่ตรวจสอบได้ — ถ้าเป็น false positive ให้ระบุใน column Cause

## Expected Outcome

- Review CLI JSON report พร้อม metrics ครบถ้วน
- `tools/analyze` CLI พร้อมใช้งานและผ่าน `/review-codebase-everythink`
- Structural overview ด้วย `ast-grep outline`
- Deep report ตาราง 7 columns พร้อม evidence ที่ตรวจสอบได้
- Deep summary 5 ส่วน: Domain Breakdown, Severity Distribution, Analyzer Changes, False Positive Analysis, Recommended Actions
- Cross-references ถูกเพิ่มในไฟล์ที่ขาด ไม่มี broken references
- Action items จัดลำดับตาม priority: quick wins ก่อน, major improvements รองลงมา
