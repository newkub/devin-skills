---
name: cleanup
description: ล้าง resources ที่ไม่ใช้ — branches, worktrees, docker, github issues ผ่าน subskills
argument-hint: "[domain]"
related:
  - cleanup-files-in-project
  - cleanup-files-in-computer
  - run-cleanup
  - ask-me
---

## Goal

Dispatch ไป subskill ตาม domain ของ cleanup — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: cleanup-branches-merged, cleanup-docker, cleanup-git-branch, cleanup-github-issue, cleanup-worktree)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `branches-merged` | `subskills/branches-merged/SKILL.md` — local branches ที่ merge แล้ว |
| `docker` | `subskills/docker/SKILL.md` — images, containers, volumes ที่ไม่ใช้ |
| `git-branch` | `subskills/git-branch/SKILL.md` — stale/orphan branches |
| `github-issue` | `subskills/github-issue/SKILL.md` — issues ที่เก่าหรือ resolve แล้ว |
| `worktree` | `subskills/worktree/SKILL.md` — git worktrees ที่ไม่ใช้ |

1. ระบุ domain จาก argument (เช่น `/cleanup worktree`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- ทุก cleanup ต้อง dry run + user confirm ก่อนลบจริง (ตาม rule ของ subskill)

- ใช้ /cleanup-files-in-project ถ้าจำเป็น
- ใช้ /cleanup-files-in-computer ถ้าจำเป็น
- ใช้ /run-cleanup ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง domain แล้ว cleanup ตาม flow นั้น
