---
name: review
description: Review ตาม context โดยเลือก review skill ที่เหมาะสม
argument-hint: "[scope]"
related:
  - follow-review
  - report
---

## Goal

Review งานตาม context โดยเลือก review skill ที่เหมาะสม

## Scope

ใช้เมื่อต้องการ review แต่ยังไม่รู้จะใช้ skill ไหน รองรับ code, docs, GitHub, และ skills

## Execute

### 1. Detect Context

> Goal: รู้ context ก่อนเลือก review skill

ทำตาม [references/detect-context.md](references/detect-context.md)

### 2. Route To Review Skill

> Goal: เรียก review skill ที่ถูกต้อง

ทำตาม [references/route-to-review-skill.md](references/route-to-review-skill.md)

### 3. Report

> Goal: สรุปผล review

ทำตาม [references/report.md](references/report.md)

## Rules

### 1. Context First
- ไม่เดาถ้า context ไม่ชัด
- ถาม user ก่อน review ถ้าจำเป็น

### 2. Skill Selection
- เลือก skill ตาม target object ไม่ใช่ตามชื่อ file อย่างเดียว
- สามารถใช้หลาย review skills ถ้า task มีหลาย context

### 3. Evidence
- ทุก finding ต้องมี file, line, หรือ reference

- ใช้ /follow-review ถ้าจำเป็น

## Metrics

- ดู metrics สำหรับ review ใน [references/scoring.md](references/scoring.md)

## Expected Outcome

- รู้ว่า review อะไร
- ได้ findings พร้อม evidence
- รู้ skill ถัดไปที่ควรทำ
