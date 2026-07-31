---
name: follow-uxui-gesture
description: ใช้งาน touch/mouse gestures เช่น drag, swipe, pinch, long-press ใน UX/UI
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
  - follow-my-tech-stack
  - follow-react
  - follow-vue
  - follow-solidjs
  - follow-best-practice
  - review-accessibility
  - validate
  - validate-workflow
  - check-reference
  - update-reference
---

## Goal

implement touch/mouse gestures เช่น drag, swipe, pinch, long-press, pan ใน web app ให้ smooth และ responsive

## Scope

ใช้สำหรับ interactive components ที่ต้องการ gesture input เช่น carousel, map, image viewer, drawer, sortable list

## Execute

### 1. Detect Gesture Need

ระบุ gesture ที่ต้องการ

> Goal: เลือก library และ pattern ถูกต้อง

1. ระบุ gesture: drag, swipe, pinch, rotate, pan, long-press
2. ระบุ input: pointer, touch, mouse, stylus
3. ระบุ target framework: React, Vue, Solid, Svelte
4. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Choose Library

เลือก library ตาม use case

> Goal: ใช้ library ที minimal และ cross-platform

1. ถ้าเป็น React → ใช้ `@use-gesture` กับ `react-spring` หรือ `Framer Motion`
2. ถ้าเป็น Vue → ใช้ `@vueuse/gesture` หรือ `interact.js`
3. ถ้าเป็น Vanilla หรือหลาย framework → ใช้ `interact.js` หรือ `Hammer.js`
4. ถ้าต้องการ native pointer events → implement เองด้วย `PointerEvent`

### 3. Implement Gesture

เขียน gesture logic

> Goal: ทำงานได้จริงบนทุก device

1. ใช้ `Pointer Events` หรือ abstraction library
2. คำนวณ velocity, direction, distance ก่อนตัดสินใจ trigger
3. ใช้ `requestAnimationFrame` สำหรับ visual feedback ระหว่าง drag
4. cleanup listeners/timers เมื่อ component unmount
5. รองรับ `touch-action` CSS เพื่อป้องกัน scroll conflict

### 4. Validate

ตรวจสอบ gesture

> Goal: ไม่มี scroll conflict, a11y, หรือ performance issues

1. ทดสอบบน touch device, mouse, trackpad
2. ตรวจสอบ scroll conflict กับ page scroll
3. ตรวจสอบ keyboard alternative
4. ทำ `/validate` และ `/validate-workflow`
5. ถ้ามี issues → ทำ `/resolve-errors` แล้ว recheck

## Rules

### 1. Gesture Discrimination

- กำหนด threshold ชัดเจนก่อน trigger gesture
- ไม่ trigger ขณะ user scroll
- รองรับ `passive: false` เมื่อต้อง prevent default

### 2. Accessibility

- ให้ keyboard alternative สำหรับทุก gesture
- ใช้ `aria-grabbed`, `aria-dropeffect` สำหรับ drag-and-drop
- เคารพ `prefers-reduced-motion`

### 3. Performance

- ไม่ bind listener ทีละ element มากเกิน 100 ตัว โดยไม่ use event delegation
- ใช้ `transform` สำหรับ visual feedback
- throttled gesture callbacks

## Expected Outcome

- Gesture input ทีทำงานบน touch, mouse, stylus
- ไม่มี scroll conflict หรือ a11y issues
- ผ่าน lint, typecheck, และ validation
- `SKILL.md` ไม่เกิน 250 บรรทัด
