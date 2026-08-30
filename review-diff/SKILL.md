---
name: review-diff
description: รีวิว git diff ก่อนตัดสินใจ keep, revert หรือดำเนินการต่อ
argument-hint: "[scope]"
related:
  - report-git-diff
  - check-git-diff
  - report-table
  - deep-validate
  - ask-me
  - ship
  - follow-enter-dot
---

## Goal

รีวิว git diff อย่างรวดเร็ว สรุปสิ่งที่เปลี่ยนแปลง ตรวจหาปัญหาทีอาจเกิด และถาม user ก่อนตัดสินใจ keep, revert หรือดำเนินการต่อ

## Scope

ใช้ก่อน `git-commit`, `/ship`, `/follow-enter-dot` หรือทุกครั้งที่ working tree มีการเปลี่ยนแปลงจำนวนมากและต้องการ user confirmation ก่อนลงมือ

## Execute

### 1. Capture Diff State
ทำตาม [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 2. Summarize Changes
สรุป changes ตาม [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 3. Check Risks
ตรวจหา risks ตาม [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 4. Present Options
เสนอตัวเลือกถัดไปตาม [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 5. Act On Decision
ดำเนินการตาม decision ของ user ตาม [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 6. Score And Report
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) แล้วทำ `/report-table` และ `/suggest-next-action`

## Rules

- สรุปให้พอตัดสินใจ ไม่ dump diff ทั้งหมด
- ถ้าตารางยาวเกิน 20 แถว ให้ group ตาม status หรือ directory
- ถ้า diff มีการลบ/ย้าย/overwrite ต้องระบุและถามก่อน
- ไม่ commit หรือ ship ถ้ายังไม่ได้ user confirmation
- ทุกสรุปต้องมาจาก `git status`, `git diff` หรือการอ่านไฟล์จริง
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis

## Expected Outcome

- ตารางสรุป diff ทั้ง tracked และ untracked
- รายการ risks หรือ side effects ทีพบ
- ตัวเลือกทัดไปที user เลือกได้ชัดเจน
- ไม่มีการ commit/ship/revert โดยไม่ได้รับ user confirmation
