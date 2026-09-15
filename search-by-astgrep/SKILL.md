---
name: search-by-astgrep
description: ค้นหา code ด้วย ast-grep AST patterns — เลือก CLI ad-hoc หรือ programmatic ตามเหมาะสม
argument-hint: "[pattern-or-target]"
related:
  - use-astgrep
  - use-astgrep-programmatic
  - update-project-rules
  - replace
  - migration-by-astgrep
  - scan-codebase
  - check-code-structure
---

## Goal

ค้นหา symbols, call sites, patterns ใน code ด้วย AST-based matching ที่แม่นยำกว่า regex — เลือก interface ที่เหมาะ: CLI ad-hoc สำหรับ search ครั้งเดียว, programmatic สำหรับ batch/aggregate

## Scope

- ครอบคลุม ad-hoc structural search (`ast-grep run -p`), temporary rules (`--inline-rules`), pattern syntax และการเลือก interface
- ไม่รวมการตั้งค่า project (`/use-astgrep`), การเขียน rules ถาวร (`/update-project-rules`), rewrite/migration (`/replace`, `/migration-by-astgrep`)

(restored จาก merge เข้า `use-astgrep` — แยกกลับเป็น standalone workflow สำหรับ search โดยเฉพาะ)

## Execute

### 1. Choose Interface

> Goal: เลือก ast-grep interface ที่เหมาะกับงาน

1. Search ครั้งเดียว / verify pattern / ดู context รอบ match → CLI `ast-grep run` (default ของ workflow นี้)
2. ต้อง aggregate ข้ามหลายไฟล์, post-process, หรือ feed เข้า scripts/CLI → `/use-astgrep-programmatic`
3. Pattern เดิมต้องรันซ้ำบ่อย → promote เป็น rule ด้วย `/update-project-rules`
4. ต้อง rewrite หลังเจอ matches → `/replace` หรือ `/migration-by-astgrep`
5. ต้องดู structure ก่อนค้น → `ast-grep outline <path>` หรือ `/check-code-structure`

### 2. Prepare Search

> Goal: เตรียม pattern และ scope ให้จำเพาะ

1. ทำ `/use-astgrep` ถ้ายังไม่เคย setup — ตรวจว่าเรียก CLI ได้ (`bunx ast-grep` ถ้ามี devDependency, ไม่งั้น `bunx -p @ast-grep/cli ast-grep`)
2. ระบุภาษา: ปล่อย auto-detect จาก extension หรือระบุ `--lang ts|tsx|js|jsx|rust|py|...`
3. เขียน pattern ด้วย metavariables: `$VAR` match node เดียว, `$$$` match 0+ nodes
4. ทดสอบ syntax ด้วย `ast-grep run --pattern 'PATTERN' --debug` ถ้าไม่แน่ใจ

### 3. Run Search

> Goal: ค้นหาและ iterate pattern จนได้ผลที่ต้องการ

1. `ast-grep run --pattern 'PATTERN' [paths]` — `ast-grep -p 'PATTERN'` เทียบเท่า (`run` เป็น default subcommand)
2. ทดสอบบนไฟล์ตัวอย่าง 1-2 ไฟล์ก่อน แล้วขยายเป็น directory/project
3. ถ้า matches เยอะเกิน → เพิ่ม context ใน pattern (`inside`, `has`, `kind` ผ่าน `--inline-rules`) หรือจำกัด paths
4. ถ้า matches น้อยกว่าที่คาด → ลด constraints ทีละจุดเพื่อหาจุดที่ pattern แคบเกิน
5. ใช้ `--json pretty` เมื่อต้องการ file/line/structured output สำหรับ downstream processing
6. ใช้ `-C <n>` (context lines) หรือ `-A/-B` สำหรับดู code รอบ match

### 4. Use Inline Rules For Complex Patterns

> Goal: search ด้วย structural constraints ที่ pattern string เดียว express ไม่ได้

1. ใช้ `ast-grep scan --inline-rules 'YAML' [paths]` สำหรับ rule ชั่วคราว:

```yaml
id: find-await-in-loop
language: TypeScript
severity: info
rule:
  pattern: await $EXPR
  inside:
    kind: for_statement
```

2. fields สำคัญ: `rule.pattern`, `rule.kind`, `rule.inside`, `rule.has`, `rule.follows`, `rule.precedes`, `constraints` บน metavariables (`regex`, `kind`, `not`)
3. ถ้า inline rule เริ่มยาวหรือต้อง reuse → ย้ายไป `rules/` ผ่าน `/update-project-rules`

### 5. Common Recipes

> Goal: patterns สำเร็จรูปสำหรับ search ที่เจอบ่อย

| ต้องการหา | Pattern |
|-----------|---------|
| function definition | `function $NAME($$$) { $$$ }` |
| call site ของ fn | `$FN($$$)` แล้ว filter ด้วย `inside`/`kind` |
| import จาก module | `import $$$ from "MODULE"` หรือ inline rule `kind: import_statement` + `has: { pattern: "MODULE" }` |
| JSX component usage | `<$COMP $$$ />` (lang tsx) |
| console calls | `console.$METHOD($$$)` |
| class method | inline rule `kind: method_definition` + `inside: { kind: class_body }` |
| async function | `async function $NAME($$$) { $$$ }` |

### 6. Consume Results

> Goal: ใช้ผลลัพธ์ต่อให้ถูกทาง

1. อ่าน code → เปิดไฟล์ที่ file:line จาก output
2. นับ/aggregate → `--json` แล้ว process ด้วย `/use-scripts` หรือ `/use-astgrep-programmatic`
3. แก้ไขจุดเดียว/few points → แก้มือ
4. แก้หลายจุด mechanical → `/replace` (rewrite rules) หรือ `/migration-by-astgrep`
5. ถ้า search นี้เป็น hygiene check ที่ควรรันประจำ → `/update-project-rules` หรือ `check-*` skill

## Rules

### 1. AST Over Regex

- ใช้ AST patterns ก่อน text search เมื่อหา structural code (definitions, calls, imports, JSX) — match ได้ข้าม whitespace/comments ที่ regex พลาด
- ใช้ regex/`Grep` เฉพาะเมื่อหา text จริงๆ (strings, comments, config values) ไม่ใช่ structure

### 2. Pattern Discipline

- ทดสอบ pattern บนไฟล์ตัวอย่างก่อนรันทั้ง project เสมอ
- matches 0 → ตรวจ `--lang` และ pattern syntax ก่อนสรุปว่าไม่มี
- matches เยอะเกิน → เพิ่ม `inside`/`has`/`kind` constraints ไม่ใช่ filter ด้วย regex ทีหลัง
- ระบุ `--lang` เมื่อ extension ไม่มาตรฐานหรือผ่าน stdin

### 3. Interface Selection

- งานครั้งเดียว/iterate pattern → CLI shell
- งาน batch, aggregation, multi-pass, integrate กับ tools → `/use-astgrep-programmatic`
- ห้ามเขียน loop shell ซับซ้อนครอบ CLI หลายรอบ — ย้ายไป programmatic script แทน

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงาน matches เป็นตารางด้วย `/report` เมื่อผลเยอะ
- ใช้ /check-code-structure ถ้าจำเป็น

## Expected Outcome

- เจอ code ที่ต้องการด้วย AST pattern ที่ถูกต้องและจำเพาะ
- เลือก interface (CLI/programmatic) ถูกต้องตามขนาดงาน
- Pattern ที่ใช้ซ้ำถูก promote เป็น rule หรือ analyzer อย่างเหมาะสม
