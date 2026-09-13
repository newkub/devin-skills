---
name: merge-git-branch-verify-merge
description: ยืนยัน merge สะอาดหลัง merge branch — commit ถูกต้อง, ไม่มี conflict residue, build/test ผ่าน
argument-hint: "[target-branch]"
related:
  - run-verify
  - resolve-errors
  - report
---

## Goal

ยืนยันหลัง merge ว่า merge commit ถูกต้อง ไม่มี conflict residue และ project ยัง build/test ผ่าน — เรียก standalone หลัง merge เสร็จหรือเมื่อสงสัยว่า merge สะอาดไหม

## Scope

- ใช้เมื่อ `/merge-git-branch` dispatch มาที่ `verify` หรือเรียกหลัง merge
- ครอบคลุม: merge commit, conflict markers, tree state, build/test green, branch state
- Read-only: ตรวจสอบ — ไม่ re-merge หรือ reset

## Execute

### 1. Verify Merge Commit

> Goal: merge commit อยู่และถูก structure

1. `git log --oneline -5` — merge commit ล่าสุดมี 2 parents (`git cat-file -p HEAD` ดู `parent` lines)
2. `git diff <feature-branch>..<target> --stat` → ควรว่างเปล่า (merge ครบ)
3. flag ถ้า merge commit ไม่ใช่ `--no-ff` (parent เดียว) หรือ diff ยังเหลือ

### 2. Check Conflict Residue

> Goal: ไม่มี conflict markers หลุมใน tree

1. `rg '^(<<<<<<<|=======|>>>>>>>)'` ทั้ง working tree — ต้องไม่เจอ
2. `git status` → clean, ไม่มี unmerged paths
3. `git diff --check` → ไม่มี whitespace/conflict artifacts

### 3. Verify Project Still Green

> Goal: code หลัง merge ใช้งานได้

1. รัน `bun run typecheck` หรือ build ของ project (best-effort)
2. ถ้า merge แตะ critical paths → ทำ `/run-verify`
3. ถ้า fail → report พร้อมระบุ `git reset --hard ORIG_HEAD` เป็น rollback option — ไม่รันเอง

### 4. Report

> Goal: สรุป merge health

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `clean` / `suspicious` / `broken` พร้อม rollback option ถ้า broken

## Rules

- conflict marker พบจริง = broken — report ทันทีพร้อม rollback command
- ไม่ reset/revert ใน subskill นี้ — decision เป็นของ caller
- ระบุ merge commit hash ในรายงานเสมอ

## Expected Outcome

- ยืนยัน merge สะอาด หรือรายการปัญหาพร้อม rollback option
