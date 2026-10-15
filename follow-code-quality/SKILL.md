---
name: follow-code-quality
description: Code quality convention — SRP, small units, no duplication, evidence-first in refactor/write tasks
argument-hint: "[scope]"
related:
  - refactor
  - check-code-structure
  - check-long-files
  - simplify
  - deep-review
  - follow-single-of-source
  - follow-reusable
  - dont-over-engineer
---

## Goal

กำหนดมาตรฐาน code quality เดียวที่ใช้ร่วมกัน — ทุกการ refactor หรือเขียนโค้ดใหม่ต้องผ่าน convention นี้ ห้ามแก้โดยไม่มี evidence และห้าม over-engineer

## Scope

ใช้เมื่อจะ refactor ไฟล์/workspace/codebase (`/refactor` อ่าน convention นี้ก่อนเสมอ) หรือเมื่อเขียนโค้ดใหม่ที่ต้องการคุณภาพระดับ production — ไม่ตรวจเองซ้ำกับ `check-*` (detector) หรือ `/deep-review` (assessor); skill นี้เป็น convention ที่ทั้งสองฝั่งอ้างอิง

## Execute

### 1. Measure Baseline

> Goal: รู้สถานะคุณภาพก่อนแตะโค้ด ด้วย detector เท่านั้น

1. รัน `/check-long-files` (>250 lines) และ `/check-code-structure` (symbols, exports, cohesion, SRP metrics) บน scope
2. สงสัย dead code/duplicate → `/follow-tool-knip` + `/follow-tool-jscpd` — ห้ามลบหรือรวมโค้ดก่อนมีผล scan

### 2. Assess With Review

> Goal: ได้ findings + severity + evidence (`file:line`)

1. รัน `/deep-review` dimension `review-code-quality` + `review-redundancy` บน scope — ไม่ scan ซ้ำเอง
2. รายงาน findings ผ่าน `/report-review` — ทุก finding ต้องมี evidence รองรับเท่านั้น (no guess-fixes)

### 3. Apply The Standard

> Goal: โค้ดผ่านมาตรฐานขั้นต่ำทั้งหมด

1. โครงสร้าง: 1 unit = 1 reason to change, 1 file = 1 concern ≤250 lines, 1 folder = 1 domain — ทำ structure จริง → `/refactor` `### 2`/`### 6`
2. ชัดขึ้นโดยไม่เปลี่ยน behavior → `/simplify`; ซ้ำซ้อนข้ามไฟล์ → `/follow-reusable` (reuse > extend > extract > create)
3. ทุก fact มีที่มาเดียว → `/follow-single-of-source`; ตั้งคำถามว่าคุ้มไหมที่จะทำต่อ → `/dont-over-engineer`

### 4. Verify Green

> Goal: หลักฐานว่าคุณภาพดีขึ้นจริง

1. `/run-check` (lint + typecheck) + tests ต้องเขียวหลังแต่ละ batch — แดง → revert batch นั้น
2. re-run `### 1` เทียบ baseline → `/report-before-after`

## Rules

### 1. Evidence First

- ทุก improvement/refactor ต้องเริ่มจากผล `check-*` หรือ finding จาก `/deep-review` — ห้ามเดา
- ทิศทางเดียว: `check` (detect) → `review` (assess) → fix — ห้ามย้อนกลับหรือข้ามขั้น

### 2. Quality Thresholds

- ไฟล์ ≤250 lines (barrel/index ยกเว้น), function ทำสิ่งเดียว, names บอก intent, ไม่มี generic bucket (`utils.ts`, `helpers.ts`, `misc.ts`)
- ไม่มี dead code, ไม่มี duplication ที่ rule-of-three ครบ, ไม่มี abstraction ที่ไม่มี real consumer

### 3. Behavior Preserved

- convention นี้เปลี่ยนโครงสร้าง/ความชัดเท่านั้น — observable behavior ต้องเหมือนเดิมเสมอ
- ไม่ tune performance ในขั้น quality — แยกเป็น `/optimize` ต่างหาก

## Expected Outcome

- scope ผ่าน thresholds ทั้งหมดโดยมี baseline/หลังแก้เปรียบเทียบจาก `check-*`
- ทุกการแก้มี evidence ระบุต้นทาง, tests เขียว, ไม่มี broken references
- ผู้เขียนคนถัดไปอ่านโค้ดเข้าใจได้ทันทีโดยไม่ต้องถาม
