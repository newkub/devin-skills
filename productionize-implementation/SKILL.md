---
name: productionize-implementation
description: แปลง TODO, MOCK, FAKE, placeholder เป้น production code จริง end-to-end
argument-hint: "[scope-or-plan]"
related:
  - implement-mock
  - implement-features-to-mvp
  - implement-todo-md
  - deep-review
  - review-architecture
  - resolve-errors
  - refactor
  - update-references
  - review-security
  - improve-security
  - run-test-all
  - run-verify
  - deep-productionize-implementation
  - update-project
  - ask-me
---

## Goal

แปลง TODO, MOCK, FAKE, STUB, placeholder เป้น production code จริง ครบทุกมิติ พร้อม architecture, security, observability และ rollback plan

## Scope

แปลงทุก unfinished features เป้น production code: schema, data, API, UX/UI, external services พร้อม infrastructure จริง end-to-end — ไม่รวมงานที่ควรเริ่มจาก architecture ใหม่ (ใช้ `/review-architecture` ก่อน)

## Execute

### 1. Review And Baseline

> Goal: เข้าใจ scope และปัญหาก่อน implement

1. ทำ `/deep-review` ครบทุกมิติ เพื่อหา TODO/MOCK/placeholder และ issues
2. ทำ `/deep-analyze-by-use-scripts` เพื่อ scan หา `TODO`, `FIXME`, `XXX`, `HACK`, mock data, hard-coded values
3. ถ้ามี `.devin/plan/<title-date>.md` → ทำ `/implement-plan` ให้ครบก่อน
4. บันทึก baseline: รายการ unfinished items, files, dependencies, infrastructure gaps

### 2. Review Architecture

> Goal: ยืนยัน architecture ก่อนลงมือ

1. ทำ `/review-architecture` หรือ `/follow-architecture` เพื่อดู boundary, layer, data flow
2. ถ้า architecture ไม่ชัดหรือต้องเปลี่ยน structure ใหญ่ → ทำ `/ask-me` ก่อน
3. ระบุ critical path: schema → data → API → UX/UI

### 3. Verify Infrastructure

> Goal: ตรวจ infrastructure ก่อน implement

1. ตรวจ database: connection pool, indexes, migrations, backup
2. ตรวจ API server: endpoints, rate limit, CORS, auth
3. ตรวจ environment variables และ secrets — ถ้าขาด → `/ask-me`
4. ตรวจ external services: credentials, API keys, rate limits
5. ถ้า infrastructure ไม่พร้อม → หยุด, report และ propose options ให้ user เลือก

### 4. Implement Schema And Data Layer

> Goal: Implement schema, validation และ data layer ให้สมบูรณ์

1. สร้าง schema สำหรับ data models ที่ขาด, validation schemas และ types
2. ตรวจ type flow: schema → validation schema → API types → UI types
3. สร้าง migrations ด้วย dry-run ก่อน apply — ถ้า destructive ต้อง user confirm
4. แทนที่ mock data ด้วย real queries — implement repository/queries
5. สร้าง seed script สำหรับ test/dev
6. ถ้า migrations/seed fail → `/resolve-errors` ก่อนดำเนินต่อ

### 5. Implement API And UX/UI Layer

> Goal: Implement API handlers และเชื่อม UX/UI เข้ากับ API จริง

1. Implement API handlers ที่ query data source จริง พร้อม validation, auth middleware และ rate limit
2. ตรวจ API types ตรงกับ schema และ validation schemas
3. แทนที่ mock data ใน components ด้วย real API calls พร้อม loading, error, empty states
4. Implement form validation ด้วย validation schemas ที่ตรงกับ API และเชื่อม auth UI กับ auth service จริง
5. ถ้าเหมาะสม → implement optimistic updates; ถ้า validation fail → `/resolve-errors`

### 6. Convert TODOs And Placeholders

> Goal: ลบ TODO/FIXME/HACK และ placeholders

1. ค้นหา `TODO`, `FIXME`, `XXX`, `HACK`, placeholder functions ด้วย `/use-ast-grep` หรือ `grep`
2. ถ้ามี `TODO.md` → ทำ `/implement-todo-md`
3. ทำ `/implement-mock` เพื่อแทนที่ MOCK/FAKE/STUB ด้วย real implementations
4. ทำ `/implement-features-to-mvp` เพื่อ implement missing features
5. ถ้ามี library ที่เหมาะกว่า → ทำ `/use-lib-effective`

### 7. Implement Security, Resilience And Observability

> Goal: code ปลอดภัย resilient และติดตามได้เมื่อขึ้น production

1. ทำ `/review-security` เพื่อหา vulnerabilities
2. ทำ `/improve-security` สำหรับ findings ที่พบ
3. Validate/sanitize user inputs, ใช้ parameterized queries, ห้าม expose secrets
4. Implement retry logic, exponential backoff, graceful degradation
5. ตั้งค่า structured logging สำหรับ external calls
6. เพิ่ม metrics: response time, error rate
7. เพิ่ม correlation IDs สำหรับ tracing
8. ถ้าจำเป็น → ทำ `/improve-observability`

### 8. Refactor And Cleanup

> Goal: ปรับปรุงคุณภาพโค้ด ตรวจ references และ cleanup

1. ทำ `/refactor` เพื่อลด long files, SRP issues และ import/exports
2. ทำ `/update-references` ถ้ามี move/rename/delete
3. ทำ `/check-unused-deps` และ `/check-unused-files` — พิจารณาลบหรือ implement
4. ทำ `/update-dot-devin` หรือ `/update-project` ถ้ามี config/manifest/docs เปลี่ยน
5. ทำ `/update-todo-md` ถ้า TODO.md items เปลี่ยน

### 9. Verify, Rollback Plan, And Finalize

> Goal: code ผ่าน validation พร้อม rollback plan

1. ทำ `/run-test-all` เพื่อรัน unit, integration, e2e, specialized tests
2. ทำ `/run-verify` เพื่อตรวจ scan, format, lint, typecheck, test, build
3. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง
4. สร้าง rollback plan: `git revert <merge-commit>` หรือ redeploy เวอร์ชันเดิม
5. ถ้างานซับซ้อนหรือหลาย workspace → ทำ `/deep-productionize-implementation` ก่อนเพื่อ deep pass
6. ทำ `/suggest-next-action`

## Rules

### 1. No Mock In Production

- ไม่มี mock implementations ใน production code
- ไม่ใช้ simulated delay หรือ in-memory stores แทน real services
- ไม่ silently fall back ไป mock data

### 2. Type And Validation Flow

- Types flow: schema → validation schema → API types → UI types
- ใช้ type inference จาก schema ไม่ประกาศ type ซ้ำ
- หลีกเลี่ยง `any` ใช้ `unknown` แทน

### 3. Safety And User Confirmation

- migrations destructive ต้อง dry-run + user confirm
- external services ไม่พร้อม → report options ก่อน proceed
- secrets/keys ไม่ hardcode ใน code

### 4. Minimal And Maintainable

- ทำ `/dont-over-engineer`
- รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน
- ไฟล์ไม่เกิน 250 บรรทัด

## Expected Outcome

- ไม่มี TODO/MOCK/placeholder ใน production code
- schema, validation, types, API, UX/UI สมบูรณ์และเชื่อมต่อกัน
- infrastructure พร้อม production: security, observability, resilience
- ผ่าน `/run-test-all` และ `/run-verify`
- มี rollback plan
