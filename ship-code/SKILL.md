---
name: ship-code
description: Prepare workspace code before ship: update project, refactor, and update skills/docs
related:
  - update-agents-md
  - follow-agents-md
  - update-devin-global-skills
  - update-all-devin-global-skills
  - update-project
  - refactor
  - run-verify
  - resolve-errors
  - report
  - suggest-next-action
  - ship-local
  - ship-ci
  - ship-release
  - ship-github-issue
---

## Goal

Prepare workspace code ก่อน ship โดยอัปเดต project docs/config, refactor (ถ้าต้องการ), และอัปเดต skills ให้พร้อมสำหรับ verify และ commit

## Scope

ใช้เป้นพื้นฐานก่อน `ship-local`, `ship-ci`, `ship-release`, หรือ `ship-github-issue`
- ไม่ verify
- ไม่ commit
- ไม่ push
- ไม่ release/deploy

## Execute

### 1. Update AGENTS.md

> Goal: `AGENTS.md` เป้นปัจจุบันก่อน ship

1. ถ้า `AGENTS.md` ไม่มีหรือไม่อัปเดต → ทำ `/update-agents-md`
2. ตรวจสอบว่า `AGENTS.md` มี sections ครบตาม `/update-devin-global-skills`
3. ถ้า `AGENTS.md` ไม่พร้อมใช้ → stop และ report

### 2. Follow AGENTS.md

> Goal: ทำตาม workflows ทีระบุใน `AGENTS.md`

1. ทำ `/follow-agents-md` เพื่ออ่าน `AGENTS.md`
2. ทำตาม `## Execute` ของ `AGENTS.md` ตามลำดับ
3. ถ้า `AGENTS.md` ไม่ระบุ workflow → ใช้ default ของ `ship-code`

### 3. Update Skills

> Goal: อัปเดต skills ให้ผ่านมาตรฐานก่อน ship

1. ถ้า ship ทัง skills repo → ทำ `/update-all-devin-global-skills`
2. ถ้า ship skill เดี่ยว → ทำ `/update-devin-global-skills <skill-name>`
3. ถ้าไม่ใช่ skills repo → ข้าม

### 4. Update Project

> Goal: sync project docs, config, rules และ tooling

1. ทำ `/update-project` ถ้า project มีการเปลี่ยนแปลง docs/config/rules หรือ `AGENTS.md` ระบุให้ run
2. ถ้าไม่จำเป็น → ข้าม

### 5. Refactor

> Goal: refactor code ก่อน verify ถ้าจำเป็น

1. ทำ `/refactor` ถ้า user ระบุ scope หรือ `AGENTS.md` ระบุให้ refactor ก่อน ship
2. ถ้าไม่ระบุ → ข้าม

### 6. Report

> Goal: สรุปสถานะ pre-ship

1. ทำ `/report` สรุปสิ่งทีทำใน `ship-code`
2. ทำ `/suggest-next-action` เพื่อแนะนำ `ship-local` หรือ `ship-ci`

## Rules

### 1. No Verify

- `ship-code` ไม่รัน `/run-verify` หรือ test
- การ verify อยู่ใน `ship-local` หรือ `ship-ci`

### 2. No Commit

- `ship-code` ไม่ commit หรือ push
- ให้เรียก `ship-local` หรือ `ship-ci` ต่อ

### 3. Optional Steps

- `/update-project` และ `/refactor` ต้องมี signal ชัดจึงจะ run
- ถ้าไม่ระบุ ให้ข้าม

### 4. AGENTS.md First

- `/update-agents-md` ต้องทำก่อนเสมอถ้า `AGENTS.md` ไม่อัปเดต
- `/follow-agents-md` ต้องทำหลัง `AGENTS.md` อัปเดต

## Expected Outcome

- `AGENTS.md` อัปเดตและถูกต้อง
- Project docs, config, rules sync (ถ้า run `/update-project`)
- Code ถูก refactor (ถ้า run `/refactor`)
- Skills อัปเดต (ถ้าอยู่ใน skills repo)
- ไม่มี commit, push, release, deploy
- มีรายงานสถานะและ next action ชัดเจน
