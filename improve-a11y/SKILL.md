---
name: improve-a11y
description: หา accessibility improvements ใน scope — WCAG, ARIA, keyboard, contrast, screen reader — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-uxui
  - test-a11y
  - deep-review
  - deep-review-then-fix
  - follow-tool-unlighthouse
  - follow-tool-lighthouse
  - follow-design-system
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "accessibility improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-accessibility` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "a11y ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-accessibility` — WCAG A/AA violations, ARIA attributes, keyboard navigation, focus management, color contrast, screen reader semantics, form labels
- UX/design กว้างกว่า a11y → `/improve-uxui`; run a11y tests → `/test-a11y`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-accessibility` — WCAG violations, keyboard traps, missing labels/landmarks, contrast, focus order
3. รวบรวม prioritized list พร้อม severity และ evidence — critical/serious violations ก่อน
4. ใช้ `/follow-tool-unlighthouse` หรือ `/follow-tool-lighthouse` เก็บ a11y score เป็น baseline evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, WCAG ref, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-accessibility`)
2. Fix ต้องไม่ regress visual — เช็คด้วย `/test-a11y` + axe scan หลังแก้
3. Design token/contrast fixes → `/follow-design-system` หรือ `/follow-unocss-theme`
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-accessibility`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้ามแก้ a11y ด้วย `aria-*` masking — semantic HTML ก่อน ARIA เสมอ
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized a11y improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม axe score ดีขึ้น
