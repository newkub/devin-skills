---
name: ship-continuous
description: Continue ship flow จาก state ปัจจุบัน หรือวนปรับปรุงงานซ้ำจนดีพอแล้ว ship โดยไม่ถาม
argument-hint: "[mode]"
related:
  - ship
  - ship-to-cloud
  - ship-github-issue
  - ship-release
  - loop-continuous
  - run-check
  - deep-validate
  - git-commit
  - resolve-errors
  - dont-over-engineer
  - report-progress
  - suggest-next-action
---

## Goal

ตรวจ state ปัจจุบันแล้ว continue ship flow ที่ค้าง หรือวนปรับปรุงงานซ้ำจนดีพอแล้ว ship โดยไม่ต้องถาม

## Scope

ใช้เมื่องานใกล้เสร็จ ต้องการ continue จาก state ที่ค้าง หรือปรับปรุงงานจนพร้อม ship
รองรับ state: uncommitted, on `dev/<n>`, on `dev`, on `main`

- `mode=continue`: ต่อ flow จาก state
- `mode=improve`: วนปรับปรุงด้วย `/loop-continuous` แล้ว `/ship`
- ถ้าไม่ระบุ `mode`: detect state แล้วเลือก (continue ถ้ามี state ค้าง, improve ถ้าอยู่ terminal state)

## Execute

### 1. Detect State

> Goal: รวบรวมข้อมูลปัจจุบัน

1. `git branch --show-current` → `CURRENT_BRANCH`
2. `git status --porcelain` → `UNCOMMITTED`
3. `git rev-parse --abbrev-ref --symbolic-full-name '@{u}'` → `UPSTREAM`
4. ถ้ามี `UPSTREAM` → `git log --oneline origin/<CURRENT_BRANCH>..HEAD` → `AHEAD`
5. ถ้ามี `UPSTREAM` → `gh run list --branch <CURRENT_BRANCH> --limit 1` → `CI_STATUS`
6. อ่าน `AGENTS.md` ship-flow ถ้ามี

### 2. Decide Mode

> Goal: เลือก continue หรือ improve

1. ถ้า `mode` = `continue` → ไป step Continue Flow
2. ถ้า `mode` = `improve` → ไป step Improve And Ship
3. ถ้าไม่ระบุ `mode`:
   - ถ้ามี `UNCOMMITTED` หรือ `CURRENT_BRANCH` อยู่ใน flow (`dev/<n>`, `dev`, `main`) และ `CI_STATUS` หรือ `AHEAD` บ่งบอกว่ายังไม่ terminal → Continue Flow
   - ถ้า state สะอาดและ terminal → Improve And Ship

### 3. Continue Flow

> Goal: เรียก skill ถัดไปตาม state

| State | Next Action |
|---|---|
| `UNCOMMITTED` > 0 (ทุก branch) | `/ship` |
| `CURRENT_BRANCH` = `dev/<n>` และ `AHEAD` ไม่ว่าง | `/ship-to-cloud` |
| `CURRENT_BRANCH` = `dev/<n>` และ `AHEAD` ว่าง (pushed) | `/ship-release` |
| `CURRENT_BRANCH` = `dev` | `/ship-release` |
| `CURRENT_BRANCH` = `main` และ clean | `/ship-release` |
| นอกเหนือนนี้ | `/suggest-next-action` หรือ `/ask-me` |

1. เรียก skill ตามตาราง
2. ถ้า skill fail → บันทึก evidence และ stop
3. ถ้า success → กลับไป step 1 (loop ต่อ)
4. วนซ้ำสูงสุด 5 รอบ

### 4. Improve And Ship

> Goal: วนปรับปรุงซ้ำจนดีพอแล้ว ship

1. ตรวจ AGENTS.md อัปเดตและถูกต้อง ถ้าไม่พร้อม → `/update-agents-md` แล้ว `/follow-agents-md`
2. ทำ `/loop-continuous` เพื่อปรับปรุง
3. ถ้า `/loop-continuous` ผ่าน criteria → ทำ `/ship`
4. ถ้าไม่ผ่าน → บันทึก evidence และ stop
5. ไม่ push/release โดยอัตโนมัติ

### 5. Report

> Goal: สรุปผล

1. ใช้ `/report-table` สรุป: detected state, mode, actions, result, loop count
2. ทำ `/suggest-next-action`

## Rules

### 1. Deterministic

- ตัดสินใจจาก git state ไม่อ่านใจ
- ไม่เดา
- ถ้า state ไม่ชัด → `/ask-me`

### 2. No Force Push

- ไม่ force push
- release/deploy ต้องผ่าน PR (ใช้ `/ship-release`)

### 3. Bounded Loop

- continue flow สูงสุด 5 รอบ
- improve ใช้ `/loop-continuous` ซึ่งมี limit ของตัวเอง

### 4. No Git Global Config

- ไม่ `git init`
- ไม่ `git config --global`

### 5. Safety

- ถ้า `CURRENT_BRANCH` คือ `main` แต่มี uncommitted → ให้ `/ship` ก่อน แล้วถามก่อน release
- ไม่ release โดยอัตโนมัติถ้าไม่มี evidence ว่า CI ผ่าน
- ไม่ push/release โดยไม่ได้รับคำสั่งชัดเจน

### 6. Modes

- `continue` = ต่อ flow
- `improve` = ปรับปรุงแล้ว ship

### 7. No Confirmation Prompt In Improve Mode

- ห้ามใช้ `ask_user_question` เพื่อขอคำยืนยันก่อน ship
- ห้ามเรียก `/ask-me`, `/ask-project-requirement`, `/understand-me` ภายใน improve loop
- ห้ามเรียก `/follow-your-suggestion` เพื่อขอคำยืนยัน

## Expected Outcome

- State ปัจจุบันถูก detect ถูกต้อง
- Skill ถัดไปถูกเรียกตาม flow หรือ `/loop-continuous` + `/ship`
- Loop หยุดเมื่องานเสร็จหรือถึงขีดจำกัด
- ไม่เกิด force push
- มีรายงานผลและ next action
