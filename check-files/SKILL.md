---
name: check-files
description: ตรวจ file hygiene — encoding, locks, length, paths, permissions และ structure ผ่าน workflows
argument-hint: "[domain]"
related:
  - check-system-env
  - report
  - ask-me

---

## Goal

Dispatch ไป workflow ตาม domain ของ file hygiene check — parent ทำ routing เท่านั้น ไม่ duplicate logic ของ workflow

## Scope

- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Workflows

| Domain | Workflow |
|---|---|
| `encoding` | `workflows/encoding/SKILL.md` — file encodings, BOM, mixed line endings |
| `locks` | `workflows/locks/SKILL.md` — lockfile consistency ทุก package manager |
| `long-files` | `workflows/long-files/SKILL.md` — ไฟล์เกิน line limit |
| `path-length` | `workflows/path-length/SKILL.md` — path ยาวเกิน OS limit |
| `permissions` | `workflows/permissions/SKILL.md` — file permissions/exec bits |
| `structure` | `workflows/structure/SKILL.md` — file/folder structure และ naming |

1. ระบุ domain จาก argument (เช่น `/check-files encoding`)
2. ถ้า domain รองรับ → ทำตาม `workflows/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ workflow
- ทุก reference path ต้องอยู่ใต้ `workflows/<domain>/`

- ใช้ /deep-review ถ้าจำเป็น (repo essentials audit)
- ใช้ /check-system-env ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป workflow ที่ตรง domain แล้วทำ file check ตาม flow นั้น
