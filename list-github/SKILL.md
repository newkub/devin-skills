---
name: list-github
description: List GitHub resources — branches, issues, PRs, projects, releases, repos, stars ผ่าน subskills
argument-hint: "[domain]"
related:
  - all-github-repo
  - use-gh-cli
  - report
  - ask-me
---

## Goal

Dispatch ไป subskill ตาม GitHub resource ที่ต้อง list — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: list-github-branch, list-github-issue, list-github-pr, list-github-project, list-github-release, list-github-repo, list-github-star)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `branch` | `subskills/branch/SKILL.md` — branches ใน repo |
| `issue` | `subskills/issue/SKILL.md` — issues พร้อม filter |
| `pr` | `subskills/pr/SKILL.md` — pull requests พร้อม status |
| `project` | `subskills/project/SKILL.md` — GitHub projects |
| `release` | `subskills/release/SKILL.md` — releases |
| `repo` | `subskills/repo/SKILL.md` — repositories |
| `star` | `subskills/star/SKILL.md` — starred repos |

1. ระบุ domain จาก argument (เช่น `/list-github pr`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- ใช้ `gh` CLI หรือ GitHub MCP tools ตามที่ available

- ใช้ /all-github-repo ถ้าจำเป็น
- ใช้ /use-gh-cli ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง domain แล้ว list ตาม flow นั้น
