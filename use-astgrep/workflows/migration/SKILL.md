---
name: use-astgrep-migration
description: Migration ทั้ง codebase ด้วย ast-grep rule files — staged batches, validate ต่อ batch, revert ได้
argument-hint: "[migration-target]"
related:
  - use-astgrep
  - migration-with-astgrep
  - scan-codebase
  - update-astgrep-rules
  - run-check
  - report
---

## Goal

รัน codebase migration (API rename, framework upgrade, deprecation cleanup, import migration) ด้วย ast-grep rules แบบ staged — ทีละ batch, validate ทุก batch, revert ได้ตลอด

## Scope

- Orchestration layer สำหรับ migration ที่มีหลาย rules/หลาย batches — mechanics ของ rule writing + apply อยู่ใน `/migration-with-astgrep` (canonical), transform syntax ลึก → `/use-astgrep transform`, batch rewrite เดี่ยวๆ → `/use-astgrep rewrite`

## Execute

### 1. Scope Migration

> Goal: รู้ว่าต้อง migrate อะไร กี่ patterns กี่ไฟล์

1. ทำ `/scan-codebase` หา patterns เก่า + ตรวจ `package.json` versions/breaking changes
2. แตก migration เป็น list ของ patterns — แต่ละ pattern = 1 rule file
3. ประมาณขนาด: matches/files ต่อ pattern ด้วย `ast-grep run -p '<pattern>'` (search only)

### 2. Write Migration Rules

> Goal: มี rule ต่อ pattern พร้อม apply

1. เขียน rules ตาม `/migration-with-astgrep` (`id`, `language`, `rule`, `fix`) — transforms ซับซ้อน → `/use-astgrep transform`
2. เก็บใน `sg-rules/` หรือ temp — promote เข้า `rules/` เฉพาะ rule ที่ควรอยู่ถาวรผ่าน `/update-astgrep-rules`
3. Dry-run แต่ละ rule: `sg scan --rule <file>` — count matches, ตรวจ false positives

### 3. Stage Batches

> Goal: apply เป็นล็อตเล็กที่ revert ได้

1. Commit/stash ก่อนเริ่ม — migration ห้ามเริ่มบน dirty tree โดยไม่เตือน
2. เรียง batches: pattern ที่ปลอดภัยสุด/impact น้อยสุดก่อน → ซับซ้อน/เสี่ยงสุดท้าย
3. ต่อ batch: `sg scan --rule <file> --fix-all` หลัง confirm → validate ทันทีก่อน batch ถัดไป
4. Batch เดียวกันอาจแยกตาม directory ถ้า matches เยอะ (`sg scan --rule <file> <subdir>`)

### 4. Validate Per Batch

> Goal: ทุก batch ผ่านก่อนขยับ

1. `git diff --stat` + review diff ของ batch
2. ทำ `/run-check` — typecheck + lint ต้องผ่าน; run tests ที่เกี่ยวข้อง
3. Fail → `git restore` เฉพาะไฟล์ที่พัง → ปรับ rule → dry-run ใหม่ (max 3 รอบต่อ batch แล้ว stop + report)

### 5. Report

> Goal: audit trail ของ migration ทั้งหมด

1. ทำ `/report` table: `No.`, `Rule`, `Batch`, `Files`, `Changes`, `Status`
2. ระบุ leftovers ที่ตั้งใจ + rules ที่ควร promote/ลบ

## Rules

- Canonical mechanics อยู่ใน `/migration-with-astgrep` — workflow นี้เพิ่มเฉพาะ staging/orchestration ไม่ duplicate
- Dry-run + commit ก่อนทุก batch — ไม่มี bulk apply ทั้ง codebase ในครั้งเดียว
- ห้าม apply กับ generated files หรือ third-party code
- ใช้ `/update-astgrep-rules` ถ้าจำเป็น

## Expected Outcome

- Migration apply ครบทุก patterns เป็น batches ที่ review/revert ได้
- Typecheck/lint/tests ผ่านหลังทุก batch
- Report ชัดเจน: rules, files, changes, leftovers
