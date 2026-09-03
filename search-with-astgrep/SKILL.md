---
name: search-with-astgrep
description: ค้นหา code patterns ด้วย ast-grep โดยใช้ AST-based patterns
argument-hint: "[pattern]"
related:
  - use-ast-grep
  - use-ast-grep-programatic
  - follow-tool-ast-grep
  - search-files-patterns
  - search-similar
  - replace
  - report-table
---

## Goal

ค้นหา code patterns ด้วย `ast-grep` โดยใช้ AST-based patterns ที่แม่นยำกว่า regex สำหรับ ad-hoc search, review, debug หรือเตรียม refactor

## Scope

ใช้สำหรับ one-off search บน codebase โดยไม่ต้องตั้งค่า `sgconfig.yml` หรือ project rules รองรับทั้ง structural patterns, regex, และ YAML rule ชั่วคราว

ดูเพิ่มเติม: /use-ast-grep-programatic, /search-files-patterns, /search-similar

## Execute

### 1. Prepare

> Goal: เลือก runtime และระบุ scope ก่อนค้นหา

1. ตรวจสอบภาษาที่ใช้ใน project จากไฟล์ extensions หรือ manifest
2. ถ้า project มี `@ast-grep/cli` ใน `devDependencies` → ใช้ `ast-grep` โดยตรง
3. ถ้าไม่มี → ใช้ `bunx ast-grep` โดยไม่ต้องติดตั้ง
4. ระบุ paths ที่ต้องการค้นหา: `.`, `src/`, `app/`, หรือเฉพาะ workspace
5. ถ้า scope ไม่ชัด → ทำ `/ask-me`

### 2. Build Pattern

> Goal: แปลง query เป็น ast-grep pattern ที่ถูกต้อง

1. ถ้า user ให้ code snippet → แปลงเป็น AST structural pattern
2. ถ้า user ให้ regex → ใช้ `ast-grep run --pattern 'REGEX'`
3. ถ้าต้องการ match โครงสร้าง → ใช้ YAML rule ชั่วคราวผ่าน `--inline-rules`
4. ทดสอบ pattern บนไฟล์ตัวอย่าง 1-2 ไฟล์ก่อนรันทั้ง project
5. ถ้า pattern ซับซ้อน → ทำ `/follow-tool-ast-grep` หรือ `/use-ast-grep`

### 3. Search

> Goal: รัน search และรวบรวมผลลัพธ์

1. รัน `ast-grep run --pattern 'PATTERN' [paths]`
2. หรือรัน `ast-grep scan --inline-rules 'YAML_RULE' [paths]`
3. ใช้ `--lang LANG` ถ้า auto-detect ไม่ชัด
4. ใช้ `--json pretty` ถ้าต้องการ structured output
5. ใช้ `--context N` เพื่อแสดงบรรทัดรอบข้าง
6. ถ้าผลลัพธ์เยอะเกินไป → ปรับ pattern ให้จำเพาะขึ้น

### 4. Refine

> Goal: ปรับ pattern ให้ได้ผลลัพธ์ที่ต้องการ

1. ถ้าไม่พบ matches → ลด specificity หรือตรวจ syntax
2. ถ้า matches เยอะเกิน → เพิ่ม constraints, filters, หรือ transformation conditions
3. ถ้าต้องการแก้ไข → ส่งต่อ `/replace` พร้อม pattern และ replacements
4. ถ้าต้องการ scan ซ้ำบ่อย → ทำ `/use-ast-grep` เพื่อตั้งค่า project rules

### 5. Report

> Goal: สรุปผลลัพธ์ให้เข้าใจง่าย

1. สรุป matches เป็น `/report-table` หรือ bullet points
2. ระบุ `file`, `line`, `snippet`, `language` สำหรับแต่ละ match
3. บันทึก pattern ที่ใช้เพื่อนำไป reuse
4. ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

## Rules

### 1. Pattern Style

- ใช้ AST-based patterns สำหรับ structural match
- ใช้ regex เฉพาะเมื่อ AST pattern ไม่จำเป็น
- ตรวจสอบ syntax ด้วย `ast-grep run --pattern 'PATTERN' --debug`

### 2. Language Handling

- ปล่อยให้ ast-grep auto-detect ภาษาโดย default
- ระบุ `--lang` ถ้า file extension ไม่ได้มาตรฐานหรือมี multiple languages
- รองรับ `js`, `ts`, `tsx`, `jsx`, `vue`, `svelte`, `py`, `rs`, `go`, `java`, `kt`, และอื่นๆ ตามที่ ast-grep รองรับ

### 3. No Project Setup

- ไม่ต้องสร้าง `sgconfig.yml` สำหรับ ad-hoc search
- ถ้าต้องการ reusable rules → ส่งต่อ `/use-ast-grep` หรือ `/update-project-rules`

### 4. Validation

- ทดสอบ pattern บนไฟล์ตัวอย่างก่อนรันทั้ง project
- ไม่รัน pattern ที่ยังไม่ได้ validate เพราะอาจ match ทุกไฟล์
- ถ้า command fail → ทำ `/resolve-errors` แล้ว retry

## Expected Outcome

- ได้รายการ matches ครบถ้วนพร้อม `file`, `line`, `snippet`
- pattern ที่ใช้ถูกต้องและสามารถนำไป reuse ได้
- ไม่มี broken syntax หรือ invalid ast-grep pattern
- พร้อมส่งต่อไป `/replace`, `/use-ast-grep`, หรือ `/report-table`
