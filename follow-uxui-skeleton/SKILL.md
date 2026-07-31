---
name: follow-uxui-skeleton
description: สร้าง skeleton screens, shimmer, และ loading states ทีไม่กระตุก
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

สร้าง skeleton screens, shimmer, และ loading states ทีช่วยลด perceived loading time และไม่กระตุก

## Scope

ใช้เมื่อต้องแสดง loading state ระหว่างโหลดข้อมูล เช่น card list, table, profile page

## Execute

### 1. Detect Loading Pattern

ระบุลักษณะ loading ที่ต้องการ

> Goal: เลือก skeleton pattern ถูกต้อง

1. ระบุ content layout: card, list, table, text block, image
2. ระบุ loading duration: short (<300ms), medium, long
3. ระบุ target framework: React, Vue, Solid, Svelte
4. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Choose Pattern

เลือก pattern ตาม context

> Goal: ใช้ pattern ที match content จริง

1. ถ้า layout ซับซ้อน → ใช้ static skeleton ที match shape ของ content
2. ถ้าต้องการดึงดูดสายตา → ใช้ shimmer animation บน skeleton
3. ถ้า loading นาน → ใช้ skeleton + progress indicator
4. ถ้า loading สั้นมาก → อาจไม่ต้องแสดงอะไร เพื่อลด flicker

### 3. Implement

สร้าง skeleton component

> Goal: performant และ match content

1. ใช้ placeholder shapes ที match ขนาด content จริง
2. ใช้ CSS gradient animation สำหรับ shimmer
3. ใช้ `prefers-reduced-motion` เพื่อ disable shimmer
4. ใช้ `aria-busy` บน container
5. รักษา layout ไม่ให้ shift เมื่อ content load

### 4. Validate

ตรวจสอบ skeleton

> Goal: ไม่กระตุกหรือทำให้ user สับสน

1. ทดสอบบน slow 3G หรือ slow device
2. ตรวจสอบ `prefers-reduced-motion`
3. ตรวจสอบ `aria-busy` และ screen reader
4. ทำ `/validate` และ `/validate-workflow`
5. ถ้ามี issues → ทำ `/resolve-errors` แล้ว recheck

## Rules

### 1. Match Real Content

- skeleton ต้อง match รูปทรงของ content จริง
- ไม่ใช้ generic spinner แทน skeleton
- ใช้ placeholder ขนาดและระยะห่างเดียวกับ content

### 2. Performance

- ใช้ CSS animation ไม่ใช้ JS
- ไม่ทำ shimmer หลายร้อย element พร้อมกัน
- ใช้ `will-change` อย่างระมัดระวัง

### 3. Accessibility

- ใช้ `aria-busy="true"` บน container
- ระบุ visually hidden text "loading" ถ้าจำเป็น
- รองรับ `prefers-reduced-motion`

## Expected Outcome

- Skeleton screens ที match content
- Shimmer animation ไม่กระตุก
- ผ่าน a11y และ performance validation
- `SKILL.md` ไม่เกิน 250 บรรทัด
