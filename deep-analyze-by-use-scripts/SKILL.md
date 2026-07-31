---
name: deep-analyze-by-use-scripts
description: วิเคราะห์ codebase ด้วย health CLI, ast-grep และ scripts พร้อมรองรับ /update-codebase-health-cli
---

## Goal

วิเคราะห์ codebase อย่างลึกซึ้งด้วย `tools/health` CLI, `@ast-grep/napi` และ scripts พร้อมรองรับ `/update-codebase-health-cli` และ run health

## Scope

ใช้สำหรับ deep analysis ที่ต้องการ data processing ซับซ้อน หรือ metrics calculation ที่ต้อง aggregation ครอบคลุม structural analysis ด้วย AST และ cross-reference analysis — ไม่ใช่การวิเคราะห์ทั่วไป (ใช้ `/deep-analyze`)

## Execute

### 1. Analyze Project

วิเคราะห์โปรเจกต์พื้นฐานและสร้าง structural overview

> Goal: มี foundation สำหรับ deep analysis

1. ทำ `/analyze-project` เพื่อวิเคราะห์โปรเจกต์พื้นฐาน
2. รัน `bunx ast-grep outline <path>` เพื่อสร้าง structural overview ของ source files
3. ใช้ผลลัพธ์จาก step 1-2 เป็น foundation สำหรับ deep analysis

### 2. Ensure Health CLI Ready

ตรวจสอบและอัปเดท health CLI ก่อนรัน analysis

> Goal: Health CLI พร้อมรันและครอบคลุม categories ล่าสุด

1. ทำ `/update-codebase-health-cli` เพื่อให้แน่ใจว่า analyzers ครอบคลุม categories ล่าสุด
2. ถ้า health CLI มีอยู่แล้วและไม่ต้องอัปเดท → ข้ามไป Step 3
3. ถ้าต้องสร้างใหม่ → ทำ `/update-codebase-health-cli` ก่อน แล้วกลับมาทำ Step 3

### 3. Run Health CLI And NAPI Analysis

รัน health CLI และใช้ `@ast-grep/napi` สำหรับ AST-based deep analysis

> Goal: มี metrics และ AST analysis ครบสำหรับ deep report

1. รัน `bun --filter @booking/tools-health health:json` เพื่อดึง health report เป็น JSON
2. ใช้ `@ast-grep/napi` สำหรับ programmatic AST analysis ใน scripts — Bun auto-install บน `import`
3. รวบรวม metrics จาก knip, biome, vitest, madge, `ast-grep scan`, `@ast-grep/napi`
4. รัน `bun --filter @booking/tools-health health:json` อีกครั้งหลังเพิ่ม analyzer และ process results

### 4. Deep Report Findings

จัดรูปแบบผลลัพธ์เป็น deep report ตาราง 7 columns พร้อม deep summary

> Goal: Deep report ที่ actionable และตรวจสอบได้

1. ทำ `/deep-report` เพื่อจัดรูปแบบผลลัพธ์เป็นตาราง 7 columns: Scope, File, Cause, Solutions, Severity, Review Workflow, Evidence
2. จัดกลุ่มตาม `reviewWorkflow` และเรียงลำดับตาม severity: Critical > High > Medium > Low
3. สร้าง deep summary 5 ส่วน: Domain Breakdown, Severity Distribution, Analyzer Changes, False Positive Analysis, Recommended Actions
4. ระบุ action items จัดลำดับตาม priority: quick wins ก่อน, major improvements รองลงมา

### 5. Analyze Cross-References

ระบุ workflows และ skills ที่ควรอ้างอิงจากผล deep analysis

> Goal: รู้ว่า findings จาก deep analysis ควรถูกอ้างอิงในไฟล์ใดบ้าง

