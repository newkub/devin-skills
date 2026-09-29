---
name: push-all-projects-in-drive-d
description: push unpushed commits ทุก git project ใน drive D ผ่าน check-unpush + git-push ต่อ repo
argument-hint: "[filter]"
allowed-tools:
  - exec
  - read
  - grep
  - find_file_by_name
  - ask_user_question
related:
  - list-projects-git-in-drive-d
  - check-unpush
  - git-push
  - refactor-commit
  - commit-all-projects-in-drive-d
  - report
  - ask-me
  - suggest-next-action
---

## Goal

push commits ที่ยังไม่ขึ้น remote ของทุก git project ใน `D:\` อย่างปลอดภัย — scan ด้วย `/check-unpush` ก่อน แล้ว push ต่อ repo/branch ผ่าน `/git-push` โดยไม่ rewrite history

## Scope

ใช้เมื่อต้องการ push งานที่ commit แล้วทุก repo ใน `D:\` ในครั้งเดียว รองรับ `filter` ตามชื่อ/keyword — ไม่รวม commit (ใช้ `/commit-all-projects-in-drive-d` ก่อนถ้ายัง dirty)

## Execute

### 1. List Target Projects

> Goal: ระบุ project ที่จะ push

1. ถ้า user ระบุ `filter` → ทำ `/search-project-in-drive-d <filter>` เพื่อกรอง project
2. ถ้าไม่ระบุ → ทำ `/list-projects-git-in-drive-d` เพื่อรายการทั้งหมด
3. ตรวจสอบว่าได้รายการอย่างน้อย 1 project ถ้าไม่มี → stop และ report

### 2. Check Unpush Per Project

> Goal: เหลือเฉพาะ repos/branches ที่มี commits ค้าง push

1. ทำ `/check-unpush` กับทุก project ใน list — `git status -sb`, `git log '@{u}..HEAD' --oneline`, `for-each-ref` upstream tracking
2. ข้าม repo ที่ `clean` — ไม่มี ahead commits
3. Flag repos ที่ `no-remote`, `unreachable`, `gone` upstream หรือ `no-upstream` branches — แยกไว้ report
4. Flag repos ที่ behind remote ด้วย — push จะถูก reject ต้อง pull ก่อน
5. แสดงรายการ repos/branches ที่จะ push พร้อม ahead counts

### 3. Confirm Push Plan

> Goal: user เลือก scope ก่อน push

1. ถาม user ด้วย `/ask-me`:
   - `current` — push เฉพาะ branch ปัจจุบันต่อ repo (default)
   - `all-branches` — push ทุก local branch ที่ ahead
   - `select` — user เลือก repos
   - `dry-run` — แสดง push plan โดยไม่ push
2. ถามว่า `no-upstream` branches จะ `git push -u origin <branch>` เลยหรือ skip
3. ถ้า user ไม่ตอบ → stop และ report — ห้าม push โดยไม่ confirm

### 4. Push Each Project

> Goal: push ครบทุก repo/branch ที่เลือก

1. วนลูป sequential ตาม list
2. ทำ `/git-push` ต่อ repo/branch — `git push` ปกติเท่านั้น
3. `no-upstream` branches ที่ user อนุญาต → `git push -u origin <branch>`
4. repos ที่ behind → ข้ามและ report ว่าต้อง `git pull` ก่อน — ห้าม force push
5. ถ้า unpushed commits รก/เละ → แนะนำ `/refactor-commit` แทนการ push และข้าม repo นั้น
6. ถ้ามากกว่า 5 repos ที่ independent → อาจใช้ `/use-subagents` แบ่งต่อ repo แล้วรวม reports

### 5. Verify

> Goal: ยืนยันว่า commits ขึ้น remote ครบ

1. รัน `/check-unpush` ซ้ำกับ repos ที่ push แล้ว
2. repos ที่ยัง ahead → ระบุสาเหตุ (rejected, unreachable, skipped)

### 6. Report Summary

> Goal: สรุปผลการ push

1. ใช้ `/report` คอลัมน์: `No.`, `Project`, `Path`, `Branch`, `Pushed`, `Status`
2. Status: `pushed`, `clean`, `skipped`, `error`, `no-remote`, `behind`, `flagged`
3. ระบุ count แต่ละประเภท
4. ทำ `/suggest-next-action`

## Rules

### 1. Drive D Scope Only

- ทำงานเฉพาะ paths ที่ขึ้นต้นด้วย `D:\` หรือ `/mnt/d` (WSL)
- ไม่แตะ drives อื่นโดยไม่ได้รับอนุญาต
- ตรวจสอบ drive letter ก่อน execute ทุกครั้ง

### 2. Confirm Before Push

- ต้องผ่าน `/ask-me` confirmation ก่อน push เสมอ — dry run แสดง plan ก่อน
- ห้าม `git push --force`, `--force-with-lease` หรือ rewrite pushed history โดยเด็ดขาด
- ห้าม push repo ที่ behind remote — report ให้ pull ก่อน

### 3. Network Aware

- ถ้า remote unreachable → flag `unreachable` ข้าม repo นั้น ไม่ retry loop
- ใช้ timeout สั้นสำหรับ remote checks — offline → report จาก local tracking info

### 4. No Commit

- skill นี้ push เท่านั้น — ไม่ commit, ไม่แก้ working tree
- ถ้า repo ยัง dirty → แนะนำ `/commit-all-projects-in-drive-d` ก่อน

### 5. Idempotency

- รันซ้ำแล้วไม่ push ซ้ำ — repo/branch ที่ up-to-date ถูก skip เสมอ

- ใช้ /check-uncommit ถ้าจำเป็น
- ใช้ /refactor-commit ถ้าจำเป็น

## Expected Outcome

- ทุก repo ที่ ahead ใน `D:\` ถูก push ขึ้น remote (หรือ skip พร้อมเหตุผล)
- ไม่มี force push หรือ history rewrite เกิดขึ้น
- รายงานสรุป status ทุก repo/branch พร้อม repos ที่ต้อง pull หรือมีปัญหา remote
