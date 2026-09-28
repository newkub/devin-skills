---
name: review-mcp-improve-mcp
description: Apply MCP findings — tool naming/schemas, transport auth, safety guards
argument-hint: "[server-or-findings]"
related:
  - review-mcp
  - check-secrets
  - run-test
  - report-before-after
---

## Goal

แก้ findings จาก `/review-mcp` จริง — tool surface ชัดเจน ปลอดภัย และ documented

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้
- ครอบคลุม: tool naming/descriptions, input schemas, transport/auth, safety guards, resource/prompt hygiene

## Execute

### 1. Baseline

> Goal: รู้ tool surface ปัจจุบัน

1. list tools/resources/prompts + findings จาก review
2. group: naming/descriptions, schemas, auth/transport, safety
3. ทำตาม `../../references/tool-design.md`, `transport-auth.md`, `prompts-resources.md` ตาม group

### 2. Fix Tool Surface

> Goal: tools ใช้ง่ายและคาดเดาได้

1. naming — consistent verbs/prefixes, no collisions; descriptions บอก what+when+side-effects
2. schemas — types/enums/defaults/required ครบ, input validation ที่ boundary
3. pagination/filtering conventions consistent ข้าม tools

### 3. Fix Safety And Auth

> Goal: least-privilege + guarded

1. auth — TLS บน transports, token/OAuth lifecycle ถูก, secrets ย้าย env (`/check-secrets`)
2. guards — destructive/expensive tools ต้อง explicit confirmation flag
3. rate limits / input size caps บน tools ที่รับ untrusted input

### 4. Verify

> Goal: server ทำงานจริง

1. `list tools`/equivalent ผ่าน — schemas parse ครบ
2. tool calls จริงทำงาน (happy + error paths)
3. `/run-test` + `/report-before-after` — findings หายครบ

## Rules

- breaking changes บน tool names/schemas → documented migration note สำหรับ consumers
- preserve behavior — guard เพิ่มได้แต่ห้ามเปลี่ยน tool semantics โดยไม่จำเป็น
- secrets ห้ามอยู่ใน code/config — rotate ถ้าเคย commit
- แยก commit: surface → schemas → auth/safety

## Expected Outcome

- Tool surface consistent + validated + documented
- Safety guards + auth posture ครบพร้อม evidence
