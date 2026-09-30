---
name: restore-files
description: กู้คืน files/state — จาก git log, devin history, dotfiles หรือ deleted files ผ่าน top-level skills
argument-hint: "[domain|verify]"
related:
  - check-git-logs
  - git-file-history
  - git-restore
  - git-revert
  - ask-me

---

## Goal

Dispatch ไป skill ปลายทาง ตาม restore source — parent ทำ routing เท่านั้น

## Scope

- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Skills

| Domain | Skill |
|---|---|
| `uncommitted`, `working-tree`, `discard` | /git-restore — discard changes/unstage/กู้จาก HEAD ผ่าน `git restore` |
| `revert-commit` | /git-revert — ย้อน committed change ด้วย inverse commit |
| `deleted-file` | /restore-files-deleted-file — กู้ไฟล์ที่ถูกลบ |
| `from-devin-history` | /restore-files-from-devin-history — กู้จาก Devin session history |
| `from-git-log` | /restore-files-from-git-log — กู้จาก git log ถอยหลังจนเจอ |
| `from-my-dotfiles` | /restore-files-from-my-dotfiles — กู้ config จาก dotfiles repo |
| `verify` | `workflows/verify-restore/SKILL.md` — ยืนยัน restored files ตรง source (hash/fidelity) |

1. ระบุ domain จาก argument (เช่น `/restore-files-from-git-log`)
2. ถ้า domain รองรับ → ทำตาม `/restore-files-<domain>` ทั้ง flow แล้วทำตาม `workflows/verify-restore/SKILL.md` เพื่อยืนยัน fidelity
3. ถ้า argument เป็น `verify` → ทำตาม `workflows/verify-restore/SKILL.md` อย่างเดียว (standalone re-verify)
4. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ skill ปลายทาง
- restore ที่ overwrite ไฟล์ปัจจุบันต้อง confirm ก่อนเสมอ

- ใช้ /check-git-logs ถ้าจำเป็น
- ใช้ /git-file-history ถ้าจำเป็น

## Merged Details

### verify-restore

##### Goal

ยืนยันหลัง restore ว่าไฟล์กลับมาครบและตรงกับ source จริง — fidelity check ที่ restore skills ทุกตัวควรเรียกต่อท้าย

##### Scope

- ใช้เมื่อ `/restore-files` dispatch มาที่ `verify` หรือเรียกหลัง restore เสร็จ
- ครอบคลุม: file presence, content fidelity (hash), expected paths, partial restore detection
- Read-only: ตรวจสอบ — ไม่ re-restore

##### Execute

###### 1. Check Presence

> Goal: ทุกไฟล์ที่ควร restore อยู่ครบ

1. เทียบรายการไฟล์ที่ restore กับ expected list (จาก restore output หรือ source manifest)
2. flag ไฟล์ที่ขาดหรือถูก restore ไปผิด path

###### 2. Check Fidelity

> Goal: content ตรงกับ source

1. ถ้า restore จาก git → เทียบ `git hash-object <file>` กับ blob ใน commit ต้นทาง
2. ถ้า restore จาก copy/backup → เทียบ `Get-FileHash` SHA256 กับ source
3. ถ้า restore จาก Devin history → เทียบ content กับ recorded snapshot
4. flag ไฟล์ที่ hash ไม่ตรง — partial write หรือ encoding drift

###### 3. Check Consistency

> Goal: restored files ทำงานร่วมกับ repo ได้

1. ถ้า restore เป็น code → `bun run typecheck` หรือ build best-effort
2. ตรวจ imports/references ที่ไฟล์ใหม่อ้างถึงยังมีอยู่
3. flag restored file ที่อ้างถึง paths/deps ที่ไม่มีแล้ว

###### 4. Report

> Goal: สรุป restore fidelity

1. ใช้ `/report` คอลัมน์: `No.`, `Path`, `Status`, `Expected`, `Actual`, `Notes`
2. Verdict: `faithful` / `partial` / `mismatched` พร้อมรายการที่ต้อง re-restore

##### Rules

- hash mismatch = รายงานทันที — ห้ามถือว่า restore สำเร็จ
- ถ้า source ไม่มีให้เทียบ (เช่น deleted file ไม่มีต้นฉบับเหลือ) → ระบุ verification method ที่ใช้แทน (e.g. git show)
- ไม่แก้ไฟล์ที่ restore มา — ถ้าต้องแก้ report กลับให้ restore ใหม่

##### Expected Outcome

- ตาราง fidelity ต่อไฟล์พร้อม verdict
- รายการไฟล์ที่ต้อง re-restore ถ้า partial

## Expected Outcome

- caller ถูก dispatch ไป skill ปลายทาง ที่ตรง source แล้วกู้คืนตาม flow นั้น
