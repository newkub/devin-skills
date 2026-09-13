---
name: update-devin
description: อัปเดต Devin config — global MCP, rules, subagents, harness, project hooks/MCP/rules ผ่าน subskills
argument-hint: "[domain]"
related:
  - update-devin-global-skills
  - list-devin
  - review-devin-global-subagents
  - use-subagents
  - update-references
  - deep-validate
  - report
  - ask-me
---

## Goal

Dispatch ไป subskill ตาม Devin config domain — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: update-devin-global-mcp, update-devin-global-rules, update-devin-global-subagents, update-devin-harness, update-devin-project-hooks, update-devin-project-mcp, update-devin-project-rules)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain
- `update-devin-global-skills` ยังเป็น skill แยก (skills catalog lifecycle)

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `global-mcp` | `subskills/global-mcp/SKILL.md` — global MCP server config |
| `global-rules` | `subskills/global-rules/SKILL.md` — global rules (`global_rules.md`) |
| `global-subagents` | `subskills/global-subagents/SKILL.md` — global subagent profiles |
| `harness` | `subskills/harness/SKILL.md` — agent harness config |
| `project-hooks` | `subskills/project-hooks/SKILL.md` — project-level hooks |
| `project-mcp` | `subskills/project-mcp/SKILL.md` — project-level MCP config |
| `project-rules` | `subskills/project-rules/SKILL.md` — project-level rules |

1. ระบุ domain จาก argument (เช่น `/update-devin global-rules`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- หลังแก้ devin config → `/update-references` + verify ไม่มี stale refs

- ใช้ /list-devin ถ้าจำเป็น
- ใช้ /review-devin-global-subagents ถ้าจำเป็น
- ใช้ /use-subagents ถ้าจำเป็น
- ใช้ /deep-validate ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง domain แล้วอัปเดต config ตาม flow นั้น
