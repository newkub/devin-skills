---
name: restore-files
description: กู้คืน files/state — จาก git log, devin history, dotfiles หรือ deleted files ผ่าน subskills
argument-hint: "[domain]"
related:
  - check-git-logs
  - git-file-history
  - ask-me
---

## Goal

Dispatch ไป subskill ตาม restore source — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: restore-deleted-file, restore-from-devin-history, restore-from-git-log, restore-from-my-dotfiles)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `deleted-file` | `subskills/deleted-file/SKILL.md` — กู้ไฟล์ที่ถูกลบ |
| `from-devin-history` | `subskills/from-devin-history/SKILL.md` — กู้จาก Devin session history |
| `from-git-log` | `subskills/from-git-log/SKILL.md` — กู้จาก git log ถอยหลังจนเจอ |
| `from-my-dotfiles` | `subskills/from-my-dotfiles/SKILL.md` — กู้ config จาก dotfiles repo |

1. ระบุ domain จาก argument (เช่น `/restore-files from-git-log`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- restore ที่ overwrite ไฟล์ปัจจุบันต้อง confirm ก่อนเสมอ

- ใช้ /check-git-logs ถ้าจำเป็น
- ใช้ /git-file-history ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง source แล้วกู้คืนตาม flow นั้น