1. ระบุ workflow หรือ skill ที่เกี่ยวข้องกับ findings จาก step 4
2. ทำ `/scan-codebase` เพื่อค้นหา references ปัจจุบัน
3. วิเคราะห์ไฟล์ที่ควรมี reference แต่ยังไม่มี: `AGENTS.md`, `README.md`, workflow files, skill files
4. ตรวจสอบว่าไฟล์ที่ควรอ้างอิงมีเงื่อนไขตรงกับ findings หรือไม่

### 6. Apply References And Report

เพิ่ม references ที่ขาดและรายงานผลลัพธ์

> Goal: References ครบถ้วน ไม่มี broken references

1. ทำ `/update-reference` เพื่อเพิ่ม references ในไฟล์ที่ขาด
2. ทำ `/check-reference` เพื่อตรวจสอบว่า references มีอยู่จริง
3. ทำ `/report-format-table` เพื่อสรุปผลลัพธ์เป็นตาราง
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Health CLI Integration

- ทุกครั้งที่เรียก workflow นี้ ต้องตรวจสอบและรองรับ `/update-codebase-health-cli` ก่อนรัน health
- ถ้า health CLI ไม่มี → ทำ `/update-codebase-health-cli` ก่อนเสมอ
- ถ้า health CLI มีอยู่ → รัน `bun --filter @booking/tools-health health:json` ได้เลย
- รัน health CLI อีกครั้งหลังเพิ่มหรืออัปเดท analyzer

### 2. Ast-Grep NAPI Usage

- `@ast-grep/napi` เป็น native addon — Bun auto-install บน `import` โดยไม่ต้อง `bun add`
- `@ast-grep/wasm` เป็น WASM version — ใช้ผ่าน CDN ได้: `import { parse } from 'https://esm.sh/@ast-grep/wasm'`
- `parse(Lang.TypeScript, source)` สร้าง `SgRoot`
- `root.find('console.log($A)')` ค้นหา pattern แรกที่ match
- `root.findAll('function $A($$$) { $$$ }')` ค้นหาทุก pattern ที่ match
- `node.getMatch('A')` ดึง single meta variable — `node.getMultipleMatches('ARGS')` ดึง multi meta variable
- `node.range()` ดึง start/end position (0-indexed)
- `node.replace(text)` สร้าง `Edit` object — `node.commitEdits(edits)` apply edits และ return new source string

### 3. Ast-Grep Outline Usage

- `bunx ast-grep outline <file>` — สรุป functions, classes, imports, exports, members
- `bunx ast-grep outline <directory>` — สรุป exported surface ของ directory
- `bunx ast-grep outline <file> --match <symbol> --view expanded` — focus ที่ symbol เฉพาะ
- ไม่มี index building, ไม่มี cross-file analysis — parse ใหม่ทุกครั้ง

### 4. Cross-Reference Quality

- เพิ่ม reference เฉพาะไฟล์ที่เกี่ยวข้องจริง — ไม่เพิ่มในไฟล์ที่ไม่เกี่ยวข้อง
- ถ้า project เป็น monorepo ตรวจสอบทุก workspace
- ตรวจสอบ `AGENTS.md` ใน root และแต่ละ workspace
- ใช้ `/check-reference` หลังเพิ่ม reference

### 5. Output Format

- Health CLI output เป็น JSON หรือ table format
- Deep report ใช้ตาราง 7 columns: Scope, File, Cause, Solutions, Severity, Review Workflow, Evidence
- ทุก finding ต้องมี evidence ที่ตรวจสอบได้ — ถ้าเป็น false positive ให้ระบุใน column Cause

## Expected Outcome

- Health CLI JSON report พร้อม metrics ครบถ้วน
- Structural overview ด้วย `ast-grep outline`
- Deep report ตาราง 7 columns พร้อม evidence ที่ตรวจสอบได้
- Deep summary 5 ส่วน: Domain Breakdown, Severity Distribution, Analyzer Changes, False Positive Analysis, Recommended Actions
- Cross-references ถูกเพิ่มในไฟล์ที่ขาด ไม่มี broken references
- Action items จัดลำดับตาม priority: quick wins ก่อน, major improvements รองลงมา
