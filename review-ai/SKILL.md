---
name: review-ai
description: Review AI/LLM usage — prompts, token cost, guardrails, evals, model config, hallucination risks
argument-hint: "[scope]"
related:
  - review-security
  - review-cost
  - review-observability
  - follow-lib-openai
  - deep-review
  - deep-review-then-fix
  - use-subagents
  - report
  - suggest-next-action
---

## Goal

Review AI/LLM integration ของ project — prompt quality, model config, token usage/cost, guardrails, eval coverage, output validation, hallucination/abuse risks — report-only

## Scope

ใช้เมื่อ project มี LLM/AI features (chat, completion, embeddings, agents, RAG) — ตรวจและรายงาน ไม่แก้ไข; แก้ findings → `/deep-review-then-fix`

## Execute

### 1. Inventory AI Usage

> Goal: รู้ว่า AI ถูกใช้ตรงไหนบ้าง

1. grep SDK/API calls (`openai`, `anthropic`, `@ai-sdk`, langchain ฯลฯ) + endpoints ที่เรียก LLM
2. map features ที่พึ่ง AI: chat, summarization, classification, embeddings/RAG, agents
3. model config: model names, versions, temperature/params — hardcoded vs config-driven

### 2. Check Prompts

> Goal: prompts มีคุณภาพและปลอดภัย

1. prompt files/templates — versioning, testability, injection surface
2. system prompts ที่ leak secrets/internal info
3. user input → prompt construction — injection sanitization

### 3. Check Cost And Tokens

> Goal: cost คุมได้และวัดได้

1. token usage tracking/logging — มีหรือไม่
2. context size control — truncation, chunking, summarization ของ context ยาว
3. caching (prompt cache, embedding cache), model routing (cheap model สำหรับงานง่าย)
4. rate limits + retry/backoff handling

### 4. Check Guardrails And Output

> Goal: output ปลอดภัยและใช้งานได้

1. output validation — structured output/schema validation vs raw text trust
2. hallucination mitigations — grounding, citations, confidence checks, human review
3. content filtering/moderation บน user input และ model output
4. PII handling — ห้ามส่ง PII เข้า prompts โดยไม่มี basis

### 5. Check Evals And Observability

> Goal: คุณภาพวัดได้

1. eval suite/golden sets — regression ตอนเปลี่ยน prompt/model
2. LLM observability — traces, latency, error rates per call site
3. fallback behavior — LLM down/timeout → graceful degradation

### 6. Injection And Pii

> Goal: coverage เพิ่มเติมของ domain

1. prompt injection test cases — jailbreak attempts ผ่าน eval suite 2. PII redaction ก่อนส่งเข้า prompts

### 8. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ dimension พร้อม severity + evidence
2. ทำ `/suggest-next-action`

## Rules

- Report only — ห้ามแก้ไขใน skill นี้
- ทุก finding มี evidence (file:line)
- ใช้ /use-subagents ถ้า scope ใหญ่
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /review-security สำหรับ injection/abuse deep-dive
- ใช้ /review-cost สำหรับ token cost analysis
- ใช้ /review-observability สำหรับ LLM tracing
- ใช้ /follow-lib-openai เป็น SDK reference ตอนตรวจ usage

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. prompts → versioned templates + injection sanitization ที่ boundary
2. cost → token tracking, caching, model routing, context truncation
3. output → structured output/schema validation + fallbacks
4. evals → golden set + regression check ใน CI
5. verify: eval suite ผ่าน + cost/usage metrics ปรากฏ

## Expected Outcome

- AI usage inventory ครบทุก call site พร้อม risk map
- prompt/cost/guardrail/eval findings พร้อม severity
- report ส่งมอบพร้อม actionable recommendations
