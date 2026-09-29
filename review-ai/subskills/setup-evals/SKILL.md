---
name: review-ai-setup-evals
description: Setup eval suite จากศูนย์ — golden set, scorer, regression gate ใน CI
argument-hint: "[feature-or-model]"
related:
  - review-ai
  - run-test
  - report-before-after
  - ask-me
---

## Goal

สร้าง eval infrastructure จากศูนย์ตาม findings ของ `/review-ai` — เมื่อไม่มีวิธีวัด output quality เลย

## Scope

- ใช้เมื่อ findings คือ "ไม่มี evals" — improve evals ที่มีอยู่ทำใน parent `## Fix`
- ครอบคลุม: golden dataset, scoring method, eval runner, CI regression gate

## Execute

### 1. Define Golden Set

> Goal: cases ที่ representative + versioned

ทำตาม `../../subagents/ai-reviewer/evals.md`

1. เลือก cases จาก real usage + edge cases ที่ findings ชี้ — 20-50 cases เริ่มต้น
2. expected output ต่อ case: exact match / rubric / properties
3. dataset versioned ใน repo — ไม่ใช่ ephemeral

### 2. Build Eval Runner

> Goal: eval รันซ้ำได้ deterministic เท่าที่ LLM จะทำได้

1. scorer — exact match / structured-diff / LLM-judge (judge มี rubric ชัด + spot-check)
2. runner — run all cases, เก็บ per-case score + pass rate; seed/temperature คุมได้
3. threshold — pass rate gate ที่สมเหตุสมผล (ไม่ใช่ 100%)

### 3. Wire CI Gate

> Goal: prompt/model change regress ไม่ได้เงียบๆ

1. eval run บน PR ที่แตะ prompts/retrieval/model config
2. regression → fail พร้อม diff report; flaky eval → quarantine แยกจาก code failures
3. verify: eval suite รันจริงผ่าน + `/report-before-after` baseline recorded

## Rules

- golden set ต้องมี real cases — synthetic-only = false confidence
- LLM-judge ต้องมี human spot-check sample — judge drift เป็น blind spot
- eval thresholds เป็น ratchet — ห้ามลดเพื่อให้ผ่าน
- user confirm ก่อน wiring เป็น required check (อาจ block PRs)

## Expected Outcome

- Golden set + scorer + runner ทำงานจริง
- CI gate ป้องกัน prompt/model regression
