---
name: check-uncommit
description: สแกน git repos ทั้งเครื่องหา uncommitted changes (modified, staged, untracked)
argument-hint: "[path]"
related:
  - list-projects-git-in-drive-d
  - git-commit
  - check-unpush
  - report
---

## Goal

สแกน git repositories ทั้งเครื่อง (หรือ path ที่ระบุ) เพื่อหา uncommitted changes: modified, staged และ untracked files — ป้องกันงานค้างที่ลืม commit

## Scope

- ใช้เมื่อต้องการ audit repos ทั้งหมดหางานที่ยังไม่ commit
- Default scope: ทุก repo ที่พบในเครื่องผ่าน `/list-projects-git-in-drive-d` หรือ path ที่ระบุ
- Read-only: รายงานสถานะเท่านั้น ไม่ commit หรือแก้ไข

## Execute

### 1. Collect Repositories

> Goal: รู้ว่าต้อง scan repo ไหนบ้าง

1. รับ `path` จาก argument — default: scan ทุก drive ผ่าน `/list-projects-git-in-drive-d`
2. หา directories ที่มี `.git` (รวม worktrees และ submodules)
3. ข้าม bare repos และ cache directories

### 2. Check Working Tree Status

> Goal: นับ uncommitted changes ต่อ repo

1. รัน `git -C <repo> status --porcelain` ต่อ repo
2. แยกประเภท: `staged` (index), `modified` (unstaged), `untracked` (`??`)
3. นับจำนวนไฟล์ต่อประเภท
4. ตรวจ `git -C <repo> stash list` สำหรับ stashes ที่ค้าง

### 3. Assess Severity

> Goal: จัดลำดับ repo ที่เสี่ยงสูญหาย

1. Flag `high` ถ้า repo มี untracked files ที่ดูเป็น source code หรือ staged changes ค้างนาน
2. Flag `medium` ถ้ามี modified files แต่ tracked ทั้งหมด
3. Flag `low` ถ้ามีแค่ untracked build artifacts (จาก `.gitignore` patterns)
4. รวมกับผล `/check-unpush` ถ้ารันคู่กัน — repo ที่ทั้ง uncommit และ unpush เสี่ยงสุด

### 4. Report

> Goal: สรุป repos ที่มีงานค้าง

1. ทำ `/report` คอลัมน์: `No.`, `Repo`, `Path`, `Staged`, `Modified`, `Untracked`, `Stashes`, `Severity`
2. เรียง severity สูง → ต่ำ
3. แนะนำ `/git-commit` หรือ `/git-commit-selected-files` ต่อ repo ที่มีงานค้าง

## Rules

### 1. Read-Only

- ไม่ commit, stash หรือแก้ไข working tree
- รายงานเท่านั้น — ให้ user เลือก action

### 2. Performance

- จำกัด scan depth และข้าม directories เช่น `node_modules`, `.git` internals
- ถ้า repos เยอะ → รัน parallel หรือ report แบบ streaming

### 3. Accuracy

- ใช้ `git status --porcelain` เท่านั้น — ไม่เดาจาก file timestamps
- ระบุ detached HEAD และ merge/rebase in-progress ในรายงาน

- ใช้ /list-projects-git-in-drive-d ถ้าจำเป็น
- ใช้ /check-unpush ถ้าจำเป็น
- ใช้ /git-commit ถ้าจำเป็น

## Expected Outcome

- รายการ repos ทั้งหมดที่มี uncommitted changes พร้อม breakdown
- ระบุ severity เพื่อ prioritize repos ที่เสี่ยงสูญหายงาน
- พร้อมส่งต่อ `/git-commit` ต่อ repo
