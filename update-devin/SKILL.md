---
name: update-devin
description: อัปเดต Devin config — MCP, rules, subagents, hooks ผ่าน top-level skills
argument-hint: "[domain]"
related:
  - update-devin-global-skills
  - list-devin
  - use-subagents
  - update-references
  - deep-validate
  - report
  - ask-me
---

## Goal

Dispatch ไป skill ปลายทาง ตาม Devin config domain — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: update-devin-global-mcp, update-devin-global-rules, update-devin-global-subagents, update-devin-harness, update-devin-project-hooks, update-devin-project-mcp, update-devin-project-rules)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain
- `update-devin-global-skills` ยังเป็น skill แยก (skills catalog lifecycle)

## Execute

### Skills

| Domain | Skill |
|---|---|
| `global-mcp` | /update-devin-global-mcp — global MCP server config |
| `global-rules` | /update-devin-global-rules — global rules (`global_rules.md`) |
| `global-subagents` | /update-devin-global-subagents — global subagent profiles |
| `harness` | /update-devin-harness — agent harness config |
| `project-hooks` | /update-devin-project-hooks — project-level hooks |
| `project-mcp` | /update-devin-project-mcp — project-level MCP config |
| `project-rules` | /update-devin-project-rules — project-level rules |

1. ระบุ domain จาก argument (เช่น `/update-devin-global-rules`)
2. ถ้า domain รองรับ → ทำตาม `/update-devin-<domain>` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ skill ปลายทาง
- หลังแก้ devin config → `/update-references` + verify ไม่มี stale refs

- ใช้ /list-devin ถ้าจำเป็น
- ใช้ /update-devin-global-subagents ถ้าจำเป็น
- ใช้ /use-subagents ถ้าจำเป็น
- ใช้ /deep-validate ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป skill ปลายทาง ที่ตรง domain แล้วอัปเดต config ตาม flow นั้น
