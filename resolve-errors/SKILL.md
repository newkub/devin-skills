---
name: resolve-errors
description: แก้ไข error อย่างเป็นระบบ รวดเร็ว และแม่นยำ — ระบุ root cause แก้น้อยที่สุด ใช้ scripts automate
argument-hint: "[scope|verify]"
related:
  - rethink
  - resolve-cicd
  - deep-debug
  - review-devin-global-harness
  - scan-codebase
  - refactor
  - use-scripts
  - deep-review
  - run-check
  - run-test-all
  - run-until-pass
  - check-secrets
  - open-web-for-config-secret
---

## Goal

แก้ไข error อย่างเป็นระบบ รวดเร็ว และแม่นยำ — ระบุ root cause แก้น้อยที่สุด ใช้ scripts automate การแก้ไข และ verify ครบถ้วน

## Scope

ใช้สำหรับแก้ไข error ที่เกิดจากการรัน commands, linting, type checking, testing, หรือ build ที่สามารถแก้ได้โดยตรง

ไม่ใช่การ debug อย่างเป็นระบบ (ใช้ `/deep-debug`)

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้า (Step N ขึ้นกับ Step N-1)

### CI/CD Failure Skills

| Topic | Skill |
|-------|-------|
| GitHub Actions workflow runs ที่ล้มเหลว | `/resolve-github-actions-fails` |
| Cloudflare Worker หรือ Pages project ที่ระบุ | `/resolve-cloudflare-worker-fails` |
| Cloudflare Workers/Pages ทั้ง account | `/resolve-all-cloudflare-worker-fails` |
| CI/CD pipeline repo-scoped หรือ single run/URL (watch + dispatch) | `/resolve-cicd` |

### Workflows

| Argument | Workflow |
|----------|----------|
| `verify`, `verify-resolved` | `workflows/verify-resolved/SKILL.md` — re-run command เดิม, ไม่มี error ใหม่, ไม่มี suppression |

1. ถ้า argument เป็น `verify` → อ่าน `workflows/verify-resolved/SKILL.md` แล้วทำตาม flow — ไม่แก้ไขใหม่
2. ถ้าไม่ระบุ → ทำ Steps 1-6 ตามปกติ โดย Step 5 อ่าน workflow `verify-resolved` มา execute

### 1. Prepare Context

> Goal: เตรียม context ก่อนเริ่มแก้ไข error

1. ทำ `/review-devin-global-harness` เพื่ออ่าน workflows ที่เกี่ยวข้องแบบ recursive
2. ทำ `/scan-codebase` เพื่อทำความเข้าใจ structure ของไฟล์ที่มี error
3. ถ้าไฟล์ยาว >250 บรรทัด → อ่าน `/refactor` ก่อนแก้
4. ถ้าเข้าถึง workspace ไม่ได้ → stop และ report โดยไม่แก้ไขไฟล์

### 2. Capture And Triage Errors

> Goal: เก็บ error ทั้งหมด จัดประเภท จัดกลุ่ม และจัดลำดับการแก้ไข

1. รัน command ที่ทำให้เกิด error อีกครั้งเพื่อ capture output ทั้งหมด
2. ถ้า error มีจำนวนมาก → ใช้ `/use-scripts` เพื่อ capture และ parse error output เป็น structured data (เช่น `bunx biome lint --reporter=json` แล้ว group by `file:rule`)
3. จัดประเภท error ตามตารางใน `## Rules → ### 2. Error Classification`
4. จัดกลุ่ม errors ที่มี root cause เดียวกันเป็น batch
5. ระบุ error source และจัดลำดับ: `environment` > `config` > `dependency` > `code` > `test-data` — แก้ตามลำดับนี้เพราะ upstream อาจทำให้ downstream หายไปเอง
6. จัดลำดับตาม dependency: แก้ upstream ก่อน downstream — ถ้า error A ทำให้เกิด B → แก้ A ก่อน
7. ถ้า error ซับซ้อนหรือไม่ชัดเจน → ทำ `/deep-review` ก่อน

### 3. Identify Root Cause

> Goal: ระบุสาเหตุที่แท้จริงของ error อย่างแม่นยำ

