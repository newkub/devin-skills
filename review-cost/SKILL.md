---
name: review-cost
description: "ตรวจสอบ infrastructure cost: compute, storage, bandwidth, third-party, idle resources"
argument-hint: "[service-or-resource]"
related:
  - report
  - review-performance
  - run-review

---

## Goal

ตรวจสอบ infrastructure cost: compute, storage, bandwidth, third-party services และ idle resources โดยไม่แก้ไข resources — ส่งต่อ fix ไปยัง section `## Fix` เมื่อ user confirm

## Scope

ใช้กับ cloud deployment: Cloudflare Workers, AWS, Vercel, fly.io โดย audit usage โดยไม่แก้ไข resources

- ถ้าต้อง deep cost model, unit economics และ projection ที่ scale สูง ดู `references/deep-cost-analysis.md`

สำหรับ dedicated fix pass อยู่ที่ `/deep-review-then-fix`

## Execute

### 1. Audit Costs

> Goal: รู้ cost drivers

1. ตรวจ billing dashboard และ invoices
2. ระบุ top cost drivers ตาม service
3. ตรวจ logs/metrics usage
4. ตรวจ storage ทีไม่จำเป็น

### 2. Review Compute And Concurrency

> Goal: ตรวจ compute efficiency

1. ตรวจ cold starts, idle instances
2. ตรวจ concurrency limits ทีเกินความจำเป็น
3. ตรวจ edge vs origin compute split

### 3. Review Storage And Bandwidth

> Goal: ตรวจ storage/bandwidth waste

1. ตรวจ unused databases, tables, buckets
2. ตรวจ logs/artifacts lifecycle
3. ตรวจ CDN cache hit ratio

### 4. Review Third-party Services

> Goal: ตรวจค่าใช้จ่าย third-party

1. ตรวจ API calls ที charge ตาม request
2. ตรวจ managed services ทีใช้น้อย
3. ระบุ services ที duplicate กัน
4. ตรวจ LLM token spend — prompt bloat, missing prompt caching, model tier ทีแพงเกินงาน

### 5. Attribution And Finops

> Goal: รู้ใครจ่ายอะไร และมี cost governance — ทำตาม `references/finops.md`

1. per-feature/per-tenant unit cost attribution
2. cost anomaly detection + budget alerts
3. commitment pricing — reserved instances, savings plans, spot สำหรับ interruptible workloads
4. egress/data-transfer — cross-region, cross-cloud, internet egress เป็น hidden driver หรือไม่
5. tagging hygiene — resources tagged (env/team/feature) เพื่อ cost allocation

### 6. Rate And Report

> Goal: สรุป findings พร้อม fix direction

1. ทำ `/report` ด้วย columns: No., Service, Cost, Waste, Severity, Fix
2. ชี้ไป section `## Fix` เมื่อ user confirm ให้แก้

### Subskills

> Goal: dispatch งานเฉพาะรูปแบบ — report subskill format findings, optimize subskill fix เมื่อ user confirm

| Topic | Target |
|-------|----------|
| `report`, `cost` — per-service breakdown + savings ranked | `subskills/report-cost/SKILL.md` |
| Apply cost findings — compute, storage, bandwidth, third-party, LLM token spend reductions | `subskills/optimize-cost/SKILL.md` |

## Rules

### 1. Read Only

- ห้ามลบ resources หรือเปลี่ยน plan ระหว่าง review
- ใช้ billing data และ observability เท่านั้น

### 2. Evidence Required

- ทุก finding ต้องมี billing amount, usage metric หรือ resource id
- ไม่แนะนำ cost cut โดยไม่มี risk assessment

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Routes

1. findings ทั้งหมด (infra: compute, storage, bandwidth, third-party, CI spend + LLM token usage: prompt bloat, caching, model tier) → `subskills/optimize-cost/SKILL.md`
2. verify: re-audit scope เดิมหลังแก้ — findings เดิมต้องไม่เหลือ

## References

- [Full-dimension checklist](references/checklist.md)
- [FinOps](references/finops.md)
- [Deep cost analysis](references/deep-cost-analysis.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /review-performance ถ้าจำเป็น

## Expected Outcome

- รายงาน findings ครอบคลุม compute, storage, bandwidth, third-party
- ทุก finding มี evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`
