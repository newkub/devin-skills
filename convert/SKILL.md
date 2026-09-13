---
name: convert
description: แปลง format/structure — esm, files, git submodules, scripts, svg ผ่าน subskills
argument-hint: "[domain]"
related:
  - refactor
  - migration-by-astgrep
  - update-references
  - run-format
  - ask-me
---

## Goal

Dispatch ไป subskill ตาม domain ของ conversion — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: convert-to-esm, convert-files-format, convert-to-git-submodules, convert-to-scripts, convert-to-svg)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `esm` | `subskills/esm/SKILL.md` — CJS → ESM migration |
| `files-format` | `subskills/files-format/SKILL.md` — แปลง file format (json/yaml/toml ฯลฯ) |
| `git-submodules` | `subskills/git-submodules/SKILL.md` — directory → git submodule |
| `scripts` | `subskills/scripts/SKILL.md` — แปลง commands เป็น runnable scripts |
| `svg` | `subskills/svg/SKILL.md` — image → SVG conversion |

1. ระบุ domain จาก argument (เช่น `/convert esm`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- conversion ที่แตะไฟล์ที่มี references → `/update-references` เสมอ

- ใช้ /refactor ถ้าจำเป็น
- ใช้ /migration-by-astgrep ถ้าจำเป็น
- ใช้ /run-format ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง domain แล้วแปลงตาม flow นั้น
