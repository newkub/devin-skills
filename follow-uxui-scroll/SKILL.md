---
name: follow-uxui-scroll
description: สร้าง scroll-driven UX เช่น parallax, scroll snap, infinite scroll, smooth scroll
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
  - follow-uxui-gesture
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

สร้าง scroll-driven UX เช่น parallax, scroll snap, infinite scroll, smooth scroll, progress indicator ให้ smooth และไม่กระตุก

## Scope

ใช้สำหรับ page หรือ section ที่เนื้อหาเยอะและต้องการ scroll behavior พิเศษ

## Execute

### 1. Detect Scroll Need

ระบุลักษณะ scroll ที่ต้องการ

> Goal: เลือก technique ถูกต้อง

1. ระบุประเภท: parallax, scroll snap, infinite scroll, smooth scroll, progress bar, reveal
2. ระบุ target: window, container, horizontal, vertical
3. ระบุ content volume: น้อย/มาก/ไม่จำกัด
4. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Choose Approach

เลือก technique ตาม use case

> Goal: ใช้ native API ก่อน แล้วจึง library

1. ถ้า scroll snap → ใช้ CSS `scroll-snap-type` ก่อน
2. ถ้า smooth scroll → ใช้ `Lenis` หรือ CSS `scroll-behavior: smooth`
3. ถ้า parallax/reveal → ใช้ `GSAP ScrollTrigger` หรือ `IntersectionObserver`
4. ถ้า infinite scroll → ใช้ `TanStack Virtual` หรือ `IntersectionObserver` + data fetching

### 3. Implement

เขียน scroll logic

> Goal: smooth และ performant

1. ใช้ `IntersectionObserver` แทน scroll event listener เมื่อเป็นไปได้
2. ใช้ `requestAnimationFrame` สำหรับ scroll-linked animation
3. ถ้าใช้ smooth scroll → รองรับ `prefers-reduced-motion`
4. ป้องกัน layout shift ขณะ load more content
5. ใช้ `will-change` อย่างระมัดระวัง

### 4. Validate

ตรวจสอบ scroll UX

> Goal: ไม่มี jank, a11y, หรือ content loss

1. ทดสอบบน low-end device และ trackpad/touch
2. ตรวจสอบ `prefers-reduced-motion`
3. ตรวจสอบ focus management หลัง infinite scroll load
4. ทำ `/validate` และ `/validate-workflow`
5. ถ้ามี issues → ทำ `/resolve-errors` แล้ว recheck

## Rules

### 1. Prefer Native

- ใช้ CSS scroll-snap และ scroll-behavior ก่อน
- ใช้ `IntersectionObserver` แทน `scroll` event
- หลีกเลี่ยงการอ่าน `scrollTop` ทุก frame

### 2. Performance

- ใช้ `transform` และ `opacity` สำหรับ parallax
- ไม่ animate หลาย element พร้อมกันใน viewport เดียว
- ใช้ virtualization สำหรับ infinite scroll

### 3. Accessibility

- รองรับ `prefers-reduced-motion`
- ไม่ lock scroll โดยไม่จำเป็น
- รักษา focus หลัง load more content

## Expected Outcome

- Scroll UX ที smooth บน device ต่างๆ
- ไม่มี jank หรือ layout shift
- ผ่าน lint, typecheck, a11y validation
- `SKILL.md` ไม่เกิน 250 บรรทัด
