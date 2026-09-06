---
name: cleanup-branches-merged
description: ลบ local และ remote branches ที่ merge เข้า main แล้วทั้งหมดพร้อม dry-run
argument-hint: "[base-branch] [--remote]"
related:
  - cleanup-git-branch
  - delete-git-branch
  - list-git-branch
  - merge-git-branch
  - ask-me
  - report-table
---

## Goal

ลบ branches ที่ merge เข้า base branch (default `main`) เรียบร้อยแล้ว — ทั้ง local และ remote — โดยมี dry-run และ confirmation ก่อนลบจริง

## Scope

- Local branches ที่ merged: `git branch --merged <base>`
- Remote branches ที่ merged หรือ PR-closed ถ้าระบุ `--remote`
- ข้าม: base branch, current branch, protected branches (`main`, `develop`, `release/*` ตาม convention)
- Destructive: ต้อง dry-run + user confirmation เสมอ

## Execute

### 1. Survey Branches

> Goal: รวบรวม branches ทั้งหมดและสถานะ

1. `git fetch --prune` เพื่อ sync remote refs ล่าสุด
2. `git branch --merged <base>` หา local branches ที่ merged
3. ถ้า `--remote`: `git branch -r --merged <base>` หา remote branches ที่ merged
4. เทียบกับ GitHub: branches ที่ PR ถูก close/merge ผ่าน `gh pr list --state merged`

### 2. Build Deletion List

> Goal: สร้างรายการ branches ที่ปลอดภัยจะลบ

1. ข้าม: base branch, current checkout, protected patterns (`main`, `master`, `develop`, `release/*`, `hotfix/*`)
2. flag branches ที่ merged แต่มี unmerged commits บน remote counterpart
3. flag branches ที่ merged แต่ยังมี open PR — อาจถูก reopen
4. เหลือเฉพาะ: merged + no open PR + not protected

### 3. Dry-Run Report

> Goal: แสดงสิ่งที่จะลบก่อนทำจริง

1. ใช้ `/report-table` คอลัมน์: `No.`, `Branch`, `Local/Remote`, `Merged Into`, `Last Commit`, `Safe`
2. ระบุจำนวนรวมและ branches ที่ข้ามพร้อมเหตุผล
3. **รอ user confirmation ผ่าน `/ask-me` ก่อนลบเสมอ**

### 4. Delete

> Goal: ลบตามที่ confirm

1. Local: `git branch -d <branch>` (safe delete — ปฏิเสธถ้า unmerged)
2. Remote: `git push origin --delete <branch>` เฉพาะที่ user confirm
3. ถ้า `-d` fail → อย่า force `-D` เอง — รายงานให้ user ตัดสินใจ

### 5. Report Result

> Goal: สรุปสิ่งที่ลบและที่เหลือ

1. ตารางผลลัพธ์: deleted, skipped, failed พร้อมเหตุผล
2. `git branch` + `git remote prune origin` เพื่อยืนยันสะอาด

## Rules

### 1. Confirmation Required

- ห้ามลบ branch ใดๆ โดยไม่มี dry-run report และ user confirmation
- ใช้ `-d` (safe) ไม่ใช่ `-D` (force) เว้นแต่ user สั่งชัดเจน

### 2. Protect Critical Branches

- base, current และ protected patterns ห้ามอยู่ใน deletion list
- branches ที่มี open PR หรือ unmerged commits ต้อง flag ไม่ลบ

### 3. Sync First

- ต้อง `fetch --prune` ก่อนเสมอ — stale refs ทำให้ list ผิด
- remote deletions ทำเฉพาะที่ user ระบุ `--remote` และ confirm

## Expected Outcome

- Branches ที่ merged ถูกลบอย่างปลอดภัยทั้ง local และ remote (ถ้าเลือก)
- Protected/open-PR branches ไม่ถูกแตะ
- รายงาน deleted/skipped พร้อมเหตุผลครบ
