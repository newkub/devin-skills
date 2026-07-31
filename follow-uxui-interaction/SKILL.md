---
name: follow-uxui-interaction
description: สร้าง micro-interactions และ interactive feedback เช่น hover, focus, loading, toggle ใน UX/UI
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
  - follow-uxui-3d
  - follow-uxui-accessibility
  - follow-uxui-animation
  - follow-uxui-chart
  - follow-uxui-feedback
  - follow-uxui-form
  - follow-uxui-gesture
  - follow-uxui-modal
  - follow-uxui-scroll
  - follow-uxui-skeleton
  - follow-uxui-toast
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

สร้าง micro-interactions และ interactive feedback เช่น hover, focus, active, loading, toggle, success/error state ใน web app ให้รวดเร็ว มีประสิทธิภาพ และ accessible

## Scope

ใช้สำหรับ UX/UI interactions ที่ไม่ใช่ animation sequence ใหญ่ เช่น button press, switch toggle, link hover, form focus, inline validation, loading spinner

## Execute

### 1. Detect Interaction Type

ระบุลักษณะ interaction ที่ต้องการ

> Goal: เลือก pattern และ library ถูกต้อง

1. ระบุประเภท: hover, focus, active, loading, toggle, inline validation, success/error feedback
2. ระบุ trigger: mouse, keyboard, touch, system event
3. ระบุ target framework: React, Vue, Solid, Svelte, Vanilla
4. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Choose Approach

เลือก technique ตาม complexity

> Goal: ใช้งาน minimal และ maintainable

1. ถ้าง่าย → ใช้ CSS transitions หรือ Tailwind `transition-*`
2. ถ้าต้องการ spring/physics → ใช้ `Framer Motion` (React), `@vueuse/motion` (Vue), `svelte/motion`
3. ถ้าต้องการ timeline/sequence → ใช้ `animejs` หรือ `GSAP`
4. ถ้าต้องการ sound/haptic → ใช้ `use-sound` หรือ native Vibration API

### 3. Implement Pattern

เขียน interaction pattern

> Goal: ทำงานได้จริงและเข้าใจง่าย

1. ใช้ state ทีชัดเจน: `idle`, `hover`, `focus`, `active`, `loading`, `success`, `error`
2. ใช้ CSS custom properties หรือ design tokens สำหรับ duration, easing
3. ใช้ `transform`/`opacity` เป็นหลัก หลีกเลี่ยง `width`/`height`
4. รองรับ `prefers-reduced-motion`
5. แยก interaction logic ออกจาก business logic

### 4. Validate

ตรวจสอบ interaction

> Goal: ไม่มี a11y หรือ UX issues

1. ทดสอบด้วย mouse, keyboard, touch
2. ตรวจสอบ `focus-visible` และ focus order
3. ตรวจสอบ `prefers-reduced-motion`
4. ทำ `/validate` และ `/validate-workflow`
5. ถ้ามี issues → ทำ `/resolve-errors` แล้ว recheck

### 5. Delegate To Specific Pattern

ส่งต่อไป skill ย่อยถ้าอยู่นอก scope micro-interaction

> Goal: ใช้ skill ทีเฉพาะทางกว่า

1. ถ้าเป็น gesture → ทำ `/follow-uxui-gesture`
2. ถ้าเป็น scroll-driven → ทำ `/follow-uxui-scroll`
3. ถ้าเป็น modal/drawer → ทำ `/follow-uxui-modal`
4. ถ้าเป็น toast/snackbar → ทำ `/follow-uxui-toast`
5. ถ้าเป็น form → ทำ `/follow-uxui-form`
6. ถ้าเป็น feedback state → ทำ `/follow-uxui-feedback`
7. ถ้าเป็น chart → ทำ `/follow-uxui-chart`
8. ถ้าเป็น 3D → ทำ `/follow-uxui-3d`
9. ถ้าเป็น accessibility → ทำ `/follow-uxui-accessibility`
10. ถ้าเป็น skeleton → ทำ `/follow-uxui-skeleton`

## Rules

### 1. Feedback Must Be Clear

- ทุก interaction ต้องมี feedback ทีชัดเจน
- ไม่ใช้ animation สำหรับ feedback ที user ต้องรอ
- ให้ visual, sound หรือ haptic ตาม context

### 2. Performance

- ใช้ CSS transitions สำหรับ micro-interaction ทั่วไป
- หลีกเลี่ยง JavaScript loop สำหรับ hover/focus
- ใช้ `will-change` อย่างระมัดระวัง

### 3. Accessibility

- รองรับ keyboard ทั้งหมด
- ใช้ `focus-visible` ไม่ใช่ `:focus` สำหรับ hover-sensitive element
- เคารพ `prefers-reduced-motion`
- ไม่พึ่งสีอย่างเดียวสำหรับ feedback สำคัญ

### 4. Maintainability

- ใช้ design tokens สำหรับ duration, easing, color
- สร้าง reusable hooks/composables สำหรับ common interactions
- เก็บ interaction logic ในทีเดียว

## Expected Outcome

- Micro-interactions ทีทำงานบน mouse, keyboard, touch
- Feedback ทีชัดเจนและ accessible
- ผ่าน lint, typecheck, a11y validation
- `SKILL.md` ไม่เกิน 250 บรรทัด
