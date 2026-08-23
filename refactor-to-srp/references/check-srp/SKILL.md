---
name: check-srp
description: ตรวจสอบ SRP violations ด้วย ast-grep outline และ deep analysis พร้อมรายงานครอบคลุม
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related: []
---
## Goal

ตรวจสอบ SRP violations ใน code units (files, classes, functions) โดยใช้ `ast-grep outline` และ `deep-analyze-by-use-scripts` พร้อมรายงานครอบคลุม

## Scope

ใช้กับ source code ใน project หรือ workspace ที่ต้องการวิเคราะห์ single responsibility ของ files, functions, classes, types

## Execute

### 1. Determine Scope And Threshold

> Goal: กำหนดเป้าหมายและเกณฑ์ SRP
> Goal: มี scope และ threshold ชัดเจอก่อน analyze

1. รับ target path หรือ file จาก user (default = ทั้ง project)
2. ค่าเริ่มต้น threshold:
   - ไฟล์มี top-level symbols เกิน 5 อันที่ไม่เกี่ยวข้องกัน
   - class/type มี public members เกิน 10
   - function มี public members หรือทำหลายหน้าที่
3. ถ้ามี argument จาก user → ใช้ค่าที่ user ระบุ

### 2. Run Ast-Grep Outline

> Goal: ใช้ `ast-grep outline` สรุป top-level symbols และ members
> Goal: มี structural overview ของ target files

1. ทำ `/use-ast-grep-outline` เพื่อรัน `sg outline <path> --json`
2. ดู top-level items (functions, classes, interfaces, types, exports)
3. ดู members ของแต่ละ class/type ด้วย `--view expanded`
4. รวบรวม imports/dependencies ด้วย `--items imports`

### 3. Calculate SRP Metrics

> Goal: ประมวลผล metrics จาก outline output
> Goal: ระบุ units ที่ violate SRP

1. ใช้ `/use-scripts` สร้าง script นับ top-level symbols ต่อไฟล์
2. นับ public members ต่อ class/type
3. วิเคราะห์ cohesion: ดูว่า imports กับ symbols ในไฟล์อยู่ใน domain เดียวกันหรือไม่
4. ระบุ units ที่เกิน threshold

### 4. Deep Analyze With Use Scripts

> Goal: ทำ deep analysis สำหรับ findings ที่พบ
> Goal: ได้รายงานลึกซึ้งครอบคลุม

1. ทำ `/deep-analyze-by-use-scripts` บน findings จาก Step 3
2. รวบรวม metrics: file count, symbols, members, imports, cross-references
3. จัดหมวดหมู่ตาม severity: Critical, High, Medium, Low

### 5. Generate Comprehensive Report

> Goal: สร้างรายงาน SRP ครอบคลุม
> Goal: รายงานสามารถใช้ตัดสินใจ refactor ได้

1. สร้างตาราง: file, unit, top-level symbols, public members, cohesion score, srp status, severity, recommended action
2. ใช้ format 7 columns จาก `/deep-analyze-by-use-scripts`: Scope, File, Cause, Solutions, Severity, Review Workflow, Evidence
3. สรุปสถิติ: จำนวน files, จำนวน violations แยกตาม severity, จำนวน quick wins
4. แนะนำ next action: `/refactor-to-srp`, `/refactor`, หรือ `/restructure`

## Rules

### SRP Thresholds

- top-level symbols ต่อไฟล์ > 5 ที่ไม่เกี่ยวข้อง = potential violation
- public members ต่อ class/type > 10 = potential violation
- function มี public members > 0 หรือทำหลายหน้าที่ = potential violation
- imports ข้าม boundary หรือ layer = potential violation

### Tool Usage

- ใช้ `/use-ast-grep-outline` สำหรับ structural overview เบื้องต้น
- ใช้ `/deep-analyze-by-use-scripts` สำหรับ deep analysis และ metrics
- ใช้ `/use-scripts` สำหรับ count/aggregate metrics ถ้ามี >10 ไฟล์

### Exclusions

- ข้าม test files (`*.test.*`, `*.spec.*`)
- ข้าม generated files, barrel/index files
- ข้าม `node_modules/`, `dist/`, `build/`, `temp/`

### Report Quality

- ทุก finding ต้องมี evidence: file path, symbol counts, imports
- ระบุ severity ตาม impact
- แยก quick wins กับ major improvements

## Expected Outcome

- รายงาน SRP violations ครอบคลุมด้วยตาราง
- Metrics จาก `ast-grep outline` และ `deep-analyze-by-use-scripts`
- Severity, evidence, และ recommended actions ชัดเจน
- ไม่มี false positive จาก test/generated/barrel files
