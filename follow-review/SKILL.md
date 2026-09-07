---
name: follow-review
description: (merged into /review) เลือกและ execute review skill(s) ที่เหมาะสมกับ context
argument-hint: "[topic-or-goal]"
related:
  - review
  - deep-review
  - review-gaps
---

## Goal

เลือกและ execute `review-*` skill(s) ที่เหมาะสมกับ context — ทำงานนี้ผ่าน `/review` ได้เลย ตั้งแต่ทีถูก merge เข้าด้วยกัน

## Scope

ใช้ `/review` เป็น entry หลักสำหรับ routing ไป `review-*` skills — ตาราง mapping 43 มิติและ parallel execution อยู่ที่นั่นแล้ว

## Execute

### 1. Redirect

> Goal: ใช้ `/review` แทน

1. ทำ `/review` พร้อม context เดิม
2. ถ้าต้องการ deep multi-dimension review → ทำ `/deep-review`
3. ถ้าต้องการรวม findings หลายมิติ → ทำ `/review-gaps`

## Rules

- ใช้ `/review` เป็น entry หลักสำหรับ review routing
- ไม่เรียก `/review` ซ้อนหลัง redirect

## Expected Outcome

- ถูกส่งต่อไป `/review` และเลือก review skill ที่ถูกต้อง
