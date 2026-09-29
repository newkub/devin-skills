---
name: review-ai
description: Review AI/LLM usage — prompts, RAG, agents, guardrails, evals, token cost, hallucination risks
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

Review AI/LLM integration ของ project ครบทุกมิติ — prompt quality, model config, RAG/retrieval, agent/tool loops, streaming UX, guardrails, eval coverage, token cost, hallucination/abuse risks — report-only

## Scope

- ใช้เมื่อ project มี LLM/AI features: chat, completion, summarization, classification, embeddings/RAG, agents, tool-use
- ตรวจและรายงาน ไม่แก้ไข; แก้ findings → `/deep-review-then-fix`
- deep checklists ตาม `subagents/ai-reviewer/` ด้านล่าง
- ไม่รวม general code quality → `/review-code-quality`, infra cost รวม → `/review-cost`

## Execute

### 1. Inventory AI Usage

> Goal: รู้ว่า AI ถูกใช้ตรงไหนบ้างและทำหน้าที่อะไร

1. grep SDK/API calls — `openai`, `anthropic`, `@ai-sdk`, `langchain`, `@google/genai`, fetch ไป `/v1/chat|/v1/messages|/v1/embeddings`
2. map features → AI call sites: chat, summarization, classification, embeddings/RAG, agents, image/audio
3. model config — model names, versions (pinned vs floating), temperature/top_p/max_tokens, provider endpoints — hardcoded vs config-driven
4. fallback/routing — multi-provider, model routing per task, local/edge fallback

### 2. Check Prompts

> Goal: prompts มีคุณภาพ ทดสอบได้ และปลอดภัย — ทำตาม `subagents/ai-reviewer/prompts.md`

1. prompt files/templates — versioning, centralized location, testability, diff-able
2. system prompts — ไม่ leak secrets/internal info, role/boundary ชัด, output contract ระบุ
3. user input → prompt construction — injection sanitization, delimiters, input length caps
4. few-shot examples — ตรง output contract จริง, ไม่ stale

### 3. Check RAG And Retrieval

> Goal: retrieval มีคุณภาพวัดได้และ grounding จริง — ทำตาม `subagents/ai-reviewer/rag.md`

1. chunking strategy — size, overlap, semantic boundaries, metadata
2. embedding model — pinned, dimension ตรง index, re-embed path ตอนเปลี่ยน model
3. retrieval quality — top-k, score threshold, dedup, rerank, citation mapping
4. context assembly — token budget, ordering, ไม่ยัดเกิน context window

### 4. Check Agents And Tool Use

> Goal: agent loops คุมได้ ไม่วนไม่จบ — ทำตาม `subagents/ai-reviewer/agents.md`

1. tool schemas — names/descriptions/params ชัด, validation ที่ boundary
2. loop control — max iterations, max tokens per turn, stop conditions, timeout
3. side-effect tools — confirmation/dry-run, least privilege, audit log
4. memory/state — session scope, ไม่ leak ข้าม users, summarization ของ history

### 5. Check Guardrails And Output

> Goal: output ปลอดภัยและใช้งานได้ — ทำตาม `subagents/ai-reviewer/guardrails.md`

1. output validation — structured output/JSON schema vs raw text trust
2. hallucination mitigations — grounding, citations, confidence checks, human review path
3. content filtering/moderation บน user input และ model output
4. PII handling — ห้ามส่ง PII เข้า prompts โดยไม่มี basis, redaction ที่ boundary
5. streaming — token streaming UX, abort/cancel, error mid-stream recovery

### 6. Check Cost And Tokens

> Goal: cost คุมได้และวัดได้ — ทำตาม `subagents/ai-reviewer/cost.md`

1. token usage tracking/logging — in/out tokens ต่อ call site, per-user/tenant
2. context size control — truncation, chunking, summarization ของ context ยาว
3. caching — prompt cache, embedding cache, response cache
4. rate limits + retry/backoff, budget alerts, per-feature cost attribution

### 7. Check Evals And Observability

> Goal: คุณภาพวัดได้ regression จับได้ — ทำตาม `subagents/ai-reviewer/evals.md`

1. eval suite/golden sets — regression ตอนเปลี่ยน prompt/model, CI gate
2. LLM observability — traces, latency, error rates, finish reasons per call site
3. fallback behavior — LLM down/timeout → graceful degradation, user-facing message
4. feedback loop — user ratings/corrections เก็บกลับมาเป็น eval data

### 8. Injection And Abuse

> Goal: adversarial surface ถูกตรวจจริง

1. prompt injection test cases — jailbreak, indirect injection ผ่าน retrieved content, eval suite มี red-team cases
2. tool abuse — agent ถูกหลอกให้เรียก destructive tools หรือไม่
3. PII redaction ก่อนส่งเข้า prompts/telemetry

### 9. Report

> Goal: ส่งมอบ findings

1. ทำ `/report` — findings ต่อ dimension พร้อม severity + evidence (file:line)
2. ทำ `/suggest-next-action`

## Severity

- `Critical`: PII/secrets เข้า prompts, injection path ที่รัน destructive tools ได้, ไม่มี output validation บน production path
- `High`: ไม่มี evals เลย ขณะมี prompt เปลี่ยนบ่อย, ไม่มี cost tracking, agent loop ไม่มี stop condition
- `Medium`: prompts ไม่ versioned, RAG ไม่มี threshold/rerank, ไม่มี streaming error recovery
- `Low`: model ไม่ pin version, missing few-shot updates, cache ยังไม่มีแต่ volume ต่ำ


### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `prompts`, `prompt` — injection surface + contracts | `subskills/check-prompts/SKILL.md` |
| `rag`, `retrieval` — chunking, thresholds, freshness | `subskills/check-rag/SKILL.md` |
| `guardrails`, `agents`, `tools` — output validation + loop guards | `subskills/check-guardrails/SKILL.md` |
| `cost`, `tokens`, `report-token-cost` — per-feature spend | `subskills/report-token-cost/SKILL.md` |
| Setup eval suite from zero — golden set + CI gate (user confirm) | `subskills/setup-evals/SKILL.md` |

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

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. prompts → versioned templates + injection sanitization ที่ boundary
2. RAG → score threshold, rerank, metadata filtering, re-embed path
3. agents → max-iteration/timeout guards, tool confirmation, audit log
4. cost → token tracking, caching, model routing, context truncation
5. output → structured output/schema validation + fallbacks
6. evals → golden set + regression check ใน CI
7. verify: eval suite ผ่าน + cost/usage metrics ปรากฏ

## References

- [Prompt checklist](subagents/ai-reviewer/prompts.md)
- [RAG checklist](subagents/ai-reviewer/rag.md)
- [Agents and tool-use checklist](subagents/ai-reviewer/agents.md)
- [Guardrails checklist](subagents/ai-reviewer/guardrails.md)
- [Cost checklist](subagents/ai-reviewer/cost.md)
- [Evals checklist](subagents/ai-reviewer/evals.md)

## Expected Outcome

- AI usage inventory ครบทุก call site พร้อม risk map
- prompt/RAG/agent/cost/guardrail/eval findings พร้อม severity
- report ส่งมอบพร้อม actionable recommendations
