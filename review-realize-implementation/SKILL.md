---
name: review-realize-implementation
description: Review implementation completeness หา TODO, MOCK, STUB, placeholder, flows ขาด UX/UI ที่มี API แล้ว
argument-hint: "[skill-name]"
related:
  - review-refactor
  - review-restructure
  - review-update
  - realize-implementation
  - update-review-codebase-cli-and-run
---

## Goal

Review implementation completeness ใน codebase เพื่อหา TODO, FIXME, HACK, MOCK, FAKE, STUB, placeholder, incomplete flows, missing features ที่ backend/API/database มีแล้วแต่ user-facing ส่วนยังไม่สมบูรณ์, missing integrations, และ compliance gaps พร้อมระบุ critical path

## Scope

ใช้กับทุก project ที่มี implementation ยังไม่สมบูรณ์ รวมถึง:

- TODO, FIXME, HACK comments
- MOCK, FAKE, STUB, placeholder implementations
- Unfinished features, unimplemented interfaces, missing types
- Incomplete flows, missing steps, dead-ends, missing branches
- API endpoints ที่ไม่มี UI เรียกใช้ (missing UI)
- UI components ที่เรียก API ที่ไม่มี (missing API)
- Database schema/tables ที่ไม่มี UX จัดการ (missing database)
- Backend services ที่ไม่มี user-facing flow
- Features ที่มี admin/staff flow แต่ไม่มี customer/user flow
- Feature flags ที่เปิดใช้แล้วแต่ไม่มี UI รองรับ
- Missing supporting features, missing integrations, missing operational readiness
- Missing compliance, security, privacy, audit controls

ใช้ร่วมกับ `review-refactor`, `review-restructure`, `review-update` เพื่อ review ก่อน refactor, restructure, หรือ update

## Execute

### 1. Prepare

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ project structure, domain, และ feature scope

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, domain, และ feature scope
2. ระบุ implementation patterns ที่ใช้: TODO, FIXME, HACK, MOCK, FAKE, STUB, placeholder
3. ถ้าสแกนไม่ได้ → stop และ report

### 2. Analyze Implementation Gaps

> Goal: หา implementation ที่ไม่สมบูรณ์ในทุกมิติ

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-review-codebase-cli-and-run` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
4. Analyzer สแกนหา TODO, FIXME, HACK, MOCK, FAKE, STUB, placeholder patterns พร้อม context ตาม [references/implementation-gaps.md](references/implementation-gaps.md)
5. Analyzer ตรวจหา unfinished features, unimplemented interfaces, missing error handling
6. Analyzer ตรวจหา incomplete flows, dead-ends, missing success/error branches, missing recovery path ตาม [references/missing-flows.md](references/missing-flows.md)
7. Analyzer ตรวจหา missing UI: API endpoints ที่ไม่มี UI เรียกใช้, database tables/columns ที่ไม่มี UX จัดการ, missing UI states (loading, error, empty), partial UX ตาม [references/missing-ui.md](references/missing-ui.md)
8. Analyzer ตรวจหา missing API: UI ที่เรียก endpoint ที่ไม่มี, database tables ที่ไม่มี CRUD endpoint, missing API methods, missing validation ตาม [references/missing-api.md](references/missing-api.md)
9. Analyzer ตรวจหา missing database: API/UI ที่ไม่มี table รองรับ, missing schema, missing migrations, missing data integrity ตาม [references/missing-database.md](references/missing-database.md)
10. Analyzer ตรวจหา missing supporting features, missing integrations, missing operational readiness, missing compliance
11. Review CLI คำนวณ implementation completeness score จาก review report
12. ถ้า review CLI ไม่ผ่าน → ทำ `/update-review-codebase-cli-and-run` แล้ว re-run ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report

### 3. Validate Findings

> Goal: Findings ถูกต้องและจัดลำดับตาม severity และ critical path

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/deep-validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. จัดกลุ่มตาม critical path: schema → data → API → UI/flow
5. ระบุ false positives
6. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 2

### 4. Report

> Goal: รายงาน implementation gaps พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Implementation Metrics Summary: TODO, FIXME, HACK, MOCK, FAKE, STUB, placeholder, unfinished features, missing types, incomplete flows, missing UI, missing API, missing database, missing features
3. สร้างตาราง Findings by Critical Path: Layer, Finding, Severity, Location, Evidence, Recommendation
4. สร้างตาราง Recommended Implementations: Priority, Action, Impact, Effort, Workflow
5. แสดง implementation completeness score พร้อม grade และ progress bar
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 5. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/realize-implementation` เพื่อตรวจสอบและแก้ไข implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Severity Classification

