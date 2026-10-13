---
name: optimize-llm
description: optimize LLM usage — token cost, model sizing, caching, evals — baseline, fix, re-measure
argument-hint: "[scope]"
related:
  - optimize
  - optimize-cost
  - improve-ai
  - improve-ai-safety
  - deep-review
  - deep-review-then-fix
  - deep-optimize
  - report-before-after
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "LLM usage optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — baseline ก่อนเสมอ, รวม findings จาก `/deep-review` domains `review-ai + review-cost` แล้วแก้และวัดซ้ำ

## Scope

ใช้เมื่อต้องการ optimize LLM/LLM API — thin entry ที่ delegate การ review ไป `/deep-review`; ต้องวัดได้ ห้ามเดา

- `review-ai` — prompt/token efficiency, model sizing, context stuffing, caching (prompt/semantic), streaming
- `review-cost` — per-request cost attribution, spend budget, provider/region pricing
- safety/guardrails → `/improve-ai-safety`; prompt quality/eval design → `/improve-ai`; cloud infra spend ทั่วไป → `/optimize-cost`
- เกณฑ์ mapping เต็ม: `follow-optimize/references/scope-map.md`

## Execute

### 1. Baseline

1. รับ `<scope>` จาก argument หรือ conversation — ไม่ชัด → `/ask-me`
2. เก็บ baseline ก่อนเสมอ — tokens/request, cost/k-request, latency p50/p95, eval pass rate — จาก usage logs หรือ provider dashboard
3. ทำ `/deep-review` domains `review-ai + review-cost` หา optimization findings — oversized prompts, wrong model tier, no caching, unbounded context

### 2. Fix And Re-Measure

1. `/report` prioritized findings — แก้ impact มาก → น้อย ผ่าน `/deep-review-then-fix`; preserve output quality (วัด eval ก่อน/หลังเสมอ)
2. วัดซ้ำหลังทุก fix — quality ตก หรือ cost ไม่ลด → revert; สรุปด้วย `/report-before-after`
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-ai + review-cost`
- มี baseline ก่อนเสมอ — ห้าม optimize แบบตาบอด
- Quality guard — ทุก cost fix ต้อง prove ว่า eval ไม่ถอย
- ทุก fix ต้องมี measurement evidence

## Expected Outcome

- Baseline + prioritized LLM optimization list จาก `/deep-review`
- Fixes ลด token/cost โดย quality ไม่ตก — regressions ถูก revert
- `/report-before-after` ครบ metrics ที่เปลี่ยน
