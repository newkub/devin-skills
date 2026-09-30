---
name: improve-features
description: หา feature improvements ใน scope — gaps, UX, completeness — รวม findings แล้วแก้หลัง user confirm
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - idea
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "features improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-gaps` + `review-uxui` เป็น prioritized list แล้วส่งต่อไปแก้หลัง user confirm

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "features ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-gaps` — feature gaps, missing capabilities, incomplete implementations
- `review-uxui` — UX flow, interaction quality, accessibility ของ features
- ถ้า user ต้องการ feature ideas ใหม่ → `/idea`

## Execute

### 1. Review Features

> Goal: ได้ prioritized feature findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-gaps` + `review-uxui` — feature completeness, UX quality, missing capabilities vs intent
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present And Confirm

> Goal: แสดงผลและให้ user เลือกสิ่งที่จะแก้

1. ทำ `/report` แสดง feature improvements: No., Finding, Severity, Fix Skill
2. ถาม user ว่าจะแก้ข้อไหน — รอการยืนยันก่อนลงมือ

### 3. Fix Confirmed Items

> Goal: แก้เฉพาะสิ่งที่ user เลือก

1. ส่งแต่ละ finding ที่ confirm ไป `/deep-review-then-fix` (domain ที่ตรง)
2. feature additions ใหญ่ → plan ผ่าน `/deep-plan` ก่อน implement
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-gaps`/`review-uxui`
- ไม่แก้ไขโดยไม่ได้ user confirm
- แยกชัด: improve existing feature vs propose new feature (new → `/idea`)
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized feature improvement list จาก `/deep-review`
- User เลือกสิ่งที่จะแก้
- Findings ที่ confirm ถูกแก้ผ่าน `/deep-review-then-fix`; feature ใหญ่ผ่าน `/deep-plan`
