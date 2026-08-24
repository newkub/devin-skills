---
name: review-content-coverage
description: Review content coverage ครอบคลุม features, APIs, use cases พร้อม gaps และ score
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - validate
  - suggest-next-action
---


## Goal

Review content coverage ครอบคลุมทุก features, APIs, use cases โดย research จากแหล่งข้อมูลหลายชั้น พร้อมระบุ gaps และ score

## Scope

ใช้สำหรับ review content coverage ของ skill, project, หรือ documentation — วิเคราะห์ gaps ระหว่าง inventory และ coverage surface โดยไม่เขียนหรือลบ content

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ content structure และ coverage surface

1. ทำ `/scan-codebase` อ่านทุกไฟล์ content ใน target directory
2. ระบุ content inventory: guides, examples, references, key-concepts, principles, index files
3. ระบุ coverage surface: features, APIs, use cases, concepts, best practices
4. ถ้า target directory ไม่มี → stop และ report

### 2. Review Source Coverage

> Goal: ตรวจสอบว่า research sources ครอบคลุม

1. ตรวจสอบการใช้ `DeepWiki` สำหรับ GitHub repositories
2. ตรวจสอบการใช้ `Context7` สำหรับ libraries และ frameworks
3. ตรวจสอบ `Official Documentation` ถูกอ้างอิง
4. ตรวจสอบ `Web Search` ใช้เฉพาะ fallback
5. ตรวจสอบบันทึก core concepts, features, examples, best practices, edge cases

### 3. Review Coverage Gaps

> Goal: ระบุ content ที่ขาดและจัดลำดับ priority

1. ตรวจสอบทุก features มี guide
2. ตรวจสอบทุก APIs มี examples
3. ตรวจสอบทุก use cases มี documentation
4. ตรวจสอบทุก concepts มี explanations
5. ตรวจสอบทุก best practices มี guidelines
6. จำแนก gaps: missing guides, examples, API references, key-concepts, principles
7. จัดลำดับ priority: Getting Started > core features > edge cases > advanced

### 4. Score And Classify

> Goal: ให้ coverage score และ severity ชัดเจน

1. ให้ score ตาม coverage percentage: 100% (complete), 80-99% (good), 60-79% (fair), <60% (poor)
2. จำแนก severity: critical (missing Getting Started), high (missing core features), medium (missing edge cases), low (missing advanced)
3. ระบุ action items สำหรับแต่ละ gap: สร้าง, อัปเดต, merge

### 5. Validate And Report

> Goal: รายงาน findings ชัดเจนและ actionable

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate`
3. รายงานเป็นตาราง: category | coverage % | gaps found | severity | action item
4. ทำ `/report-table` สำหรับสรุปผล
5. ทำ `/report` พร้อม review score
6. ทำ `/suggest-next-action`

## Rules

### 1. Review Only

- เป็น review reference เท่านั้น ไม่แก้ไข ไม่ลบ ไม่สร้าง content ใหม่
- ห้ามลบไฟล์หรือ content ที่มีอยู่

### 2. Coverage Surface

- ทุก features ต้องมี guide
- ทุก APIs ต้องมี examples
- ทุก use cases ต้องมี documentation
- ทุก concepts ต้องมี explanations
- ทุก best practices ต้องมี guidelines

### 3. Source Priority

- ลำดับแหล่งข้อมูล: `DeepWiki` → `Context7` → `Web Search` → `Official Docs`
- ใช้ `DeepWiki` ก่อนถ้าเป็น GitHub repository
- ใช้ `Context7` สำหรับ libraries และ frameworks
- อ้างอิง `Official Documentation` เสมอ

### 4. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder, generic filler

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- ตาราง: category | coverage % | gaps found | severity | action item
- Coverage gaps ถูกระบุและจัดลำดับ
- Review score สำหรับ content coverage
- Action items ชัดเจนสำหรับขั้นตอนถัดไป
- ไม่มีการลบหรือแก้ไข content ที่มีอยู่

