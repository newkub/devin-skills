---
name: resolve-errors
description: แก้ไข error อย่างเป็นระบบ รวดเร็ว และแม่นยำ — ระบุ root cause แก้น้อยที่สุด ใช้ scripts automate
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - quotes
---

## Goal

แก้ไข error อย่างเป็นระบบ รวดเร็ว และแม่นยำ — ระบุ root cause แก้น้อยที่สุด ใช้ scripts automate การแก้ไข และ verify ครบถ้วน

## Scope

ใช้สำหรับแก้ไข error ที่เกิดจากการรัน commands, linting, type checking, testing, หรือ build ที่สามารถแก้ได้โดยตรง

ไม่ใช่การ debug อย่างเป็นระบบ (ใช้ `/deep-debug`) และไม่ใช่การ debug หาสาเหตุอย่างเดียว (ใช้ `/debug-issue`)

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้า (Step N ขึ้นกับ Step N-1)

### 1. Prepare Context

> Goal: เตรียม context ก่อนเริ่มแก้ไข error
> Goal: เข้าใจ codebase structure, conventions และ dependencies

1. ทำ `/read-related-skills` เพื่ออ่าน workflows ที่เกี่ยวข้องแบบ recursive
2. ทำ `/scan-codebase` เพื่อทำความเข้าใจ structure ของไฟล์ที่มี error
3. ถ้าไฟล์ยาว >250 บรรทัด → อ่าน `/refactor` ก่อนแก้
4. ถ้าเข้าถึง workspace ไม่ได้ → stop และ report โดยไม่แก้ไขไฟล์

### 2. Capture And Triage Errors

> Goal: เก็บ error ทั้งหมด จัดประเภท จัดกลุ่ม และจัดลำดับการแก้ไข
> Goal: มี error list ที่จัดประเภท จัดกลุ่ม และจัดลำดับแล้ว

1. รัน command ที่ทำให้เกิด error อีกครั้งเพื่อ capture output ทั้งหมด
2. ถ้า error มีจำนวนมาก → ใช้ `/use-scripts` เพื่อ capture และ parse error output เป็น structured data (เช่น `bunx biome lint --reporter=json` แล้ว group by `file:rule`)
3. จัดประเภท error ตามตารางใน `## Rules → ### 2. Error Classification`
4. จัดกลุ่ม errors ที่มี root cause เดียวกันเป็น batch
5. ระบุ error source และจัดลำดับ: `environment` > `config` > `dependency` > `code` > `test-data` — แก้ตามลำดับนี้เพราะ upstream อาจทำให้ downstream หายไปเอง
6. จัดลำดับตาม dependency: แก้ upstream ก่อน downstream — ถ้า error A ทำให้เกิด B → แก้ A ก่อน
7. ถ้า error ซับซ้อนหรือไม่ชัดเจน → ทำ `/deep-review` ก่อน

### 3. Identify Root Cause

> Goal: ระบุสาเหตุที่แท้จริงของ error อย่างแม่นยำ
> Goal: รู้ว่าต้องแก้อะไรที่จุดไหน อย่างแน่นอน

1. อ่าน error message ทั้งหมดรวม stack trace และ error code
2. ระบุไฟล์และบรรทัดที่เกิด error อย่างแม่นยำ — ดู context ±20 บรรทัด
3. ติดตาม call stack ย้อนกลับ ตรวจสอบ data flow และ dependencies
4. ถ้า root cause ไม่ชัดเจน:
   - ใช้ `git diff` และ `git log --oneline -5 -- <file>` ตรวจสอบการเปลี่ยนแปลงล่าสุด
   - ใช้ `ast-grep` ค้นหา pattern ที่คล้ายกันใน codebase
   - ถ้ายังไม่พบ → ทำ `/debug-issue` หรือ `/deep-debug`

### 4. Apply Minimal Fix

> Goal: แก้ไขที่ root cause ด้วยการเปลี่ยนแปลงน้อยที่สุด — รวม parallel fix สำหรับ independent errors
> Goal: แก้ถูกจุด แก้น้อย แก้ได้ผล

