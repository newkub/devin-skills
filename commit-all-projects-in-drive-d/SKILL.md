---
name: commit-all-projects-in-drive-d
description: commit uncommitted changes ทุก git project ใน drive D ผ่าน check-uncommit + git-commit ต่อ repo
argument-hint: "[filter]"
allowed-tools:
  - exec
  - read
  - grep
  - find_file_by_name
  - ask_user_question
related:
  - list-projects-git-in-drive-d
  - check-uncommit
  - git-commit
  - check-secrets
  - push-all-projects-in-drive-d
  - report
  - ask-me
  - suggest-next-action
---

## Goal

commit uncommitted changes ของทุก git project ใน `D:\` อย่างปลอดภัย — scan ด้วย `/check-uncommit` ก่อน แล้ว commit ต่อ repo ผ่าน `/git-commit` โดยไม่ทำลายงานที่ค้าง

## Scope

ใช้เมื่อต้องการ commit งานค้างทุก repo ใน `D:\` ในครั้งเดียว รองรับ `filter` ตามชื่อ/keyword — ไม่รวม push (ใช้ `/push-all-projects-in-drive-d` ต่อ) และไม่แก้ไขไฟล์ใดๆ นอกเหนือการ commit

## Execute

### 1. List Target Projects

> Goal: ระบุ project ที่จะ commit

1. ถ้า user ระบุ `filter` → ทำ `/search-project-in-drive-d <filter>` เพื่อกรอง project
2. ถ้าไม่ระบุ → ทำ `/list-projects-git-in-drive-d` เพื่อรายการทั้งหมด
3. ตรวจสอบว่าได้รายการอย่างน้อย 1 project ถ้าไม่มี → stop และ report

### 2. Check Uncommit Per Project

> Goal: เหลือเฉพาะ repos ที่มีงานค้าง

1. ทำ `/check-uncommit` กับทุก project ใน list — ใช้ `git -C <repo> status --porcelain`
2. ข้าม repo ที่ clean — ไม่มี staged/modified/untracked
3. Flag repos ที่มี `merge`/`rebase` in-progress, detached HEAD หรือ staged secrets-suspect files — แยกไว้ report ไม่ commit
4. แสดงรายการ repos ที่จะ commit พร้อม file counts ต่อประเภท

### 3. Confirm Commit Plan

> Goal: user เลือก scope และ message strategy ก่อนลงมือ

1. ถาม user ด้วย `/ask-me`:
   - `all` — commit ทุก repo ที่ dirty (default)
   - `select` — user เลือก repos ที่จะ commit
   - `dry-run` — แสดง commit plan โดยไม่ commit
2. ถาม message strategy: ให้ `/git-commit` สร้าง conventional message ต่อ repo (default) หรือใช้ message เดียวกันทุก repo
3. ถ้า user ไม่ตอบ → stop และ report — ห้าม commit โดยไม่ confirm

### 4. Commit Each Project

> Goal: commit ครบทุก repo ที่เลือก

1. วนลูป sequential ตาม list — repo หนึ่งทีเพื่อให้ message ตรง context ของ repo นั้น
2. ทำ `/git-commit` ต่อ repo — ให้ skill นั้นจัดการ staging, message และ hooks
3. ถ้า repo มีไฟล์เสี่ยง (`.env`, credentials, large binaries) → ทำ `/check-secrets` ก่อน แล้ว skip + flag ถ้าพบ
4. ถ้า pre-commit hook fail → บันทึก error แล้วข้าม repo นั้น — ห้ามใช้ `--no-verify` โดยไม่ได้รับอนุญาต
5. ถ้ามากกว่า 5 repos ที่ independent → อาจใช้ `/use-subagents` แบ่งต่อ repo แล้วรวม reports

### 5. Verify

> Goal: ยืนยันว่าไม่มีงานค้างเหลือ

1. รัน `/check-uncommit` ซ้ำกับ repos ที่ commit แล้ว
2. repos ที่ยัง dirty → ระบุสาเหตุ (hook fail, skipped, secrets flag)

### 6. Report Summary

> Goal: สรุปผลการ commit

1. ใช้ `/report` คอลัมน์: `No.`, `Project`, `Path`, `Files`, `Commit`, `Status`
2. Status: `committed`, `clean`, `skipped`, `error`, `flagged`
3. ระบุ count แต่ละประเภท
4. ทำ `/suggest-next-action` — แนะนำ `/push-all-projects-in-drive-d` ถ้ามี repos ที่ commit แล้วยังไม่ push

## Rules

### 1. Drive D Scope Only

- ทำงานเฉพาะ paths ที่ขึ้นต้นด้วย `D:\` หรือ `/mnt/d` (WSL)
- ไม่แตะ drives อื่นโดยไม่ได้รับอนุญาต
- ตรวจสอบ drive letter ก่อน execute ทุกครั้ง

### 2. Confirm Before Commit

- ต้องผ่าน `/ask-me` confirmation ก่อน commit เสมอ — dry run แสดง plan ก่อน
- ห้าม commit repo ที่ merge/rebase ค้าง, detached HEAD หรือมี secrets flag
- ห้าม `--no-verify` เว้น user อนุญาตชัดเจน

### 3. Per-Repo Context

- commit message ต้องมาจาก diff ของ repo นั้นจริง — ห้ามใช้ generic message เดียวกันทุก repo เว้น user สั่ง
- ใช้ conventional commits ตาม style ของ repo นั้น (ดู `git log` ล่าสุด)

### 4. No Push

- skill นี้ commit เท่านั้น — ไม่ push, ไม่ pull, ไม่ fetch
- ถ้าต้องการ push ให้ใช้ `/push-all-projects-in-drive-d` ต่อ

### 5. Idempotency

- รันซ้ำแล้วไม่สร้าง empty commits — repo ที่ clean ถูก skip เสมอ

- ใช้ /check-unpush ถ้าจำเป็น
- ใช้ /refactor-commit ถ้าจำเป็น

## Expected Outcome

- ทุก repo ที่ dirty ใน `D:\` ถูก commit ด้วย message ที่ตรง context (หรือ skip พร้อมเหตุผล)
- ไม่มี secrets หรืองานค้างที่เสี่ยงถูก commit โดยไม่ตั้งใจ
- รายงานสรุป status ทุก repo พร้อม pointer ไป `/push-all-projects-in-drive-d`
