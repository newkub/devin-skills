---
name: create-dev-branch
description: สร้าง branch `dev` จาก `main` ถ้ายังไม่มี และ push ไปยัง remote
related:
  - follow-git-flow
  - ship-github-issue
  - use-git-worktrees
  - git-push
  - report-table
  - suggest-next-action
---

## Goal

สร้าง branch `dev` จาก `main` ถ้ายังไม่มีใน local หรือ remote แล้ว push ไปยัง remote
`dev` เป้น staging/integration branch สำหรับ flow `dev/<number>` → `dev` → `main`

## Scope

ใช้เมื่อ setup repo หรือก่อนสร้าง issue branch แล้วยังไม่มี `dev`
ไม่ `git init`, ไม่ `git config --global`

## Execute

### 1. Pre-flight

> Goal: ตรวจสอบสถานะ repo

1. ทำ `git rev-parse --git-dir` เพื่อยืนยันว่าอยู่ใน git repo
2. ทำ `git branch --list main` และ `git branch --list master`
3. กำหนด base branch เป้น `main` ถ้ามี ไม่เช่นนั้น `master` ถ้ามี
4. ถ้าไม่มี `main` หรือ `master` → stop และ report

### 2. Create dev Branch

> Goal: สร้าง `dev` จาก base branch

1. ทำ `git branch --list dev`
2. ถ้ามี `dev` ใน local → ไปขั้นตอน Ensure Remote
3. ถ้าไม่มี `dev` ใน local แต่มีบน remote → ทำ `git switch -c dev origin/dev` แล้วไปขั้นตอน Report
4. ถ้าไม่มีทั่ง local และ remote → ทำ `git switch -c dev <base-branch>`

### 3. Ensure Remote

> Goal: push `dev` ไปยัง remote

1. ทำ `git push -u origin dev`
2. ถ้า push ถูก reject ด้วย non-fast-forward → ทำ `git pull --ff-only origin dev` แล้ว push ใหม่
3. ถ้า push สำเร็จ → ไปขั้นตอน Report

### 4. Report

> Goal: สรุปผล

1. ใช้ `/report-table` สรุป: status, base branch, remote URL
2. ทำ `/suggest-next-action`

## Rules

### 1. No Global Config

- ไม่ทำ `git init`
- ไม่ทำ `git config --global`
- ไม่เปลี่ยน global git settings

### 2. Base Branch

- base branch คือ `main` ก่อน
- ถ้าไม่มี `main` ใช้ `master`
- ถ้าไม่มีทังสองอัน → stop

### 3. No Force Push

- ไม่ใช้ `--force`
- ถ้า push ถูก reject → pull --ff-only แล้วลองใหม่
- ถ้ายังไม่ได้ → report

### 4. Idempotent

- ถ้า `dev` มีอยู่แล้ว → ไม่สร้างซ้ำ แค่ push ถ้ายังไม่ได้ push
- รันได้หลายครั้งโดยไม่เกิด side effects

## Expected Outcome

- `dev` branch มีอยู่ใน local และ remote
- `dev` ชี้ไปยัง commit เดียวกับ `main` ถ้าเพิ่งสร้าง
- ไม่เกิด force push
- มีรายงานผล
