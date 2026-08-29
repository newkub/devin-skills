---
name: ship-github-issue
description: ทำงานตาม GitHub issue สร้าง branch worktree ทำงาน commit และ push ไป cloud verify
argument-hint: "[issue-number-or-title]"
related:
  - ship
  - ship-to-cloud
  - ship-release
  - open-github-issue
  - create-github-issue
  - use-git-worktrees
  - delete-git-worktree
  - follow-plan
  - report-table
  - suggest-next-action
---

## Goal

ทำงานตาม GitHub issue หนึ่งฉบับให้ครบถ้วนจน branch ถูก push ไปยัง cloud และผ่าน verify
`/ship-github-issue` ไม่ทำ release/deploy ให้ใช้ `/ship-release` ต่อเมื่องานพร้อม release

## Scope

รับ issue หมายเลขหรือ title สร้าง branch `dev/<number>` จาก `dev` พร้อม worktree ทำงาน commit ใน local และ push ไป cloud verify

ถ้าต้องการ release/deploy → ใช้ `/ship-release`
ถ้าต้องการแค่ commit ใน local → ใช้ `/ship`
ถ้าต้องการ push + verify อย่างเดียว → ใช้ `/ship-to-cloud`

## Execute

### 1. Identify Issue

> Goal: ระบุ issue ทีจะทำงาน

1. ถ้ามี argument เป้น number → ทำ `/open-github-issue <number>`
2. ถ้ามี argument เป้น title → ทำ `/create-github-issue --title "..." --body "..."`
3. ถ้าไม่มี argument → ทำ `/create-github-issue` แล้วบันทึกเลข issue
4. เก็บ issue number ไว้ใช้ตั้งชื่อ branch

### 2. Plan

> Goal: วางแผนงานก่อนเริ่ม implement

1. ทำ `/follow-plan` หรือ `/deep-plan` ตามขนาดของ issue
2. บันทึกแผนไว้ใน `.devin/plans/issue-<number>.md`
3. ทำ `/report-plan`

### 3. Ensure dev Branch

> Goal: ให้ branch `dev` พร้อมใช้งาน

1. ทำ `git branch --list dev`
2. ถ้าไม่มี `dev` → `git switch -c dev main`
3. ทำ `git push -u origin dev` ถ้ายังไม่ได้ push

### 4. Create Branch And Worktree

> Goal: สร้าง workspace สำหรับทำงานบน issue

1. สร้าง branch `dev/<number>` จาก `dev`:
   ```bash
   git switch -c dev/<number> dev
   ```
2. ทำ `/use-git-worktrees dev/<number> dev`
   → สร้าง `worktrees/dev-<number>/`
3. ทำงานใน worktree ทีสร้างขึ้น

### 5. Implement

> Goal: ทำงานตามแผน

1. เปลี่ยน directory ไปยัง `worktrees/dev-<number>/`
2. ทำงานตาม `/follow-plan` หรือ `/do-it-all`
3. รัน `/run-verify-fast` ระหว่างทำงานตามความเหมาะสม
4. ถ้ามีปัญหาใหญ่ → stop และ report

### 6. Ship Local

> Goal: commit การเปลี่ยนแปลงใน local

1. ทำ `/ship` ใน worktree
2. ถ้า `/ship` ไม่ผ่าน → แก้ไขและทำซ้ำจนผ่าน
3. ถ้าไม่มี changes ให้ commit → report และไปขั้นตอนถัดไป

### 7. Ship To Cloud

> Goal: push branch ไปยัง remote และ verify

1. ทำ `/ship-to-cloud`
2. ถ้า cloud verify fail → แก้ไขและทำ `/ship-to-cloud` ซ้ำจนผ่าน
3. ถ้า cloud verify pass → ไปขั้นตอน Report

### 8. Report

> Goal: สรุปผลการทำงาน

1. ใช้ `/report-table` สรุป: issue, branch, worktree, commit, CI status
2. แนะนำให้ทำ `/ship-release` ถ้าพร้อม release
3. ทำ `/suggest-next-action`

## Rules

### 1. Branch Naming

- branch ของ issue ต้องเป้น `dev/<number>`
- ถ้า issue number นำหน้าด้วย `0` ให้ตัดศูนย์นำหน้าออก
- ไม่ใช้ `issue/<number>` หรือ `feature/*`

### 2. No Direct Main Work

- ห้าม commit หรือ push บน `main` โดยตรง
- ห้าม merge เองเข้า `main` จาก `/ship-github-issue`
- การ promote ไป `main` ต้องทำผ่าน `/ship-release`

### 3. No Release/Deploy

- `/ship-github-issue` จบที `/ship-to-cloud` เท่านั้น
- ไม่เรียก `/ship-release` โดยอัตโนมัติ
- ถ้าต้องการ release ให้ user เรียก `/ship-release` เพิ่ม

### 4. Worktree Discipline

- สร้าง worktree ใน `worktrees/dev-<number>/`
- ไม่ทำงานนอก worktree สำหรับ branch นี้
- ถ้า worktree มีปัญหา → ใช้ `/delete-git-worktree` แล้วสร้างใหม

### 5. No Global Git Config

- ไม่ทำ `git init`
- ไม่ทำ `git config --global`
- สร้าง branch โดยใช้ `git switch -c` หรือ `git checkout -b`

### 6. Safety

- ไม่ force push
- ไม่ push secrets
- ไม่ skip git hooks
- ตรวจสอบ working tree clean ก่อน commit

## Expected Outcome

- Issue ถูกสร้างหรือเปิดขึ้น
- Branch `dev/<number>` ถูกสร้างจาก `dev`
- Worktree `worktrees/dev-<number>/` พร้อมใช้งาน
- งานถูกทำและ commit ใน worktree
- Branch ถูก push ไปยัง remote และผ่าน cloud verify
- ไม่มี release หรือ deploy เกิดขึ้น
- มีรายงานผลและแนะนำ next action
