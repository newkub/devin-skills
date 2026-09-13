---
name: deep-validate-report-findings
description: รวม findings จากทุก dimension เป็น severity matrix เดียว — shared report สำหรับ check-* subskills
argument-hint: "[scope]"
related:
  - report
  - suggest-next-action
  - create-report-in-dot-devin
---

## Goal

รวม findings จาก `check-*` subskills ทุก dimension เป็น report เดียว — severity matrix เรียงตามความรุนแรง พร้อม recommendations

## Scope

- ใช้เมื่อ `/deep-validate` dispatch มาที่ `report` หรือ `check-*` subskill ต้องการ emit findings
- ครอบคลุม: findings จากทุก dimension หรือ dimension เดียว (ถ้า dispatch เดี่ยว)

## Execute

### 1. Aggregate Findings

> Goal: รวม findings ทุก dimension เข้า pool เดียว

1. รวม findings จากแต่ละ `check-*` subskill ที่รัน — พร้อม dimension tag
2. dedupe findings ที่ root cause เดียวกันข้าม dimensions (เช่น type error ที่เป็น correctness+type-safety)
3. normalize severity scale: Critical / High / Medium / Low

### 2. Build Severity Matrix

> Goal: ตารางเดียวเรียงตาม impact

1. ตาราง: `No.`, `Dimension`, `Finding`, `Severity`, `Location`, `Recommendation`
2. เรียง Critical → High → Medium → Low — dimension เป็น secondary sort
3. สรุป counts ต่อ dimension + ต่อ severity ด้านบนตาราง

### 3. Summarize And Suggest

> Goal: ปิดท้ายด้วยสิ่งที่ดี + next actions

1. สรุปสิ่งที่ดีอยู่แล้วเสมอ (per dimension)
2. recommendations ที่ actionable เรียงตาม priority
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`
4. ทำ `/suggest-next-action` (เช่น `/resolve-errors` สำหรับ Critical findings)

## Rules

- ทุก finding มี evidence (file:line) — ตาม contract ของ check-* subskills
- ไม่ปรับ severity ตอน aggregate — เก็บค่าที่ subskill ให้มา
- single-dimension call ก็ใช้ matrix format เดียวกัน

## Expected Outcome

- Severity matrix รวมทุก dimension พร้อม counts + recommendations
