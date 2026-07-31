---
name: follow-uxui-accessibility
description: ตรวจสอบและปรับปรุง accessibility สำหรับ interactive UX/UI
triggers:
  - user
  - model
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
  - skill
related:
  - review-accessibility
  - check-accessibility
  - follow-uxui-animation
  - follow-uxui-interaction
  - follow-uxui-modal
  - follow-uxui-form
  - follow-uxui-chart
  - follow-my-tech-stack
  - follow-best-practice
  - validate
  - validate-workflow
  - check-reference
  - update-reference
---

## Goal

ตรวจสอบและปรับปรุง accessibility สำหรับ interactive UX/UI เช่น focus, keyboard, screen reader, motion, color contrast

## Scope

ใช้กับทุก component หรือ page ที่มี interaction เช่น modal, form, chart, animation, navigation

## Execute

### 1. Audit Interactive Elements

ระบุ elements ที่ต้องตรวจสอบ

> Goal: รู้ว่าจุดไหนต้อง a11y

1. ทำ `/scan-codebase` เพื่อหา interactive components
2. ระบุ elements: buttons, links, inputs, modals, menus, carousels, charts
3. เก็บรายการไว้ตรวจสอบ

### 2. Check Keyboard And Focus

ตรวจสอบ keyboard flow

> Goal: ใช้งานได้ด้วย keyboard

1. ทดสอบ Tab, Shift+Tab, Enter, Space, Escape, Arrow keys
2. ตรวจสอบ focus order ตรงกับ visual order
3. ตรวจสอบ focus trap ใน modal/drawer
4. ใช้ `focus-visible` แทน `:focus` เมื่อเหมาะสม

### 3. Check Screen Reader

ตรวจสอบ semantic และ ARIA

> Goal: เนื้อหาทั้งหมดอ่านได้

1. ใช้ semantic HTML: `<button>`, `<a>`, `<label>`, `<dialog>`
2. ตรวจสอบ ARIA labels, roles, states
3. ใช้ `aria-describedby` สำหรับ error/hint
4. ตรวจสอบ live regions สำหรับ dynamic content

### 4. Check Motion And Contrast

ตรวจสอบ motion และ color

> Goal: ไม่กระทบ users ที sensitive

1. รองรับ `prefers-reduced-motion`
2. ตรวจสอบ color contrast ตาม WCAG 4.5:1 สำหรับ text
3. ไม่ใช้ animation สำหรับ critical feedback อย่างเดียว
4. ตรวจสอบ touch target size 44x44px

### 5. Validate

ตรวจสอบและสรุป

> Goal: มี actionable report

1. ทำ `/check-accessibility` ถ้ามี
2. ทำ `/review-accessibility` เพื่อ health score
3. สร้างรายการ issues พร้อม priority
4. ทำ `/validate` และ `/validate-workflow`
5. ถ้ามี issues → ทำ `/resolve-errors` แล้ว recheck

## Rules

### 1. Semantic First

- ใช้ native HTML element ก่อน ARIA
- หลีกเลี่ยง `div` ปุ่ม
- ใช้ `<button>` สำหรับ action, `<a>` สำหรับ navigation

### 2. Keyboard

- ทุก interactive element focusable
- focus order มี logic
- ให้ escape/close สำหรับ overlays

### 3. Motion

- เคารพ `prefers-reduced-motion`
- ไม่ autoplay animation ที user ควบคุมไม่ได้
- ให้ pause/stop option

## Expected Outcome

- Interactive UX ที accessible
- รายการ a11y issues พร้อม priority และแนวทางแก้
- ผ่าน lint, typecheck, a11y validation
- `SKILL.md` ไม่เกิน 250 บรรทัด
