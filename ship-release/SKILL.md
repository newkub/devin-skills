---
name: ship-release
description: "Release patch from dev: deep validation, PR to main, review, merge, release, then back to dev"
argument-hint: "[version-or-empty]"
related:
  - ship-code
  - ship-verify-local
  - ship-verify-cicd
  - deep-refactor
  - deep-realize-implementation
  - deep-review
  - deep-test
  - deep-verify
  - deep-build
  - deep-review-pr
  - create-github-pr
  - unified-review-and-merge-pr
  - watch-cicd-and-resolve
  - open-web
  - ask-me
  - run-release
  - test-release
  - setup-release
  - setup-package
  - follow-git-flow
  - report
  - report-progress
  - view-repo
---

## Goal

Release patch จาก `dev` branch โดยผ่าน deep validation, PR, review, merge, release แล้วกลับมาอยู่บน `dev` เพื่อทำงานต่อ

## Scope

- ใช้เมื่องานผ่าน staging CI บน `dev` แล้วและต้องการ release patch
- ทำงานบน `dev` branch ตลอด ไม่สร้าง version branch
- `main` ห้ามแก้ไขโดยตรง ไว้ merge เท่านั้น

## Execute

### 1. Ensure Dev Branch And Verify CICD

> Goal: ให้ `dev` ผ่านทุกขั้นตอนและ CI/CD ก่อน PR

1. `git branch --show-current`
2. ถ้าไม่อยู่บน `dev` → `git switch dev` แล้ว `git pull origin dev`
3. ตรวจ `git status --porcelain` ต้องว่างก่อนทำอะไรต่อ
4. ถ้าต้องการดู repo health ก่อน ship ให้ทำ `/view-repo`
5. ทำ `/ship-verify-cicd` เพื่อ ship code, verify, push และ watch CI ให้ผ่าน
6. ถ้า fail → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 รอบ

### 2. Open PR Dev To Main

> Goal: สร้าง PR เพื่อ merge `dev` เข้า `main`

1. ทำ `/create-github-pr --head dev --base main --fill`
2. จด `PR_NUMBER`

### 3. Deep Review PR

> Goal: review PR แบบละเอียด

1. ทำ `/deep-review-pr <PR_NUMBER>`
2. ตอบ comments และ resolve conversations
3. เปิด `/open-web` ให้ user อ่าน PR review
4. ถาม user ว่าจะ merge ไหม
5. ถ้า user ไม่ merge → stop, report status, และ next action

### 4. Merge And Release Patch

> Goal: merge PR และ release patch อย่างปลอดภัย

1. ถ้า user ตกลง merge → ทำ `/unified-review-and-merge-pr <PR_NUMBER>`
2. ตรวจว่า merge สำเร็จ
3. ทำ `/watch-cicd-and-resolve` บน `main` หรือ `dev` ตาม repo workflow เพื่อตรวจ green CI ก่อน release
4. ทำ `/test-release` ถ้ามี setup
5. ทำ `/run-release --dry-run` ก่อน release จริง
6. ถ้า dry-run ผ่านและ user ยืนยัน → ทำ `/run-release` เพื่อ release patch (version จาก argument หรือ auto bump)

### 5. Switch Back To Dev

> Goal: กลับมาทำงานต่อบน `dev`

1. `git switch dev`
2. `git pull origin dev`
3. รายงานว่า standby บน `dev` พร้อมทำงานต่อไป

### 6. Report

> Goal: สรุปผล

1. ทำ `/report-progress` พร้อม progress bar, งานเสร็จ, งานค้าง, next actions
2. ทำ `/report` พร้อม PR, release version, branch ปัจจุบัน
3. ทำ `/suggest-next-action`

## Rules

- ไม่ merge เองยกเว้น user บอก
- ทำงานบน `dev` branch ตลอด ไม่สร้าง version branch
- `main` ห้ามแก้ไขโดยตรง ไว้ merge เท่านั้น
- ต้องผ่าน `/ship-verify-cicd` ก่อน PR
- ต้อง resolve ทุก PR conversation ก่อน merge
- ต้องมี green CI ก่อน release

## Expected Outcome

- PR `dev` → `main` ถูกสร้าง รีวิว และ merge
- Patch ถูก release
- กลับมาอยู่บน `dev` พร้อมทำงานต่อ
- รายงาน status, version, next action ชัดเจน
