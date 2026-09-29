---
name: review-cost
description: "ตรวจสอบ infrastructure cost: compute, storage, bandwidth, third-party, idle resources"
argument-hint: "[service-or-resource]"
related:
  - report
  - review-performance
  - run-review
  - use-subagents

---

## Goal

ตรวจสอบ infrastructure cost: compute, storage, bandwidth, third-party services และ idle resources โดยไม่แก้ไข resources — ส่งต่อ fix ไปยัง section `## Fix` เมื่อ user confirm — domain checklist อยู่ใน `subagents/cost-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

ใช้กับ cloud deployment: Cloudflare Workers, AWS, Vercel, fly.io โดย audit usage โดยไม่แก้ไข resources

| Dimension | Checklist |
|-----------|-----------|
| `overview` — full-dimension cost checklist | `subagents/cost-reviewer/checklist.md` |
| `finops` — attribution, anomaly, commitment, egress, tagging | `subagents/cost-reviewer/finops.md` |
| `deep-analysis` — cost model, unit economics, projection | `subagents/cost-reviewer/deep-cost-analysis.md` |

- ถ้าต้อง deep cost model, unit economics และ projection ที่ scale สูง ดู `subagents/cost-reviewer/deep-cost-analysis.md`

สำหรับ dedicated fix pass อยู่ที่ `/deep-review-then-fix`

## Execute

### 1. Prepare And Audit

> Goal: รู้ cost drivers และเก็บ baseline

1. ตรวจ billing dashboard และ invoices
2. ระบุ top cost drivers ตาม service
3. ตรวจ logs/metrics usage — เก็บ baseline (ใช้เป็น findings-file ให้ subagent cross-check)

### 2. Dispatch Cost-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → ทุก dimension ที่ apply
2. Spawn `subagents/cost-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1) — ครอบคลุม compute (cold starts, idle, concurrency, edge vs origin), storage/bandwidth (unused DBs/buckets, lifecycle, CDN hit ratio), third-party (per-request APIs, underused services, duplicates, LLM token spend), finops (attribution, anomaly, commitment pricing, egress, tagging)
3. scope ใหญ่/หลาย service → spawn หลาย instance ทีละ scope ขนานกัน

### 3. Aggregate And Score

> Goal: รวม findings พร้อม severity

1. รวม findings จากทุก instance — dedup ตาม resource/service + issue type
2. ทุก finding ต้องมี billing amount, usage metric หรือ resource id
3. จัดลำดับ severity พร้อม savings direction

### 4. Rate And Report

> Goal: สรุป findings พร้อม fix direction

1. ทำ `/report` ด้วย columns: No., Service, Cost, Waste, Severity, Fix
2. ชี้ไป section `## Fix` เมื่อ user confirm ให้แก้

### Subskills

> Goal: dispatch งานเฉพาะรูปแบบ — report subskill format findings, optimize subskill fix เมื่อ user confirm

| Topic | Target |
|-------|----------|
| `report`, `cost` — per-service breakdown + savings ranked | `subskills/report-cost/SKILL.md` |
| Apply cost findings — compute, storage, bandwidth, third-party, LLM token spend reductions | `subskills/optimize-cost/SKILL.md` |

### Subagents

> Goal: dispatch domain review ไปยัง subagent

| Topic | Subagent |
|-------|----------|
| cost dimensions — compute, storage, bandwidth, third-party, finops พร้อม severity | `subagents/cost-reviewer/AGENT.md` |

## Rules

### 1. Read Only

- ห้ามลบ resources หรือเปลี่ยน plan ระหว่าง review
- ใช้ billing data และ observability เท่านั้น

### 2. Evidence Required

- ทุก finding ต้องมี billing amount, usage metric หรือ resource id
- ไม่แนะนำ cost cut โดยไม่มี risk assessment
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/cost-reviewer/` เท่านั้น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Routes

1. findings ทั้งหมด (infra: compute, storage, bandwidth, third-party, CI spend + LLM token usage: prompt bloat, caching, model tier) → `subskills/optimize-cost/SKILL.md`
2. verify: re-audit scope เดิมหลังแก้ — findings เดิมต้องไม่เหลือ

## References

- [Full-dimension checklist](subagents/cost-reviewer/checklist.md)
- [FinOps](subagents/cost-reviewer/finops.md)
- [Deep cost analysis](subagents/cost-reviewer/deep-cost-analysis.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /review-performance ถ้าจำเป็น

## Expected Outcome

- รายงาน findings ครอบคลุม compute, storage, bandwidth, third-party
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`
