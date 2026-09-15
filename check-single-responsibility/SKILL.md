---
name: check-single-responsibility
description: ตรวจ SRP violations ด้วย ast-grep script — symbols ต่อไฟล์, members ต่อ class, mixed concerns
argument-hint: "[paths]"
related:
  - check-function-quality
  - check-code-structure
  - use-astgrep
  - use-astgrep-programmatic
  - refactor
  - follow-single-of-source
  - deep-validate
  - report
  - suggest-next-action
---

## Goal

ตรวจ Single Responsibility violations ด้วย ast-grep metrics — ไฟล์ที่มี top-level symbols เยอะ, class ที่มี members เกิน, ไฟล์ที่ปนหลาย domain — พร้อม evidence สำหรับ `/refactor`

## Scope

ใช้กับ TS/TSX/JS/JSX source เพื่อหา SRP violations ระดับ file/class — เป็น evidence step ของ `/refactor` โดยเฉพาะ SRP refactor path; ต่างจาก `/check-code-structure` ตรงที่ skill นี้ focus นับ responsibilities ไม่ใช่ดู structure ทั่วไป

## Execute

### 1. Prepare

> Goal: เตรียม scope และเครื่องมือ

1. ระบุ target paths (default `src` หรือ paths ที่ user ระบุ)
2. ตรวจ ast-grep พร้อมใช้ — script resolve `ast-grep`/`sg`/`bunx -p @ast-grep/cli` ให้อัตโนมัติ
3. ทำ `/scan-codebase` ถ้ายังไม่รู้ว่า directories ไหนมี source

### 2. Run SRP Script

> Goal: เก็บ symbol/member counts ด้วย ast-grep

```powershell
bun skills/check-single-responsibility/scripts/check-single-responsibility.ts <paths...>
bun skills/check-single-responsibility/scripts/check-single-responsibility.ts src --json
bun skills/check-single-responsibility/scripts/check-single-responsibility.ts src --max-symbols 5 --max-members 10
```

1. script รัน `ast-grep run -p` เก็บ top-level declarations (function, class, interface, type, const, enum)
2. รัน `scan --inline-rules` สำหรับ `method_definition` + `public_field_definition` แล้ว attribute เข้า enclosing class ตาม range
3. metrics: `symbols` (top-level), `exports`, `members` ต่อ class, `domains` (distinct name prefixes เป็น heuristic)
4. ถ้า script fail → ตรวจ ast-grep resolution และ paths (max retry 3 → stop/report)

### 3. Identify Violations

> Goal: แปลง counts เป็น SRP findings พร้อม severity

| Metric | Medium | High | Critical |
|--------|--------|------|----------|
| `symbols` ต่อไฟล์ | 4-5 | >5 | >10 |
| `members` ต่อ class | 6-10 | >10 | >20 |
| `exports` ต่อไฟล์ | >8 | >12 | — |

1. file ที่ symbols เยอะ + ชื่อข้าม domain หลายกลุ่ม → mixed concerns ชัดเจน (High+)
2. class ที่ members เกิน → God class candidate — อ่านจริงยืนยันก่อน flag
3. ระบุ false positives: barrel/index files, generated code, type-only modules, i18n tables
4. ถ้าไม่มี violations จริง → stop และ report

### 4. Recommend Splits

> Goal: แนะนำการแยกตาม responsibility ที่เห็น

- file หลาย domain → split เป็นไฟล์ต่อ responsibility (`/relocation` ถ้าต้องย้าย)
- class members เยอะ → extract เป็น sub-types/services ตามกลุ่ม methods ที่ cohesive
- exports เกิน → พิจารณา module boundary ใหม่หรือลด public surface
- function-level issues (ยาว/complex) → ทำ `/check-function-quality` ต่อ
- duplicated logic ข้าม symbols → `/follow-single-of-source`

### 5. Hand Off Or Report

> Goal: ส่งต่อ refactor หรือสรุปผล

1. ทำ `/deep-validate` ยืนยัน findings
2. violations น้อย → แก้เลยใน `/refactor` file scope; violations กระจาย → `/refactor` SRP path
3. ทำ `/report` ตาราง: No., File, Symbols, Exports, Top Class Members, Severity, Suggested Split
4. ทำ `/suggest-next-action`

## Rules

### 1. Evidence-Based

- ทุก finding ต้องมี `file` + count + symbol names จาก script
- counts เป็น heuristic — เปิดอ่าน top findings ยืนยันก่อนแนะนำ split
- barrel files (`index.ts` re-export only) ไม่นับเป็น violation

### 2. Thresholds

- defaults ตามตาราง Step 3 สอดคล้องกับ `/check-code-structure` (>5 symbols, >10 members)
- override ด้วย `--max-symbols`, `--max-members`, `--max-exports`
- ถ้า project มี convention ต่าง → ปรับ flags ตาม project standard

### 3. Script Discipline

- script เป็น read-only — ไม่แก้ไข source
- output JSON (`--json`) สำหรับ review CLI หรือ scripts อื่น (`/use-astgrep-programmatic`)
- nested declarations ถูก exclude จาก top-level count โดย range containment — เป็น approximation ไม่ใช่ semantic analysis

### 4. Scope Boundary

- check เท่านั้น ไม่ refactor — การแก้ไขอยู่ใน `/refactor` และ `/restructure`
- ไม่ซ้ำกับ `/check-function-quality` (function internals) — skill นี้ดู file/class level
- ห้ามใช้ `**` (bold markers) — ใช้ backticks

## Expected Outcome

- ตาราง SRP metrics พร้อม severity และ evidence
- false positives (barrels, generated, type-only) ถูกระบุ
- suggested splits ตรง responsibility ที่เห็นจริง
- hand-off ไป `/refactor` พร้อม baseline
