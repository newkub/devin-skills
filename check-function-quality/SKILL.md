---
name: check-function-quality
description: ตรวจคุณภาพ functions ด้วย ast-grep script — length, params, returns, nesting, complexity
argument-hint: "[paths]"
related:
  - check-single-responsibility
  - check-code-structure
  - use-astgrep
  - use-astgrep-programmatic
  - search-by-astgrep
  - refactor
  - deep-validate
  - report
  - suggest-next-action
---

## Goal

ตรวจคุณภาพ function/method ระดับตัวด้วย ast-grep metrics — function ยาวเกิน, params เยอะ, returns หลายจุด, nesting ลึก, complexity สูง — แล้วแนะนำ technique แก้ไขตรง root cause

## Scope

ใช้กับ TS/TSX/JS/JSX source ที่ต้องการตรวจ function quality ก่อน/ระหว่าง refactor — เป็น evidence step ของ `/refactor` และ complement `/check-code-structure` (ซึ่งดู file-level structure) โดย skill นี้ดู function-level metrics

## Execute

### 1. Prepare

> Goal: เตรียม scope และเครื่องมือ

1. ระบุ target paths (default `src` หรือ paths ที่ user ระบุ)
2. ตรวจ ast-grep พร้อมใช้: `bunx ast-grep --version` (local devDependency) หรือ `bunx -p @ast-grep/cli ast-grep --version` — script resolve ให้อัตโนมัติ
3. ถ้า scope ใหญ่ ให้ทำ `/scan-codebase` ก่อนเพื่อเลือก directories ที่คุ้ม

### 2. Run Metrics Script

> Goal: เก็บ function metrics ด้วย ast-grep

1. รัน script จาก skills root:

```powershell
bun skills/check-function-quality/scripts/check-function-quality.ts <paths...>
bun skills/check-function-quality/scripts/check-function-quality.ts src --json
bun skills/check-function-quality/scripts/check-function-quality.ts src --max-lines 60 --max-params 4
```

2. script รัน `ast-grep run -p` เก็บ function declarations, arrow functions และ `scan --inline-rules` สำหรับ `method_definition`
3. metrics ต่อ function: `lines`, `params`, `returns`, `depth` (brace nesting), `complexity` (branch tokens)
4. ถ้า script fail → ตรวจว่า ast-grep resolve ได้และ paths มีไฟล์ที่รองรับ (max retry 3 → stop/report)

### 3. Analyze Findings

> Goal: แปลง metrics เป็น issues พร้อม severity

| Metric | Medium | High | Critical |
|--------|--------|------|----------|
| `lines` | >40 | >80 | >150 |
| `params` | >4 | >6 | — |
| `returns` | >3 | >6 | — |
| `depth` | >4 | >6 | — |
| `complexity` | >10 | >15 | — |

1. อ่าน findings จาก table/JSON — ทุก finding มี `file:line` + function name เป็น evidence
2. เปิดอ่าน functions ที่ severity สูงสุด 3-5 ตัวเพื่อยืนยันว่า metric สะท้อนปัญหาจริง (ไม่ใช่ data table/generated code)
3. ระบุ false positives: dispatch tables, JSX-heavy components (ดู `update-review-cli` Known Issues #3 — TSX declarative อนุโลม), config builders
4. ถ้าไม่มี findings ที่เป็นปัญหาจริง → stop และ report

### 4. Recommend Techniques

> Goal: map issue → refactoring technique ที่ตรง

- `lines`/`complexity` สูง → Extract Function ตาม phases/branches ที่เห็นใน body
- `params` สูง → Introduce Parameter Object หรือ options bag
- `returns` หลายจุด → Guard clauses / แยก validation ออกจาก core logic
- `depth` ลึก → early return, แยก loop body, Replace Nested Conditional
- function ทำหลายอย่าง (and-then-else structure) → ทำ `/check-single-responsibility` ต่อ
- เลือก technique เพิ่มจาก `refactor/references/code-smells.md`

### 5. Hand Off Or Fix

> Goal: ส่งต่อไป refactor หรือแก้เล็กน้อยในที่

1. findings น้อยและชัด → แก้เลยตาม `/refactor` file scope
2. findings กระจายทั้ง codebase → ทำ `/refactor` codebase scope พร้อม findings เป็น baseline
3. ทำ `/deep-validate` ยืนยัน findings ก่อน hand-off เสมอ

### 6. Report

> Goal: สรุปผล

1. ทำ `/report` ตาราง: No., File, Function, Lines, Params, Returns, Depth, Complexity, Severity, Technique
2. สรุป distribution: จำนวน functions ต่อ severity
3. ทำ `/suggest-next-action`

## Rules

### 1. Evidence-Based

- ทุก finding ต้องมี `file:line` + metric value จาก script — ห้าม flag โดยไม่มี evidence
- metrics เป็น heuristic — ต้องเปิดอ่าน top findings ยืนยันก่อนแนะนำ fix
- ระบุ false positives ใน report เสมอ

### 2. Thresholds

- defaults ตามตารางใน Step 3 — override ได้ด้วย flags (`--max-lines`, `--max-params`, `--max-returns`, `--max-depth`, `--max-complexity`)
- TSX declarative components อนุโลม: JSX-heavy functions ใช้ threshold สูงกว่า (x2) หรือ skip ตาม context ของ project
- ถ้า project มี convention ต่าง (เช่น update-review-cli: TS 120/TSX 200) → ปรับ flags ตามนั้น

### 3. Script Discipline

- script เป็น read-only — ไม่แก้ไข source
- output JSON (`--json`) สำหรับ integrate กับ review CLI หรือ scripts อื่น (`/use-astgrep-programmatic`)
- ถ้าต้อง metrics เพิ่ม/ภาษาอื่น → ขยาย script ตาม `/use-astgrep-programmatic` ไม่ใช่ copy-paste shell loops

### 4. Scope Boundary

- check เท่านั้น ไม่ refactor — การแก้ไขอยู่ใน `/refactor`
- ไม่ซ้ำกับ `/check-code-structure` (file-level symbols/exports) — skill นี้ดู function internals
- ห้ามใช้ `**` (bold markers) — ใช้ backticks

## Expected Outcome

- ตาราง function metrics พร้อม severity และ evidence `file:line`
- false positives ถูกระบุและตัดออก
- technique ที่แนะนำตรง metric ที่ผิดเกณฑ์
- hand-off ไป `/refactor` พร้อม baseline ชัดเจน
