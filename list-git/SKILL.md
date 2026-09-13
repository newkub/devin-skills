---
name: list-git
description: List git resources — branches, commits, releases, submodules, tags, worktrees ผ่าน subskills
argument-hint: "[domain]"
related:
  - follow-tool-git
  - report
  - ask-me
---

## Goal

Dispatch ไป subskill ตาม git resource ที่ต้อง list — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: list-git-branch, list-git-commit, list-git-release, list-git-submodules, list-git-tags, list-git-worktree)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `branch` | `subskills/branch/SKILL.md` — branches + merge status |
| `commit` | `subskills/commit/SKILL.md` — commit history |
| `release` | `subskills/release/SKILL.md` — releases |
| `submodules` | `subskills/submodules/SKILL.md` — submodule status |
| `tags` | `subskills/tags/SKILL.md` — tags |
| `worktree` | `subskills/worktree/SKILL.md` — worktrees |

1. ระบุ domain จาก argument (เช่น `/list-git branch`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill

- ใช้ /follow-tool-git ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง domain แล้ว list ตาม flow นั้น
