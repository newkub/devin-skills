---
name: review-uxui-improve-uxui-fix
description: Apply UX/UI findings per dimension — fix per domain checklist with evidence
argument-hint: "[scope-or-findings]"
related:
  - review-uxui
  - capture
  - review-by-stakeholder
  - watch-browser-and-improve-uxui
  - run-dev
  - run-test
  - ask-me
  - report
  - resolve-errors
---

## Goal

Apply UX/UI findings จาก `/review-uxui` หรือ stakeholder review — แก้ตาม domain checklist ตาม dimension ของแต่ละ finding แล้ว verify ด้วย before/after evidence

## Scope

- ใช้หลัง `/review-uxui` หรือ `/watch-browser-and-improve-uxui` เมื่อมี findings ที่ confirm แล้วว่าจะแก้
- ครอบคลุม design system, visual, interaction, accessibility, responsive, content/copy และ page-type fixes
- ไม่ครอบคลุม frontend architecture/rendering → ใช้ `/review-frontend` subskills

## Execute

### 1. Collect And Triage Findings

> Goal: ได้ fix list ที่ trace กลับ finding ได้ทุกข้อ

1. อ่าน findings จาก `/review-uxui` report หรือ stakeholder feedback — ถ้ายังไม่มี → ทำ `/review-uxui` ก่อน
2. บันทึกแต่ละ finding ด้วย `id`, `severity`, `area`, `issue`, `suggestion`, `evidence`
3. เรียงตาม severity ก่อน แล้วตาม effort ต่ำ → สูง — `Critical`/`High` ต้องแก้ในรอบนี้

### 2. Capture Before Evidence

> Goal: มี before state เปรียบเทียบได้ทุก fix

1. เปิด dev server (`/run-dev`) แล้ว capture ทุก route/component ที่จะแก้
2. ตั้งชื่อไฟล์ `<route>-<date>-before.png` — ใช้ `agent-browser snapshot -i` บันทึก interactive elements
3. ถ้า `agent-browser` ใช้ไม่ได้ → fallback เป็น screenshot ผ่าน dev tools หรือ skip capture และ flag ใน report

### 3. Fix Per Dimension

> Goal: แต่ละ finding แก้ตาม checklist ของ dimension ที่ตรง

| Topic | Fix Focus |
|-------|-----------|
| Design system, tokens, component variants, states | รวม hardcoded values เข้า tokens, ใช้ variants แทน one-off styles, ครบ states (hover/active/disabled) |
| Color, contrast, dark/light mode, theme flash | contrast ≥ 4.5:1, theme toggle ไม่ flash, tokens ผูกทั้งสอง mode |
| Typography, hierarchy, readability, Thai/English pairing | scale สม่ำเสมอ, line-height/length เหมาะ, font fallback สำหรับไทย |
| Accessibility, keyboard, focus, a11y WCAG | semantics, ARIA, focus visible, keyboard nav — ถ้าต้อง deep fix → `/review-accessibility` `## Fix` |
| Animation, motion, reduced-motion | purpose-driven motion, easing จาก tokens, respect `prefers-reduced-motion` |
| Responsive, touch targets, mobile/tablet/desktop | touch targets ≥ 44px, no horizontal scroll, breakpoints ครบ |
| Navigation, wayfinding, IA, breadcrumbs | active state ชัด, breadcrumbs สำหรับ nested, IA depth ≤ 3 |
| Forms, labels, validation UX, submit flow | label ทุก field, inline validation, error recovery, disabled submit ระหว่าง pending |
| Loading/empty/error/success feedback states | skeleton/spinner, empty state มี action, error บอกวิธีแก้, success feedback |
| Microcopy, labels, error messages, tone | concise, action-oriented, consistent tone, no jargon |
| Landing page, hero, CTA, conversion | single primary CTA, value prop เหนือ fold, social proof |
| Dashboard, KPI, tables, charts | KPI อ่านเร็ว, table responsive, chart มี labels/units |
| Onboarding, first-run, time-to-value | time-to-value สั้น, progressive disclosure, skippable |
| Stakeholder review flow และ feedback format | feedback เป็น structured findings พร้อม severity + evidence |

แก้ทีละ finding — functional → visual → accessibility order ภายใน dimension เดียวกัน

### 4. Validate Changes

> Goal: improvements ทำงานจริงและ traceable

1. Reload และ capture after ที่ viewport/route เดียวกับ before — ตั้งชื่อ `*-after.png`
2. ทำ `/review-by-stakeholder` อีกครั้งเพื่อยืนยัน — สูงสุด 3 รอบ review/fix
3. รัน `/deep-test e2e` ถ้ามี — interactions ต้องไม่พัง
4. Persist report ที่ `.devin/reports/<workspace>/uxui-<time>.md` ตาม parent fix flow

### 5. Report

> Goal: สรุปผลพร้อม before/after evidence

1. ทำ `/report table` — columns: No., Finding ID, Dimension, Fix, Before, After, Status
2. ระบุ findings ที่ยังไม่แก้และเหตุผล — ทำ `/ask-me` ถ้าต้องตัดสินใจ trade-off เสี่ยงสูง

## Rules

- ทุก fix ต้องมี before screenshot ก่อนแก้และ after screenshot หลังแก้ — evidence traceable
- แก้เฉพาะ findings ที่ confirm แล้ว — ใช้ minimal changes ไม่ over-engineer ไม่เพิ่ม dependencies โดยไม่จำเป็น
- ปรับ UX/UI เท่านั้น ไม่แก้ business logic — ถ้าเกิด error ระหว่าง implement → `/resolve-errors`
- ถ้า capture/verify ไม่ได้ → หยุดและ report ห้ามอ้างว่าแก้เสร็จ
- ปิด browser session อย่างสะอาดเมื่อจบ — บันทึกสถานะสุดท้ายก่อน cleanup

## Expected Outcome

- Findings ถูกแก้ตาม domain guides เรียง severity — ทุก fix มี before/after evidence
- Stakeholder re-review ยืนยัน improvements — e2e tests ผ่าน
- รายงานตาราง fixes พร้อม status และ residual findings

