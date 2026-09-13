---
name: restore-files
description: กู้คืน files/state — จาก git log, devin history, dotfiles หรือ deleted files ผ่าน top-level skills
argument-hint: "[domain|verify]"
related:
  - check-git-logs
  - git-file-history
  - ask-me
---

## Goal

Dispatch ไป skill ปลายทาง ตาม restore source — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: restore-deleted-file, restore-from-devin-history, restore-from-git-log, restore-from-my-dotfiles)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Skills

| Domain | Skill |
|---|---|
| `deleted-file` | /restore-files-deleted-file — กู้ไฟล์ที่ถูกลบ |
| `from-devin-history` | /restore-files-from-devin-history — กู้จาก Devin session history |
| `from-git-log` | /restore-files-from-git-log — กู้จาก git log ถอยหลังจนเจอ |
| `from-my-dotfiles` | /restore-files-from-my-dotfiles — กู้ config จาก dotfiles repo |
| `verify` | `subskills/verify-restore/SKILL.md` — ยืนยัน restored files ตรง source (hash/fidelity) |

1. ระบุ domain จาก argument (เช่น `/restore-files-from-git-log`)
2. ถ้า domain รองรับ → ทำตาม `/restore-files-<domain>` ทั้ง flow แล้วทำตาม `subskills/verify-restore/SKILL.md` เพื่อยืนยัน fidelity
3. ถ้า argument เป็น `verify` → ทำตาม `subskills/verify-restore/SKILL.md` อย่างเดียว (standalone re-verify)
4. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ skill ปลายทาง
- restore ที่ overwrite ไฟล์ปัจจุบันต้อง confirm ก่อนเสมอ

- ใช้ /check-git-logs ถ้าจำเป็น
- ใช้ /git-file-history ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป skill ปลายทาง ที่ตรง source แล้วกู้คืนตาม flow นั้น
