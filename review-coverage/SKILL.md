---
name: review-coverage
description: Review coverage ของ declared surface เทียบกับของจริง — skills/tests/docs gaps พร้อม severity
argument-hint: "[skills|tests|docs|<surface>]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
  - read
related:
  - follow-skills-map
  - check-skill-usage
  - review-devin-global-harness
  - run-test-coverage
  - update-docs
  - idea-new-devin-global-skills
  - review-test
  - report
  - suggest-next-action
---

## Goal

Review ว่า "surface ที่ควรครอบคลุม" ถูก cover จริงแค่ไหน — เทียบ declared surface (actions, routes, features, domains) กับ existing coverage (skills, tests, docs) แล้วรายงาน gaps พร้อม priority

## Scope

ใช้เมื่อต้องตอบคำถาม "อะไรที่ยังไม่มี X รองรับ" — coverage review ไม่ใช่การรัน coverage tool (รันจริงทำผ่าน `/run-test-coverage`); modes:

| Surface | คำถาม |
|---------|-------|
| `skills` | action/domain ไหนยังไม่มี skill รองรับ |
| `tests` | route/file/feature ไหนยังไม่มี test |
| `docs` | feature/public API ไหนยังไม่มี docs |
| `<custom>` | surface ที่ user กำหนดเอง |

## Execute

### 1. Define Surface

> Goal: รู้ว่าอะไร "ควรถูก cover"

1. `skills` → surface = actions/domains ใน `follow-skills-map/references/tool-map.md` + intents ใน `global_rules.md` + task types จาก skills-map categories
2. `tests` → surface = routes/endpoints/public modules จาก codebase (ทำ `/check-all-routes` หรือ scan route files)
3. `docs` → surface = features/public API จาก `FEATURES.md`, exports, routes
4. custom → ใช้ list ที่ user ให้หรือ extract จาก spec/config ที่ระบุ
5. ทำ `/use-scripts` ถ้า surface ใหญ่ — เขียน `scripts/review-coverage.ts` extract + compare

### 2. Inventory Actual Coverage

> Goal: รู้ว่ามีอะไร cover อยู่จริง

1. `skills` → scan `*/SKILL.md` descriptions + `related` + `/check-skill-usage` สำหรับ usage signal
2. `tests` → scan test files (`*.test.*`, `*.spec.*`, `tests/`) เทียบกับ surface items; ถ้ามี coverage report จริง (`vitest --coverage`, istanbul) ให้อ่านค่าจาก report
3. `docs` → scan docs pages, README sections, `docs/` nav เทียบ features
4. normalize ทั้งสองฝั่งเป็น key เดียวกัน (action name / route path / feature id)

### 3. Build Gap Matrix

> Goal: เทียบ surface vs coverage หา gaps

1. สำหรับแต่ละ surface item → status: `covered`, `partial`, `missing`
2. `partial` = มีของรองรับแต่ไม่ครบ scope (เช่น skill มีแต่ไม่มี script, route มี smoke test แต่ไม่มี edge cases)
3. หา orphans ฝั่งกลับด้วย — coverage ที่ไม่มี surface item (tests/docs ของ feature ที่ตายไปแล้ว)

### 4. Classify Severity

| Severity | เกณฑ์ |
|----------|-------|
| Critical | surface item ที่ user-facing/critical path ไม่มี coverage เลย |
| Warning | partial coverage หรือ missing ใน non-critical domain |
| Info | orphan coverage, low-value gaps |

### 5. Report And Route

> Goal: รายงาน gaps พร้อม action

1. ทำ `/report` ตาราง: No, Surface Item, Status, Coverage, Severity, Recommendation
2. สรุป coverage % ต่อ category
3. Route: missing skills → `/idea-new-devin-global-skills`, missing tests → `/update-tests`, missing docs → `/update-docs`, orphans → review ว่าควรลบ
4. ทำ `/suggest-next-action`

## Rules

### 1. Surface Discipline

- surface ต้องมาจาก declared source (spec, map, config, routes) — ไม่เดาว่าอะไร "น่าจะมี"
- ถ้า surface ไม่ชัด → ทำ `/ask-me` ให้ user นิยามก่อน

### 2. Review-Only

- รายงาน gaps เท่านั้น — ไม่สร้าง skill/test/doc เอง (route ไป skill ที่เหมาะ)
- ทุก gap ต้องมี evidence: surface item + สิ่งที่ค้นหาแล้วไม่เจอ

### 3. Quality Over Quantity

- coverage % เป็น signal ไม่ใช่เป้าหมาย — critical path uncovered สำคัญกว่า % ต่ำใน trivial items
- orphan coverage ให้รายงานแยก อย่ารวมเป็น gap

- ใช้ /check-skill-usage ถ้าจำเป็น
- ใช้ /follow-skills-map ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- Gap matrix: surface items ทั้งหมดมี status covered/partial/missing
- Coverage % ต่อ category + orphan list
- Prioritized recommendations พร้อม route ไป skill ที่สร้าง/แก้ได้
