---
name: review-realize-implementation
description: Review implementation completeness หา TODO, MOCK, STUB, placeholder, flows ขาด UX/UI
argument-hint: "[skill-name]"
related:
  - review-refactor
  - review-restructure
  - review-update
  - realize-implementation
  - review-codebase-everything
  - scan-codebase
  - deep-analyze
---

## Goal

Review implementation completeness ใน codebase เพื่อหา TODO, FIXME, HACK, MOCK, FAKE, STUB, placeholder, incomplete flows, missing features

## Scope

- TODO, FIXME, HACK comments
- MOCK, FAKE, STUB, placeholder implementations
- Unfinished features, unimplemented interfaces, missing types
- Incomplete flows, missing steps, dead-ends
- API endpoints ที่ไม่มี UI, UI ที่เรียก API ที่ไม่มี, database ที่ไม่มี UX
- Missing supporting features, integrations, operational readiness, compliance

ใช้ร่วมกับ `review-refactor`, `review-restructure`, `review-update` เพื่อ review ก่อน refactor, restructure, หรือ update

## Execute

### 1. Prepare

> Goal: เข้าใจ project structure, domain, และ feature scope

1. ทำ `/scan-codebase`
2. ระบุ implementation patterns ที่ใช้
3. ถ้าสแกนไม่ได้ → stop และ report

### 2. Analyze Implementation Gaps

> Goal: หา implementation ที่ไม่สมบูรณ์ในทุกมิติ

1. ทำ `/deep-analyze`, `/review-codebase-everything`, `/run-review`
2. ทำตาม `references/implementation-gaps.md`
3. ทำตาม `references/missing-flows.md`
4. ทำตาม `references/missing-ui.md`
5. ทำตาม `references/missing-api.md`
6. ทำตาม `references/missing-database.md`

### 3. Validate Findings

> Goal: Findings ถูกต้องและจัดลำดับตาม severity และ critical path

1. ทำตาม `references/validation.md#validate-findings`

### 4. Report

> Goal: รายงาน implementation gaps พร้อม actionable recommendations

1. ทำตาม `references/validation.md#report`

### 5. Implement All

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/realize-implementation` เพื่อตรวจสอบและแก้ไข
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Severity Classification

ระบุ severity ตาม `references/severity.md`

- Critical: MOCK/FAKE/STUB ใน production path, core feature ไม่สมบูรณ์, missing critical schema/data/API, TODO ใน critical path
- High: STUB ที่ถูกเรียกใช้, error handling ไม่สมบูรณ์, hardcoded data ที่ควรมาจาก source, missing type ใน critical path, missing supporting feature ใน flow
- Medium: TODO ใน non-critical path, partial implementation, missing validation, incomplete UX/flow state, missing integration
- Low: FIXME ใน non-critical path, cosmetic placeholder, missing docs, missing feature flag

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ code snippet หรือ evidence
- ระบุ false positives
- ระบุ critical path: schema → data → API → UI/flow

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ใช้ `/review-codebase-everything` สำหรับระบุ issues ใน code
- ถ้าต้อง refactor → ทำ `review-refactor` ก่อน `refactor`
- ถ้าต้อง restructure → ทำ `review-restructure` ก่อน `restructure`
- ถ้าต้อง update → ทำ `review-update` ก่อน `update-*`
- ถ้าต้อง implement ให้ใช้ `/realize-implementation` หลัง review

### 4. Health Score Formula

คำนวณ score ตาม `references/scoring.md`

- Metrics หลัก: TODO, FIXME, HACK, MOCK, FAKE, STUB, placeholder, unfinished features, missing types, incomplete flows, missing UI, missing API, missing database, missing features
- คะแนนต่อ metric: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Review score = (total score / total metrics) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 5. Critical Path Priority

- แก้ไข schema ก่อน data, data ก่อน API, API ก่อน UI/flow

### 6. Flow And Feature Completeness

- ทำ `/roleplay-user` เพื่อจำลอง user journey
- ตรวจ missing features ภายใน workflow
- ทำ `/review-codebase-everything` ถ้าพบ gaps ในแต่ละด้าน
- ตรวจ flow หลักมี happy path, error path, recovery, rollback, undo, confirmation
- ตรวจ feature หลักมี supporting features ครบ: validation, auth, audit, notifications, rate limiting, tests, docs

### 7. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Implementation Metrics Summary
- รายงาน Findings by Critical Path
- รายงาน Flow And Feature Completeness Gaps
- รายงาน Recommended Implementations
- Implementation completeness score พร้อม grade และ progress bar
- แนะนำ `review-refactor`, `review-restructure`, หรือ `review-update` ถ้าต้องการ
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
