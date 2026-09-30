---
name: morning-briefing
description: Daily digest รวมสถานะ — uncommit, unpush, CI fails, PRs รอ review และ stale branches
argument-hint: "[repos-scope|report]"
related:
  - check-uncommit
  - check-unpush
  - resolve-errors
  - list-github
  - list-git
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
3. อ่าน `TODO.md` ของ repos — items ที่ pending

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

ทำตาม `workflows/report-digest/SKILL.md` — แยก sections ตาม urgency, top 3 actions, `/suggest-next-action`

### Workflows

| Argument | Workflow |
|----------|----------|
| `report`, `digest` | `workflows/report-digest/SKILL.md` — daily digest report รวม signals ทั้งหมด |

1. ถ้า argument เป็น `report`/`digest` → อ่าน `workflows/report-digest/SKILL.md` แล้วทำตาม flow — ใช้ signals ที่เก็บแล้ว
2. ถ้าไม่ระบุ → ทำ Steps 1-4 ตามปกติ โดย Step 4 อ่าน workflow `report-digest` มา execute

### Subagents

> Goal: parallelize signal collection ให้ briefing เร็ว

- ใช้ `subagents/signal-collector.md` เมื่อต้องเก็บหลาย signals พร้อมกัน (uncommit/unpush/CI-fails/PRs/stale-branches) — spawn ทีละ signal type ผ่าน `/use-subagents` แล้ว merge เป็น digest เดียว

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
- ใช้ /resolve-errors ถ้าจำเป็น


## Merged Details

### report-digest

##### Goal

สร้าง digest report ของ `/morning-briefing` — สถานะ repos ทั้งหมดในรายงานเดียวที่อ่านจบใน 1 นาที

##### Scope

- ใช้เมื่อ `/morning-briefing` dispatch มาที่ `report`/`digest` — output ทั้งหมดของ skill คือ report นี้
- Chat-only: ไม่สร้างไฟล์ถาวร เว้น user ขอ (`/create-report-in-dot-devin`)

##### Execute

###### 1. Collect Status

> Goal: รวม signals จากทุก repo

1. รวม: uncommit counts, unpush commits, CI fails, PRs รอ review, stale branches
2. แหล่ง: `/check-uncommit`, `/check-unpush`, `gh` status, `/list-github-pr`
3. ข้าม repos ที่เข้าถึงไม่ได้ — flag ไว้

###### 2. Build Digest

> Goal: สรุปที่ action ได้ทันที

1. Section ตามความเร่งด่วน: `needs-action` (CI fail, PR รอนาน) → `pending` (uncommit/unpush) → `info` (stale branches)
2. ตาราง: `No.`, `Repo`, `Signal`, `Detail`, `Action`
3. Clean repos สรุปเป็น count เดียว — ไม่ list ทีละตัว

###### 3. Next Actions

> Goal: ปิดท้ายด้วยสิ่งที่ทำได้เลย

1. Top 3 actions เรียงตามความเร่งด่วน
2. ทำ `/report-todo` ถ้า user ต้องการ action plan
3. ทำ `/suggest-next-action`

##### Rules

- Digest ต้องสั้น — รายละเอียด expand เมื่อ user ขอเท่านั้น
- repos ที่เข้าถึงไม่ได้ flag แยก — อย่าปนกับ clean
- ทุก action ชี้ skill ที่ทำได้ต่อ (`/resolve-cicd`, `/git-push`, `/review-github-pr`)

##### Expected Outcome

- Digest อ่านจบเร็ว พร้อม actions ที่ทำได้ทันที

### subagents/signal-collector

##### Role

Subagent สำหรับเก็บ briefing signal ประเภทเดียว — เช่น `uncommit`, `unpush`, `ci-fails`, `open-prs`, `assigned-issues`, `stale-branches`, `pending-todos` — จาก repos ทั้งหมดใน scope — ใช้เมื่อ `morning-briefing` ต้องรวบรวมหลาย signals ขนานกันให้เร็ว

##### Inputs

- `signal-type`: signal เดียวที่รับผิดชอบ เช่น `uncommit`, `unpush`, `ci-fails`, `open-prs`, `stale-branches`
- `repos-scope`: list ของ repos/paths ที่ต้องเช็ค เช่น `D:\projects\*` หรือ repo เดียว
- `filters` (optional): เช่น `--author @me`, branch age threshold สำหรับ stale branches

##### Tools

- `exec` — read-only commands เท่านั้น: `git status --porcelain`, `git log`, `gh pr list`, `gh issue list`, `gh run list`
- `read`, `find_file_by_name` — อ่าน `TODO.md` หรือ config ที่เกี่ยว
- ห้ามใช้ `edit`, `write`, `exec` ที่ mutate — briefing เป็น read-only

##### Execute

1. เลือก check/list skill หรือ command ที่ตรง `signal-type`:
   - `uncommit` → `git status --porcelain` ต่อ repo
   - `unpush` → `git rev-list --count HEAD...@{upstream}` และ branches ไม่มี upstream
   - `ci-fails` → `gh run list --status failure --limit 10`
   - `open-prs` → `gh pr list` (ของตัวเอง + review requests)
   - `assigned-issues` → `gh issue list --assignee @me`
   - `stale-branches` → `git branch` + last commit date, merged-but-not-deleted
   - `pending-todos` → scan `TODO.md` items ที่ pending
2. รันกับทุก repo ใน `repos-scope` — ถ้า repo เข้าถึงไม่ได้ข้ามและบันทึก
3. จัด urgency ต่อ item: `blocker` / `action-needed` / `waiting` / `hygiene`

##### Output Contract

คืนผลลัพธ์เป็นตารางของ signal เดียว:

| No. | Repo/Item | Status | Detail | Urgency |
|-----|-----------|--------|--------|---------|
| 1 | `my-app` | `uncommitted` | 5 files changed | `action-needed` |

- ปิดท้ายด้วย signal summary: total items, count ต่อ urgency, repos ที่ข้ามพร้อมสาเหตุ
- ถ้า signal ว่าง → คืน `clean` พร้อมจำนวน repos ที่เช็ค

##### Constraints

- Read-only เท่านั้น — ห้าม commit, push, close, หรือแก้อะไร
- รับผิดชอบ signal type เดียว — ห้ามเก็บ signals อื่น
- reuse check/list commands ที่มี — ไม่เขียน check logic ใหม่
- ถ้า check ของ repo ใด fail → ข้าม repo นั้นและระบุไว้ ไม่หยุดทั้งรัน
- แสดงเฉพาะสิ่งที่ต้อง action หรือรู้ — signal over noise

## Expected Outcome

- Digest เดียวเห็นทุกอย่างที่ต้องรู้: WIP, CI, PRs, hygiene
- Prioritized — รู้ว่าควรเริ่มจากอะไร
- ไม่ต้องรันหลาย skills แยกกัน
