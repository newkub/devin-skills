---
name: merge-github-pr
description: Merge pull request ด้วย strategy ทีเหมาะสม พร้อม validate ก่อน merge
argument-hint: "[scope|verify]"
related:
  - resolve-github-pr
  - refactor-commit
  - git-commit
  - git-push
  - deep-validate
  - review-github-pr
---

## Goal

Merge pull request ด้วยวิธีทีเหมาะสม (merge, squash, rebase) พร้อมตรวจสอบ CI, review approval และ conflicts

## Scope
- สำหรับ skills ที่เกี่ยวข้อง: `refactor-commit`, `git-commit`, `git-push`, `deep-validate`, `open-github`, `review-github-pr`

ใช้เมื่อ PR พร้อม merge ต้องการเลือก strategy อย่างถูกต้องและ merge อย่างปลอดภัย

## Execute

### 1. Read PR Info

> Goal: อ่านข้อมูล PR

1. รัน `gh pr view <pr>` เพื่อดู title, body, branch, base, status
2. บันทึก PR number, branch, author
3. ถ้าไม่มี PR number → ทำ `/ask-me`

### 2. Check Merge Requirements

> Goal: ตรวจสอบเงื่ือนไขก่อน merge

1. รัน `gh pr checks <pr>` หรือ `gh pr view <pr> --json statusCheckRollup`
2. ตรวจสอบ review approval: `gh pr view <pr> --json reviews`
3. ตรวจสอบ conflicts: `gh pr view <pr> --json mergeStateStatus`
4. ถ้า CI ไม่ผ่าน → ทำ `/resolve-errors` ก่อน merge
5. ถ้ามี conflicts → ทำ `/resolve-github-pr` หรือ merge base branch

### 3. Choose Merge Strategy

> Goal: เลือก strategy ทีเหมาะสม

1. ดู project conventions หรือ `CONTRIBUTING.md`
2. เลือก:
   - `--merge` ถ้าต้องการเก็บ commit history
   - `--squash` ถ้าต้องการ commit เดียว (default สำหรับ feature branch)
   - `--rebase` ถ้าต้องการ linear history
3. ถ้าไม่ชัด → ถาม user ด้วย `/ask-me`

### 4. Final Checks

> Goal: ตรวจสอบครั้งสุดท้าย

1. ทำ `/run-check` (lint, typecheck, tests)
2. ทำ `/run-test` สำหรับ critical paths
3. ตรวจสอบว่า branch ที merge เป็ต สมบูรณ์

### 5. Merge

> Goal: ทำการ merge

1. รัน `gh pr merge <pr> --<strategy>`
2. ถ้าต้องใช้ admin privilege → เพิ่ม `--admin`
3. ถ้ามี auto-merge → ใช้ `gh pr merge <pr> --auto`
4. รอจน merge สำเร็จ

### Workflows

> Goal: dispatch post-merge verification แยกจาก merge flow

| Argument | Workflow |
|----------|----------|
| `verify`, `verify-merge` | `workflows/verify-merge/SKILL.md` — PR merged บน remote, base updated, cleanup ครบ |

1. ถ้า argument เป็น `verify` → อ่าน `workflows/verify-merge/SKILL.md` แล้วทำตาม flow — ไม่ merge ใหม่
2. ถ้าไม่ระบุ → ทำ Steps 1-7 ตามปกติ โดย Step 6 อ่าน workflow `verify-merge` มา execute ก่อน cleanup

### 6. Verify And Cleanup

> Goal: ยืนยันและ cleanup

1. ทำตาม `workflows/verify-merge/SKILL.md` — ยืนยัน PR merged บน remote ก่อน
2. รัน `git fetch` และ `git pull` บน base branch
3. ลบ local branch ถ้าไม่ต้องการ `git branch -d <branch>`
4. รัน `gh pr delete-branch <pr>` ถ้าต้องการ

### 7. Report

> Goal: สรุปผล

1. รายงาน PR number, strategy, final status
2. ระบุ branch ทีถูกลบหรือคงไว้

## Rules

- ไม่ merge ถ้า CI ไม่ผ่าน
- ไม่ merge ถ้ามี unresolved conflicts
- ไม่ merge โดยไม่มี approval (ยกเว้น user สั่ง)
- ใช้ strategy ตาม project conventions
- ทำ final checks ก่อน merge เสมอ

## Merged Details

### verify-merge

##### Goal

ยืนยันหลัง `gh pr merge` ว่า PR merged จริงบน remote, base branch อัปเดต และ cleanup ครบ — เรียก standalone หลัง merge เสร็จ

##### Scope

- ใช้เมื่อ `/merge-github-pr` dispatch มาที่ `verify` หรือเรียกหลัง merge
- ครอบคลุม: PR state บน remote, base branch sync, merge commit บน remote, branch cleanup
- Read-only: ตรวจสอบ — ไม่ re-merge

##### Execute

###### 1. Verify PR State

> Goal: PR เป็น merged จริงบน GitHub

1. `gh pr view <pr> --json state,mergedAt,mergeCommit` — state = `MERGED`
2. บันทึก merge commit sha และ strategy ที่ใช้
3. flag ถ้า state เป็น `CLOSED` โดยไม่ merge หรือยัง `OPEN` (auto-merge pending)

###### 2. Verify Base Branch

> Goal: base branch บน remote มี merge commit

1. `git fetch origin` แล้ว `git log origin/<base> --oneline -3` — merge commit อยู่บน remote
2. `gh pr checks <pr>` หรือดู CI run บน base หลัง merge — post-merge CI ผ่านหรือกำลังรัน
3. flag ถ้า merge commit ไม่อยู่บน remote base

###### 3. Verify Cleanup

> Goal: branch hygiene หลัง merge

1. `gh pr view <pr> --json headRefName` → ตรวจ remote branch ถูกลบหรือยัง (`git ls-remote --heads origin <branch>`)
2. local branch cleanup: `git branch --merged <base>`
3. flag stale branches ที่ merge แล้วแต่ยังอยู่

###### 4. Report

> Goal: สรุป merge status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `merged-clean` / `merged-pending-ci` / `not-merged` พร้อม items ที่ค้าง

##### Rules

- evidence ต้องมาจาก remote (`gh`/`git ls-remote`) ไม่ใช่ local state เพียงอย่างเดียว
- auto-merge pending ≠ merged — รายงานเป็น pending
- ไม่ delete branches ใน workflow นี้ — รายงานให้ caller ทำ

##### Expected Outcome

- ยืนยัน PR merged บน remote พร้อม merge commit sha
- รายการ cleanup ที่ค้างถ้ามี

## Expected Outcome

- PR ถูก merge สำเร็จ
- Base branch อัปเดต
- Branch ทีใช้งานเสร็จถูก cleanup
- สรุปผลชัดเจน

