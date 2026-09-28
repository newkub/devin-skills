---
name: git-restore
description: กู้ไฟล์/discard uncommitted changes ด้วย git restore — working tree, staged, หรือจาก commit เดิม
argument-hint: "[files...|--staged|--source <ref>]"
related:
  - restore-files
  - git-revert
  - check-git-logs
  - git-file-history
  - check-uncommit
  - ask-me
  - resolve-errors
---

## Goal

ใช้ `git restore` จัดการ uncommitted state — discard working-tree changes, unstage files หรือกู้ไฟล์จาก commit เดิม — โดยไม่แตะ committed history

## Scope

- discard local modifications (`git restore <path>`)
- unstage files (`git restore --staged`)
- กู้ไฟล์/เวอร์ชันจาก commit เดิม (`git restore --source=<ref>`)
- ไม่ครอบคลุมการย้อน committed changes ที่ push แล้ว → `/git-revert`; กู้ deleted files จาก history ลึก → `/restore-files`

## Execute

### 1. Assess State

> Goal: รู้ว่าอะไรจะเปลี่ยนก่อน discard

1. `git status --short` — แยก staged, unstaged, untracked ออกจากกัน
2. `git diff` (unstaged) / `git diff --cached` (staged) — preview สิ่งที่จะหายไป
3. ถ้าไฟล์ modified มี change ที่อาจต้องการภายหลัง → เสนอ `git stash` แทนการ discard

### 2. Choose Mode

> Goal: เลือก restore mode ที่ตรง intent

| Intent | Command |
|--------|---------|
| discard changes ใน working tree | `git restore <path>` |
| unstage (เก็บ changes ใน working tree) | `git restore --staged <path>` |
| กู้ไฟล์จาก commit อื่น | `git restore --source=<ref> <path>` |
| กู้ไฟล์ที่ถูกลบ (ยังไม่ commit) | `git restore <path>` (กลับจาก HEAD/index) |
| discard ทุกอย่างใน repo | `git restore .` — ต้อง confirm |

### 3. Confirm And Execute

> Goal: destructive action ได้รับ confirm ชัดเจน

1. discard modes (`restore <path>`, `restore .`) = ลบ uncommitted work — แจ้งรายการไฟล์ที่จะหายแล้ว confirm ก่อน
2. unstage mode ปลอดภัย — ทำได้เลยไม่ต้อง confirm
3. `--source` mode overwrite working tree — preview `git diff <ref> -- <path>` ก่อน
4. รัน command แล้ว `git status` verify ผล

### 4. Verify

> Goal: state ตรง intent ไม่มีของหายโดยไม่ตั้งใจ

1. `git status --short` ยืนยันไฟล์กลับสู่ HEAD/index state
2. ถ้า discard ผิดไฟล์ → กู้ผ่าน editor local history หรือ `/restore-files` (git ไม่เก็บ uncommitted changes — ไม่มีทางกู้จาก git)

## Rules

- `git restore <path>` เป็น destructive บน uncommitted changes — preview + confirm เสมอ ไม่มี undo ใน git
- untracked files ไม่ได้รับผลกระทบจาก `git restore` — ลบต้อง `git clean` (skill อื่น, destructive กว่า)
- `--staged` เพียงอย่างเดียว = ปลอดภัย ไม่ต้อง confirm
- อย่าใช้ `git restore` แทน `git revert` — restore ไม่แตะ history, revert สร้าง inverse commit
- สงสัยว่า change สำคัญไหม → `git stash` แทน discard เสมอ
- ใช้ /check-uncommit ถ้าจำเป็น

## Expected Outcome

- Working tree/staging กลับสู่ state ที่ต้องการโดยไม่กระทบ committed history
- ไม่มี uncommitted work หายโดยไม่ได้ confirm
