---
name: scope-acceptance
description: Scope clarity and acceptance criteria validation
---

# Scope And Acceptance Validation

## Goal

ตรวจ scope clarity และ acceptance criteria

## Checks

1. ตรวจ scope ชัดเจน ไม่กว้างเกินไป ไม่แคบเกินไป
2. ตรวจแต่ละ task มี acceptance criteria ที่ testable
3. ตรวจไม่มี scope creep หรือ missing tasks
4. ตรวจ rollback plan มีสำหรับ high-risk tasks

## Severity

- Critical: scope ไม่ชัดทำให้ deliver ไม่ได้, high-risk task ไม่มี rollback
- High: acceptance criteria ไม่ testable, missing rollback
- Medium: scope กว้าง/แคบเกินไป, missing minor acceptance criteria
- Low: documentation gap
