---
name: ship-to-main-branch
description: Ship เข้า main — /ship-to-dev-branch → review-github-pr gate → merge-all-branch-by-me-to-main
argument-hint: "[--dry-run] [dont-ask-me]"
related:
  - ship-verify
  - ship-to-dev-branch
  - merge-all-branch-by-me-to-main
  - review-github-pr
  - ship-release
  - resolve-cicd
  - resolve-merge-conflicts
  - deep-review
  - deep-validate
  - report
  - suggest-next-action

---

## Goal

Promote งานจาก `dev` เข้า `main` อย่างปลอดภัย — ship dev ก่อน, PR review + checks gate, แล้ว merge branches เข้า `main` ตาม `/merge-all-branch-by-me-to-main`

## Scope

- ใช้เมื่อต้องการ ship ถึง `main` — orchestrate `/ship-to-dev-branch` → `/review-github-pr` → `/merge-all-branch-by-me-to-main`
- ไม่ duplicate workflow — canonical steps อยู่ในแต่ละ skill ที่เรียก
- `dont-ask-me` argument → confirmation gates ถูกแทนด้วย `/follow-your-suggestion` + safe default
- ไม่รัน release — release → `/ship-release`

## Execute

### 1. Ship Dev

> Goal: งานทั้งหมดอยู่บน `origin/dev` และผ่าน validation

1. ทำ `/ship-to-dev-branch` ครบ workflow — push เข้า `dev` สำเร็จ, CI บน dev ผ่าน
2. ถ้า ship-to-dev fail → หยุดและ report — ห้าม promote งานที่ยังไม่ผ่าน

### 2. PR Review Gate

> Goal: PR dev → main ผ่าน review + checks ครบก่อน merge

1. สร้าง/หา PR `dev` → `main` ด้วย `/create-github-pr` (ถ้ายังไม่มี)
2. ทำ `/review-github-pr` — gate ครบ: CI checks ผ่านทั้งหมด + `/deep-validate` + `/deep-review` + PR metadata/diff clean
3. ถ้า gate ไม่ผ่าน → แก้ findings บน `dev` แล้ว `/ship-to-dev-branch` ใหม่ — ห้าม merge

### 3. Merge To Main

> Goal: merge เข้า main + cleanup branches

1. user confirm ก่อน merge เข้า `main` (ยกเว้น `dont-ask-me` → safe default)
2. ทำ `/merge-all-branch-by-me-to-main` — merge user branches เข้า `main` + cleanup
3. ถ้า conflict → `/resolve-merge-conflicts`; ถ้า complex → `/ask-me`
4. `git switch main` + `git pull` — verify merge สำเร็จและ remote main มี commits ใหม่

### 4. Report

> Goal: สรุป ship-to-main status

1. ทำ `/report` — ตาราง `No.`, `Step`, `Expected`, `Actual`, `Status` + verdict `merged`/`blocked`
2. ถ้าต้อง release → แนะนำ `/ship-release`
3. ทำ `/suggest-next-action`

## Rules

- `/ship-to-dev-branch` ต้องผ่านก่อนเสมอ — ห้าม merge เข้า main โดยข้าม dev validation
- merge เข้า `main` → user confirm เสมอ (ยกเว้น `dont-ask-me` mode)
- ห้าม merge ตอน CI fail/pending หรือ PR review มี blocker
- ห้าม force-push `main` — rollback ด้วย `git revert` เท่านั้น
- `dont-ask-me` mode: ห้าม `ask_user_question`, `/ask-me`; action ย้อนกลับไม่ได้ → safe default หรือหยุด+report

## Expected Outcome

- `dev` ผ่าน validation ครบและอยู่บน remote
- PR review gate ผ่าน (checks + deep-validate + deep-review)
- branches เข้า `main` สำเร็จ + cleanup เสร็จ พร้อม rollback path
- verdict ชัดเจน พร้อม next action (`/ship-release` ถ้าต้อง release)