1. แก้ไขที่จุดเดียวที่เป็น root cause จริง — single-line change เมื่อเป็นไปได้
2. ถ้า error มีจำนวนมาก → ใช้ `/use-scripts` เพื่อ automate:
   - Batch text replacement — แก้ typo, rename, import path ในหลายไฟล์ด้วย `Bun.Glob` + `Bun.file()` + `Bun.write()` หรือใช้ `/rename` สำหรับ rename code identifiers
   - ast-grep structural fix — แก้ code pattern ที่ต้องเปลี่ยนโครงสร้าง AST
   - Parallel fix — แก้ independent errors ในหลายไฟล์พร้อมกันด้วย `Promise.all` ถ้า errors มี dependency ระหว่างกัน → แก้ตามลำดับแทน
3. ถ้า fix กระทบหลายไฟล์ → ทำ `/update-reference` อัปเดท references
4. ถ้า fix สร้าง error ใหม่ → ทำ `/resolve-errors` ซ้ำ (loop) จนกว่าจะไม่มี error ใหม่
5. ถ้า fix ไม่ได้ → stop และ report พร้อมระบุสาเหตุ

### 5. Verify Fix

> Goal: ตรวจสอบว่าการแก้ไขถูกต้อง ไม่สร้าง side effects และไม่มี ignore patterns
> Goal: ยืนยันด้วยการรัน ไม่ใช่คาดการณ์

1. รัน command เดียวกับที่ทำให้เกิด error เพื่อยืนยันว่า error หายไป
2. รัน `bun run check` เพื่อตรวจสอบรวม (lint + typecheck + scan) หรือรันเฉพาะเจาะจง: `bunx biome lint` | `tsc --noEmit` | `bun test` | `bun run build`
3. ใช้ `/run-until-pass` เพื่อรันจนกว่าจะผ่านทุก check
4. ตรวจสอบไม่มี side effects: ไม่มี error ใหม่ในไฟล์อื่น, ไม่มี test ที่เคยผ่านแล้ว fail, ไม่มี warning ใหม่
5. ตรวจสอบว่า fix ไม่ได้เพิ่ม ignore comments (`// biome-ignore`, `// @ts-ignore`, `# type: ignore`, etc.) — ทำตาม `/no-use-ignore` ถ้าพบ → ลบและแก้ที่ source
6. ถ้ามี error ใหม่ → กลับไป Step 4 (loop) — ถ้าเกิน 3 รอบ → ทำ `/deep-debug`

### 6. Document And Prevent

> Goal: บันทึกการแก้ไขและป้องกัน regression
> Goal: ป้องกันปัญหาซ้ำ และมี reference สำหรับอนาคต

1. เขียน comment อธิบายสาเหตุของการแก้ไขถ้าไม่ชัดเจน
2. พิจารณาเพิ่ม test case เพื่อป้องกัน regression — ทำ `/write-test`
3. ทำ `/memorize` เพื่อบันทึก pattern ของปัญหาและวิธีแก้
4. แนะนำ preventive measures ถ้า error มีโอกาสเกิดซ้ำ: linter rule, type constraint, pre-commit hook

## Rules

### 1. When To Use

- ใช้เมื่อ: error ชัดเจน แก้ได้โดยตรง เกิดจาก lint/typecheck/test/build หรือมีหลายตัวที่ batch fix ได้
- ไม่ใช้เมื่อ: ซับซ้อนหลายจุด (ใช้ `/deep-debug`) ต้องหาสาเหตุก่อน (ใช้ `/debug-issue`) ต้องจัดลำดับมากมาย (ใช้ `/deep-review`) เป็น race condition (ใช้ `/deep-debug`)
- `/resolve-errors` = รู้สาเหตุแล้ว แก้น้อยที่สุด ใช้ scripts automate | `/deep-debug` = วางแผนแก้และป้องกันซ้ำ | `/debug-issue` = ยังไม่รู้สาเหตุ

