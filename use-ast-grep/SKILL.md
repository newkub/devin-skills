---
name: use-ast-grep
description: ใช้งาน ast-grep สำหรับ code search, linting และ transformation ด้วย AST-based pattern matching
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - exclude
---

## Goal

ใช้งาน ast-grep เพื่อค้นหา patterns ใน codebase อย่างมีประสิทธิภาพ ด้วย AST-based pattern matching

## Scope

ครอบคลุมการใช้งาน ast-grep สำหรับ code search, linting, และ transformation ด้วย AST-based pattern matching

## Execute

### 1. Prepare
> Goal: Prepare

- ทำ `/follow-write-devin-skills` เมื่อสร้างหรือแก้ไข workflow
- ติดตั้ง ast-grep CLI: `bun add -g @ast-grep/cli`
- รัน `ast-grep new` สร้าง project scaffolding (ถ้ายังไม่มี)
- สร้าง folder `rules/` สำหรับเก็บ rule files

### 2. Create Rule
> Goal: Create Rule

- สร้าง rule YAML file ใน `rules/`
- กำหนด id, language, rule, fix, message
- ใช้ meta variables ($VAR) สำหรับ capture nodes
- ใช้ atomic rules: pattern, kind, regex, nthChild, range
- ทำ `/update-ast-grep-rules` สำหรับเขียน rules ที่ซับซ้อน

### 3. Advanced Rules
> Goal: Advanced Rules

- ใช้ relational rules: inside, has, precedes, follows
- ใช้ composite rules: all, any, not, matches
- เขียน fix template สำหรับ auto-rewrite
- ใช้ transform สำหรับ complex transformations

### 4. Test Rules
> Goal: Test Rules

- สร้าง test cases (valid และ invalid)
- รัน `ast-grep test` เพื่อ verify rules
- ใช้ snapshot testing สำหรับ complex fixes
- รัน `ast-grep scan` เพื่อ test กับ codebase

### 5. Usage
> Goal: Usage

- ใช้ `ast-grep run -p 'pattern'` สำหรับ ad-hoc search
- รัน `ast-grep scan --config sgconfig.yml` สำหรับ routine check
- ใช้ `--interactive` สำหรับ selective apply
- ตรวจสอบ output และ tune rules

### 6. Outline Command
> Goal: Outline Command

ใช้ `sg outline` สำหรับ explore code structure และ navigation

- รัน `sg outline <file>` เพื่อดู structure ของ file (default: `--items structure --view digest`)
- รัน `sg outline <directory>` เพื่อดู exports ของ directory (default: `--items exports --view names`)
- ใช้ `--items imports` เพื่อดู dependencies
- ใช้ `--match <regex>` และ `--type <type>` เพื่อ filter symbols
- ใช้ `--view expanded` เพื่อ expand symbol ดู members ทั้งหมด
- ใช้ `--json` สำหรับ machine-readable output (pretty/compact/stream)
- ใช้ `--pub-members` เพื่อดูเฉพาะ public members
- ใช้ `--outline-rules <file>` เพื่อโหลด custom extraction rules
- ใช้ `--no-default-outline-rules` เพื่อแทนที่ bundled extractors
- ใช้ `--color auto|always|ansi|never` ควบคุม ANSI color
- ใช้ `-c <config>` เพื่อระบุ sgconfig.yml path
- ดู `/use-ast-grep-outline` สำหรับ detailed usage

## Rules

### 1. Rule Structure

โครงสร้างของ ast-grep rule:

- Rule เป็น YAML file ที่ define pattern สำหรับ match code
- ใช้ id, language, rule, fix, message fields
- Support multiple languages: JavaScript, TypeScript, Python, Rust, Go, Java, etc.
- เก็บ rules ใน folder `rules/` เท่านั้น

### 2. Pattern Matching

การ match patterns ด้วย AST:

- ใช้ `$META_VAR` สำหรับ capture nodes (e.g., `$FUNC`, `$NAME`)
- Pattern based on code syntax เช่น `console.log($ARG)`
- Support strictness level: smart, ast, cst, relaxed
- ใช้ kind สำหรับ match specific AST node types

### 3. Rule Categories

สามประเภทหลักของ ast-grep rules:

Atomic Rules:
- pattern, kind, regex, nthChild, range

Relational Rules:
- inside, has, precedes, follows

Composite Rules:
- all, any, not, matches

### 4. Meta Variables

การใช้ meta variables:

- ใช้ `$NAME` สำหรับ capture AST nodes
- Pattern ต้องเป็น valid code syntax
- Meta variables ใช้ใน fix template: `fix: console.warn($ARG)`

### 5. Rule Configuration

การตั้งค่า rule:

- id: unique identifier สำหรับ rule
- language: target programming language
- severity: error, warning, info, hint
- message: description ที่แสดงเมื่อ match
- fix: automatic rewrite pattern
- files/ignores: glob patterns สำหรับ include/exclude

### 6. Transform and Fix

การใช้ transform และ fix:

- ใช้ fix สำหรับ simple string replacement
- ใช้ transform สำหรับ complex transformations
- Support rewriters สำหรับ reusable transformation logic

### 7. Testing

การทดสอบ rules:

- ทุก rule ต้องมี valid และ invalid test cases
- ตรวจสอบว่า fix ไม่ทำให้ code เสีย
- ใช้ snapshot testing สำหรับ complex rewrites

### 8. Best Practices

แนวทางการเขียน rules:

- Atomic First: เริ่มจาก atomic rules (pattern, kind) ก่อน
- Compose Rules: ใช้ all, any, not สำหรับ combine multiple conditions
- Test Driven: เขียน test cases ก่อนเขียน rules
- Incremental: เริ่มจาก simple patterns แล้วค่อยเพิ่มความซับซ้อน
- Document: เขียน message ที่ชัดเจนสำหรับแต่ละ rule

### 9. Outline Usage

การใช้ `sg outline` สำหรับ code navigation:

Use Cases:
- ดู structure ของ file ก่อนอ่าน implementation
- ดู exports ของ directory เพื่อ understand module surface
- ตรวจสอบ dependencies ด้วย `--items imports`
- Expand symbol ด้วย `--view expanded` เพื่อดู members โดยไม่ต้องอ่านทั้ง file
- Filter symbols ด้วย `--match` และ `--type` เพื่อ narrow down search
- ใช้ `--pub-members` เพื่อดูเฉพาะ public members
- ใช้ `--json` สำหรับ machine-readable output (pretty/compact/stream)
- ใช้ `--outline-rules` สำหรับ custom extraction rules

Design Principles:
- Parse on demand: ไม่ build index แต่ parse files เมื่อต้องการ
- Stay local: ไม่ analyze cross-file relationships
- Declarative extraction: ใช้ rules สำหรับ define extraction logic
- Fast and deterministic: ไม่มี global knowledge แต่เร็วและ predictable

Output Format:
- Outline entry ประกอบด้วย: name, symbol type, source range, signature, AST kind, flags
- Top-level entries เรียกว่า items
- Direct children เรียกว่า members
- Support JSON output สำหรับ machine-readable consumption
- Exit codes: 0 = completed, 2 = fatal error

## Expected Outcome

- ast-grep rules ที่ใช้งานได้จริง
- Code search ที่มีประสิทธิภาพด้วย AST-based matching
- Custom lint rules สำหรับ project
- Automatic code transformation และ refactoring
