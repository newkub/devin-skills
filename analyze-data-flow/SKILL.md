---
name: analyze-data-flow
description: วิเคราะห์และ trace data flow จาก input ไป output
argument-hint: "[entrypoint]"
related:
  - analyze-file-structure
  - analyze-dependencies
  - analyze-codebase-quality
  - draw-svg-image
---

## Goal
trace ข้อมูลจาก entrypoint ผ่านทุก layer จนถึง output หรือ database

## Scope
- รองรับ web, API, ETL, stream pipelines
- ใช้ static analysis และ grep
- รายงานเป้น diagram หรือ bullet list

## Execute
### 1. Identify Entrypoints

> Goal: Identify Entrypoints

1. หา entrypoints: routes, handlers, queue consumers, cron jobs
2. ระบุ input ทีรับเข้า
3. ระบุ expected output

### 2. Trace Path

> Goal: Trace Path

1. ใช้ `grep`, `ast-grep`, หรือ `code_search` ตาม symbols
2. ติดตามการเรียก function, service, database
3. บันทึก files/functions ทีผ่าน

### 3. Map Transformations

> Goal: Map Transformations

1. ระบุ validation, parsing, business logic
2. หา external calls เช่น API, DB, cache
3. ตรวจสอบ error handling และ side effects

### 4. Report

> Goal: Report

1. สร้าง data flow diagram ด้วย `draw-svg-image` หรือ text
2. สรุป critical paths
3. ระบุ risks เช่น missing validation

## Rules
### 1. Completeness

- trace ทุก path ทีเป็นไปได้
- ระบุทั้ง happy path และ error path
- ไม่สันนิษฐาน behavior ทีไม่มีหลักฐาน

### 2. Read Only

- ไม่เปลี่ยน code ใน step นี้
- ใช้ read/search tools
- บันทึก diagram ลง temp ถ้าจำเป็น

## Expected Outcome
- data flow diagram หรือ bullet map
- รายการ files/functions ในแต่ละ path
- risk ทีพบ
