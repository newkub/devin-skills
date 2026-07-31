---
name: follow-uxui-modal
description: สร้าง dialogs, drawers, overlays ที accessible ด้วย focus trap, escape, scroll lock
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
  - follow-uxui-animation
  - follow-uxui-interaction
  - follow-react
  - follow-vue
  - follow-solidjs
  - review-accessibility
  - check-accessibility
  - follow-best-practice
  - validate
  - validate-workflow
  - check-reference
  - update-reference
---

## Goal

สร้าง dialogs, drawers, overlays ทีใช้งานง่าย ปลอดภัย และ accessible ครอบคลุม focus trap, escape key, scroll lock

## Scope

ใช้สำหรับ modal, dialog, drawer, popover, confirm, alert ใน web app

## Execute

### 1. Detect Modal Type

ระบุประเภท overlay

> Goal: เลือก component pattern ถูกต้อง

1. ระบุประเภท: alert, confirm, dialog, drawer, popover, bottom sheet
2. ระบุขนาด: full, large, small, mobile bottom sheet
3. ระบุ target framework: React, Vue, Solid, Svelte
4. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Choose Library

เลือก headless UI library

> Goal: ใช้ accessible primitive ก่อน

1. React: `Radix Dialog`, `Headless UI`, `React Aria`, `Shadcn UI Dialog`
2. Vue: `Nuxt UI`, `Radix Vue`, `Kobalte`
3. Solid: `Kobalte`, `Corvu`
4. Vanilla: ใช้ native `<dialog>` element

### 3. Implement

สร้าง modal pattern

> Goal: accessible และ robust

1. ใช้ native `<dialog>` หรือ headless primitive
2. จัดการ focus: focus first focusable element, restore focus ตอนปิด
3. รองรับ `Escape` key เพื่อปิด
4. ล็อค body scroll ตอนเปิด
5. ปิดเมื่อ click backdrop โดยมี guard
6. ใช้ `aria-modal`, `aria-labelledby`, `aria-describedby`

### 4. Validate

ตรวจสอบ modal

> Goal: ไม่มี a11y หรือ UX issues

1. ทดสอบ keyboard: Tab, Shift+Tab, Escape
2. ตรวจสอบ focus trap
3. ตรวจสอบ screen reader output
4. ทดสอบ scroll lock
5. ทำ `/validate` และ `/validate-workflow`
6. ถ้ามี issues → ทำ `/resolve-errors` แล้ว recheck

## Rules

### 1. Accessibility First

- ใช้ native `<dialog>` หรือ headless primitive ทีจัดการ a11y
- กัก focus ภายใน modal
- คืน focus เมื่อปิด

### 2. UX Behavior

- ปิดด้วย Escape, backdrop click, close button
- ไม่ปิดเมื่อ click ภายใน modal
- แสดง clearly ว่าเปิด modal

### 3. Performance

- ไม่ render DOM หนักใน modal จนกว่าจะเปิด
- ใช้ portal เพื่อหลีกเลี่ยง z-index ปัญหา
- cleanup event listeners ตอนปิด

## Expected Outcome

- Modal/drawer ที accessible ครบ
- ผ่าน keyboard, screen reader, scroll lock tests
- ผ่าน lint, typecheck, a11y validation
- `SKILL.md` ไม่เกิน 250 บรรทัด
