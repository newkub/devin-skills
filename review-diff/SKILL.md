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
---

## Goal

รีวิว git diff อย่างรวดเร็ว สรุปสิ่งที่เปลี่ยนแปลง ตรวจหาปัญหาทีอาจเกิด และถาม user ก่อนตัดสินใจ keep, revert หรือดำเนินการต่อ

## Scope

ใช้ก่อน `git-commit`, `/ship-ci`, `/follow-enter-dot` หรือทุกครั้งที่ working tree มีการเปลี่ยนแปลงจำนวนมากและต้องการ user confirmation ก่อนลงมือ

## Execute

### 1. Capture Diff State

> Goal: รวบรวมสถานะการเปลี่ยนแปลงทั้งหมด

1. รัน `git status --short`, `git diff --stat`, `git diff --name-status`
2. ระบุ scope เฉพาะด้วย `git diff -- <path>` ถ้ามี
3. ดูรายละเอียดใน [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 2. Summarize Changes

> Goal: ทำให้ user เข้าใจ diff ในเวลาสั้น

1. สร้างตารางสรุป status, lines, intent ต่อไฟล์
2. ตรวจ references ของไฟล์ที่ลบ และส่วนสำคัญของไฟล์แก้ไข
3. ดูรายละเอียดใน [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 3. Check Risks

> Goal: หาปัญหาก่อนสรุป

1. ตรวจ references เก่า, ไฟล์ยาวเกิน 250 บรรทัด, secrets, scope
2. ดูรายละเอียดใน [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 4. Present Options

> Goal: ให้ user เลือกท่าทีถัดไป

1. สรุป `## Diff Review Snapshot` และเสนอ `continue`, `revert`, `inspect`, `ask`
2. ไม่ตัดสินใจแทน user ถ้า diff มี action เสี่ยง
3. ดูรายละเอียดใน [references/diff-review-checklist.md](references/diff-review-checklist.md)

### 5. Act On Decision

> Goal: ดำเนินการตามที user เลือก

1. ทำงานถัดไปตาม `continue`, `revert`, `inspect`, `ask` ที user เลือก
2. ดูรายละเอียดใน [references/diff-review-checklist.md](references/diff-review-checklist.md)

## Rules

### 1. Minimal Output

- สรุปให้พอตัดสินใจ ไม่ dump diff ทั้งหมด
- ถ้าตารางยาวเกิน 20 แถว ให้ group ตาม status หรือ directory
- ใช้ `git diff --stat` ก่อนจะแสดงรายละเอียด

### 2. Safety First

- ถ้า diff มีการลบ/ย้าย/overwrite ต้องระบุและถามก่อน
- ไม่ commit หรือ ship ถ้ายังไม่ได้ user confirmation
- ถ้าพบ untracked files นอก scope ให้แจ้ง user

### 3. Evidence-Based

- ทุกสรุปต้องมาจาก `git status`, `git diff`, หรือการอ่านไฟล์จริง
- ระบุ file path, line count, และ status เป็นหลักฐาน
- ไม่เดา intent ของ changes ถ้าไฟล์ซับซ้อน

### 4. No Hidden Scope

- หยุดถ้า diff มีงานนอก scope ที่ user ร้องขอ
- แยก diff ของงานหลักกับ side effects ออกจากกัน
- ถ้ามี side effects ให้รายงานก่อนและขอ decision

### 5. Cross-Reference Check

- ถ้ามี rename/ลบ skill ให้ `/grep` หา references ทีเกี่ยวข้อง
- ถ้า references ขาด → แจ้งก่อน continue
- ถ้า references เกิน → แนะนำ `/update-references`

## Expected Outcome

- ตารางสรุป diff ทั้ง tracked และ untracked
- รายการ risks หรือ side effects ทีพบ
- ตัวเลือกทัดไปที user เลือกได้ชัดเจน
- ไม่มีการ commit/ship/revert โดยไม่ได้รับ user confirmation
