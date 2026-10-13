---
name: improve-motion
description: หา motion/animation improvements — policy, reduced motion, consistency — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-uxui
  - improve-a11y
  - improve-web
  - follow-lib-animejs
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "motion/animation improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-uxui + review-frontend + review-accessibility` (motion scope) เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "animation/motion ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-uxui` (motion scope) — motion consistency กับ design system, duration/easing tokens, purposeful animation (not decorative spam)
- `review-frontend` (motion scope) — GPU-friendly properties (transform/opacity), layout thrash จาก animation, jank ที่ 60fps budget
- `review-accessibility` (motion scope) — `prefers-reduced-motion` honored ทุกจุด, auto-play/carousel safety
- general UX → `/improve-uxui`; a11y audit กว้าง → `/improve-a11y`; web perf budget → `/optimize-web-vitals`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-uxui + review-frontend + review-accessibility` (motion scope)
3. รวบรวม prioritized list พร้อม severity และ evidence — animation ที่ trigger vestibular issues เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. เลือก motion lib ตาม project (`/follow-lib-animejs` หรือ lib ที่ใช้อยู่) — ห้ามเพิ่ม dep ใหม่โดยไม่ผ่าน `/alternative` เทียบก่อน
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ทุก animation ต้องมี reduced-motion fallback — ไม่นับเป็น done ถ้ายังไม่ทำ
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized motion improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม reduced-motion fallbacks ครบ
