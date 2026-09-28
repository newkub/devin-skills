---
name: git-cherry-pick
description: Cherry-pick commits ข้าม branch อย่างถูกต้อง — single, range, merge-safe
argument-hint: "[sha|range]"
related:
  - git-revert
  - git-commit
  - check-git-logs
  - check-merge-conflicts
  - resolve-errors
---

## Goal

นำ commit(s) จาก branch หนึ่งไปยังอีก branch ด้วย `git cherry-pick` — โดยไม่ merge ทั้ง branch

## Scope

- pick commit เดียว, หลาย commits, range
- `-x` record source, `-n`/`--no-commit` batch, merge commit picks (`-m`)
- คู่กับ `/git-revert` — revert = inverse apply, cherry-pick = re-apply

## Execute

### 1. Identify Source

> Goal: หา commits ที่จะ pick ชัดเจน

1. `git log --oneline <source-branch>` หรือ `/check-git-logs` หา sha
2. `git show <sha>` — ยืนยันเนื้อหาและ dependencies (commit อาจพึ่ง commits ก่อนหน้า)
3. ตรวจว่า change นั้นมีอยู่ใน target แล้วหรือยัง (`git cherry <target> <source>` หรือ `git log --grep`)

### 2. Pick

> Goal: apply commits ข้ามมาอย่างถูกลำดับ

```bash
git cherry-pick <sha>                  # เดียว
git cherry-pick -x <sha>               # เดียว + บันทึก "(cherry picked from ...)"
git cherry-pick <oldest>^..<newest>    # range — เก่าไปใหม่เสมอ
git cherry-pick -n <sha1> <sha2>       # batch เป็น commit เดียว (--no-commit)
git cherry-pick -m 1 <merge-sha>       # merge commit — ระบุ mainline
```

1. range ต้องเรียงเก่า→ใหม่ — dependencies ของ commits มัก forward-only
2. commits ที่ต้องติดกันให้ batch ด้วย `-n` แล้ว commit เดียว

### 3. Handle Conflicts

> Goal: conflict resolve ถูก context ของ target branch

1. conflict → แก้ไฟล์, `git add`, `git cherry-pick --continue`
2. ล้มเลิก → `git cherry-pick --abort`
3. conflict แปลว่า branches diverge มาก — พิจารณา port ด้วยมือแทน

### 4. Verify

> Goal: change ทำงานบน target branch

1. `git show HEAD` ตรวจ diff; ทำ `/run-check` — context ต่าง branch อาจทำให้แตก
2. รายงาน: sha เดิม → sha ใหม่ (pick สร้าง commit ใหม่ sha ต่างกันเสมอ)

## Rules

- cherry-pick สร้าง duplicate commits — merge กลับภายหลังอาจ conflict, รับรู้ก่อนใช้
- ใช้ `-x` เมื่อ pick ระหว่าง public branches — traceability สำคัญ
- อย่า pick partial ของ logical change — pick ครบชุดหรือไม่ pick เลย
- ใช้ /resolve-errors ถ้าจำเป็น

## Expected Outcome

- Changes เป้าหมายอยู่บน target branch เป็น commits ใหม่ พร้อม traceability (`-x`)
- ผ่าน `/run-check` บน context ของ branch ปลายทาง
