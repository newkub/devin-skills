---
name: check-merge-conflicts
description: ทำนาย merge conflicts ก่อน merge จริง — dry-run เทียบ branches โดยไม่แตะ working tree
argument-hint: "[source-branch] [target-branch]"
related:
  - merge-git-branch
  - resolve-merge-conflicts
  - check-git-diff
  - list-git-branch
  - check-file-relations
  - report-table
---

## Goal

ตรวจว่าการ merge จะเกิด conflicts หรือไม่ ก่อน merge จริง — ใช้ merge-tree/patch dry-run เปรียบเทียบ branches โดยไม่แตะ working tree

## Scope

- ใช้ก่อน `/merge-git-branch` หรือก่อนสร้าง/อัปเดต PR
- ครอบคลุม: textual conflicts (บรรทัดเดียวกันแก้ทั้งสองฝั่ง), semantic conflicts (rename/delete cross), diverged branches
- Read-only ต่อ working tree — ไม่ merge จริง

## Execute

### 1. Prepare Comparison

> Goal: ระบุ branches และ merge base

1. ระบุ source และ target จาก argument — default: current branch vs `main`
2. `git fetch` ให้ refs ล่าสุด แล้วหา merge base: `git merge-base <source> <target>`
3. เช็คว่า branches diverge จริง — ถ้า fast-forward ได้ = ไม่มี conflict แน่นอน

### 2. Dry-Run Merge

> Goal: ทำนาย conflicts โดยไม่แตะ working tree

1. `git merge-tree --write-tree <target> <source>` (git ≥2.38) — แสดง conflicts โดยไม่ merge
2. Fallback: `git merge --no-commit --no-ff` ใน temp worktree (`/use-git-worktrees`) แล้ว abort
3. เก็บรายการไฟล์ที่ conflict พร้อม hunk details

### 3. Analyze Conflict Surface

> Goal: เข้าใจขนาดและลักษณะ conflicts

1. จัดกลุ่ม: trivial (imports, formatting), moderate (logic overlaps), severe (same function แก้คนละทาง)
2. flag semantic risks ที่ merge เขียวแต่พัง: file ถูก rename ฝั่งหนึ่ง + แก้อีกฝั่ง, deleted file ที่ถูก modify
3. ประเมิน resolution effort: auto-mergeable conflicts vs ต้องคนตัดสิน

### 4. Report

> Goal: สรุป conflict risk พร้อมแผน

1. ใช้ `/report-table`: `No.`, `File`, `Conflict Type`, `Severity`, `Auto-resolvable`, `Notes`
2. Verdict: `clean`, `trivial conflicts`, `needs manual resolution`, `high risk`
3. แนะนำ: merge เลย, rebase ก่อน, หรือแบ่งเป็น smaller merges

## Rules

### 1. No Working Tree Changes

- dry-run เท่านั้น — ใช้ `merge-tree` หรือ temp worktree, ห้าม merge ใน working tree จริง
- cleanup temp worktree หลังเสร็จ

### 2. Evidence-Based

- รายงาน conflict ที่พิสูจน์ได้จาก dry-run — ไม่เดาจาก diff size
- แยก textual conflicts จาก semantic risks ชัดเจน

### 3. Actionable

- verdict ต้องมี next step — merge ได้เลย / ควรทำอะไรก่อน
- conflicts ที่ auto-resolvable ให้บอกวิธี (theirs/ours/format-fix)

## Expected Outcome

- รายการไฟล์ที่จะ conflict พร้อม severity ก่อน merge จริง
- Verdict + recommended merge strategy
- ลด surprise conflicts ตอน merge
