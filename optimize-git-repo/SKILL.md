---
name: optimize-git-repo
description: ลดขนาด git repo — history bloat, large objects, gc และ LFS migration
argument-hint: "[--analyze-only]"
related:
  - check-size
  - check-git-logs
  - follow-tool-git
  - use-git-worktrees
  - report-before-after
---

## Goal

ลดขนาด git repository — clone size, history bloat และ large objects — ด้วยการวิเคราะห์ objects, git gc และ LFS migration สำหรับ binaries

## Scope

- ครอบคลุม: `.git` size, large blobs ใน history, pack efficiency, refs เก่า, LFS candidates
- ต้องระวัง: history rewrite เป็น destructive — ต้อง user confirmation และ coordination
- Action-oriented แต่ safety-first: analyze ก่อน, rewrite เฉพาะเมื่อจำเป็นและได้รับอนุมัติ

## Execute

### 1. Measure Repo Size

> Goal: วัดขนาดและหา hot spots

1. วัด `.git` size, working tree size, object counts (`git count-objects -vH`)
2. หา largest objects ใน history: `git rev-list --objects --all` + sort by size หรือ `git filter-repo --analyze`
3. หา largest files ปัจจุบัน vs ใน history — ไฟล์ที่ลบแล้วยังกินที่ใน history

### 2. Identify Bloat Sources

> Goal: หาสาเหตุ repo บวม

1. **Binaries in history**: images, videos, builds, `node_modules` ที่เคย commit
2. **Dead branches/tags**: refs ที่ไม่ prune — pack objects ค้าง
3. **Pack inefficiency**: objects ไม่ถูก pack/delta-compress
4. **Large current files**: binaries ที่ควรเป็น LFS — ทำ `/check-git-lfs` ร่วมถ้ามี

### 3. Apply Safe Optimizations

> Goal: ลดขนาดแบบไม่ rewrite history ก่อน

1. `git gc --aggressive --prune=now` — repack + prune unreachable
2. `git remote prune origin` + ลบ stale local refs
3. แนะนำ LFS migration สำหรับ future binaries (`.gitattributes` + `git lfs migrate` สำหรับ history ถ้าต้องการ)
4. `.gitignore` audit — ป้องกัน binaries ใหม่เข้า repo

### 4. History Rewrite (Only If Approved)

> Goal: ลบ bloat จาก history — destructive ต้อง confirm

1. **ต้อง user confirmation ชัดเจน** — rewrite ทำให้ทุก clone ต้อง re-clone
2. ใช้ `git filter-repo` (ไม่ใช่ `filter-branch`) ลบ paths/blobs ที่ใหญ่
3. แจ้ง consequences: SHAs เปลี่ยนทั้งหมด, open PRs พัง, CI caches invalid
4. หลัง rewrite: force-push ต้อง coordinate กับทีม — อย่าทำเองโดยไม่แจ้ง

### 5. Report

> Goal: สรุปขนาดและผล

1. `/report-before-after`: repo size, pack size, object count
2. ตาราง top space consumers ที่จัดการแล้ว/เหลือ
3. Recommendations: LFS policy, gitignore rules, `.gitattributes` eol rules

## Rules

### 1. Non-Destructive First

- gc/prune/LFS-forward ก่อนเสมอ — history rewrite เป็นทางเลือกสุดท้าย
- rewrite ต้องมี written user approval + backup/clone สำรอง

### 2. Measure First

- รายงาน sizes จริงก่อน-หลัง — ไม่เดาว่าอะไรใหญ่
- แยก working tree vs `.git` vs remote ชัดเจน

### 3. Team Aware

- history rewrite กระทบทุกคน — ต้องระบุ coordination steps
- ไม่ force-push เองเด็ดขาด

## Expected Outcome

- Repo เล็กลงพร้อมตัวเลข before/after
- Bloat sources ถูกระบุและจัดการตามความปลอดภัย
- Policy ป้องกัน bloat ในอนาคต (LFS, gitignore, gitattributes)
