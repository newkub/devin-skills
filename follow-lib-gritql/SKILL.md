---
name: follow-lib-gritql
description: ใช้ GritQL ใน Biome สำหรับ code search, transformation และ custom linting
related:
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้ GritQL ร่วมกับ Biome สำหรับ structural code search, code transformation และ custom lint rules

## Scope

ใช้กับ JavaScript/TypeScript, CSS และ JSON ในโปรเจกต์ที่ใช้ Biome v2+

## Execute

### 1. Understand GritQL Basics

> Goal: เข้าใจพื้นฐาน GritQL pattern syntax

1. อ่าน GritQL documentation ที่ `https://biomejs.dev/reference/gritql/`
2. เรียนรู้ pattern syntax ด้วย code snippets ใน backticks
3. เรียนรู้ variables ด้วย `$variable` syntax
4. เรียนรู้ conditions ด้วย `where` และ operators

### 2. Set Up Language Target

> Goal: ระบุ target language และ engine สำหรับ patterns

1. ระบุ target language ด้วย `language js`, `language css` หรือ `language json`
2. ใช้ flavors เช่น `typescript`, `jsx` สำหรับ JavaScript ด้วย `language js(typescript,jsx)`
3. ใช้ `engine biome(1.0)` เมื่อต้องการ match Biome syntax nodes เช่น `JsIfStatement`
4. ตรวจสอบ integration status ของแต่ละ language ก่อนใช้งาน

### 3. Write Basic Patterns

> Goal: เขียน code snippet patterns อย่างถูกต้อง

1. เขียน code snippet patterns ใน backticks เช่น `` `console.log($message)` ``
2. ใช้ variables สำหรับ flexible matching เช่น `$method`, `$message`
3. ใช้ spread metavariables `$$$args` สำหรับ match arguments
4. ใช้ same variable multiple times สำหรับ consistency matching
5. ใช้ `as $name` เพื่อ capture node span สำหรับ diagnostics หรือ rewrite

### 4. Add Conditions And Filters

> Goal: เพิ่ม conditions และ filters ด้วย `where` clause

1. ใช้ `where` clause สำหรับ conditions
2. ใช้ pattern matching operator `<:` สำหรับ pattern comparison
3. ใช้ `or` สำหรับ multiple pattern options
4. ใช้ built-in functions เช่น `register_diagnostic()` สำหรับ complex logic

### 5. Create GritQL Analyzer Plugin

> Goal: สร้าง GritQL plugin สำหรับ Biome linter

1. สร้างไฟล์ `.grit` สำหรับ plugin เช่น `.grit/no-console-log.grit`
2. ใช้ `register_diagnostic()` สำหรับ custom lint rules โดยระบุ `span`, `message` และ `severity`
3. ใช้ `fix_kind` (`safe` หรือ `unsafe`) เมื่อมี rewrite ด้วย `=>`
4. ลงทะเบียน plugin ใน `biome.jsonc` หรือ `biome.json` ภายใต้ key `plugins`

### 6. Use Biome Search Command

> Goal: ใช้ `biome search` สำหรับ structural code search

1. ใช้ `biome search '<pattern>' [path]` โดยห่อ pattern ด้วย single quotes
2. ใช้ `--language=<lang>` เช่น `javascript`, `css`, `json` สำหรับ target language
3. ระบุ path หรือ glob patterns สำหรับ scope ของ search
4. จำไว้ว่า `biome search` รองรับเฉพาะ search pattern ไม่รองรับ rewrites

### 7. Apply Rewrites (Optional)

> Goal: แก้ไข code ด้วย rewrite operator ใน plugins

1. ใช้ rewrite operator `=>` สำหรับ transform matched code
2. กำหนด `fix_kind` ใน `register_diagnostic()` เพื่อบ่งบอกความปลอดภัยของ fix
3. รัน `biome check --write` หรือ `biome lint --write` เพื่อ apply safe fixes
4. หลีกเลี่ยง unsafe rewrites หากอาจทำให้ code logic เปลี่ยน

### 8. Optimize Performance

> Goal: ปรับปรุง performance ของ patterns

1. ใช้ specific node types หรือ snippets แทน full-tree walks
2. หลีกเลี่ยง overly broad patterns
3. ใช้ anchors และ node matchers ที่เหมาะสม
4. ตรวจสอบ performance ด้วย benchmarking บน codebase จริง

## Rules

### 1. Pattern Syntax

- ใช้ backticks สำหรับ code snippets: `` `console.log($message)` ``
- ใช้ `$variable` สำหรับ metavariables
- ใช้ `$$$args` สำหรับ spread metavariables
- ใช้ `where` clause สำหรับ conditions
- ใช้ `<:` operator สำหรับ pattern matching

### 2. Language And Engine Support

- `language js` สำหรับ JavaScript รองรับ `typescript` และ `jsx` flavors
- `language css` สำหรับ CSS
- `language json` สำหรับ JSON
- `engine biome(1.0)` สำหรับ match Biome AST nodes เช่น `JsIfStatement`
- ตรวจสอบ integration status ก่อนใช้งาน

### 3. Variable Usage

- ใช้ same variable name หลายครั้งสำหรับ consistency matching
- ใช้ spread metavariables สำหรับ flexible argument matching
- ใช้ pattern matching ใน `where` clause
- หลีกเลี่ยง overly generic variables

### 4. Condition Logic

- ใช้ `where` clause สำหรับ filtering
- ใช้ `<:` operator สำหรับ pattern comparison
- ใช้ `or` สำหรับ multiple options
- ใช้ built-in functions สำหรับ complex logic

### 5. Plugin Integration

- ใช้ `register_diagnostic()` สำหรับ custom rules โดยระบุ `span`, `message`, `severity`
- กำหนด `fix_kind` เป็น `safe` หรือ `unsafe` เมื่อใช้ rewrite
- ลงทะเบียน plugin ใน Biome configuration
- ตรวจสอบ plugin compatibility กับ Biome version

### 6. Search Usage

- ใช้ single quotes รอบ patterns: `biome search '`console.log($message)`' ./src`
- ใช้ `--language=<lang>` สำหรับ target language
- หลีกเลี่ยง shell conflicts ด้วยการห่อ pattern ด้วย single quotes
- ไม่ใช้ rewrite (`=>`) กับ `biome search`

### 7. Rewrite And Fix Safety

- ใช้ `=>` operator สำหรับ transformation ใน GritQL plugins เท่านั้น
- กำหนด `fix_kind` ให้เหมาะสม
- รัน `biome check --write` สำหรับ safe fixes
- ทดสอบ rewrite บน sample files ก่อน apply ใน production

### 8. Performance Best Practices

- ใช้ specific node types แทน full-tree walks
- หลีกเลี่ยง overly broad patterns
- ใช้ anchors สำหรับ efficient matching
- ตรวจสอบ performance ด้วย benchmarking

- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- เขียน GritQL patterns ได้อย่างถูกต้อง
- สร้าง custom Biome lint rules ด้วย GritQL
- ใช้ `biome search` สำหรับ structural code search
- เข้าใจความแตกต่างระหว่าง GritQL และ `ast-grep`
