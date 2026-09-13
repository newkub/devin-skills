---
name: review-uxui-improve-uxui-fix
description: Apply UX/UI findings per dimension — dispatch fix-uxui domain guides with evidence
argument-hint: "[scope-or-findings]"
related:
  - review-uxui
  - capture
  - review-by-stakeholder
  - improve-uxui-and-features
  - run-dev
  - run-test
  - ask-me
  - report
  - resolve-errors
---

## Goal

Apply UX/UI findings จาก `/review-uxui` หรือ stakeholder review — dispatch ไปยัง domain fix guides ใน `references/fix-uxui/` ตาม dimension ของแต่ละ finding แล้ว verify ด้วย before/after evidence

## Scope

- ใช้หลัง `/review-uxui` หรือ `/improve-uxui-and-features` เมื่อมี findings ที่ confirm แล้วว่าจะแก้
- ครอบคลุม design system, visual, interaction, accessibility, responsive, content/copy และ page-type fixes
- ไม่ครอบคลุม frontend architecture/rendering → ใช้ `/review-frontend` subskills

## Execute

### 1. Collect And Triage Findings

> Goal: ได้ fix list ที่ trace กลับ finding ได้ทุกข้อ

1. อ่าน findings จาก `/review-uxui` report หรือ stakeholder feedback — ถ้ายังไม่มี → ทำ `/review-uxui` ก่อน
2. บันทึกแต่ละ finding ด้วย `id`, `severity`, `area`, `issue`, `suggestion`, `evidence` ตาม `references/fix-uxui/stakeholder-review.md`
3. เรียงตาม severity ก่อน แล้วตาม effort ต่ำ → สูง — `Critical`/`High` ต้องแก้ในรอบนี้

### 2. Capture Before Evidence

> Goal: มี before state เปรียบเทียบได้ทุก fix

1. เปิด dev server (`/run-dev`) แล้ว capture ทุก route/component ที่จะแก้ ตาม `references/fix-uxui/capture-and-evidence.md`
2. ตั้งชื่อไฟล์ `<route>-<date>-before.png` — ใช้ `agent-browser snapshot -i` บันทึก interactive elements
3. ถ้า `agent-browser` ใช้ไม่ได้ → setup/fallback ตาม `references/fix-uxui/agent-browser-setup.md`

### 3. Dispatch Per Dimension

> Goal: แต่ละ finding แก้ตาม domain guide ที่ตรง

| Topic | Guide |
|-------|-------|
| Design system, tokens, component variants, states | `references/fix-uxui/design-system.md` |
| Color, contrast, dark/light mode, theme flash | `references/fix-uxui/theme.md` |
| Typography, hierarchy, readability, Thai/English pairing | `references/fix-uxui/typography.md` |
| Accessibility, keyboard, focus, a11y WCAG | `references/fix-uxui/accessibility.md` |
| Animation, motion, reduced-motion | `references/fix-uxui/animation.md` |
| Responsive, touch targets, mobile/tablet/desktop | `references/fix-uxui/responsive.md` |
| Navigation, wayfinding, IA, breadcrumbs | `references/fix-uxui/navigation.md` |
| Forms, labels, validation UX, submit flow | `references/fix-uxui/forms.md` |
| Loading/empty/error/success feedback states | `references/fix-uxui/feedback.md` |
| Microcopy, labels, error messages, tone | `references/fix-uxui/content-copy.md` |
| Landing page, hero, CTA, conversion | `references/fix-uxui/landing-pages.md` |
| Dashboard, KPI, tables, charts | `references/fix-uxui/dashboard.md` |
| Onboarding, first-run, time-to-value | `references/fix-uxui/onboarding.md` |
| Stakeholder review flow และ feedback format | `references/fix-uxui/stakeholder-review.md` |

แก้ทีละ finding ตาม guide — functional → visual → accessibility order ภายใน dimension เดียวกัน

### 4. Validate Changes

> Goal: improvements ทำงานจริงและ traceable

1. Reload และ capture after ที่ viewport/route เดียวกับ before — ตั้งชื่อ `*-after.png`
2. ทำ `/review-by-stakeholder` อีกครั้งเพื่อยืนยัน — สูงสุด 3 รอบ review/fix
3. รัน `/deep-test-e2e` ถ้ามี — interactions ต้องไม่พัง
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

