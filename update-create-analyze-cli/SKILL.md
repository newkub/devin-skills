---
name: update-create-analyze-cli
description: สร้างหรืออัปเดต tools/analyze analyzers ให้ครอบคลุม features ปัจจุบัน 60+ categories 5 domains
argument-hint: "[category-or-domain]"
related:
  - report-table
  - resolve-errors
  - suggest-next-action
---

## Goal

สร้างหรืออัปเดต `tools/analyze` analyzers ให้ครอบคลุม codebase features ปัจจุบัน 60+ categories 5 domains ลด false positives และ analyzer errors

## Scope

ใช้กับ `tools/analyze` ใน monorepo โดย detect features, เพิ่ม/แก้ analyzer categories, tune rules และ validate ด้วย review CLI

## Execute

### 1. Detect Codebase Features

> Goal: รู้ features ทีต้องวิเคราะห์

1. อ่าน root `package.json`, `moon.yml`, `turbo.json`
2. สร้าง list workspaces: `apps`, `packages`, `integrations`, `tools`
3. ระบุ tech stack: framework, database, API, auth, payments, realtime, search, integrations, notifications, mobile, AI, SEO
4. สร้าง keyword/file patterns สำหรับแต่ละ feature

### 2. Plan Analyzers

> Goal: รู้ว่าต้องเพิ่ม/แก้ analyzers อะไร

1. อ่าน `tools/analyze/src/domain/analyzers/index.ts` ดูกลุ่ม analyzers
2. นับจำนวน categories ปัจจุบัน
3. ระบุ categories ทีขาดหรือ score 0 แบบ false negative
4. ระบุ categories ที mapping ผิด domain
5. วางแผนเพิ่ม categories จนถึง 60+

### 3. Implement Analyzers

> Goal: เพิ่ม/แก้ analyzer code

1. แก้ regex ให้รองรับ Windows และ Unix paths ด้วย `[\/]`
2. normalize paths ใน context loader ถ้าจำเป็น
3. เพิ่ม analyzer functions ใน group files เช่น `features.ts`, `architecture.ts`, `security.ts`
4. เพิ่ม `Finding` พร้อม `evidence`: file path, line, message, severity
5. กำหนด `reviewWorkflow` ให้ถูกต้อง
6. ใช้ `countMatches`, `matchStats`, `countWordOccurrences` จาก `helpers.ts`

### 4. Tune Rules

> Goal: ลด false positives และ analyzer errors

1. ตรวจ regex patterns ว่า match ถูกต้องบน Windows
2. ใช้ `try/catch` ใน analyzer functions ไม่ให้ crash
3. ตรวจ exceptions ถูกจับใน `runAllAnalyzers`
4. ลด false positives ด้วย stricter patterns
5. ตรวจ `analyzerErrors` ใน report

### 5. Validate

> Goal: ยื่นยันว่า analyzers ทำงาน

1. รัน `bun --filter tools-analyze lint`
2. รัน `bun --filter tools-analyze typecheck`
3. รัน `bun --filter tools-analyze test`
4. รัน `bun --filter tools-review-codebase review-codebase`
5. ถ้า fail → `/resolve-errors` แล้วแก้ (max 3)

### 6. Report

> Goal: สรุปผล

1. ทำ `/report-table` แสดง categories ก่อน/หลัง, score, falsePositiveRate
2. ทำ `/suggest-next-action`

## Rules

### 1. Path Compatibility

- ใช้ regex `[\/]` แทน `\` หรือ `/` ตรงๆ
- normalize paths ก่อน match ถ้าได้
- ทดสอบบน Windows และ Unix paths

### 2. Evidence-Based

- ทุก finding ต้องมี file path
- ใช้ metrics จริงจาก codebase
- ไม่เดา

### 3. Category Count

- target 60+ categories
- categories ต้องกระจายทั่ว 5 domains
- ไม่รวม category ซ้ำ

### 4. No Crash

- จับ exceptions ใน `runAllAnalyzers`
- ใช้ safe access
- ไม่ throw จาก analyzer

### 5. Minimal

- แก้เฉพาะ categories ที metrics ระบุ
- ไม่ rewrite analyzers ทั้งหมด
- reuse helpers

## Expected Outcome

- `tools/analyze` มี 60+ categories
- categories ครอบคลุม features ปัจจุบัน
- falsePositiveRate <= 20%
- analyzerErrors = 0
- review score >= 70
- build, typecheck, tests ผ่าน