1. อ่าน error message ทั้งหมดรวม stack trace และ error code
2. ระบุไฟล์และบรรทัดที่เกิด error อย่างแม่นยำ — ดู context ±20 บรรทัด
3. ติดตาม call stack ย้อนกลับ ตรวจสอบ data flow และ dependencies
4. ถ้า root cause ไม่ชัดเจน:
   - ใช้ `git diff` และ `git log --oneline -5 -- <file>` ตรวจสอบการเปลี่ยนแปลงล่าสุด
   - ใช้ `ast-grep` ค้นหา pattern ที่คล้ายกันใน codebase
   - ถ้ายังไม่พบ → ทำ `/deep-debug`

### 4. Apply Minimal Fix

> Goal: แก้ไขที่ root cause ด้วยการเปลี่ยนแปลงน้อยที่สุด — รวม parallel fix สำหรับ independent errors

1. แก้ไขที่จุดเดียวที่เป็น root cause จริง — single-line change เมื่อเป็นไปได้
2. ถ้า error มีจำนวนมาก → ใช้ `/use-scripts` เพื่อ automate:
   - Batch text replacement — แก้ typo, rename, import path ในหลายไฟล์ด้วย `Bun.Glob` + `Bun.file()` + `Bun.write()` หรือใช้ `/rename` สำหรับ rename code identifiers
   - ast-grep structural fix — แก้ code pattern ที่ต้องเปลี่ยนโครงสร้าง AST
   - Parallel fix — แก้ independent errors ในหลายไฟล์พร้อมกันด้วย `Promise.all` ถ้า errors มี dependency ระหว่างกัน → แก้ตามลำดับแทน
3. ถ้า fix กระทบหลายไฟล์ → ทำ `/update-references` อัปเดท references
4. ถ้า fix สร้าง error ใหม่ → ทำ `/resolve-errors` ซ้ำ (loop) จนกว่าจะไม่มี error ใหม่
5. ถ้า fix ไม่ได้ → stop และ report พร้อมระบุสาเหตุ

### 5. Verify Fix

> Goal: ตรวจสอบว่าการแก้ไขถูกต้อง ไม่สร้าง side effects และไม่มี ignore patterns

1. ทำตาม `workflows/verify-resolved/SKILL.md` — re-run command เดิม, ตรวจ side effects และ suppression
2. ถ้า verdict ไม่ใช่ `resolved` → กลับไป Step 4 (loop) — ถ้าเกิน 3 รอบ → ทำ `/deep-debug`

### 6. Document And Prevent

> Goal: บันทึกการแก้ไขและป้องกัน regression

1. เขียน comment อธิบายสาเหตุของการแก้ไขถ้าไม่ชัดเจน
2. พิจารณาเพิ่ม test case เพื่อป้องกัน regression — ทำ `/update-tests`
3. บันทึก pattern ของปัญหาและวิธีแก้ลงไฟล์บันทึกหรือ memory ของ project
4. แนะนำ preventive measures ถ้า error มีโอกาสเกิดซ้ำ: linter rule, type constraint, pre-commit hook

## Rules

### 1. When To Use

- ใช้เมื่อ: error ชัดเจน แก้ได้โดยตรง เกิดจาก lint/typecheck/test/build หรือมีหลายตัวที่ batch fix ได้
- ไม่ใช้เมื่อ: ซับซ้อนหลายจุด หรือต้องหาสาเหตุก่อน (ใช้ `/deep-debug`) ต้องจัดลำดับมากมาย (ใช้ `/deep-review`) เป็น race condition (ใช้ `/deep-debug`)
- `/resolve-errors` = รู้สาเหตุแล้ว แก้น้อยที่สุด ใช้ scripts automate | `/deep-debug` = หา root cause วางแผนแก้และป้องกันซ้ำ

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
| `Config` | `config` | แก้ env var, config value, path — ถ้าเป็น env-missing (`Missing required environment variables`, `X environment variable is not set`) → ห้าม hardcode ค่า ให้ route ไป `/check-secrets env-vars` + `/open-web-for-config-secret` (inventory table ชี้ key/URL/จุดกรอก) |
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
- No ignore — ห้าม suppress error ด้วย ignore patterns แก้ที่ source แทน
- Loop until clean — ถ้า fix สร้าง error ใหม่ ให้ loop จนกว่าจะไม่มี

