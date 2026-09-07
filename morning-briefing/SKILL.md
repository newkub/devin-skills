---
name: morning-briefing
description: Daily digest รวมสถานะ — uncommit, unpush, CI fails, PRs รอ review และ stale branches
argument-hint: "[repos-scope]"
related:
  - check-uncommit
  - check-unpush
  - resolve-github-actions-fails
  - list-github-pr
  - list-github-issue
  - list-git-branch
  - report
  - suggest-next-action
---

## Goal

สรุปสถานะทั้งหมดที่ต้องรู้ตอนเริ่มวัน/เริ่ม session — งานค้าง, repos ที่ไม่ clean, CI ที่แดง, PRs/issues ที่รอ — เป็น digest เดียวแทนเช็คทีละอย่าง

## Scope

- Composite skill: รวมผลจาก check/list skills ที่มีอยู่ ไม่สร้าง checks ใหม่
- ครอบคลุม: uncommitted work, unpushed commits, CI failures, open PRs รอ review, assigned issues, stale branches, pending TODOs
- Read-only: รายงาน — ไม่แก้อะไรเอง

## Execute

### 1. Work In Progress

> Goal: งานที่ค้างใน repos

1. ทำ `/check-uncommit` — repos ที่มี uncommitted changes
2. ทำ `/check-unpush` — commits ที่ยังไม่ push, branches ไม่มี upstream
3. ทำ `/report-scan-todo` — TODO.md items ที่ pending

### 2. CI And PRs

> Goal: สิ่งที่ต้อง attention บน remote

1. ทำ `/resolve-github-actions-fails` — workflows ที่ fail ล่าสุด
2. ทำ `/list-github-pr` — PRs ที่รอ review (ของตัวเอง + ที่ถูก request)
3. ทำ `/list-github-issue` — issues ที่ assigned/mention

### 3. Branch Hygiene

> Goal: branches ที่นานเกิน

1. ทำ `/list-git-branch` — branches ที่ไม่ active นาน หรือ merged แล้วยังไม่ลบ
2. flag branches ที่ diverge จาก main มาก — rebase risk

### 4. Compile Digest

> Goal: รวมเป็น briefing เดียว

1. ใช้ `/report` แยก sections:
   - `Needs Action`: uncommit, unpush, failed CI, review requests
   - `Waiting`: PRs ที่รอคนอื่น, blocked items
   - `Hygiene`: stale branches, old TODOs
2. เรียงตาม urgency — blockers และ time-sensitive ก่อน
3. จบด้วย `/suggest-next-action` — เสนอ top 3 สิ่งที่ควรทำ

## Rules

### 1. Composite Only

- reuse check/list skills ที่มี — ไม่เขียน check logic ซ้ำ
- ถ้า sub-skill ไม่มีหรือ fail → ข้าม section นั้นและระบุไว้

### 2. Signal Over Noise

- แสดงเฉพาะสิ่งที่ต้อง action หรือรู้ — ไม่ dump ทุกอย่าง
- สรุปเป็นจำนวนเมื่อ list ยาว

### 3. Fast

- รัน checks แบบ parallel เมื่อทำได้ — briefing ต้องเร็วพอใช้ทุกวัน
- skip sections ที่ไม่ relevant (ไม่มี remote → ข้าม CI/PR sections)

## Expected Outcome

- Digest เดียวเห็นทุกอย่างที่ต้องรู้: WIP, CI, PRs, hygiene
- Prioritized — รู้ว่าควรเริ่มจากอะไร
- ไม่ต้องรันหลาย skills แยกกัน
