---
name: use-astgrep-programatic
description: ใช้งาน ast-grep แบบ programmatic ผ่าน scripts เพื่อ automate analysis และ integrate กับ review CLI
argument-hint: "[scope]"
related:
  - use-astgrep
  - update-project-rules
  - improve-review-cli
  - follow-lang-bun
  - follow-create-bun-cli
  - scan-codebase
  - use-scripts
---

## Goal

ใช้งาน ast-grep แบบ programmatic ผ่าน Bun scripts เพื่อ automate code analysis และ integrate กับ review CLI

## Scope

ครอบคลุมการใช้ ast-grep ผ่าน napi bindings และ CLI ใน Bun scripts, การสร้าง programmatic analyzers, การ integrate กับ review CLI — ไม่รวม manual ast-grep CLI usage (ดู `/use-astgrep`) — ไม่รวมการอัปเดต rules (ดู `/update-project-rules`) หรืออัปเดต review CLI (ดู `/improve-review-cli`)

## Execute

### 0. Setup

> Goal: ติดตั้ง ast-grep สำหรับ Bun scripts

1. ติดตั้ง `@ast-grep/cli` ใน project:
   - `bun add -D @ast-grep/cli`
   - หรือ global: `mise use -g 'npm:@ast-grep/cli'`
2. ตรวจสอบ CLI: `bunx ast-grep --version`
3. ถ้าต้องใช้ napi bindings → `bun add -D @ast-grep/napi`
4. สร้าง `sgconfig.yml` ที root ถ้ายังไม่มี
5. ถ้าติดตั้งไม่สำเร็จ → ใช้ `/research-setup ast-grep`

### 1. Prepare Context

> Goal: อ่าน context และเตรียม environment ก่อนเขียน scripts

1. ทำ `/use-astgrep`, ทำ `/follow-lang-bun`, ทำ `/follow-create-bun-cli` — อ่าน ast-grep patterns, Bun native APIs, และ CLI best practices
2. อ่าน `tools/review-codebase/` directory เพื่อเข้าใจ analyzer structure ที่มีอยู่
3. อ่าน `rules/` directory เพื่อดู ast-grep rules ที่มีอยู่
4. ทำ `/scan-codebase` เพื่อเข้าใจ codebase structure ที่จะ analyze

### 2. Create Programmatic Script

> Goal: สร้าง Bun script ที่ใช้ ast-grep แบบ programmatic สำหรับ automated analysis

1. ทำ `/use-scripts` เพื่อสร้าง script ใน `.devin/scripts/` หรือ `$env:TEMP`
2. เลือก ast-grep interface:
   - napi bindings: `import { parse, findPattern } from '@ast-grep/napi'` — สำหรับ in-process analysis
   - CLI wrapper: `Bun.$\`ast-grep scan --json\`` — สำหรับ batch scanning
3. เขียน script ด้วย Bun native APIs:
   - ใช้ `Bun.Glob` สำหรับ file discovery
   - ใช้ `Bun.$` สำหรับ CLI invocation
   - ใช้ `Bun.file()` + `Bun.write()` สำหรับ file I/O
4. script ต้องมี `dryRun` option สำหรับ testing
5. script ต้อง output เป็น JSON สำหรับ review CLI consumption
6. ใช้ CDN imports สำหรับ external dependencies: `https://esm.sh/@ast-grep/napi`

### 3. Run Analysis

> Goal: รัน programmatic analysis และ integrate ผลลัพธ์กับ review CLI

1. รัน script ใน dry run mode เพื่อดูผลลัพธ์ก่อน
2. ถ้า dry run ผ่าน → รันจริง
3. ถ้า review CLI ไม่รวม ast-grep findings → รัน script แยกและ merge ผลลัพธ์
4. ตรวจสอบ findings ว่ามี evidence ครบ: file path, line number, code snippet, rule id

### 4. Validate And Report

> Goal: ตรวจสอบ findings และรายงานผล

1. ทำ `/deep-validate` สำหรับ validate issues จาก ast-grep analysis
2. จัดลำดับตาม severity: Critical → High → Medium → Low
3. ถ้าพบ false positives → ปรับ rules และรันซ้ำ (max 3 → stop/report)
4. ทำ `/suggest-next-action`

## Rules

### 1. Script Standards

- ใช้ Bun native APIs เสมอ: `Bun.Glob`, `Bun.$`, `Bun.file()`, `Bun.write()`
- ใช้ CDN imports สำหรับ external dependencies: `https://esm.sh/@ast-grep/napi`
- script ต้องมี `dryRun` option
- script ต้อง output เป็น JSON สำหรับ machine consumption
- เก็บ scripts ใน `.devin/scripts/` (permanent) หรือ `$env:TEMP` (throwaway)

### 2. Integration

- ast-grep findings ต้อง integrate กับ review CLI output
- ถ้า review CLI ไม่รวม ast-grep findings → รัน script แยกและ merge
- แต่ละ finding ต้องมี: file path, line number, code snippet, rule id
- ถ้า finding เป็น false positive → ปรับ rule และรันซ้ำ

### 3. Scope Boundary

- ไม่รวมการอัปเดต rules — อยู่ใน `/update-project-rules`
- ไม่รวมการอัปเดต review CLI analyzers — อยู่ใน `/improve-review-cli`
- เน้นเฉพาะการใช้ ast-grep แบบ programmatic ผ่าน scripts

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- Bun script ที่ใช้ ast-grep แบบ programmatic สำหรับ automated analysis
- Review report พร้อม ast-grep findings ที่ครอบคลุมและ accurate
- Findings ถูก validate และรายงานเป็นตาราง
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