### 2. Error Classification

| Type | Source | Common Fix |
|------|--------|-------------|
| `Syntax` | `code` | แก้ syntax, typos, missing brackets/quotes |
| `Type` | `code` | เพิ่ม/แก้ type annotation, narrowing |
| `Runtime` | `code` | เพิ่ม null check, optional chaining, try-catch |
| `Logic` | `code` | แก้ condition, data flow |
| `Build` | `config`/`dependency` | แก้ config, import path, dependency version |
| `Lint` | `code`/`config` | แก้ code pattern หรือปรับ config |
| `Test` | `test-data`/`code` | แก้ assertion, mock, test setup |
| `Network` | `code` | แก้ URL, headers, request format |
| `Config` | `config` | แก้ env var, config value, path |
| `Dependency` | `dependency` | อัปเดท/ติดตั้ง dependency |

จัดลำดับการแก้ตาม source: `environment` > `config` > `dependency` > `code` > `test-data`

### 3. Batch Fix And Script Automation

ใช้ `/use-scripts` เมื่อ errors มีจำนวนมาก:
- Group by root cause — errors ที่มีสาเหตุเดียวกันแก้พร้อมกัน
- Group by rule — lint errors จาก rule เดียวกันแก้ด้วย pattern เดียวกัน
- Group by file — errors ในไฟล์เดียวกันแก้พร้อมกันเพื่อลด context switching
- Script patterns: batch text replacement, ast-grep structural fix, parallel file fix ด้วย `Promise.all`, error capture and parse, verify loop ด้วย `/run-until-pass`

### 4. Fix Principles

- Root cause over symptom — แก้ที่สาเหตุ ไม่ใช่ที่อาการ
- Minimal over maximal — single-line change เมื่อเป็นไปได้
- Upstream over downstream — แก้ต้นน้ำดีกว่าปลายน้ำ (config > dependency > code)
- Batch over sequential — แก้ errors ที่เกี่ยวข้องเป็น batch
- Verify before assume — ยืนยันด้วยการรัน
- No ignore — ห้าม suppress error ด้วย ignore patterns ทำตาม `/no-use-ignore`
- Loop until clean — ถ้า fix สร้าง error ใหม่ ให้ loop จนกว่าจะไม่มี

### 5. Time Budget And Loop Limit

- Error เล็ก: ≤ 2 นาที | กลาง: ≤ 5 นาที | ใหญ่: ≤ 15 นาที | Batch: ≤ 10 นาที
- ถ้าเกินเวลา → ใช้ `/deep-debug`
- ถ้า fix แล้วเกิด error ใหม่ซ้ำเกิน 3 รอบ → ทำ `/deep-debug`
- ถ้า root cause หาไม่ได้หลังพยายาม 3 ครั้ง → ทำ `/debug-issue`

### 6. Integration With Other Workflows

- `/deep-review` — errors มาก ต้องจัดลำดับ
- `/debug-issue` — ยังไม่พบ root cause
- `/deep-debug` — error ซับซ้อน ต้องวางแผนแก้และป้องกันซ้ำ
- `/run-check` — รัน lint + typecheck + scan รวม
- `/run-until-pass` — รัน command จนกว่าจะผ่าน
- `/watch-browser-console` — error มาจาก browser console
- `/update-reference` — fix กระทบ references ในหลายไฟล์
- `/rename` — rename code identifiers ที่เป็น root cause ของ error
- `/scan-codebase` — ค้นหา pattern ที่คล้ายกัน
- `/memorize` — จดจำบทเรียนจาก error

## Expected Outcome

- Error ถูกแก้ไขอย่างถาวรจาก root cause
- ไม่มี side effects ใหม่ ไม่มี ignore patterns
- Code quality รักษาไว้หรือดีขึ้น
- Batch errors ถูกแก้ได้รวดเร็วด้วย scripts automation
- มี regression test และ preventive measures สำหรับ error ที่มีโอกาสเกิดซ้ำ
