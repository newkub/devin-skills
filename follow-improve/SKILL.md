---
name: follow-improve
description: Convention การทำ improvement — route ผ่าน improve-* domain skills → deep-review findings → confirm → deep-review-then-fix
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - report
---

## Goal

กำหนดวิธีทำ improvement มาตรฐาน — ห้ามแก้แบบ ad-hoc; ทุก improvement เริ่มจาก review findings ที่มี evidence แล้วแก้ผ่าน fix path เดียวกัน

## Scope

ใช้เมื่อต้องการ improve scope ใดๆ — feature, quality, security, performance, docs — route ไป `improve-*` domain skill ที่ตรงกัน หรือ `/improve` thin entry ถ้าไม่ชัด

## Execute

### 1. Route To Domain

> Goal: เลือก improve-* skill ที่ตรง scope

1. scope ตรง domain → ใช้ `improve-{domain}` (เช่น `improve-security` → review-security, `improve-code-quality` → `/improve-correctness`, `improve-consistency` → review-alignment+review-redundancy+review-code-quality+review-writing)
2. scope ไม่ชัด → ใช้ `/improve` thin entry ให้ dispatch เอง
3. ทุก `improve-*` เป็น thin entry → `/deep-review` domain ตามชื่อ — ห้ามเขียน review logic ซ้ำเอง

### 2. Review And Confirm

> Goal: ได้ prioritized findings ที่ user confirm แล้ว

1. `/deep-review` domain นั้นรวม findings + severity + evidence
2. `/report` เป็น prioritized list — ให้ user เลือกก่อนลงมือ ห้ามแก้ทันที

### 3. Fix Via Canonical Path

> Goal: แก้ด้วย fixer เดียวกันเสมอ

1. ทำ `/deep-review-then-fix` กับ findings ที่ confirm — แก้ root cause ไม่ใช่ symptom
2. fix loop สูงสุด 3 รอบต่อ finding — ไม่ผ่าน → stop + report

## Rules

- ทุก improvement ต้องมี review finding + evidence ก่อน — ห้าม guess-fix
- thin entries ห้ามมี logic เอง — delegate `/deep-review` domain เท่านั้น
- ยืนยันกับ user ก่อนแก้ทุกครั้ง ยกเว้น user สั่ง auto-fix ชัดเจน

## Expected Outcome

- improvements ทุกข้อผ่าน path เดียว: domain review → prioritized report → confirm → canonical fix
- ไม่มี ad-hoc fix ที่ไม่มี finding รองรับ