### 5. Time Budget And Loop Limit

- Error เล็ก: ≤ 2 นาที | กลาง: ≤ 5 นาที | ใหญ่: ≤ 15 นาที | Batch: ≤ 10 นาที
- ถ้าเกินเวลา → ใช้ `/deep-debug`
- ถ้า fix แล้วเกิด error ใหม่ซ้ำเกิน 3 รอบ → ทำ `/deep-debug`
- ถ้า root cause หาไม่ได้หลังพยายาม 3 ครั้ง → ทำ `/deep-debug`

### 6. Integration With Other Workflows

- `/deep-review` — errors มาก ต้องจัดลำดับ
- `/deep-debug` — ยังไม่พบ root cause
- `/deep-debug` — error ซับซ้อน ต้องวางแผนแก้และป้องกันซ้ำ
- `/run-verify` — รัน lint + typecheck + scan รวม
- `/run-until-pass` — รัน command จนกว่าจะผ่าน
- `/watch-browser-and-fix` — error มาจาก browser console
- `/update-references` — fix กระทบ references ในหลายไฟล์
- `/rename` — rename code identifiers ที่เป็น root cause ของ error
- `/scan-codebase` — ค้นหา pattern ที่คล้ายกัน

- ใช้ /rethink ถ้าจำเป็น
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /run-test-all ถ้าจำเป็น

- ใช้ /resolve-cicd ถ้าจำเป็น

## Merged Details

### verify-resolved

##### Goal

ยืนยันหลัง `/resolve-errors` ว่า error หายจริงและ fix ไม่สร้าง side effects — เรียก standalone เมื่อต้อง re-verify resolution

##### Scope

- ใช้เมื่อ parent dispatch มาที่ `verify` หรือเรียกหลัง fix เสร็จ
- ครอบคลุม: original error gone, no new errors, no suppression, tests still green
- Read-only: ตรวจสอบ — ไม่แก้ไข

##### Execute

###### 1. Re-Run Original Command

> Goal: error เดิมหายจริง

1. รัน command เดียวกับที่ทำให้เกิด error — output ต้อง clean
2. ถ้า error เดิมยังอยู่ → verdict `not-resolved` report ทันที
3. เปรียบเทียบ output กับ error capture เดิม — errors ที่ claim fixed ต้องหายทั้งหมด

###### 2. Check For Side Effects

> Goal: fix ไม่พังอย่างอื่น

1. รัน `bun run check` (lint + typecheck + scan) หรือเทียบเท่า
2. รัน tests ที่เกี่ยวข้อง — ไม่มี test ที่เคยผ่าน fail
3. ตรวจไม่มี warning/error ใหม่ในไฟล์อื่น

###### 3. Check No Suppression

> Goal: fix แก้ที่ source ไม่ใช่ suppress

1. `rg '(biome-ignore|ts-ignore|ts-nocheck|type: ignore|eslint-disable)'` ใน diff ของ fix
2. flag ignore comments ที่เพิ่มมาจาก fix นี้ — ถ้าพบ verdict `suppressed` ไม่ใช่ resolved

###### 4. Report

> Goal: สรุป resolution status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `resolved` / `not-resolved` / `suppressed` / `regressed`

##### Rules

- `resolved` เมื่อ original command clean + ไม่มี side effects + ไม่มี suppression เท่านั้น
- ถ้า `not-resolved`/`regressed` → report กลับให้ `/resolve-errors` loop ต่อ — ไม่แก้เอง
- ใช้ `/run-until-pass` ถ้าต้องรันซ้ำจน stable (flaky checks)

##### Expected Outcome

- Verdict ชัดเจนว่า resolution สำเร็จจริงหรือไม่ พร้อม evidence

## Expected Outcome

- Error ถูกแก้ไขอย่างถาวรจาก root cause
- ไม่มี side effects ใหม่ ไม่มี ignore patterns
- Code quality รักษาไว้หรือดีขึ้น
- Batch errors ถูกแก้ได้รวดเร็วด้วย scripts automation
- มี regression test และ preventive measures สำหรับ error ที่มีโอกาสเกิดซ้ำ
