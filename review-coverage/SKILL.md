---
name: review-coverage
description: Review content coverage ครอบคลุมทุก features, APIs, use cases พร้อม review score
related:
  - scan-codebase
  - report-format-table
  - suggest-next-action
---

## Goal

Review content coverage ครอบคลุมทุก features, APIs, use cases พร้อม review score

## Scope

content coverage review สำหรับ: skills, workflows, documentation — วิเคราะห์ gaps ระหว่าง inventory และ coverage surface ไม่รวมการเขียน content ใหม่

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ content structure และ coverage surface ใน codebase

1. ทำ `/scan-codebase`, อ่านทุกไฟล์ใน target directory, ระบุ features/APIs/use cases ทั้งหมดจาก codebase และ dependencies
2. จัดทำ inventory: feature/API/use case → content file ที่ครอบคลุม (ถ้ามี)
3. ถ้า target directory ไม่มี → stop และ report

### 2. Analyze Coverage Gaps

> Goal: รู้ว่าขาดอะไร จัดลำดับ priority ชัดเจน

1. เทียบ inventory กับ coverage surface — ระบุ missing: guides, examples, references, key-concepts, principles
2. จำแนก gaps ตามประเภท: missing guides, missing examples, missing API references, missing key concepts, missing principles
3. จัดลำดับ gaps ตาม impact: Getting Started > core features > edge cases > advanced
4. ถ้าไม่มี gaps → report ว่า coverage ครบ

### 3. Score And Classify

> Goal: แต่ละ category มี score และ severity ชัดเจน

1. ให้ score ตาม coverage percentage: 100% (complete), 80-99% (good), 60-79% (fair), <60% (poor)
2. จำแนก severity: critical (missing Getting Started), high (missing core features), medium (missing edge cases), low (missing advanced)
3. ระบุ action items สำหรับแต่ละ gap: สร้าง content ใหม่, อัปเดต content เดิม, หรือ merge content

### 4. Report Findings

> Goal: Report ชัดเจน  actionable สอดคล้อง Goal

1. รายงานเป็นตาราง: category | coverage % | gaps found | severity | action item
2. ทำ `/report-format-table` สำหรับสรุปผล
3. ทำ `/suggest-next-action` สำหรับขั้นตอนถัดไป

## Rules

### 1. Coverage Surface

- ทุก features ต้องมี guide — ทุก APIs ต้องมี examples — ทุก use cases ต้องมี documentation
- ทุก concepts ต้องมี explanations — ทุก best practices ต้องมี guidelines

### 2. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder, generic filler

### 3. Non-Redundancy

- workflow นี้เป็น review เท่านั้น ไม่ fix

## Expected Outcome

- ตาราง: category | coverage % | gaps found | severity | action item
- Coverage gaps ถูกระบุและจัดลำดับ
- Review score สำหรับ content coverage
- Action items ชัดเจนสำหรับขั้นตอนถัดไป
