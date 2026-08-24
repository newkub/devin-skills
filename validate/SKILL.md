---
name: validate
description: ตรวจสอบความถูกต้อง คุณภาพ และความเหมาะสม
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
---

## Goal

ตรวจสอบความถูกต้อง คุณภาพ และความเหมาะสมของสิ่งที่ตรวจสอบ

## Scope

ใช้ได้กับทุกเรื่อง: code, documentation, design, decision, workflow, หรืออื่นๆ

## Execute

### 1. Check Correctness

> Goal: ตรวจสอบความถูกต้องตาม principle, standard, และ criteria ที่ผู้ใช้ระบุ
> Goal: ตรวจสอบความถูกต้องก่อนประเมินคุณภาพและความเหมาะสม

1. ทำตาม `/review-correctness` ตาม criteria ที่ผู้ใช้ระบุ
2. ตรวจสอบว่าทำงานได้ตาม requirement และไม่มี errors
3. ตรวจสอบ logic และ edge cases ได้รับการจัดการ

### 2. Check Quality

> Goal: Check Quality

1. ตรวจสอบคุณภาพโดยรวม (readability, completeness, consistency)
2. ตรวจสอบมี documentation เพียงพอหรือ clear
3. ตรวจสอบใช้ best practices และไม่มี redundancy

### 3. Check Appropriateness

> Goal: Check Appropriateness

1. ตรวจสอบความเหมาะสมกับ requirements หรือ context
2. ตรวจสอบความเหมาะสมกับ capabilities หรือ constraints
3. ตรวจสอบความเหมาะสมกับ scalability หรือ maintainability

### 4. Provide Feedback

> Goal: Provide Feedback

1. สรุปสิ่งที่ดีอยู่แล้วเสมอ
2. ระบุสิ่งที่ควรปรับปรุงอย่างชัดเจน
3. ให้ข้อเสนอแนะ actionable และระบุ priority
4. ทำตาม `/report` และ `/suggest-next-action` เพื่อสรุปผลและแนะนำ action ถัดไป

## Rules

### 1. Validation Approach

การตรวจสอบต้อง:

- ตรวจสอบอย่างเคร่งครัดและ systematic
- พิจารณา context และ constraints ที่เกี่ยวข้อง
- ใช้ criteria ที่ชัดเจนในการตรวจสอบ

### 2. Feedback Style

การให้ feedback ต้อง:

- ให้ feedback ที่ชัดเจนและ constructive
- ระบุสิ่งที่ดีอยู่แล้วเสมอ
- ให้ข้อเสนอแนะที่เป็นรูปธรรมและ actionable
- ระบุ priority ของการปรับปรุง (High, Medium, Low)

## Expected Outcome

- ความถูกต้องได้รับการตรวจสอบ
- คุณภาพได้รับการประเมิน
- ความเหมาะสมกับ context ได้รับการตรวจสอบ
- Feedback ที่ชัดเจนและ constructive
- ข้อเสนอแนะที่ actionable และมี priority
