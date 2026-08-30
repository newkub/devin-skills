---
name: ship-ci
description: "Ship workspace ด้วย CI/CD: ship-code, setup CI/CD, push, และ watch CI จนผ่าน"
related:
  - ship-code
  - ship-verify
  - setup-cicd
  - run-test-all
  - deep-validate
  - git-commit
  - git-push
  - watch-cicd-and-resolve
  - resolve-errors
  - report
  - suggest-next-action
  - ship-local
  - ship-release
  - ship-github-issue
---

## Goal

Ship workspace ด้วย CI/CD: ship-code, setup CI/CD, push branch, watch CI pipeline จนผ่าน

## Scope

ใช้เมื่องานใน workspace ทีเลือกเสร็จสมบูรณ์ และต้องการ ship-code, setup CI/CD, push, แล้ว watch CI จนผ่าน
- ไม่ release/deploy
- รัน `/run-verify` บน CI หลัง push

## Execute

### 1. Ship Code

> Goal: prepare workspace ก่อน push

1. ทำ `/ship-code`
2. ถ้า fail → stop และ report

### 2. Setup CI/CD

> Goal: ตั้งค่าหรืออัปเดต CI/CD ให้พร้อมก่อน push

1. ทำ `git status --porcelain`, `git branch --show-current`, `git remote -v`
2. ถ้าไม่มี remote → stop และ report
3. ทำ `/setup-cicd` เพื่อ detect platform, verify package scripts, setup secrets, และ create/update workflow files
4. ตรวจสอบว่า CI/CD workflow รัน `/run-verify` หรือ `/run-test-all`
5. ถ้า CI/CD config ยังไม่พร้อม → stop และ report
6. บันทึก `LAST_GREEN_SHA` ด้วย `git rev-parse HEAD`

### 3. Commit

> Goal: commit การเปลี่ยนแปลง

1. รัน `git submodule status` เพื่อดู submodules ทังหมด
2. ถ้ามี submodules ทีมี changes → `cd` เข้า submodule แต่ละอัน ทำ `/git-commit` ใน submodule แล้วกลับมา root
3. ทำ `/git-commit` ที root พร้อมระบุ submodule pointer updates ถ้ามี
4. ถ้าไม่มี uncommitted changes แต่มี unpushed commits → ไปขั้นตอน Push

### 4. Push and Watch CI

> Goal: ส่ง branch ขึ้น remote แล้ว verify บน CI

1. ทำ `git push -u origin <current-branch>` (ไม่ force push)
2. ถ้า push ถูก reject → resolve หรือ rebase ตามความเหมาะสม แล้ว push ใหม
3. ทำ `/watch-cicd-and-resolve`
4. ถ้าผ่าน → ไปขั้นตอน Report
5. ถ้า fail → ทำ `/resolve-errors` วิเคราะห์ cloud logs, แก้ไข, commit ถ้ามี changes, push, re-run `/watch-cicd-and-resolve`
6. วนซ้ำสูงสุด 5 รอบ ถ้ายังไม่ผ่าน → stop และ report

### 5. Report

> Goal: สรุปการ ship

1. ทำ `/report` พร้อม `/report-table`
2. สรุป commits, CI status, loop count
3. ทำ `/suggest-next-action` เพื่อแนะนำ `ship-release` หรือ `ship-github-issue`

## Rules

### 1. No Release/Deploy

- `ship-ci` ไม่ release หรือ deploy
- ถ้าต้องการ release/deploy → ใช้ `/ship-release`

### 2. No Force Push

- ไม่ใช้ `--force` หรือ `--force-with-lease`
- ถ้า push ถูก reject → resolve หรือ rebase ก่อน

### 3. CI Verify

- ไม่รัน full local verify (จะรันบน CI หลัง push)
- ทำ `/deep-validate` เบื้องต้น
- CI workflow ต้องรัน `/run-verify`

### 4. Submodule First

- commit ใน submodule ก่อนเสมอ แล้วจึง update root pointer
- ห้าม commit root pointer โดยที submodule ยังไม่ commit

## Expected Outcome

- `/ship-code` สำเร็จ
- CI/CD config พร้อม
- branch ถูก push
- CI pipeline ผ่าน หรือมี root cause + next action ชัดเจน
- ไม่ release/deploy โดยอัตโนมัติ
- รายงาน commits, CI status, loop count ครบถ้วน
