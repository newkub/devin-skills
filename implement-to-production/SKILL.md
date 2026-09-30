---
name: implement-to-production
description: แปลง TODO, MOCK, FAKE, placeholder เป็น production code จริง end-to-end
argument-hint: "[setup-infra|deploy-production] [scope-or-plan]"
related:
  - deep-review
  - deep-analyze
  - deep-plan
  - ask-me
  - check-secrets
  - deep-validate
  - run-verify
  - run-test-coverage
  - resolve-errors
  - use-lib-effective
  - follow-tdd
  - use-subagents
  - refactor

---

## Goal

แปลง TODO, MOCK, FAKE, STUB, placeholder เป็น production code จริง ครบทุกมิติ พร้อม architecture, security, observability และ rollback plan

## Scope

- ถ้า input เป็นไฟล์แผน `.devin/temp/plan/<workspace>/<title-date>.md` → ทำตาม `references/implement-plan.md`
- ถ้า input เป็น `TODO.md` task list → ทำตาม `references/implement-todo-md.md`

แปลงทุก unfinished features เป็น production code: schema, data, API, UX/UI, external services พร้อม infrastructure จริง end-to-end — ไม่รวมงานที่ควรเริ่มจาก architecture ใหม่ (ใช้ `/deep-review` ก่อน)

## Execute

### 1. Review And Baseline

> Goal: เข้าใจ scope และปัญหาก่อน implement

1. ทำ `/follow-review` เป็น gate ก่อน implement — เลือกและรัน `review-*` ที่ตรง context แล้วทำ `/deep-review` ครบทุกมิติ เพื่อหา TODO/MOCK/placeholder และ issues
2. ทำ `/deep-analyze` เพื่อ scan หา `TODO`, `FIXME`, `XXX`, `HACK`, mock data, hard-coded values — ถ้า codebase ใหญ่ → spawn `subagents/gap-scanner.md` (read-only) คืน gap inventory table แทนการสแกนเอง และทำ `/deep-research` ถ้าต้องหา external patterns หรือ sources
3. ถ้ามี `.devin/temp/plan/<workspace>/<title-date>.md` → ทำตาม `references/implement-plan.md` ให้ครบก่อน
4. บันทึก baseline: รายการ unfinished items, files, dependencies, infrastructure gaps
5. อ่าน `refactor/SKILL.md` `## Rules` ก่อนเริ่ม implement — code ใหม่ต้องผ่าน refactor standards ตั้งแต่เขียน: SRP, ≤250 บรรทัด, preserve public API, minimal change

### 2. Review Architecture

> Goal: ยืนยัน architecture ก่อนลงมือ

1. ทำ `/deep-plan` เพื่อวางแผน implement อย่างละเอียด แล้วทำ `/deep-review` เพื่อดู boundary, layer, data flow
2. ทำ `/refactor` architecture scope เมื่อ implement ใน `packages/`, `crates/` หรือ `apps/` เพื่อ apply pattern convention ของ directory นั้น (`packages/`/`crates/` → clean, `apps/` → layered — target table ใน step 5)
3. ถ้า architecture ไม่ชัดหรือต้องเปลี่ยน structure ใหญ่ → ทำ `/ask-me` ก่อน
4. ระบุ critical path: schema → data → API → UX/UI

### 3. Verify Infrastructure

> Goal: ตรวจ infrastructure ก่อน implement

1. ตรวจ database: connection pool, indexes, migrations, backup — ทำ `/deep-review` เทียบ pending vs applied
2. ตรวจ API server: endpoints, rate limit, CORS, auth
3. ทำ `/check-secrets env-vars` เทียบ `.env` / `.env.example` / code usage — ถ้าขาด → `/ask-me`
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

1. อ่าน `TODO.md` ใน workspace โดยตรงเพื่อรวบรวม pending items ก่อน implement (หรือ `/update-todo-md` เพื่ออ่าน/enhance prompt)
2. ค้นหา `TODO`, `FIXME`, `XXX`, `HACK`, placeholder functions ด้วย `/use-astgrep` หรือ `grep` — และทำ `/check-secrets hardcoded-values` หา hardcoded URLs, credentials, magic strings
3. ถ้ามี `TODO.md` → ทำตาม `references/implement-todo-md.md`
4. แทนที่ MOCK/FAKE/STUB ด้วย real implementations ตาม flow ของ skill นี้ — items ที่ independent กันหลายตัว → spawn `subagents/feature-implementer.md` ทีละ item ขนานกัน (ส่ง contracts จากขั้น 4-5 ให้)
5. ทำ `/implement-features-to-mvp` เพื่อ implement missing features
6. implement แต่ละ feature/fix ด้วย `/follow-tdd` — เขียน failing test ที่ lock behavior ก่อน แล้วค่อยเขียน code ให้ผ่าน
7. ทำ `/use-lib-effective` ก่อนเขียน implementation ใหม่ — ใช้ dep ที่ติดตั้งอยู่หรือ preferred stack ให้เต็มประสิทธิภาพแทนการ reinvent
8. ถ้ามี library ที่เหมาะกว่า → ทำ `/deep-review`
9. หลัง implement เสร็จ → ทำ `/update-todo-md` เพื่ออัปเดต status ของ items ที่ทำเสร็จเป็น `done` หรือ `completed`

### 7. Implement Security, Resilience And Observability

> Goal: code ปลอดภัย resilient และติดตามได้เมื่อขึ้น production

