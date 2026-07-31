---
name: follow-uxui-feedback
description: ออกแบบ empty, error, success states และ microcopy ทีชัดเจนและช่วย user
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
  - follow-uxui-toast
  - follow-uxui-form
  - follow-my-tech-stack
  - follow-best-practice
  - review-accessibility
  - validate
  - validate-workflow
  - check-reference
  - update-reference
---

## Goal

ออกแบบ empty, error, success states และ microcopy ทีชัดเจน ช่วย user เข้าใจสถานะ และกระทำต่อไปได้

## Scope

ใช้สำหรับทุกจุดที system ต้องสื่อสารกับ user เช่น empty list, 404, form error, success message

## Execute

### 1. Detect Feedback Need

ระบุ context ทีต้อง feedback

> Goal: เลือก pattern ถูกต้อง

1. ระบุ state: empty, loading, error, success, no results, offline
2. ระบุ severity: info, warning, critical
3. ระบุ action ที user ควรทำต่อ
4. ถ้าไม่ชัด → ทำ `/ask-me`

### 2. Design Feedback

สร้าง feedback UI

> Goal: ชัดเจนและ actionable

1. ใช้หัวข้อทีตรงประเด็นและ microcopy ทีอธิบายสถานะ
2. ให้ action ชัดเจน (retry, create, go back, contact support)
3. ใช้ illustration/icon ประกอบแต่ไม่ทดแทนข้อความ
4. ใช้ animation เข้า/ออก ด้วย `animejs` หรือ CSS transitions

### 3. Implement

เขียน component

> Goal: ใช้งานได้จริงทุก state

1. สร้าง reusable feedback component
2. ใช้ design tokens สำหรับ color, spacing, typography
3. รองรับ `prefers-reduced-motion`
4. ตรวจสอบว่า screen reader อ่าน content ครบ

### 4. Validate

ตรวจสอบ feedback

> Goal: ไม่มี confusion

1. ทดสอบกับ real users หรือ heuristic evaluation
2. ตรวจสอบ clarity ของ message และ action
3. ตรวจสอบ a11y
4. ทำ `/validate` และ `/validate-workflow`
5. ถ้ามี issues → ทำ `/resolve-errors` แล้ว recheck

## Rules

### 1. Clarity

- บอกสิ่งเกิดขึ้น, ทำไม, และทำอะไรต่อ
- ไม่ใช้ generic message เช่น "An error occurred"
- ใช้ภาษาที user เข้าใจ

### 2. Actionable

- ทุก error state ควรมี action ถัดไป
- empty state ควรมี CTA สร้างเนื้อหา
- success state ควรมี next step

### 3. Tone

- ใช้ tone สม่ำเสมอ
- ไม่ blame user
- ใช้ positive and helpful language

## Expected Outcome

- Feedback states ทีชัดเจนและ actionable
- ผ่าน lint, typecheck, a11y validation
- `SKILL.md` ไม่เกิน 250 บรรทัด
