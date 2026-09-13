---
name: morning-briefing-report-digest
description: สร้าง daily digest report — uncommit/unpush/CI/PRs/stale branches ในรายงานเดียว
argument-hint: "[repos-scope]"
related:
  - report
  - report-todo
  - suggest-next-action
---

## Goal

สร้าง digest report ของ `/morning-briefing` — สถานะ repos ทั้งหมดในรายงานเดียวที่อ่านจบใน 1 นาที

## Scope

- ใช้เมื่อ `/morning-briefing` dispatch มาที่ `report`/`digest` — output ทั้งหมดของ skill คือ report นี้
- Chat-only: ไม่สร้างไฟล์ถาวร เว้น user ขอ (`/create-report-in-dot-devin`)

## Execute

### 1. Collect Status

> Goal: รวม signals จากทุก repo

1. รวม: uncommit counts, unpush commits, CI fails, PRs รอ review, stale branches
2. แหล่ง: `/check-uncommit`, `/check-unpush`, `gh` status, `/list-github-pr`
3. ข้าม repos ที่เข้าถึงไม่ได้ — flag ไว้

### 2. Build Digest

> Goal: สรุปที่ action ได้ทันที

1. Section ตามความเร่งด่วน: `needs-action` (CI fail, PR รอนาน) → `pending` (uncommit/unpush) → `info` (stale branches)
2. ตาราง: `No.`, `Repo`, `Signal`, `Detail`, `Action`
3. Clean repos สรุปเป็น count เดียว — ไม่ list ทีละตัว

### 3. Next Actions

> Goal: ปิดท้ายด้วยสิ่งที่ทำได้เลย

1. Top 3 actions เรียงตามความเร่งด่วน
2. ทำ `/report-todo` ถ้า user ต้องการ action plan
3. ทำ `/suggest-next-action`

## Rules

- Digest ต้องสั้น — รายละเอียด expand เมื่อ user ขอเท่านั้น
- repos ที่เข้าถึงไม่ได้ flag แยก — อย่าปนกับ clean
- ทุก action ชี้ skill ที่ทำได้ต่อ (`/resolve-cicd`, `/git-push`, `/review-github-pr`)

## Expected Outcome

- Digest อ่านจบเร็ว พร้อม actions ที่ทำได้ทันที
