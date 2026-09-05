---
name: review-content-coverage
description: เขียน content ครอบคลุมทุก features, APIs, และ use cases
argument-hint: "[scope]"
related:
  - follow-coverage
  - run-test-coverage
  - follow-best-practice
  - deep-review-codebase
  - suggest-next-action
  - resolve-errors
  - review-writing
  - improve-docs
---

## Goal

เขียน content ครอบคลุมทุก features, APIs, และ use cases โดย research จากแหล่งข้อมูลหลายชั้น

## Scope

ใช้สำหรับเขียน content ที่ครอบคลุมทุก aspects ของ skill, project, หรือ documentation

ดูเพิ่มเติม: /deep-review-codebase

## Execute

### 1. Research From Multiple Sources

> Goal: Research From Multiple Sources

1. รวบรวมข้อมูลจาก `DeepWiki`, `Context7`, `search_web`, Official Documentation
2. จำกัด `Context7` ไม่เกิน 3 ครั้งต่อคำถาม
3. ดูรายละเอียดใน [references/content-coverage-checklist.md](references/content-coverage-checklist.md)

### 2. Extract Knowledge

> Goal: Extract Knowledge

1. จด core concepts, features, examples, best practices, edge cases
2. ดูรายละเอียดใน [references/content-coverage-checklist.md](references/content-coverage-checklist.md)

### 3. Analyze Coverage Gaps

> Goal: Analyze Coverage Gaps

1. วิเคราะห์ features, APIs, use cases ทั้งหมด
2. ระบุ content ที่ขาดและจัดลำดับ priority
3. ดูรายละเอียดใน [references/content-coverage-checklist.md](references/content-coverage-checklist.md)

### 4. Write Missing Content

> Goal: Write Missing Content

1. เขียน guides, examples, API references, key-concepts, principles
2. ดูรายละเอียดใน [references/content-coverage-checklist.md](references/content-coverage-checklist.md)

### 5. Verify Completeness

> Goal: Verify Completeness

1. ตรวจสอบว่าทุก feature, API, use case, concept มี content
2. ดูรายละเอียดใน [references/content-coverage-checklist.md](references/content-coverage-checklist.md)

### 6. Update Index Files

> Goal: Update Index Files

1. อัปเดต `SKILL.md`, sitemap, references และ links
2. ดูรายละเอียดใน [references/content-coverage-checklist.md](references/content-coverage-checklist.md)

## Rules

### 1. Source Priority

- ลำดับแหล่งข้อมูล: `DeepWiki` → `Context7` → `Web Search` → `Official Docs`
- ใช้ `DeepWiki` ก่อนถ้าเป็น GitHub repository
- ใช้ `Context7` สำหรับ libraries และ frameworks
- เข้าถึง `Official Documentation` เสมอ

### 2. Content Quality

- ทำ `/review-writing` สำหรับจัดรูปแบบและคุณภาพเนื้อหา
- ใช้ kebab-case สำหรับชื่อไฟล์
- จัดลำดับ content ตาม logical flow
- ใช้ index files สำหรับ organization

### 3. Coverage Requirements

- ทุก features ต้องมี guide
- ทุก APIs ต้องมี examples
- ทุก use cases ต้องมี documentation
- ทุก concepts ต้องมี explanations
- ทุก best practices ต้องมี guidelines

- ใช้ /follow-coverage ถ้าจำเป็น
- ใช้ /run-test-coverage ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Metrics

- ดู metrics สำหรับ review ใน [references/scoring.md](references/scoring.md)

- ใช้ /improve-docs ถ้าจำเป็น

## Expected Outcome

- Content ครอบคลุมทุก features, APIs, และ use cases
- ข้อมูลถูกต้องและเป็นปัจจุบันจาก multiple sources
- Guides ครบถ้วนและอ่านง่าย
- Examples ที่ใช้งานได้จริง
- References ที่ถูกต้องและอัปเดต
- Index files ครบถ้วนและถูกต้อง