ระบุ severity ตาม [references/severity.md](references/severity.md)

- Critical: MOCK/FAKE/STUB ใน production path, core feature ไม่สมบูรณ์, missing critical schema/data, missing critical API, TODO ใน critical path, incomplete flow ที่อาจก่อให้เกิดความเสียหายทางกฎหมาย/ข้อมูล/การเงิน, ฟีเจอร์หลักที่ API/database มีแล้วแต่ไม่มี UX ทำให้ user ไม่สามารถใช้งานได้เลย
- High: STUB ที่ถูกเรียกใช้, error handling ไม่สมบูรณ์, hardcoded data ที่ควรมาจาก source, missing type ใน critical path, missing supporting feature ใน flow, ฟีเจอร์สำคัญที่ UX ไม่สมบูรณ์ (ขาด create/edit/delete, ขาด error/loading state, ขาด confirmation)
- Medium: TODO ใน non-critical path, partial implementation, missing validation, incomplete UX/flow state, missing integration, missing operational readiness, ฟีเจอร์รองที่ UX ยังไม่มี หรือมีแต่สำหรับบาง role
- Low: FIXME ใน non-critical path, cosmetic placeholder, missing docs, missing feature flag, ฟีเจอร์ internal/optional ที่อาจไม่ต้องมี UI ตาม design

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ code snippet หรือ evidence ที่พบ
- ระบุ false positives
- ระบุ critical path: schema → data → API → UI/flow

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ใช้ `/update-review-codebase-cli-and-run` สำหรับระบุ issues ใน code
- ถ้าต้อง refactor ก่อน implement → ทำ `review-refactor` ก่อน `refactor`
- ถ้าต้อง restructure ก่อน implement → ทำ `review-restructure` ก่อน `restructure`
- ถ้าต้อง update docs/config ก่อน implement → ทำ `review-update` ก่อน `update-*`
- ถ้าต้อง implement ให้ใช้ `/realize-implementation` หลัง review

### 4. Health Score Formula

คำนวณ score ตาม [references/scoring.md](references/scoring.md)

- Metrics หลัก: TODO, FIXME, HACK, MOCK, FAKE, STUB, placeholder, unfinished features, missing types, incomplete flows, missing UI, missing API, missing database, missing features
- คะแนนต่อ metric: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Review score = (total score / total metrics) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 5. Critical Path Priority

- แก้ไข schema ก่อน data, data ก่อน API, API ก่อน UI/flow

### 6. Flow And Feature Completeness

- ทำ `/roleplay-user` เพื่อจำลอง user journey และตรวจสอบ flow ที่ไม่สมบูรณ์
- ตรวจสอบ missing features ภายใน workflow นี้ (API/database มีแล้วแต่ UX/UI ยังไม่สมบูรณ์)
- ทำ `/update-review-codebase-cli-and-run` ถ้าพบ gaps ในแต่ละด้าน
- ตรวจสอบว่า flow หลักมี happy path, error path, recovery, rollback, undo, confirmation
- ตรวจสอบว่า feature หลักมี supporting features ครบ: validation, auth, audit, notifications, rate limiting, tests, docs

### 7. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง Implementation Metrics Summary พร้อม status indicators
- รายงาน Findings by Critical Path พร้อม severity และ location
- รายงาน Flow And Feature Completeness Gaps
- รายงาน Recommended Implementations พร้อม priority และ workflow
- Implementation completeness score พร้อม grade และ progress bar
- แนะนำ `review-refactor`, `review-restructure`, หรือ `review-update` ถ้า implementation gaps ต้องการ refactor, restructure, หรือ update ก่อน
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
