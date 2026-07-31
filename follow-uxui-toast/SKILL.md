---
name: follow-uxui-toast
description: สร้าง toast, snackbar, notification system ที accessible และไม่รบกวน user
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
  - follow-uxui-modal
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

สร้าง toast, snackbar, notification system ทีช่วยสื่อสาร status ให้ user โดยไม่รบกวน flow และ accessible

## Scope

ใช้สำหรับ notifications หลัง action เช่น success, error, info, promise, async progress

## Execute

### 1. Detect Toast Need

ระบุประเภท notification

> Goal: เลือก pattern ถูกต้อง

1. ระบุประเภท: success, error, info, warning, promise, loading
2. ระบุ duration: auto-dismiss หรือ manual close
3. ระบุ position: top, bottom, center, corner
4. ระบุ target framework: React, Vue, Solid, Svelte
5. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Choose Library

เลือก library หรือ implement เอง

> Goal: ใช้ headless/primitive ที a11y ดี

1. React: `Sonner`, `React Hot Toast`, `Radix Toast`
2. Vue: `vue-toastification`, `Nuxt UI Toast`
3. Solid: `solid-toast`
4. หรือ implement เองด้วย custom store + portal

### 3. Implement

สร้าง toast system

> Goal: ใช้งานได้และไม่กวน user

1. ใช้ global store หรือ context จัดการ queue
2. กำหนด limit (เช่น max 3 toast พร้อมกัน)
3. ใช้ animation enter/exit ด้วย `animejs`, `GSAP`, หรือ CSS transitions
4. รองรับ pause on hover/focus
5. ใช้ `role="status"` หรือ `role="alert"` ตาม severity
6. ให้ close button ทีมี `aria-label`

### 4. Validate

ตรวจสอบ toast

> Goal: ไม่มี a11y หรือ UX issues

1. ทดสอบ screen reader อ่าน toast ตามลำดับ
2. ตรวจสอบ auto-dismiss ไม่หายเร็วเกินไป
3. ตรวจสอบ pause on hover
4. ทำ `/validate` และ `/validate-workflow`
5. ถ้ามี issues → ทำ `/resolve-errors` แล้ว recheck

## Rules

### 1. Non-Intrusive

- ไม่ block user flow
- ไม่แสดงหลาย toast ซ้อนกันจน screen เต็ม
- ให้ manual close เสมอ

### 2. Accessibility

- ใช้ `role="status"` สำหรับ info/success
- ใช้ `role="alert"` สำหรับ error/warning
- ระบุ `aria-live` ให้เหมาะสม
- ให้ close button มี label ชัดเจน

### 3. Animation

- ใช้ animation enter/exit สั้น (150-300ms)
- รองรับ `prefers-reduced-motion`
- หลีกเลี่ยง animation ทีทำให้ user พลาดข้อความ

## Expected Outcome

- Toast system ที accessible
- ผ่าน lint, typecheck, a11y validation
- `SKILL.md` ไม่เกิน 250 บรรทัด
