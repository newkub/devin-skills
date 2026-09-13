---
name: list-devin
description: List Devin resources — global hooks, MCP, skills, subagents, sessions, user requests ผ่าน subskills
argument-hint: "[domain]"
related:
  - update-devin-global-skills
  - follow-devin-global-skills
  - report
  - ask-me
---

## Goal

Dispatch ไป subskill ตาม Devin resource ที่ต้อง list — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: list-devin-global-hooks, list-devin-global-mcp, list-devin-global-skills, list-devin-global-subagents, list-devin-session, list-devin-user-requests)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `global-hooks` | `subskills/global-hooks/SKILL.md` — global hooks config |
| `global-mcp` | `subskills/global-mcp/SKILL.md` — global MCP servers |
| `global-skills` | `subskills/global-skills/SKILL.md` — global skills catalog |
| `global-subagents` | `subskills/global-subagents/SKILL.md` — global subagent profiles |
| `session` | `subskills/session/SKILL.md` — Devin sessions |
| `user-requests` | `subskills/user-requests/SKILL.md` — user request history |

1. ระบุ domain จาก argument (เช่น `/list-devin global-skills`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- output ต้องเป็นตารางผ่าน `/report` ตาม convention ของ subskill

- ใช้ /update-devin-global-skills ถ้าจำเป็น
- ใช้ /follow-devin-global-skills ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง domain แล้ว list ตาม flow นั้น
