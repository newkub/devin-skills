---
name: follow-gritql
description: ตั้งค่าและใช้งาน GritQL สำหรับ code search, transformation และ linting ใน Biome
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
---

## Goal

ใช้ GritQL สำหรับ AST-based code search, transformation และ custom linting ใน Biome

## Scope

ตั้งค่าและใช้งาน GritQL patterns สำหรับ JavaScript/TypeScript, CSS, และ JSON

## Execute

### 1. Understand GritQL Basics
> Goal: Understand GritQL Basics

1. อ่าน GritQL documentation ที่ `https://biomejs.dev/reference/gritql/`
2. เรียนรู้ pattern syntax ด้วย code snippets ใน backticks
3. เรียนรู้ variables ด้วย `$variable` syntax
4. เรียนรู้ conditions ด้วย `where` และ operators

### 2. Set Up Language Target
> Goal: Set Up Language Target

1. ระบุ target language ด้วย `language js`, `language css`, หรือ `language json`
2. ใช้ flavors เช่น `typescript`, `jsx` สำหรับ JavaScript
3. ตรวจสอบ integration status ของแต่ละ language
4. อ่าน language documentation สำหรับ syntax เฉพาะภาษา

### 3. Write Basic Patterns
> Goal: Write Basic Patterns

1. เขียน code snippet patterns ใน backticks เช่น `` `console.log($message)` ``
2. ใช้ variables สำหรับ flexible matching เช่น `$method`, `$message`
3. ใช้ spread metavariables `$$$args` สำหรับ match arguments
4. ใช้ same variable multiple times สำหรับ consistency matching

### 4. Add Conditions And Filters
> Goal: Add Conditions And Filters

1. ใช้ `where` clause สำหรับ conditions
2. ใช้ pattern matching operator `<:` สำหรับ pattern comparison
3. ใช้ `or` สำหรับ multiple pattern options
4. ใช้ built-in functions สำหรับ complex logic

### 5. Create Analyzer Plugin
> Goal: Create Analyzer Plugin

1. สร้าง GritQL plugin file สำหรับ Biome linter
2. ใช้ `register_diagnostic()` สำหรับ custom lint rules
3. กำหนด severity และ message สำหรับ diagnostics
4. ลงทะเบียน plugin ใน Biome configuration

### 6. Use Biome Search Command
> Goal: Use Biome Search Command

1. ใช้ `biome search` สำหรับ structural code search
2. ใช้ single quotes รอบ GritQL patterns เพื่อ avoid shell conflicts
3. ใช้ `--language` flag สำหรับ specify target language
4. ใช้ output options สำหรับ format results

### 7. Optimize Performance
> Goal: Optimize Performance

1. ใช้ anchor kinds สำหรับ efficient matching
2. หลีกเลี่ยง overly broad patterns
3. ใช้ specific node types แทน full-tree walks
4. ตรวจสอบ performance ด้วย benchmarking

## Rules

### 1. Pattern Syntax

เขียน GritQL patterns อย่างถูกต้อง:

- ใช้ backticks สำหรับ code snippets: `` `console.log($message)` ``
- ใช้ `$variable` สำหรับ metavariables
- ใช้ `$$$args` สำหรับ spread metavariables
- ใช้ `where` clause สำหรับ conditions
- ใช้ `<:` operator สำหรับ pattern matching

### 2. Language Support

เลือก target language ที่เหมาะสม:

- `language js` สำหรับ JavaScript (รองรับ `typescript`, `jsx` flavors)
- `language css` สำหรับ CSS
- `language json` สำหรับ JSON
- ตรวจสอบ integration status ก่อนใช้งาน
- อ่าน language documentation สำหรับ syntax เฉพาะภาษา

### 3. Variable Usage

ใช้ variables อย่างมีประสิทธิภาพ:

- ใช้ same variable name หลายครั้งสำหรับ consistency matching
- ใช้ spread metavariables สำหรับ flexible argument matching
- ใช้ pattern matching ใน `where` clause
- หลีกเลี่ยง overly generic variables

### 4. Condition Logic

เขียน conditions อย่างชัดเจน:

- ใช้ `where` clause สำหรับ filtering
- ใช้ `<:` operator สำหรับ pattern comparison
- ใช้ `or` สำหรับ multiple options
- ใช้ built-in functions สำหรับ complex logic

### 5. Plugin Integration

สร้าง Biome plugins อย่างถูกต้อง:

- ใช้ `register_diagnostic()` สำหรับ custom rules
- กำหนด severity และ message อย่างชัดเจน
- ลงทะเบียน plugin ใน Biome configuration
- ตรวจสอบ plugin compatibility กับ Biome version

### 6. Search Usage

ใช้ `biome search` อย่างถูกต้อง:

- ใช้ single quotes รอบ patterns: `biome search '`console.log($message)`'`
- ใช้ `--language` flag สำหรับ target language
- ใช้ output options สำหรับ format results
- หลีกเลี่ยง shell conflicts ด้วย backticks

### 7. Performance Best Practices

ปรับปรุง performance ของ patterns:

- ใช้ anchor kinds สำหรับ efficient matching
- หลีกเลี่ยง overly broad patterns
- ใช้ specific node types แทน full-tree walks
- ตรวจสอบ performance ด้วย benchmarking

## Expected Outcome

- เขียน GritQL patterns ได้อย่างถูกต้อง
- สร้าง custom Biome lint rules ด้วย GritQL
- ใช้ `biome search` สำหรับ structural code search
- เข้าใจความแตกต่างระหว่าง GritQL และ ast-grep

## Common Mistakes

ข้อผิดพลาดที่พบบ่อย:

- ไม่ใช้ single quotes รอบ patterns ใน shell
- ใช้ overly broad patterns ที่ match มากเกินไป
- ไม่ระบุ target language อย่างชัดเจน
- ไม่ optimize patterns สำหรับ performance

## Anti-Patterns

รูปแบบที่ไม่ควรทำ:

- ❌ ใช้ GritQL สำหรับ simple text search (ใช้ grep แทน)
- ❌ ไม่ใช้ conditions เมื่อจำเป็น
- ❌ สร้าง patterns ที่ match ทุกอย่าง
- ❌ ไม่ตรวจสอบ performance ของ complex patterns
