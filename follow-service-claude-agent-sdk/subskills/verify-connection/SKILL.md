---
name: follow-service-claude-agent-sdk-verify-connection
description: ยืนยัน Claude Agent SDK ใช้งานได้ — API key valid, minimal query ตอบกลับ
argument-hint: "[model]"
related:
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า Claude Agent SDK เชื่อมต่อ Anthropic API ได้จริง — key valid, model พร้อม, query ตอบกลับ

## Scope

- ใช้เมื่อ `/follow-service-claude-agent-sdk` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่แก้ config

## Execute

### 1. Check API Key

> Goal: `ANTHROPIC_API_KEY` มีและ format ถูก

1. ตรวจ env var มีค่า (ไม่ print ค่า)
2. ตรวจ key ไม่ใช่ placeholder (`sk-ant-...` format)

### 2. Smoke Test Query

> Goal: API ตอบกลับจริง

1. รัน minimal SDK call — เช่น query สั้นๆ หรือ model list ถ้า SDK รองรับ
2. ตรวจ response ไม่ใช่ 401/403 (auth) หรือ 429 (rate limit)
3. บันทึก latency คร่าวๆ เป็น baseline

### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `rate-limited` / `unreachable`

## Rules

- ใช้ minimal query เท่านั้น — ควบคุม token cost
- ไม่ print API key
- auth failure → แนะนำ `/follow-secret-manager` — ไม่แก้เอง

## Expected Outcome

- Verdict connection พร้อม model/latency evidence