1. ทำ `/deep-review` เพื่อหา vulnerabilities
2. แก้ findings แล้ว re-review ยืนยันว่าปิดครบ
3. Validate/sanitize user inputs, ใช้ parameterized queries, ห้าม expose secrets — ทำ `/check-secrets secrets-leak` ก่อน ship
4. Implement retry logic, exponential backoff, graceful degradation — ทำ `/deep-review` กับ mutation endpoints ให้ retry-safe
5. ทำ `/deep-review` — ไม่มี throw ที่ไม่มี handler หรือ catch ที่ swallow errors
6. ทำ `/deep-review` กับ endpoints ที่เปิดใหม่ — กัน abuse/brute force/cost exposure
7. ตั้งค่า structured logging สำหรับ external calls
8. เพิ่ม metrics: response time, error rate
9. เพิ่ม correlation IDs สำหรับ tracing
10. ถ้าจำเป็น → ทำ `/deep-review`
11. reviews หลาย domain บน changes เดียวกัน → spawn `subagents/review-sweeper.md` ทีละ domain ขนานกัน (read-only) แล้วรวม findings ก่อนแก้

### 8. Refactor And Cleanup

> Goal: ปรับปรุงคุณภาพโค้ด ตรวจ references และ cleanup

1. ทำ `/refactor` เสมอหลัง implementation เสร็จ — ลด long files, SRP issues และ import/exports ให้ผ่าน refactor rules ที่อ่านไว้ตอน step 1
2. ทำ `/update-references` ถ้ามี move/rename/delete
3. ทำ `/follow-tool-knip` — พิจารณาลบหรือ implement dead code ที่พบ
4. ทำ `/update-dot-devin` หรือ `/update-project` ถ้ามี config/manifest/docs เปลี่ยน
5. ทำ `/update-todo-md` ถ้า TODO.md items เปลี่ยน

### 9. Verify, Rollback Plan, And Finalize

> Goal: code ผ่าน validation พร้อม rollback plan

1. ทำ `/deep-validate` เพื่อ validate หลายมิติ แล้วทำ `/run-test-all` เพื่อรัน unit, integration, e2e, specialized tests — ถ้า project มี coverage target ให้ทำ `/run-test-coverage` จน coverage ถึงเป้า (default 100%) ก่อน verify
2. ทำ `/run-verify` เพื่อตรวจ scan, format, lint, typecheck, test, build
3. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง
4. pre-ship sweep: scan debug leftovers ด้วย `rg "console\.(log|debug)|debugger"`, `/check-secrets secrets-leak` ยืนยันไม่มี secrets หลุด, และ `/run-audit` ตรวจ dependency vulnerabilities
5. ทำ `/test-usage` เพื่อทดสอบ usage examples ใน `README.md`, docs และ `package.json` scripts ว่าทำงานได้จริงก่อน ship
6. สร้าง rollback plan: `git revert <merge-commit>` หรือ redeploy เวอร์ชันเดิม
7. ถ้างานซับซ้อนหรือหลาย workspace → ทำ deep pass เพิ่ม: front-load `/deep-thinking`, `/deep-impact` สำหรับ high-impact changes, จัดลำดับ critical path (schema → data → API → UX) และกำหนด rollback plan ก่อนแต่ละ batch
8. ถ้างานนี้ implement จาก GitHub issue ที่สร้างโดยฉัน → ทำ `/resolve-github-issue-by-me` เพื่อ comment ผลและปิด issue
9. ถ้ามีงานที่ยังไม่เสร็จ blocked หรือ deferred → ทำ `/save-to-todo-md` เพื่อเก็บ remaining items ลง `TODO.md`
10. ทำ `/suggest-next-action`

### Subskills

> Goal: dispatch ไปยัง subskill ตาม topic/argument

| Topic/Argument | Subskill |
|----------------|----------|
| `setup-infra`, `infra`, `env`, `secrets`, `ci`, `observability` | `subskills/setup-infra/SKILL.md` — infra readiness: env vars, secrets, CI, observability |
| `deploy-production`, `deploy`, `production` | `subskills/deploy-production/SKILL.md` — production deploy gate, verify, rollback |

1. ถ้า argument ตรง topic → อ่าน `subskills/<name>/SKILL.md` แล้วทำตาม flow ในนั้น — ไม่ execute จากตารางนี้โดยตรง
2. ถ้าไม่ระบุ → ทำตาม steps 1-9 ตามลำดับ

### Subagents

> Goal: dispatch งาน implement ที่อิสระไปยัง subagent profiles

| Task | Subagent |
|------|----------|
| inventory TODO/MOCK/placeholder/hardcoded ทั้ง codebase (read-only) | `subagents/gap-scanner.md` |
| implement feature/gap item เดียว end-to-end — spawn ทีละ item ขนานกัน | `subagents/feature-implementer.md` |
| review changes ทีละ domain (security/api/test/observability/resilience) ขนานกัน | `subagents/review-sweeper.md` |

1. spawn ผ่าน `/use-subagents` โดยส่ง inputs ตามที่แต่ละ profile กำหนด
2. `gap-scanner`/`review-sweeper` เป็น read-only — `feature-implementer` แก้เฉพาะ `files` ที่ได้รับ
3. parent เป็นคนรวมผล, checkpoint commit และ verify รวมเสมอ

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

- อ่าน `/refactor` rules ก่อนลงมือ implement เสมอ — และทำ `/refactor` หลัง implement เสร็จเสมอ (step 8) ไม่ข้าม
- ทำ `/dont-over-engineer`
- รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน
- ไฟล์ไม่เกิน 250 บรรทัด
- ใช้ /run-build ถ้าจำเป็น

## Expected Outcome

- ไม่มี TODO/MOCK/placeholder ใน production code
- schema, validation, types, API, UX/UI สมบูรณ์และเชื่อมต่อกัน
- infrastructure พร้อม production: security, observability, resilience
- ผ่าน `/run-test-all` และ `/run-verify`
- มี rollback plan
