---
name: review-naming
description: Review variable, function, class, file, directory, API endpoint, database naming, prefix/suffix conventions, cross-layer consistency
---

## Goal

Review naming conventions ครอบคลุม variable, function, class, file, directory, API, database พร้อม health score

## Scope

naming review สำหรับ: variable naming, function naming, class naming, file naming patterns, file name reflects content, file extension correctness, prefix/suffix conventions (use-*, *.server.ts, *.client.ts), directory naming, API endpoint naming, database table/column naming, cross-layer consistency, naming clarity (no data/temp/single-letter), self-documenting names

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ naming patterns และ conventions ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ naming structure
2. ระบุ language conventions, framework conventions, project-specific naming rules ที่ใช้

### 2. Deep Analyze

> Goal: ครอบคลุมทุก naming dimension พร้อม health score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ naming patterns
2. ทำ `/update-codebase-health-cli` — `/update-codebase-health-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-codebase-health-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-health` เพื่อดึง metrics ล่าสุด

### 3. Code Naming Review

> Goal: ครอบคลุม variable, function, class naming

1. ตรวจสอบ variable naming: camelCase for JS/TS variables, snake_case for Python, PascalCase for constants, descriptive names, no single-letter names (except loop indices), no data/temp/info names, boolean naming (is/has/can/should prefix)
2. ตรวจสอบ function naming: verb-first naming (get/set/create/update/delete), action naming, async function naming (async suffix if needed), event handler naming (on/handle prefix), utility function naming, consistent verb usage
3. ตรวจสอบ class naming: PascalCase, noun naming, interface naming (I prefix if convention), type vs interface naming, enum naming, generic type parameter naming (T, K, V, descriptive)
4. ตรวจสอบ naming clarity: self-documenting names, name reflects purpose, name reflects type, no misleading names, no abbreviated names ที่ไม่ชัด, consistent terminology

### 4. File, Directory And Cross-Layer Naming Review

> Goal: ครอบคลุม file, directory, API, database naming

1. ตรวจสอบ file naming: component PascalCase, utility camelCase, test .test.ts/.spec.ts, file name reflects content, file extension correctness, prefix/suffix conventions (use-*, *.server.ts, *.client.ts, *.config.ts)
2. ตรวจสอบ directory naming: kebab-case for directories, domain-based directory naming, feature-based directory naming, consistent directory structure, plural vs singular
3. ตรวจสอบ API endpoint naming: RESTful resource naming, plural nouns for collections, kebab-case for URLs, consistent endpoint naming, HTTP method consistency
4. ตรวจสอบ database naming: table naming (snake_case plural), column naming (snake_case), foreign key naming (table_id), index naming, constraint naming, consistent naming conventions
5. ตรวจสอบ cross-layer consistency: same concept same name across layers, API field name vs database column name mapping, client-side naming vs API naming, consistent terminology across codebase
6. Critical: inconsistent naming ที่ก่อให้เกิด bug, misleading name ที่ทำให้เข้าใจผิด, naming ที่สื่อผิดความหมายใน critical path
7. High: inconsistent convention across layer, naming ที่สื่อผิด, single-letter names ใน non-trivial scope, data/temp/info names, inconsistent verb usage
8. Medium: minor naming inconsistency, inconsistent prefix/suffix, missing naming convention documentation
9. Low: cosmetic, minor naming improvement, documentation gap

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ health score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี API → ข้าม Step 4 item 3
- ถ้า project ไม่มี database → ข้าม Step 4 item 4
- ถ้า project ไม่มี TypeScript → ข้าม Step 3 item 3 สำหรับ interface/type naming

### 2. Severity Classification

- Critical: inconsistent naming ที่ก่อให้เกิด bug, misleading name ที่ทำให้เข้าใจผิด, naming ที่สื่อผิดความหมายใน critical path
- High: inconsistent convention across layer, naming ที่สื่อผิด, single-letter names ใน non-trivial scope, data/temp/info names, inconsistent verb usage
- Medium: minor naming inconsistency, inconsistent prefix/suffix, missing naming convention documentation
- Low: cosmetic, minor naming improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ variable, function, class, file, หรือ endpoint ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก naming section
- Health score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
