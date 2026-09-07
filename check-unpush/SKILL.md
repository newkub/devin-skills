---
name: check-unpush
description: สแกน git repos ทั้งเครื่องหา commits ที่ยังไม่ push และ branches ที่ไม่มี upstream
argument-hint: "[path]"
related:
  - list-project-git-in-computer
  - git-push
  - check-uncommit
  - report-table
---

## Goal

สแกน git repositories ทั้งเครื่อง (หรือ path ที่ระบุ) เพื่อหา commits ที่ยังไม่ push, branches ที่ไม่มี upstream และ repos ที่ remote หายไป — ป้องกันงานที่ commit แล้วแต่ยังไม่ backup

## Scope

- ใช้เมื่อต้องการ audit repos ทั้งหมดหา commits ที่ยังไม่ขึ้น remote
- Default scope: ทุก repo ที่พบในเครื่องผ่าน `/list-project-git-in-computer` หรือ path ที่ระบุ
- Read-only: รายงานสถานะเท่านั้น ไม่ push หรือแก้ไข remote config

## Execute

### 1. Collect Repositories

> Goal: รู้ว่าต้อง scan repo ไหนบ้าง

1. รับ `path` จาก argument — default: scan ทุก repo จาก `/list-project-git-in-computer`
2. ข้าม repos ที่ไม่มี remote (`git remote` ว่าง) แต่ flag เป็น `no-remote`
3. ข้าม bare repos

### 2. Check Ahead/Behind Status

> Goal: นับ unpushed commits ต่อ branch

1. รัน `git -C <repo> status -sb` หา `[ahead N]` / `[behind M]`
2. รัน `git -C <repo> log '@{u}..HEAD' --oneline` สำหรับ commits ที่ยังไม่ push (ถ้ามี upstream)
3. นับ ahead count ต่อ branch ทุก branch: `git -C <repo> for-each-ref --format='%(refname:short) %(upstream:track)' refs/heads`

### 3. Detect Orphan Branches

> Goal: หา branches ที่ไม่มี upstream

1. หา local branches ที่ `%(upstream)` ว่าง — commits บนนั้นไม่ถูก push เลย
2. หา branches ที่ upstream ชี้ remote branch ที่ถูกลบ (`[gone]`)
3. ตรวจว่า remote reachable (`git ls-remote --heads` แบบ short timeout) — flag `unreachable` ถ้า remote ตาย

### 4. Report

> Goal: สรุป repos ที่มีงานยังไม่ backup

1. ทำ `/report-table` คอลัมน์: `No.`, `Repo`, `Branch`, `Ahead`, `Behind`, `Upstream`, `Status`
2. Status: `unpushed`, `no-upstream`, `gone`, `no-remote`, `unreachable`, `clean`
3. เรียง `unpushed` มากสุดก่อน
4. แนะนำ `/git-push` ต่อ repo/branch ที่ต้อง push

## Rules

### 1. Read-Only

- ไม่ push, fetch หรือแก้ remote config
- รายงานเท่านั้น — ให้ user เลือก action

### 2. No Network Surprise

- `git status` และ `for-each-ref` ใช้ local data — ไม่ต้อง network
- `git ls-remote` ทำเฉพาะเมื่อต้องตรวจ remote reachable และใช้ timeout สั้น
- ถ้า offline → รายงานจาก local tracking info พร้อมระบุว่า remote ไม่ได้ verify

### 3. Accuracy

- นับ commits จาก `@{u}..HEAD` ไม่ใช่การเดา
- แยกชัด `ahead` (local มีเพิ่ม) กับ `behind` (remote มีเพิ่ม)

- ใช้ /list-project-git-in-computer ถ้าจำเป็น
- ใช้ /check-uncommit ถ้าจำเป็น
- ใช้ /git-push ถ้าจำเป็น

## Expected Outcome

- รายการ repos/branches ที่มี commits ยังไม่ push พร้อมจำนวน
- ระบุ branches ที่ไม่มี upstream และ repos ที่ remote หาย
- พร้อมส่งต่อ `/git-push` ต่อ repo
