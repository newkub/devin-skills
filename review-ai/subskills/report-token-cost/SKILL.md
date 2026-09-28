---
name: review-ai-report-token-cost
description: สร้าง token-cost report — per-feature spend, waste, savings ranked
argument-hint: "[feature-or-scope]"
related:
  - review-ai
  - review-cost
  - report
  - create-report-in-dot-devin
---

## Goal

แปลง cost/token findings ของ `/review-ai` เป็น spend report — per-feature token usage + savings เรียงตาม impact

## Scope

- ใช้เมื่อ `/review-ai` dispatch มาที่ `cost`/`tokens`/`report-token-cost` หรือเรียก standalone
- Infra-level cost ทั้งหมด → `/review-cost` (report นี้เฉพาะ LLM token spend)

## Execute

### 1. Collect Usage

> Goal: numbers จริงจาก usage data

ทำตาม `../../references/cost.md`

1. token usage ต่อ feature/endpoint — input/output split, calls/day
2. model mix — cost per call เทียบ capability ที่ใช้จริง
3. ไม่มี usage data → derive จาก code (prompt size × estimated calls) แล้ว tag `estimated`

### 2. Build Cost Table

> Goal: เห็น waste ทันที

1. `No.`, `Feature`, `Model`, `Tokens/Call`, `Calls`, `Cost`, `Waste`, `Severity`
2. `Waste` = prompt bloat, missing caching, oversized context, model แพงเกินงาน
3. savings estimate ต่อ item พร้อม effort

### 3. Summarize

> Goal: verdict + actions

1. total LLM spend + top-3 savings opportunities
2. fix route → parent `## Fix` (cost step); infra cost → `/review-cost` `../report-cost` equivalent
3. ถ้าต้องเก็บถาวร → `/create-report-in-dot-devin`

## Rules

- ทุกตัวเลขมี source — usage data หรือ tag `estimated` พร้อม assumption
- ห้ามเดา spend — ไม่มี data ให้ list instrumentation gap แทน
- artifact อยู่ใน `.devin/` เท่านั้น

## Expected Outcome

- Per-feature token spend table พร้อม waste classification
- Savings ranked by impact + instrumentation gaps flagged
