---
name: idea-review
description: สร้างไอเดียจาก review findings/reports ที่มี — แปลง findings เป็น actionable ideas พร้อม priority
argument-hint: "[scope-or-report]"
related:
  - idea
  - idea-improve
  - review
  - review-gaps
  - deep-review
  - report
  - then-apply
  - suggest-next-action
---

## Goal

สร้างไอเดียจาก review findings หรือ reports ที่มีอยู่แล้ว — อ่าน findings จาก `.devin/reports/` หรือ review ล่าสุด แล้วแปลงเป็น prioritized actionable ideas ไม่ใช่ brainstorm จาก context เปล่า

## Scope

ใช้เมื่อ user บอก "ขอ idea จาก review" หรือมี findings/reports พร้อมแล้วต้องการทิศทางต่อ — ต่างจาก siblings:

- `/idea-improve` — brainstorm improvements จาก context (ไม่ต้องมี findings ก่อน)
- `/improve` — review-first แล้ว fix ตาม confirm (ไม่ generate ideas)
- skill นี้ — findings-first: อ่าน review output ที่มี → สร้าง ideas ที่ grounded ใน evidence จริง

ไม่ run review ใหม่เอง — ถ้ายังไม่มี findings ให้แนะนำ `/review` หรือ `/deep-review` ก่อน

## Execute

### 1. Gather Findings

> Goal: ได้ findings จริงเป็น input

1. รับ `scope-or-report` จาก argument — ระบุ report path หรือ scope ได้
2. อ่าน findings ล่าสุดจาก `.devin/reports/<workspace>/` — `review-report.json`, UX findings, test results
3. ถ้า user ส่ง findings มาใน chat → ใช้เป็น input หลัก
4. ถ้าไม่มี findings เลย → แนะนำให้ทำ `/review` หรือ `/deep-review` ก่อน แล้วค่อยกลับมา

### 2. Generate Ideas From Findings

> Goal: แปลง findings เป็น ideas

1. `Fix` — findings ที่มี severity → idea คือ fix path ผ่าน `review-*` `## Fix`
2. `Extends` — findings ที่ชี้ gap → idea คือขยาย capability ที่มีอยู่
3. `New` — findings ที่ชี้ missing surface → idea คือสร้างใหม่
4. `Remove` — findings ที่ชี้ redundancy/dead weight → idea คือตัดทิ้ง
5. ทุก idea อ้าง finding จริง — finding ID, file path, หรือ evidence — ห้ามเดา
6. ถ้า ideas จำเจหรือติดกรอบ → ใช้ `/think-reframe`

### 3. Prioritize And Report

> Goal: prioritized actionable list

1. จัดอันดับตาม severity ของ finding ต้นทาง + impact/effort
2. ทำ `/report table` columns: `No.`, `Idea`, `Type`, `Source Finding`, `Severity`, `Impact`, `Effort`, `Fix Skill`
3. แยก quick wins (High impact / Low effort) ออกมาชัดเจน
4. ทำ `/suggest-next-action` — idea ที่ confirm ส่งต่อผ่าน `/then-apply` ไป `review-*` `## Fix` หรือ `/deep-review-then-fix`

## Rules

### 1. Evidence-Based Only

- ทุก idea ต้อง trace กลับไปหา finding จริง — ห้าม generate จากความคิดลอยๆ
- ถ้า findings เก่า/stale → ระบุใน report และเสนอ re-review

### 2. Ideas Not Fixes

- skill นี้ produce ideas เท่านั้น — ไม่แก้ไข, ไม่ dispatch fix โดยไม่ confirm
- confirmed ideas → `/deep-review-then-fix` (multi-domain) หรือ `## Fix` ของ `review-*` ตรง domain

### 3. No Duplicate Review

- ไม่ run review ซ้ำ — ใช้ findings ที่มี; ถ้าขาด coverage ให้แนะนำ review skill ที่ตรง

## Expected Outcome

- Ideas ที่ grounded ใน findings จริง พร้อม source, severity, impact/effort
- ตาราง prioritized + quick wins ชัดเจน
- Next action ผ่าน `/suggest-next-action` — confirm แล้ว fix ได้ทันที
