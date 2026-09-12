---
name: deep-review-then-fix
description: Review findings แล้วแก้ไขจริงตาม fix guides ของแต่ละ domain — canonical fix skill หลัง review-*
argument-hint: "[scope-or-domain]"
related:
  - deep-review
  - use-subagents
  - deep-thinking
  - resolve-errors
  - run-check
  - run-test-all
  - report-before-after
  - create-report-in-dot-devin
  - report
  - suggest-next-action
---

## Goal

รับ findings จาก `review-*` หรือ `/deep-review` แล้วแก้ไขจริงตาม fix guides ของแต่ละ domain — review-* ทุกตัวเป็น report-only; skill นี้เป็น canonical fix path เดียว (merged from: `review-then-fix`, `improve-*`, `optimize-*` fix orchestrators, `deep-review-codebase-then-fix`)

## Scope

ใช้เมื่อต้องการแก้ findings ที่ review พบ — ทั้ง domain เดียวและหลาย domains

- ถ้าต้องการ review อย่างเดียว → `review-*` domain นั้น หรือ `/deep-review`
- ถ้า fix ต้อง user confirm → confirm ก่อนลงมือ (default) เว้นแต่ `/dont-ask-me` mode
- ถ้า scope ใหญ่หลาย domains → dispatch review phase ผ่าน `/use-subagents`

## Domain Map

fix guides อยู่ใน `references/` ของ review-* ตัวที่ตรง domain — อ่านก่อนแก้เสมอ

| Domain | Review skill | Fix guides |
|--------|-------------|------------|
| seo | `/review-seo` | `review-seo/references/fix-*.md` |
| security | `/review-security` | `review-security/references/fix-*.md` |
| auth | `/review-auth` | `review-auth/references/fix-*.md` |
| api | `/review-api` | `review-api/references/fix-*.md` |
| database | `/review-database` | `review-database/references/fix-*.md` |
| dependencies | `/review-dependencies` | `review-dependencies/references/fix-*.md` |
| bundle | `/review-bundle` | `review-bundle/references/fix-*.md` |
| performance | `/review-performance` | `review-performance/references/fix-*.md` |
| assets | `/review-assets` | `review-assets/references/fix-*.md` |
| ci/delivery | `/review-delivery` | `review-delivery/references/fix-*.md` |
| cost | `/review-cost` | `review-cost/references/fix-*.md` |
| docs | `/review-docs` | `review-docs/references/fix-*.md` |
| tests | `/review-test` | `review-test/references/fix-*.md` + `/update-tests` สำหรับเขียน test ใหม่ |
| uxui | `/review-uxui` | `review-uxui/references/fix-*.md` + `/improve-uxui` (browser pass) |
| stability | `/review-stability` | `review-stability/references/fix-*.md` |
| observability | `/review-observability` | `review-observability/references/fix-*.md` |
| cli | `/review-cli` | `deep-review-then-fix` guide ที่ `review-quality/references/` หรือทำตาม checklist |
| config | `/review-config` | `review-config/references/fix-*.md` |
| migration | `/review-migration` | `review-migration/references/fix-*.md` |
| accessibility | `/review-accessibility` | `review-accessibility/references/fix-*.md` |
| frontend | `/review-frontend` | `review-frontend/references/fix-*.md` |
| backend | `/review-backend` | `review-backend/references/fix-*.md` |
| quality | `/review-quality` | `review-quality/references/fix-*.md` |
| อื่นๆ | `/review-<domain>` | `review-<domain>/references/fix-*.md` ถ้ามี — ไม่มีให้แก้ตาม findings ตรงๆ |

## Execute

### 1. Collect Findings

> Goal: รู้ว่าต้องแก้อะไรและ domain ไหน

1. ถ้ามี findings เดิม → ใช้เลย; ถ้าไม่มี → รัน `review-*` ตาม Domain Map หรือ `/deep-review` สำหรับ codebase-wide
2. map findings → domains → fix guides ที่ตรง
3. ถ้า user confirm แล้ว → ดำเนินการ; ยังไม่ confirm → present findings + plan ก่อน

### 2. Plan Fixes

> Goal: ลำดับการแก้ที่ปลอดภัย

1. prioritize: severity critical → high → medium/low; blockers ก่อน polish
2. dedupe cross-domain findings (เช่น secrets โผล่ทั้ง security+config → fix ที่เดียว)
3. ใช้ `/deep-thinking` ถ้า fix มี trade-off หรือกระทบ public API/behavior

### 3. Apply Fixes Per Domain

> Goal: แก้ตาม fix guides จริง

1. sequential ตาม priority — อ่าน fix guide ของ domain นั้นแล้วแก้
2. หลังแต่ละ fix → verify ทันที (re-check finding นั้น)
3. fix ที่พัง → `/resolve-errors`; fix เดิมล้มเหลว 3 ครั้ง → stop + report

### 4. Verify Aggregate

> Goal: fixes ไม่ทำกันเองพัง

1. `/run-check` + `/run-test-all` ตามที่ project มี
2. cross-domain regression — fix domain หนึ่งห้ามทำ domain อื่นพัง
3. ถ้า regression → fix หรือ revert เฉพาะส่วนนั้น

### 5. Report

> Goal: ส่งมอบพร้อม evidence

1. ทำ `/report-before-after` + `/report` — findings fixed per domain, verified status, residual items
2. persist raw results → `.devin/reports/<workspace>/review-then-fix-<time>.md` ตาม format `/create-report-in-dot-devin`
3. ทำ `/suggest-next-action`

## Rules

### 1. Guides Before Fixes

- ทุก domain fix ต้องอ่าน fix guide ของ domain นั้นก่อน — ห้ามแก้ตาม intuition
- fix guide ไม่มี → แก้ตาม findings ตรงๆด้วย minimal change

### 2. Confirm Before Mutate

- user confirm ก่อนแก้เสมอ เว้นแต่ `/dont-ask-me` mode — review ไม่แปลว่าแก้ได้เลย
- destructive fixes → dry-run + confirmation เสมอ

### 3. No Behavior Change Without Cause

- fix ต้องรักษา behavior เดิมเว้นแต่ finding คือ behavior bug
- tests/checks ต้องผ่านหลัง fix — ห้ามปล่อย regression

### 4. Evidence

- ทุก fix มี before/after evidence — verify จริงไม่ใช่อ้างว่าแก้แล้ว
- residual/unfixed findings ต้องระบุชัดใน report

## Expected Outcome

- findings ถูกแก้ตาม fix guides พร้อม verification
- ไม่มี regressions — checks/tests ผ่าน
- report สรุป per-domain พร้อม evidence และ items ค้าง
