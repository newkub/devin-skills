---
name: ship-continue
description: ตรวจสอบ state ปัจจุบันและ continue ship flow ไปยังขั้นตอนถัดไปอย่างอัตโนมัติ
related:
  - ship
  - ship-to-cloud
  - ship-github-issue
  - ship-release
  - follow-git-flow
  - report-table
  - suggest-next-action
---

## Goal

Continue ship flow จาก state ปัจจุบันโดยไม่ต้องบอกชื่อ skill เอง
`/ship-continue` ตรวจ current branch, git status, CI status แล้วเรียก skill ถัดไปให้ถูกต้อง

## Scope

ใช้เมื่อต้องการ continue งานทีค้างอยู่หรือ ship ต่อจากจุดใดก็ได้ใน flow
รองรับ state: uncommitted, on `dev/<n>`, on `dev`, on `main`

ถ้าต้องการเริ่ม issue ใหม → ใช้ `/ship-github-issue`
ถ้าต้องการ release เท่านั้น → ใช้ `/ship-release`

## Execute

### 1. Detect State

> Goal: รวบรวมข้อมูลปัจจุบัน

1. ทำ `git branch --show-current` → `CURRENT_BRANCH`
2. ทำ `git status --porcelain`
3. ตรวจ upstream ด้วย `git rev-parse --abbrev-ref --symbolic-full-name @{u}`; ถ้ามี → ทำ `git log --oneline origin/<CURRENT_BRANCH>..HEAD` ถ้าไม่มี → ข้าม
4. ถ้ามี remote branch → ตรวจ CI status ด้วย `gh run list --branch <CURRENT_BRANCH> --limit 1`
5. อ่าน `AGENTS.md` ship-flow ถ้ามี

### 2. Decide Next Action

> Goal: เลือก skill ถัดไปตาม state

| State | Next Action |
|---|---|
| มี uncommitted changes (ทุก branch) | `/ship` |
| `CURRENT_BRANCH` = `dev/<n>` และยังไม่ push | `/ship-to-cloud` |
| `CURRENT_BRANCH` = `dev/<n>` และ push แล้ว | `/ship-release` |
| `CURRENT_BRANCH` = `dev` | `/ship-release` |
| `CURRENT_BRANCH` = `main` | `/ship-release` (release/deploy) |
| ไม่อยู่ใน flow ข้างต้น | `/ask-me` |

### 3. Execute

> Goal: เรียก skill ถัดไป

1. เรียก skill ตามตารางข้างต้น
2. ถ้า skill fail → บันทึก evidence
3. ถ้า skill success → ไป step Report

### 4. Loop Until Terminal State

> Goal: ทำต่อจนถึง state terminal

1. หลังจาก skill สำเร็จ ตรวจสถานะใหม่อีกครั้ง
2. ถ้ายังไม่อยู่ใน terminal state (`main` หรือ no more action) → repeat step 2-3
3. วนซ้ำสูงสุด 5 รอบ
4. ถ้าเกิน 5 รอบ → stop และ report

### 5. Report

> Goal: สรุปผล

1. ใช้ `/report-table` สรุป: detected state, actions, result, loop count
2. ทำ `/suggest-next-action`

## Rules

### 1. Deterministic

- ตัดสินใจจาก git state ไม่อ่านใจ
- ไม่เดา
- ถ้า state ไม่ชัด → `/ask-me`

### 2. No Force Push

- ไม่ force push
- ถ้า `ship-release` ต้อง merge ผ่าน PR → ให้ทำตาม flow

### 3. Bounded Loop

- วนซ้ำสูงสุด 5 รอบ
- ถ้า loop ไม่ออก → stop

### 4. No Git Global Config

- ไม่ `git init`
- ไม่ `git config --global`

### 5. Safety

- ถ้า `CURRENT_BRANCH` คือ `main` แต่มี uncommitted → ให้ `/ship` ก่อน แล้ว re-evaluate state
- ถ้า `CURRENT_BRANCH` คือ `main` clean และต้องการ release/deploy → `/ship-release` ได้
- ถ้า `CURRENT_BRANCH` คือ `main` แต่ไม่มี release/deploy config หรือไม่ชัด → report และหยุด ไม่ release อัตโนมัติ
- ไม่ release โดยอัตโนมัติถ้าไม่มี evidence ว่า CI ผ่าน

## Expected Outcome

- State ปัจจุบันถูก detect ถูกต้อง
- Skill ถัดไปถูกเรียกตาม flow
- Loop หยุดเมื่องานเสร็จหรือถึงขีดจำกัด
- ไม่เกิด force push
- มีรายงานผลและ next action
