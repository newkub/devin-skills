---
name: deep-review-mcp
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

Review MCP (Model Context Protocol) servers ครบทุกมิติ — tool surface design, input schemas, prompts/resources, transports, auth, config hygiene, safety annotations — report-only

## Scope

- ใช้เมื่อ project มี MCP server (custom server หรือ MCP config) — ตรวจและรายงาน ไม่แก้ไข; แก้ findings → `/deep-review-then-fix`
- deep checklists ตาม `references/` ด้านล่าง
- ไม่รวม REST API conventions → `/review-api`, config hygiene ทั่วไป → `/review-config`

## Execute

### 1. Inventory MCP Surface

> Goal: รู้ว่ามี servers/tools/resources/prompts อะไรบ้าง

1. ตรวจ MCP configs (`.devin/`, `mcp.json`, client configs) — installed servers, transports, env
2. list tools/resources/prompts แต่ละ server expose — ตาราง inventory
3. transports — stdio/SSE/HTTP, host/port, TLS

### 2. Check Tool Design

> Goal: tool surface ใช้งานได้และชัดเจน — ทำตาม `references/tool-design.md`

1. naming: `verb-noun` consistent, ไม่ชนกัน, scope ชัด
2. descriptions: action + params + return ชัดเจน, ไม่มี vague docs
3. input schemas: types ถูก, required/optional สมเหตุ, enums/defaults ครบ, `additionalProperties` ไม่ leak
4. output format: structured, errors เป็น tool errors ไม่ใช่ text dumps
5. pagination — `cursor`/`nextCursor` contract, result size bounds

### 3. Check Prompts And Resources

> Goal: prompts/resources มีคุณภาพเท่า tools — ทำตาม `references/prompts-resources.md`

1. prompts — arguments schema ครบ, descriptions ชัด, ไม่มี injection surface
2. resources — URI scheme ชัด, MIME types ถูก, subscription/listChanged semantics
3. resource templates — `uriTemplate` valid, params typed

### 4. Check Transports And Auth

> Goal: connection ปลอดภัยและใช้ได้จริง — ทำตาม `references/transport-auth.md`

1. stdio — process spawn ถูก, env pass ปลอดภัย, cleanup on exit
2. SSE/HTTP — TLS, auth header/token, CORS, origin validation
3. OAuth — client registration, scopes, token refresh, revocation path
4. session lifecycle — init handshake, keep-alive, reconnect

### 5. Check Safety And Permissions

> Goal: ไม่มี destructive/secret surface ที่ไม่ปลอดภัย

1. destructive tools → confirmation/dry-run guard, annotations (`readOnlyHint`, `destructiveHint`)
2. secrets/credentials ใน config → env refs เท่านั้น ห้าม inline
3. scope/permissions — least privilege ต่อ tool
4. unsafe input → validation ที่ boundary ก่อน execute
5. rate limits — per-tool throttling, abuse prevention

### 6. Check Config And Docs

> Goal: install/ใช้งานได้จริง

1. server config valid — command/args/env ตรง runtime จริง
2. docs: setup instructions, examples, version pinning, changelog
3. health/liveness — tools list ได้, errors สื่อสารชัด
4. version pinning — server version ตรง lockfile/semver

### 7. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ server/tool/prompt/resource พร้อม severity + evidence
2. ทำ `/suggest-next-action`

## Severity

- `Critical`: secrets inline ใน config, destructive tools ไม่มี guard, auth bypass
- `High`: schemas ไม่ validate, transport ไม่มี TLS, tool errors เป็น text dumps
- `Medium`: naming inconsistent, no pagination bounds, missing descriptions
- `Low`: no health check, minor ergonomics

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence
- ใช้ /use-subagents ถ้า scope ใหญ่
- ใช้ /review-api สำหรับ API surface conventions
- ใช้ /review-config สำหรับ config/env hygiene deep-dive
- ใช้ /review-security สำหรับ auth/secrets deep-dive
- ใช้ /follow-create-mcp เป็น implementation reference

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. tool naming/descriptions → consistent + documented
2. schemas → types/enums/defaults ครบ + validation
3. transports/auth → TLS, tokens, OAuth lifecycle
4. safety → confirmation guards, least privilege, secrets ย้าย env
5. verify: `list tools` ผ่าน + tool calls จริงทำงาน

## References

- [Tool design checklist](references/tool-design.md)
- [Prompts and resources checklist](references/prompts-resources.md)
- [Transport and auth checklist](references/transport-auth.md)

## Expected Outcome

- MCP surface inventory ครบ — servers/tools/resources/prompts
- design/safety/transport/config findings พร้อม severity + evidence
