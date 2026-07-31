---
name: follow-uxui
description: Orchestrator สำหรับ UX/UI patterns ชี้ไป skill ย่อยตาม dimension
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
  - follow-uxui-interaction
  - follow-uxui-animation
  - follow-uxui-accessibility
  - follow-uxui-chart
  - follow-uxui-3d
  - follow-my-tech-stack
  - follow-best-practice
  - validate
  - validate-workflow
  - check-reference
  - update-reference
---

## Goal

ชี้ user ไปยัง skill ย่อยทีเหมาะสมกับ UX/UI pattern ที่ต้องการ implement หรือ review

## Scope

ใช้เป็น entry point เมื่อไม่แน่ใจว่าต้องใช้ skill UX/UI ตัวไหน

## Execute

### 1. Detect UX/UI Dimension

ระบุว่าเรื่องที่ถามตกใน category ไหน

> Goal: ส่งต่อไป skill ย่อยถูกต้อง

1. ถ้าเป็น micro-interaction, hover, focus, loading, toggle, feedback → ทำ `/follow-uxui-interaction`
2. ถ้าเป็น animation visual/timeline → ทำ `/follow-uxui-animation`
3. ถ้าเป็น accessibility → ทำ `/follow-uxui-accessibility`
4. ถ้าเป็น chart/data viz → ทำ `/follow-uxui-chart`
5. ถ้าเป็น 3D scene/viewer → ทำ `/follow-uxui-3d`
6. ถ้าไม่ชัด → ทำ `/follow-uxui-interaction` เป็น default

## Rules

### 1. Delegate, Don't Duplicate

- `follow-uxui` ไม่ implement เอง ชี้ไป skill ย่อยเท่านั้น
- ไม่ใส่ implementation details ทีซ้ำกับลูก skill

### 2. Default Path

- ถ้าไม่ชัดว่าที category ไหน ให้ไป `/follow-uxui-interaction` ก่อน เพราะครอบคลุม interaction patterns ทั่วไป

## Expected Outcome

- User ถูกส่งต่อไปยัง skill ย่อยทีเหมาะสม
- ไม่มี duplicated instructions ระหว่าง skills
- `SKILL.md` ไม่เกิน 250 บรรทัด
