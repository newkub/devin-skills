---
name: improve-accessibility
description: แก้ไข accessibility findings ตาม WCAG — semantics, ARIA, keyboard, focus, contrast
argument-hint: "[url-or-route-or-component]"
related:
  - review-accessibility
  - review-uxui
  - run-test-website-by-agent-browser
  - capture-image-app-to-screenshot
  - follow-best-practice
  - resolve-errors
  - run-check
  - report-table
  - ask-me
---

## Goal

แก้ไข accessibility findings จาก `/review-accessibility` ตาม WCAG จนผ่าน audit ซ้ำ — semantics, ARIA, keyboard, focus และ contrast

## Scope

ใช้หลัง `/review-accessibility` เมื่อต้องแก้ a11y violations ใน code: semantic HTML, ARIA attributes, focus management, keyboard handlers, contrast, reduced motion — ไม่ครอบคลุม design overhaul

## Execute

### 1. Collect Findings

> Goal: รวบรวม violations ที่ต้องแก้

1. รัน `/review-accessibility` ถ้ายังไม่มี findings
2. จัดกลุ่มตาม WCAG principle และ component
3. เรียง severity: critical → serious → moderate → minor

### 2. Fix Semantics

> Goal: ใช้ semantic HTML แทน ARIA ที่ไม่จำเป็น

1. แทนที่ `div`+click ด้วย `button`, `a`, `input` ตามความเหมาะสม
2. เพิ่ม landmarks และแก้ heading hierarchy
3. เพิ่ม alt text, form labels, table headers ที่ขาด

### 3. Fix Keyboard And Focus

> Goal: ทุก interaction ใช้ keyboard ได้

1. เพิ่ม `tabindex`, keyboard handlers และ focus visible styles
2. แก้ focus trap ใน modals/dialogs และ return focus หลังปิด
3. เพิ่ม skip links และแก้ focus order ที่ผิด

### 4. Fix ARIA And Announcements

> Goal: assistive tech ได้รับข้อมูลครบ

1. แก้ `role`, `aria-label`, `aria-labelledby`, `aria-describedby` ที่ผิดหรือขาด
2. เพิ่ม `aria-live` regions สำหรับ dynamic updates และ errors
3. ลบ ARIA ที่ซ้ำกับ semantic HTML

### 5. Fix Visual Accessibility

> Goal: contrast และ motion ผ่านเกณฑ์

1. แก้สีให้ contrast ≥4.5:1 (text) และ ≥3:1 (UI)
2. เพิ่ม `prefers-reduced-motion` media query สำหรับ animations
3. แก้ text sizing/zoom และ touch targets ≥24px

### 6. Validate And Re-audit

> Goal: violations หายและไม่มี regression

1. รัน audit ซ้ำผ่าน `/review-accessibility` หรือ axe
2. ทดสอบ keyboard flow อีกครั้งผ่าน `agent-browser`
3. รัน `/run-check` แล้วทำ `/report-table` สรุป before/after

## Rules

### 1. Semantic First

- ใช้ semantic HTML ก่อนเสมอ — เพิ่ม ARIA เฉพาะเมื่อจำเป็น
- ห้าม `role` ที่ขัดกับ native semantics

### 2. No Visual Regression

- a11y fixes ต้องไม่ทำลาย visual design โดยไม่จำเป็น
- ถ้า contrast fix เปลี่ยน brand colors → `/ask-me`

### 3. Verify With Real Interaction

- ทุก keyboard fix ต้องทดสอบจริงใน browser
- ไม่ปิด finding โดยไม่ re-audit

- ใช้ /review-uxui ถ้าจำเป็น
- ใช้ /run-test-website-by-agent-browser ถ้าจำเป็น
- ใช้ /capture-image-app-to-screenshot ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Expected Outcome

- Critical/serious violations ถูกแก้และผ่าน re-audit
- Keyboard navigation ใช้งานได้ครบ
- ไม่มี visual/functional regression
- รายงาน before/after พร้อม residual findings
