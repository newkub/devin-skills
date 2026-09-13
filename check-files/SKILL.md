---
name: check-files
description: ตรวจ file hygiene — encoding, locks, length, paths, permissions และ structure ผ่าน subskills
argument-hint: "[domain]"
related:
  - check-repo-hygiene
  - check-system-env
  - report
  - ask-me
---

## Goal

Dispatch ไป subskill ตาม domain ของ file hygiene check — parent ทำ routing เท่านั้น ไม่ duplicate logic ของ subskill

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: check-file-encoding, check-file-locks, check-long-files, check-path-length, check-file-permissions, check-file-structure)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `encoding` | `subskills/encoding/SKILL.md` — file encodings, BOM, mixed line endings |
| `locks` | `subskills/locks/SKILL.md` — lockfile consistency ทุก package manager |
| `long-files` | `subskills/long-files/SKILL.md` — ไฟล์เกิน line limit |
| `path-length` | `subskills/path-length/SKILL.md` — path ยาวเกิน OS limit |
| `permissions` | `subskills/permissions/SKILL.md` — file permissions/exec bits |
| `structure` | `subskills/structure/SKILL.md` — file/folder structure และ naming |

1. ระบุ domain จาก argument (เช่น `/check-files encoding`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- ทุก reference path ต้องอยู่ใต้ `subskills/<domain>/`

- ใช้ /check-repo-hygiene ถ้าจำเป็น
- ใช้ /check-system-env ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง domain แล้วทำ file check ตาม flow นั้น
