---
name: ship-to-production
description: Merge แล้ว deploy ไป production หลังจาก staging ผ่าน
argument-hint: "[app-or-package]"
related:
  - ship
  - ship-to-staging
  - ship-rollback
  - create-github-pr
  - deep-review-pr
  - watch-github-actions
  - merge-github-pr
  - merge-git-branch
  - run-deploy
  - watch-deploy
  - resolve-errors
  - report-table
  - ask-me
---

## Goal

Merge feature branch แล้ว deploy ไป production หลังจาก staging ผ่าน พร้อม health check และ rollback

## Scope

ใช้จาก `/ship` หรือ standalone — ตรวจ staging report, merge, deploy production, watch, rollback ถ้าพัง

## Execute

### 1. Ensure Staging Passed

> Goal: ยืนยันว่าผ่าน staging ก่อน production

1. ถ้ามี `/ship-to-staging` report อยู่แล้ว → อ่าน `ready-for-production`
2. ถ้าไม่มี report → ทำ `/ship-to-staging` ก่อน
3. ถ้า `ready-for-production` เป็น false → หยุดและ report
4. ถ้า project ไม่มี staging → ยืนยัน `/ask-me` ก่อน deploy โดยตรง

### 2. Confirm Production Deploy

> Goal: ได้รับอนุญาตก่อน production

1. ถาม user ก่อน merge และ deploy จริง
2. แสดง commit hash, changes, staging result
3. ถ้าเป็น breaking change → ทำ `/ask-me` เพิ่ม

### 3. Create PR And Review

> Goal: สร้าง PR และ review ถ้าใช้ PR workflow

1. ถ้า repo มี remote ใช้ PR workflow และยังไม่มี PR → ทำ `/create-github-pr`
2. ทำ `/deep-review-pr` เพื่อ review PR พร้อม comment แต่ละ finding
3. ถ้า deep-review ไม่ผ่าน → แก้ code แล้วกลับไปข้อ 2
4. ทำ `/watch-github-actions` หรือ `gh run watch` เพื่อรอ CI ผ่านก่อน merge

### 4. Merge

> Goal: code อยู่บน production branch

1. ถ้า user ตกลง merge → ทำ `/merge-github-pr` หรือ `/merge-git-branch` เข้า `main`
2. ยืนยัน `main` เป้นปัจจุบัน
3. ถ้าไม่มี remote หรือไม่ใช้ PR workflow → merge local ด้วย `/merge-git-branch`

### 5. Deploy To Production

> Goal: production มี version ล่าสุด

1. รัน production deploy command ตาม `AGENTS.md` หรือ `package.json` — ใช้ `/run-deploy` ถ้ามี skill สำหรับ target
2. บันทึก deploy URL, commit hash, deploy time
3. ถ้า deploy fail → `/resolve-errors` แล้ว report

### 6. Health Check And Watch

> Goal: ยืนยันว่า production ทำงานได้

1. ทำ `/watch-deploy` หรือ health check endpoints
2. รัน smoke tests บน production (critical paths เท่านั้น)
3. ตรวจ error rate / latency ถ้ามี observability ให้ใช้

### 7. Rollback If Needed

> Goal: กู้คืนถ้า production พัง

1. ถ้า health check fail → ทำ `/ship-rollback` หรือ `git revert <merge-commit>` แล้ว redeploy เวอร์ชันเดิม
2. ถ้าปกติ → ลบ feature branch และ report success

### 8. Report

> Goal: สรุปผล production

1. ทำ `/report-table` สรุป deploy, status, version, rollback status
2. ทำ `/suggest-next-action`

## Rules

### 1. Staging First

- ไม่ deploy production โดยไม่ผ่าน staging เว้นแต่ user ยืนยันเอง
- `/ship-to-staging` ต้อง return `ready-for-production: true`

### 2. Production Safety

- user ต้อง confirm ก่อน merge และ deploy
- ไม่ force-push, ไม่ bypass CI
- มี rollback plan ก่อน deploy

### 3. Fast Rollback

- ถ้า health check fail ต้อง rollback ทันที
- บันทึก version เดิมก่อน deploy เสมอ

## Expected Outcome

- feature branch ถูก merge แล้ว deploy production
- production ผ่าน health check
- ถ้าพังมี rollback สำเร็จ
- รายงาน deploy status และ version
