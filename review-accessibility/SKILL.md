---
name: review-accessibility
description: ตรวจ accessibility ตาม WCAG — semantics, keyboard, ARIA, contrast, screen reader
argument-hint: "[url-or-route-or-component]"
related:  - review-uxui
  - run-test-website-by-agent-browser
  - capture
  - use-agent-browser
  - report-table
  - deep-review
---

## Goal

ตรวจ accessibility ของ web pages/components ตามมาตรฐาน WCAG — semantics, keyboard navigation, ARIA, color contrast และ screen reader support

## Scope

ใช้กับ web apps, pages หรือ components ที่ต้องตรวจ a11y แยกจาก UX/UI ทั่วไป — ครอบคลุม WCAG 2.2 Level A/AA: perceivable, operable, understandable, robust — ไม่แก้ไข code (แก้ไขตาม section `## Fix`)

## Execute

### 1. Prepare Target

> Goal: เปิด target พร้อม audit tools

1. เปิด dev server หรือใช้ deployed URL ตาม argument
2. ใช้ `/run-test-website-by-agent-browser` เพื่อเปิด page ด้วย `agent-browser`
3. ถ้าเป็น component เดี่ยว → เปิด storybook หรือ route ที่ render component นั้น

### 2. Run Automated Audit

> Goal: ได้ violations จาก automated checks

1. รัน axe/pa11y หรือ `agent-browser` accessibility audit ตามที่มี
2. บันทึก violations พร้อม selector, rule และ severity (critical/serious/moderate/minor)
3. ตรวจ automated coverage: ไม่เกิน ~40% ของ WCAG — เตรียม manual checks ต่อ

### 3. Check Semantics And Structure

> Goal: HTML สื่อความหมายถูกต้อง

1. ตรวจ landmark regions (`header`, `nav`, `main`, `footer`) และ heading hierarchy `h1`-`h6`
2. ตรวจ interactive elements ใช้ semantic tags (`button`, `a`, `input`) ไม่ใช่ `div`+click
3. ตรวจ alt text, form labels และ table headers

### 4. Check Keyboard And Focus

> Goal: ใช้งานได้ครบด้วย keyboard เท่านั้น

1. กด `Tab` ผ่าน interactive elements ทั้งหมด — ตรวจ focus order และ visible focus indicator
2. ทดสอบ `Enter`/`Space`/`Escape`/`Arrow keys` บน interactive patterns (menus, dialogs, tabs)
3. ตรวจ focus traps ใน modals และ skip links

### 5. Check Visual And ARIA

> Goal: perceivable สำหรับทุกผู้ใช้

1. ตรวจ color contrast ขั้นต่ำ 4.5:1 (text) และ 3:1 (UI components, large text)
2. ตรวจ ARIA attributes — ใช้เฉพาะเมื่อ semantic HTML ไม่พอ ตรวจ `aria-label`, `role`, `aria-live`
3. ตรวจ motion/animation เคารพ `prefers-reduced-motion` และไม่มี auto-play ที่ควบคุมไม่ได้

### 6. Rate And Report

> Goal: สรุป findings พร้อม severity และ remediation path

1. จัดกลุ่ม findings ตาม WCAG principle และ severity
2. ทำ `/report-table` พร้อม columns: No., Rule, Severity, Element, Evidence, Fix
3. ชี้ไป section `## Fix` สำหรับการแก้ไข

## Rules

### 1. Evidence Based

- ทุก finding ต้องมี element/selector และ WCAG criterion อ้างอิง
- แยก automated findings กับ manual findings ชัดเจน

### 2. Real Interaction

- keyboard checks ต้องทำจริงผ่าน browser ไม่เดาจาก code
- ตรวจกับหลาย states: default, focus, error, loading, empty

### 3. No Fixes During Review

- ไม่แก้ไข code ระหว่าง review — ส่งต่อไปยัง section `## Fix`
- ใช้ `/deep-review` ถ้าต้องการวิเคราะห์เชิงลึกเพิ่ม

- ใช้ /review-uxui ถ้าจำเป็น
- ใช้ /capture ถ้าจำเป็น
- ใช้ /use-agent-browser ถ้าจำเป็น

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review`

Merged from: improve-accessibility

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after`

- `references/fix-improve-accessibility.md` — แก้ไข accessibility findings ตาม WCAG — semantics, ARIA, keyboard, focus, contrast
## Expected Outcome

- รายงาน a11y findings พร้อม WCAG rule, severity, element และ evidence
- ครอบคลุม semantics, keyboard, ARIA, contrast, motion
- ระบุ coverage ของ automated vs manual checks
- next action ชัดเจนผ่าน section `## Fix`
