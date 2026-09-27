---
name: resolve-all-github-actions-fails
argument-hint: "[--owner <user-or-org>]"
description: List และ resolve GitHub Actions workflow runs ที fail ทุก repo ของ account แล้วลบ runs ที fail
related:
  - resolve-github-actions-fails
  - all-github-repo
  - delete-cicd-fails
  - resolve-errors
  - report
  - suggest-next-action
  - ask-me
---

## Goal

List repos ทั้งหมดของ account (user + orgs) ที่มี GitHub Actions runs ล้มเหลว แล้ว resolve ทีละ repo และ delete failed runs ให้หมดใน account เดียว

## Scope

ใช้เมื่อต้องการกวาด CI failures ทั่วทั้ง account — ทุก repo ที่ `gh` token เข้าถึงได้ สำหรับ repo เดียวให้ใช้ `/resolve-github-actions-fails`

## Execute

### 1. Verify gh CLI

> Goal: ยืนยันว่า `gh` พร้อมและ authenticated
1. รัน `gh --version`
2. รัน `gh auth status`
3. ถ้าไม่ authenticated → ทำ `/ask-me` เพื่อให้ user รัน `gh auth login`

### 2. List Repos

> Goal: ได้รายชื่อ repos ทั้งหมดใน account
1. ถ้ามี `--owner` → ใช้ owner นั้น (user หรือ org)
2. ถ้าไม่มี → ทำ `/all-github-repo` หรือ `gh repo list <owner> --limit 100` สำหรับ user และแต่ละ org จาก `gh api user/orgs --jq ".[].login"`
3. รับรายการ `owner/repo` ทั้งหมด

### 3. Scan Failed Runs

> Goal: หา repos ทีมี workflow runs ล้มเหลว
1. ต่อ repo รัน `gh run list --repo <owner/repo> --status failure --limit 10`
2. ถ้า repos เยอะ ให้ batch (5-10 repos ต่อรอบ) เพื่อเลี่ยง rate limit
3. เก็บเฉพาะ repos ทีมี failures พร้อมจำนวน runs
4. ถ้าไม่มี repo ที fail → report ว่างานเสร็จแล้ว stop

### 4. Resolve Per Repo

> Goal: resolve failures ทีละ repo
1. ต่อ repo ที fail → ทำ `/resolve-github-actions-fails --repo <owner/repo>` (ครอบคลุม analyze logs, rerun, watch)
2. หา local project ด้วย `/search-project-in-drive-d <repo-name>` ถ้าต้อง code fix
3. ถ้า repo ไม่มี local clone หรือ resolve ไม่ได้ → ทำเครื่องหมาย `manual-fix-required` แล้วไป repo ถัดไป
4. ทำซ้ำสูงสุด 3 รอบต่อ repo

### 5. Delete Failed Runs

> Goal: ลบ runs ที fail ออกจากทุก repo
1. หลัง resolve ต่อ repo เสร็จ → ลบ failed runs ด้วย `/delete-cicd-fails` หรือ `gh run delete <run-id> --repo <owner/repo>`
2. บันทึก last green SHA ของแต่ละ repo ก่อนลบ
3. ถ้า repo ใดมี runs ทีจะลบ > 5 หรือเป็น production repo → ทำ `/ask-me` ยืนยันก่อน

### 6. Build Report

> Goal: รายงานผลเป็นตาราง
1. ใช้ `/report` คอลัมน์: No., Repo, Failing Runs, Status, Action Taken, Deleted, Notes
2. เรียงตาม repo name
3. ระบุสรุป: จำนวน repos ทั้งหมด, repos ที resolve ได้, runs ทีถูกลบ, repos ทีค้าง manual-fix-required

### 7. Suggest Next Action

> Goal: แนะนำขั้นตอนถัดไป
1. ทำ `/suggest-next-action` เพื่อแนะนำ fix workflow, ดู logs, หรือ `/resolve-cicd`

## Rules

### 1. Safety
- ถาม user ก่อน rerun/deploy ถ้า failures เยอะหรือกระทบ production
- ไม่ push หรือ merge code โดยอัตโนมัติ
- ไม่แก้ไข workflow files โดยไม่ได้รับอนุญาต
- rollback ได้: บันทึก last green SHA ก่อน fix ทุก repo

### 2. Rate Limit
- อย่า query เร็วเกินไป — batch repos และใช้ `--limit`/`--page`
- ถ้า `gh` คืน rate limit (403/429) ให้รอแล้ว retry

### 3. Local Project Matching
- ใช้ `/search-project-in-drive-d` หา project ใน `D:\` ทีตรง repo name
- ถ้าไม่พบ → manual-fix-required

### 4. Secret Safety
- ไม่ expose tokens, secrets หรือ logs ทีมี credentials ใน output
- mask token ใน logs

## Expected Outcome

- รายการ repos ทีมี GitHub Actions failures พร้อมสถานะหลัง resolve
- Failed runs ถูก delete หรือทำเครื่องหมาย manual-fix-required
- ตารางที sort ตาม repo name พร้อม last green SHA ต่อ repo
