---
name: review-coverage-report-coverage
description: สร้าง coverage gap report — surface vs coverage matrix, orphan list, priorities
argument-hint: "[surface]"
related:
  - report
  - create-report-in-dot-devin
  - review-coverage
---

## Goal

แปลง gap matrix ของ `/review-coverage` เป็น coverage report — surface items vs actual coverage พร้อม priority ที่ทีมเอาไป plan ได้

## Scope

- ใช้เมื่อ `/review-coverage` dispatch มาที่ `report`/`report-coverage` หรือเรียก standalone กับ matrix ที่มีอยู่
- รองรับทุก surface: `skills`, `tests`, `docs`, custom
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Organize Matrix

> Goal: matrix อ่านง่าย ตัดสินใจได้

1. ตาราง: `No.`, `Surface Item`, `Status`, `Coverage`, `Severity`, `Recommendation`
2. จัดกลุ่มตาม category ของ surface (action domain / route group / feature area)
3. orphans (coverage ที่ไม่มี surface item) แยก section — อย่ารวมเป็น gap

### 2. Summarize Coverage

> Goal: signal ระดับสูง

1. coverage % ต่อ category — `covered`/`partial`/`missing` counts
2. critical-path uncovered list แยก — สำคัญกว่า % รวม
3. verdict: `well-covered` / `gaps-in-non-critical` / `critical-gaps`

### 3. Route Actions

> Goal: gap แต่ละก้อนมี owner

1. missing tests → `/update-tests`; missing docs → `/update-docs`; missing skills → `/idea-new-devin-global-skills`
2. orphans → recommendation: ลบ หรือเพิ่ม declaration
3. ถ้าต้องเก็บถาวร → `/create-report-in-dot-devin`

## Rules

- surface ต้องมาจาก declared source เดียวกันกับที่ parent ใช้ — ห้ามเดาเพิ่ม
- ทุก row ต้องมี evidence: surface item + สิ่งที่ค้นแล้วไม่เจอ
- coverage % เป็น signal ไม่ใช่เป้าหมาย — highlight critical gaps ก่อน %

## Expected Outcome

- Gap matrix ครบทุก surface item พร้อม status
- Orphan list แยก + coverage % ต่อ category + routed recommendations
