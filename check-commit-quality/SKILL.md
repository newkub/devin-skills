---
name: check-commit-quality
description: Lint commit messages ตาม conventional commits หา messages ที่ผิด format หรือไม่ชัด
argument-hint: "[range]"
related:
  - git-commit
  - refactor-commit
  - list-git-commit
  - follow-tool-hk
  - report
---

## Goal

ตรวจ commit messages ใน repo ว่าตรง conventional commits และมีคุณภาพ — หา messages ที่ผิด format, กำกวม, ยาวเกิน หรือไม่บอก intent

## Scope

- ใช้กับ git history ของ repo ปัจจุบันหรือ range ที่ระบุ (`HEAD~10`, `main..feature`)
- ครอบคลุม format check (type, scope, subject) และ quality heuristics (imperative, specificity)
- Read-only: รายงานเท่านั้น ไม่ rewrite history

## Execute

### 1. Select Commit Range

> Goal: รู้ว่าตรวจ commits ไหน

1. รับ `range` จาก argument — default: `HEAD~20..HEAD` หรือ commits ที่ยังไม่ push
2. รัน `git log --format='%h|%s|%an|%ad' <range>` เพื่อดึง messages
3. ข้าม merge commits และ bot commits ตาม convention ของ repo

### 2. Check Format Compliance

> Goal: ตรง conventional commits spec

1. Pattern: `<type>(<scope>)?: <subject>` — types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `perf`, `build`, `ci`, `style`
2. Flag `bad-format` ถ้าไม่ match pattern
3. Flag `bad-type` ถ้า type ไม่อยู่ใน list ที่ repo ใช้
4. Flag `long-subject` ถ้า subject >72 ตัวอักษร
5. Flag `capitalized`/`trailing-dot` ตาม convention

### 3. Check Message Quality

> Goal: message บอก intent จริง

1. Flag `vague` สำหรับ subjects เช่น `update`, `fix bug`, `changes`, `wip`, `misc`
2. Flag `non-imperative` ถ้าใช้ past tense (`added`, `fixed`)
3. Flag `no-context` ถ้า commit ใหญ่ (diff หลายไฟล์) แต่ subject สั้นเกินและไม่มี body
4. Flag `mismatch` ถ้า type ไม่ตรง diff (เช่น `docs:` แต่แก้ source code)

### 4. Suggest Rewrites

> Goal: เสนอ message ที่ดีกว่า

1. สำหรับ commits ที่ flag → draft conventional message จาก diff summary
2. ใช้ `git show --stat <sha>` เพื่อเข้าใจ change จริง
3. เสนอ `<type>(<scope>): <imperative subject>` ต่อ commit

### 5. Report

> Goal: สรุป quality และแนวทางแก้

1. ทำ `/report` คอลัมน์: `No.`, `SHA`, `Message`, `Issues`, `Suggested`
2. สรุป compliance rate และ issue breakdown
3. แนะนำ `/refactor-commit` ถ้าต้อง rewrite (เฉพาะ commits ที่ยังไม่ push)
4. แนะนำ `commitlint` + `/follow-tool-hk` ถ้าต้องการ enforce ต่อเนื่อง

## Rules

### 1. Read-Only

- ไม่ rebase, amend หรือ rewrite history ใน skill นี้
- เสนอ suggestion เท่านั้น — rewrite ผ่าน `/refactor-commit` เมื่อ user สั่ง

### 2. Repo Convention

- ใช้ types/scopes ที่ repo ใช้จริงจาก `git log` — ไม่บังคับ set มาตรฐานถ้า repo มีของตัวเอง
- ถ้า repo ไม่ใช้ conventional commits เลย → รายงาน quality เท่านั้น ไม่ flag format

### 3. Actionable

- ทุก flag ต้องมี suggested rewrite หรือเหตุผลที่ชัด
- ไม่ flag bot commits (`dependabot`, `renovate`) เว้นแต่ repo บังคับ format

- ใช้ /list-git-commit ถ้าจำเป็น
- ใช้ /refactor-commit ถ้าจำเป็น
- ใช้ /follow-tool-hk ถ้าจำเป็น

## Expected Outcome

- รู้ compliance rate และ commits ที่ผิด format/quality
- มี suggested messages พร้อมใช้
- รู้ว่าควร `/refactor-commit` หรือตั้ง commitlint hook
