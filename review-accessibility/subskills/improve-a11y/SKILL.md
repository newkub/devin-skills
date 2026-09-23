---
name: review-accessibility-improve-a11y
description: Apply a11y findings — contrast, aria labels, keyboard nav, focus, screen reader
argument-hint: "[url-or-route-or-component]"
related:
  - review-accessibility
  - review-uxui
  - run-test
  - use-agent-browser
  - run-check
  - report-before-after
---

## Goal

แก้ a11y findings จาก `/review-accessibility` จริงตาม WCAG — contrast, aria labels, keyboard navigation, focus management, screen reader support — verify ด้วย browser จริงทุก fix

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้ — review/report-only โดย default
- ครอบคลุม: contrast violations, missing/incorrect ARIA, keyboard traps, focus order, semantic fixes
- multi-domain fix → `/deep-review-then-fix`

## Execute

### 1. Prioritize Findings

> Goal: เรียง fixes ตาม severity และ impact

1. รวม findings จาก review report — severity, element/selector, WCAG criterion
2. เรียง: critical (block usage) → serious → moderate → minor
3. group findings ที่แก้ด้วย component/pattern เดียวกันไว้ด้วยกัน

### 2. Fix Semantics And ARIA

> Goal: elements สื่อความหมายถูกต้องกับ assistive tech

1. เปลี่ยน `div`+click เป็น semantic tags (`button`, `a`, `input`) ก่อนเสมอ — semantic HTML > ARIA
2. เพิ่ม `aria-label`/`aria-labelledby` เมื่อไม่มี visible label, `role` เฉพาะเมื่อ semantic ไม่พอ
3. แก้ alt text, form labels, table headers ตาม findings — ห้าม alt ว่างบน informative images

### 3. Fix Keyboard And Focus

> Goal: ใช้งานครบด้วย keyboard เท่านั้น

1. แก้ focus order ให้ตาม visual order, เพิ่ม visible focus indicator ที่ถูกลบออก
2. modals/menus → focus trap + return focus ตอนปิด, `Escape` ปิดได้, arrow keys ตาม pattern (ดู WAI-ARIA Authoring Practices)
3. เพิ่ม skip links ถ้าหน้ามี navigation ซ้ำยาว — `tabindex` เฉพาะ `-1`/`0` ห้ามค่าบวก

### 4. Fix Contrast And Motion

> Goal: perceivable สำหรับทุกผู้ใช้

1. แก้ color contrast ให้ถึง 4.5:1 (text) และ 3:1 (UI components, large text) — ปรับ design tokens ก่อน inline
2. เคารพ `prefers-reduced-motion` บน animations และห้าม auto-play ที่หยุดไม่ได้
3. อย่าใช้สีอย่างเดียวสื่อ state — เพิ่ม icon/text ประกอบ

### 5. Verify With Real Browser

> Goal: fixes ทำงานจริงกับ assistive tech flow

1. เปิดผ่าน `/use-agent-browser` หรือ `/run-test` (e2e) — รัน automated audit ซ้ำ findings เดิมต้องหาย
2. ทดสอบ keyboard flow จริงผ่านทุก interactive element ที่แก้
3. `/run-check` ผ่าน แล้ว `/report-before-after` — violations ก่อน/หลังต่อ criterion

## Rules

- แก้ด้วย semantic HTML ก่อน — เพิ่ม ARIA เฉพาะเมื่อจำเป็น (ARIA ผิดแย่กว่าไม่มี)
- preserve behavior และ visual design เว้นแต่ finding คือ design เอง (contrast)
- verify ด้วย browser จริงทุก fix — ห้ามเดาจาก code
- แยก commit ต่อ fix group: semantics → keyboard/focus → contrast/motion

## Expected Outcome

- automated violations หายครบตาม audit ซ้ำ
- keyboard-only flow ใช้งานได้ครบทุก interactive element
- report before/after พร้อม WCAG criterion ต่อ fix

