---
name: improve-ai-safety
description: หา AI safety improvements — prompt injection, jailbreak, guardrails, output filtering — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-ai
  - improve-security
  - optimize-llm
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "AI safety improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-ai` (safety scope) + `review-security` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "AI/LLM safety ควร improve อะไร" — thin entry ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-ai` (safety scope) — prompt injection จาก user/tool output, jailbreak, red-team cases, output filtering, PII leakage ผ่าน LLM
- `review-security` — trust boundary ของ AI input (indirect injection), secrets ใน prompts, tool/MCP invocation abuse
- prompt quality/evals/token cost → `/improve-ai` / `/optimize-llm`; security ทั่วไปที่ไม่ใช่ AI path → `/improve-security`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domains `review-ai` + `review-security` (AI safety scope) — unvetted prompt assembly, missing output validation, tool access ที่ model ควบคุมได้เกินจำเป็น
3. รวบรวม prioritized list พร้อม severity และ evidence — injection ที่ reach production data เป็น P0

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง)
2. ทุก guardrail fix ต้องมี attack-case test (injection payload จริง) — ห้ามแก้แบบ heuristic อย่างเดียว
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- Treat ทุก LLM input เป็น untrusted — ห้ามต่อตรงเข้า tool/system prompt โดยไม่วet
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized AI safety improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม attack-case tests
