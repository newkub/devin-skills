---
name: merge-github-pr-verify-merge
description: ยืนยัน PR merge สำเร็จบน remote — status merged, base updated, cleanup ครบ
argument-hint: "[pr-number]"
related:
  - run-verify
  - report
---

## Goal

ยืนยันหลัง `gh pr merge` ว่า PR merged จริงบน remote, base branch อัปเดต และ cleanup ครบ — เรียก standalone หลัง merge เสร็จ

## Scope

- ใช้เมื่อ `/merge-github-pr` dispatch มาที่ `verify` หรือเรียกหลัง merge
- ครอบคลุม: PR state บน remote, base branch sync, merge commit บน remote, branch cleanup
- Read-only: ตรวจสอบ — ไม่ re-merge

## Execute

### 1. Verify PR State

> Goal: PR เป็น merged จริงบน GitHub

1. `gh pr view <pr> --json state,mergedAt,mergeCommit` — state = `MERGED`
2. บันทึก merge commit sha และ strategy ที่ใช้
3. flag ถ้า state เป็น `CLOSED` โดยไม่ merge หรือยัง `OPEN` (auto-merge pending)

### 2. Verify Base Branch

> Goal: base branch บน remote มี merge commit

1. `git fetch origin` แล้ว `git log origin/<base> --oneline -3` — merge commit อยู่บน remote
2. `gh pr checks <pr>` หรือดู CI run บน base หลัง merge — post-merge CI ผ่านหรือกำลังรัน
3. flag ถ้า merge commit ไม่อยู่บน remote base

### 3. Verify Cleanup

> Goal: branch hygiene หลัง merge

1. `gh pr view <pr> --json headRefName` → ตรวจ remote branch ถูกลบหรือยัง (`git ls-remote --heads origin <branch>`)
2. local branch cleanup: `git branch --merged <base>`
3. flag stale branches ที่ merge แล้วแต่ยังอยู่

### 4. Report

> Goal: สรุป merge status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `merged-clean` / `merged-pending-ci` / `not-merged` พร้อม items ที่ค้าง

## Rules

- evidence ต้องมาจาก remote (`gh`/`git ls-remote`) ไม่ใช่ local state เพียงอย่างเดียว
- auto-merge pending ≠ merged — รายงานเป็น pending
- ไม่ delete branches ใน subskill นี้ — รายงานให้ caller ทำ

## Expected Outcome

- ยืนยัน PR merged บน remote พร้อม merge commit sha
- รายการ cleanup ที่ค้างถ้ามี
