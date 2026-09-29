---
name: review-mcp
description: Review MCP servers — tools, schemas, prompts, resources, transports, auth, config, safety
argument-hint: "[scope]"
related:
  - review-api
  - review-security
  - review-config
  - follow-create-mcp
  - deep-review
  - deep-review-then-fix
  - use-subagents
  - report
  - suggest-next-action
---

## Goal

Review MCP (Model Context Protocol) servers ครบทุกมิติ — tool surface design, input schemas, prompts/resources, transports, auth, config hygiene, safety annotations — report-only; domain checklist อยู่ใน `subagents/mcp-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

- ใช้เมื่อ project มี MCP server (custom server หรือ MCP config) — ตรวจและรายงาน ไม่แก้ไข; แก้ findings → `/deep-review-then-fix`
- deep checklists ตาม `subagents/mcp-reviewer/` ด้านล่าง
- ไม่รวม REST API conventions → `/review-api`, config hygiene ทั่วไป → `/review-config`

| Dimension | Checklist |
|-----------|-----------|
| `tool-design` — naming, descriptions, schemas, output, pagination | `subagents/mcp-reviewer/tool-design.md` |
| `prompts-resources` — arguments, URIs, MIME types, templates | `subagents/mcp-reviewer/prompts-resources.md` |
| `transport-auth` — stdio, SSE/HTTP, OAuth, session lifecycle | `subagents/mcp-reviewer/transport-auth.md` |
| `safety` — destructive guards, annotations, secrets, rate limits | `subagents/mcp-reviewer/tool-design.md` + `subagents/mcp-reviewer/transport-auth.md` |
| `config` — server config validity, docs, version pinning | `subagents/mcp-reviewer/transport-auth.md` |

## Execute

### 1. Prepare And Baseline

> Goal: รู้ว่ามี servers/tools/resources/prompts อะไรบ้าง

1. ตรวจ MCP configs (`.devin/`, `mcp.json`, client configs) — installed servers, transports, env
2. list tools/resources/prompts แต่ละ server expose — ตาราง inventory (ใช้เป็น findings-file ให้ subagent cross-check)
3. transports — stdio/SSE/HTTP, host/port, TLS

### 2. Dispatch Mcp-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — `tool-design`, `prompts-resources`, `transport-auth`, `safety`, `config`; ไม่ระบุ → ทุก dimension ที่ apply
2. Spawn `subagents/mcp-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (inventory จาก step 1)
3. scope ใหญ่/หลาย server → spawn หลาย instance ทีละ scope ขนานกัน — dimensions ต่างกันใน scope เดียวรวมเป็น instance เดียว

### 3. Aggregate And Validate

> Goal: findings รวมกันถูกต้อง ไม่มี false positives

1. รวม findings จากทุก instance — dedup ตาม server/tool + issue type
2. จัดลำดับ findings ตาม severity — ระบุ false positives พร้อมเหตุผล
3. ถ้าพบ security issues ลึก → ระบุเป็น info และแนะนำ `/review-security`

### 4. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ server/tool/prompt/resource พร้อม severity + evidence
2. ทำ `/suggest-next-action`

## Severity

- `Critical`: secrets inline ใน config, destructive tools ไม่มี guard, auth bypass
- `High`: schemas ไม่ validate, transport ไม่มี TLS, tool errors เป็น text dumps
- `Medium`: naming inconsistent, no pagination bounds, missing descriptions
- `Low`: no health check, minor ergonomics

### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| Apply MCP findings — tools, schemas, auth, guards (user confirm) | `subskills/improve-mcp/SKILL.md` |

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/mcp-reviewer/` เท่านั้น
- ใช้ /use-subagents ถ้า scope ใหญ่
- ใช้ /review-api สำหรับ API surface conventions
- ใช้ /review-config สำหรับ config/env hygiene deep-dive
- ใช้ /review-security สำหรับ auth/secrets deep-dive
- ใช้ /follow-create-mcp เป็น implementation reference

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. tool naming/descriptions → consistent + documented
2. schemas → types/enums/defaults ครบ + validation
3. transports/auth → TLS, tokens, OAuth lifecycle
4. safety → confirmation guards, least privilege, secrets ย้าย env
5. verify: `list tools` ผ่าน + tool calls จริงทำงาน

## References

- [Tool design checklist](subagents/mcp-reviewer/tool-design.md)
- [Prompts and resources checklist](subagents/mcp-reviewer/prompts-resources.md)
- [Transport and auth checklist](subagents/mcp-reviewer/transport-auth.md)

## Expected Outcome

- MCP surface inventory ครบ — servers/tools/resources/prompts
- design/safety/transport/config findings พร้อม severity + evidence
