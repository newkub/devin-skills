---
name: review-ai-check-guardrails
description: Check guardrails + agents — output validation, tool-use limits, abuse surface
argument-hint: "[scope]"
related:
  - review-ai
  - report
---

## Goal

Run the guardrails/agents dimension of `/review-ai` แบบ focused — outputs validated และ agent loops คุมได้

## Scope

- ใช้เมื่อ `/review-ai` dispatch มาที่ `guardrails`/`agents`/`tools` หรือเรียก standalone
- ครอบคลุม: output validation/schema, content safety, tool-use guards, iteration limits, abuse prevention

## Execute

### 1. Guardrails Checks

> Goal: output ผ่าน validation ก่อนใช้

ทำตาม `../../references/guardrails.md`

1. output validation — schema/structured output + fallback เมื่อ parse ไม่ได้
2. content safety — PII leakage, harmful output filters ตาม policy
3. injection defense — tool output/web content ไม่ไหลเข้า instruction channel ดิบๆ

### 2. Agent Checks

> Goal: agent loops มี guards ครบ

ทำตาม `../../references/agents.md`

1. iteration limits — max steps/timeout กัน runaway
2. tool confirmation — destructive/expensive tools ต้อง confirm
3. audit log — tool calls logged พร้อม inputs/outputs

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Guardrail/Agent`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี file path + line
- unbounded agent loop + destructive tool ไม่มี confirm = Critical

## Expected Outcome

- Guardrail findings แยก output/safety/injection
- Agent loop guards coverage status
