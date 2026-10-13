---
name: implement-to-production
description: แปลง TODO, MOCK, FAKE, placeholder เป็น production code จริง end-to-end — รวม dead UI ให้ใช้งานได้จริงทุกจุด และ improve ครอบคลุม scope
argument-hint: "[setup-infra|deploy-production] [scope-or-plan]"
related:
  - deep-review
  - deep-analyze
  - create-plan-in-dot-devin
  - ask-me
  - check-secrets
  - deep-validate
  - run-verify
  - run-test
  - resolve-errors
  - use-lib-effective
  - follow-tdd
  - use-subagents
  - refactor
  - follow-review
  - follow-architecture
  - follow-lib-drizzle
  - follow-lib-effect-ts
  - follow-lib-orpc
  - follow-lib-tanstack-ecosystem
  - implement-features-to-mvp
  - update-todo-md
  - use-astgrep
  - update-references
  - follow-tool-knip
  - test-e2e
  - test-usage
  - run-audit
  - dont-over-engineer
  - improve
  - improve-tests
  - update-tests
  - watch-browser-and-test
  - ship
  - release-new-version

---

## Goal

แปลง TODO, MOCK, FAKE, STUB, placeholder เป็น production code จริง ครบทุกมิติ พร้อม architecture, security, observability และ rollback plan

## Scope

- ถ้า input เป็นไฟล์แผน `.devin/temp/plan/<workspace>/<title-date>.md` → ทำตาม `references/implement-plan.md`
- ถ้า input เป็น `TODO.md` task list → ทำตาม `references/implement-todo-md.md`

แปลงทุก unfinished features เป็น production code: schema, data, API, UX/UI, external services พร้อม infrastructure จริง end-to-end — ไม่รวมงานที่ควรเริ่มจาก architecture ใหม่ (ใช้ `/deep-review` ก่อน)

- UI ที่ดูเสร็จแต่ใช้ไม่ได้จริง นับเป็น placeholder เช่นกัน — dead buttons, `onClick={() => {}}`, `href="#"`, `disabled` ถาวรโดยไม่มีเหตุผล, dialogs/menus/tabs ที่ไม่เปิด, forms ที่ submit ไม่ได้, 'coming soon' text — ต้อง wire ให้ทำงานจริงหรือลบออก
- ครอบคลุม improvement รอบ scope งาน ไม่ใช่แค่ TODO items — หลัง implement ต้องผ่าน `/improve` domains ที่เกี่ยวข้อง (uxui, error handling, consistency, stability, a11y)

## Execute

### 1. Review And Baseline

> Goal: เข้าใจ scope และปัญหาก่อน implement

1. ทำ `/follow-review` เป็น gate ก่อน implement — เลือกและรัน `review-*` ที่ตรง context แล้วทำ `/deep-review` ครบทุกมิติ เพื่อหา TODO/MOCK/placeholder และ issues
2. ทำ `/deep-analyze` เพื่อ scan หา `TODO`, `FIXME`, `XXX`, `HACK`, mock data, hard-coded values — ถ้า codebase ใหญ่ → spawn profile `gap-scanner` (ใน `## Subagents`, read-only) คืน gap inventory table แทนการสแกนเอง และทำ `/deep-research` ถ้าต้องหา external patterns หรือ sources
3. ถ้ามี `.devin/temp/plan/<workspace>/<title-date>.md` → ทำตาม `references/implement-plan.md` ให้ครบก่อน
4. บันทึก baseline: รายการ unfinished items, files, dependencies, infrastructure gaps
5. อ่าน `refactor/SKILL.md` `## Rules` ก่อนเริ่ม implement — code ใหม่ต้องผ่าน refactor standards ตั้งแต่เขียน (รวม `/refactor-to-srp`): 1 unit = 1 reason to change, ≤250 บรรทัด, preserve public API, minimal change

### 2. Review Architecture

> Goal: ยืนยัน architecture ก่อนลงมือ

1. ทำ `/create-plan-in-dot-devin` เสมอ เพื่อวางแผน implement อย่างละเอียด (ถ้ามี plan file อยู่แล้วให้อ่านและทำตาม) แล้วทำ `/deep-review` เพื่อดู boundary, layer, data flow
2. ทำ `/refactor` architecture scope เมื่อ implement ใน `packages/`, `crates/` หรือ `apps/` เพื่อ apply pattern convention ของ directory นั้น (`packages/`/`crates/` → clean, `apps/` → layered — dispatch table ใน `/follow-architecture`)
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
4. แทนที่ mock data ด้วย real queries — implement repository/queries; ถ้า project ใช้/เลือก ORM → ทำ `/follow-lib-drizzle` สำหรับ schema, migrations, queries (ORM อื่น → `/refactor` orm scope)
5. สร้าง seed script สำหรับ test/dev
6. ถ้า migrations/seed fail → `/resolve-errors` ก่อนดำเนินต่อ

### 5. Implement API And UX/UI Layer

> Goal: Implement API handlers และเชื่อม UX/UI เข้ากับ API จริง — ทุก interactive element ใช้งานได้จริง end-to-end

1. Implement API handlers ที่ query data source จริง พร้อม validation, auth middleware และ rate limit — ถ้า project ใช้ oRPC → ทำ `/follow-lib-orpc` (contracts, procedures, typed errors); domain services/error handling ด้วย Effect → ทำ `/follow-lib-effect-ts`
2. ตรวจ API types ตรงกับ schema และ validation schemas
3. แทนที่ mock data ใน components ด้วย real API calls — เชื่อมผ่าน lib ของ project: TanStack → ทำ `/follow-lib-tanstack-ecosystem` (`Query` = server state, `Form` = forms+validation, `Store` = client state)
4. Implement form validation ด้วย validation schemas ที่ตรงกับ API และเชื่อม auth UI กับ auth service จริง
5. Audit UI ให้ใช้งานได้จริงทุกจุด — ทุก button/link/nav/menu/tab/dialog/dropdown ต้องทำงาน end-to-end: ไม่มี `onClick={() => {}}`, `href="#"`, `disabled` ถาวรโดยไม่มีเหตุผล, 'coming soon', `alert()` placeholder — wire เข้า real action หรือลบออก
6. ครบทุก UI state — loading, error (พร้อม retry), empty, success, disabled-during-submit — ทุก form submit ได้จริงและ feedback ชัดเจน
7. ถ้าเหมาะสม → implement optimistic updates; ถ้า validation fail → `/resolve-errors`

### 6. Convert TODOs And Placeholders

> Goal: ลบ TODO/FIXME/HACK และ placeholders

1. อ่าน `TODO.md` ใน workspace โดยตรงเพื่อรวบรวม pending items ก่อน implement (หรือ `/update-todo-md` เพื่ออ่าน/enhance prompt)
2. ค้นหา `TODO`, `FIXME`, `XXX`, `HACK`, placeholder functions ด้วย `/use-astgrep` หรือ `grep` — รวม dead-UI markers (`onClick={() => {}}`, `href="#"`, `disabled` ถาวร, `alert(`, 'coming soon') — และทำ `/check-secrets hardcoded-values` หา hardcoded URLs, credentials, magic strings
3. ถ้ามี `TODO.md` → ทำตาม `references/implement-todo-md.md`
4. แทนที่ MOCK/FAKE/STUB ด้วย real implementations ตาม flow ของ skill นี้ — items ที่ independent กันหลายตัว → spawn profile `feature-implementer` (ใน `## Subagents`) ทีละ item ขนานกัน (ส่ง contracts จากขั้น 4-5 ให้)
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
7. ตั้งค่า structured logging สำหรับ external calls — ทำ `/improve-observability` เพื่อหา observability gaps ครบทั้ง logging/metrics/tracing
8. เพิ่ม metrics: response time, error rate
9. เพิ่ม correlation IDs สำหรับ tracing
10. ถ้าจำเป็น → ทำ `/deep-review`
11. reviews หลาย domain บน changes เดียวกัน → spawn profile `review-sweeper` (ใน `## Subagents`) ทีละ domain ขนานกัน (read-only) แล้วรวม findings ก่อนแก้

### 8. Refactor And Cleanup

> Goal: ปรับปรุงคุณภาพโค้ด ตรวจ references และ cleanup

1. ทำ `/refactor` เสมอหลัง implementation เสร็จ — ลด long files, SRP issues (`/refactor-to-srp` — ทุก unit ที่สร้าง/แตะ = 1 reason to change) และ import/exports ให้ผ่าน refactor rules ที่อ่านไว้ตอน step 1
2. ทำ `/improve` ให้ครอบคลุม scope งาน — หา improvements ในไฟล์ที่แตะและระบบที่เกี่ยวข้อง (uxui, error handling, consistency, stability, a11y ตาม context) แล้วแก้ผ่าน domain skills — ไม่จำกัดแค่ TODO items
3. ทำ `/update-references` ถ้ามี move/rename/delete
4. ทำ `/follow-tool-knip` — พิจารณาลบหรือ implement dead code ที่พบ
5. ทำ `/update-dot-devin` หรือ `/update-project` ถ้ามี config/manifest/docs เปลี่ยน
6. ทำ `/update-todo-md` ถ้า TODO.md items เปลี่ยน

### 9. Verify, Rollback Plan, And Finalize

> Goal: code ผ่าน validation พร้อม rollback plan

1. ทำ `/ship verify-only` เป็น canonical verify gate (ห้าม duplicate gate เอง — reference `/ship` ตาม SSOT ของ repo): รัน `/deep-review` → `/deep-validate` → `/run-check` → `/update-tests` + `/run-test all` → `/run-dev` + `/test-usage` ครบชุด แล้วหยุดก่อน push/merge — test gaps ที่เจอระหว่างทาง → `/improve-tests` แล้วเขียน/แก้ specs ผ่าน `/update-tests`; ถ้า project มี coverage target → `/run-test coverage` จนถึงเป้า (default 100%)
2. ทำ `/run-verify` เพื่อตรวจ scan, format, lint, typecheck, test, build
3. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง
4. pre-ship sweep: scan debug leftovers ด้วย `rg "console\.(log|debug)|debugger"`, `/check-secrets secrets-leak` ยืนยันไม่มี secrets หลุด, และ `/run-audit` ตรวจ dependency vulnerabilities
5. ทำ `/watch-browser-and-test` แบบครบทุก route — dispatch user-roleplay subagents ทุก route ใน app (ไม่ใช่แค่ route ที่แตะ): ทุก interactive element, forms valid + invalid, flows หลัก, error/empty/loading states พร้อม evidence; จากนั้น codify flows ที่ผ่านเป็น Playwright suite ผ่าน `/test-e2e` — Playwright report คือ authoritative result
6. ทำ `/test-usage` เพื่อทดสอบ usage examples ใน `README.md`, docs และ `package.json` scripts ว่าทำงานได้จริงก่อน ship
7. สร้าง rollback plan: `git revert <merge-commit>` หรือ redeploy เวอร์ชันเดิม
8. ถ้างานซับซ้อนหรือหลาย workspace → ทำ deep pass เพิ่ม: front-load `/deep-thinking`, `/deep-impact` สำหรับ high-impact changes, จัดลำดับ critical path (schema → data → API → UX) และกำหนด rollback plan ก่อนแต่ละ batch
9. ถ้างานนี้ implement จาก GitHub issue ที่สร้างโดยฉัน → ทำ `/resolve-github-issue-by-me` เพื่อ comment ผลและปิด issue
10. ถ้ามีงานที่ยังไม่เสร็จ blocked หรือ deferred → ทำ `/save-to-todo-md` เพื่อเก็บ remaining items ลง `TODO.md`
11. ทำ `/suggest-next-action` — ถ้าทุกอย่างผ่านและ user ต้องการขึ้น production → ทำ `/ship` ตัวเต็ม (commit/push → PR review gate → merge `main`) หรือ `/release-new-version` เมื่อต้องออก version

### Workflows

> Goal: dispatch ไปยัง workflow ตาม topic/argument

| Topic/Argument | Workflow |
|----------------|----------|
| `setup-infra`, `infra`, `env`, `secrets`, `ci`, `observability` | `workflows/setup-infra/SKILL.md` — infra readiness: env vars, secrets, CI, observability |
| `deploy-production`, `deploy`, `production` | `workflows/deploy-production/SKILL.md` — production deploy gate, verify, rollback |

1. ถ้า argument ตรง topic → อ่าน `workflows/<name>/SKILL.md` แล้วทำตาม flow ในนั้น — ไม่ execute จากตารางนี้โดยตรง
2. ถ้าไม่ระบุ → ทำตาม steps 1-9 ตามลำดับ

## Rules

### 1. No Mock In Production

- ไม่มี mock implementations ใน production code
- ไม่ใช้ simulated delay หรือ in-memory stores แทน real services
- ไม่ silently fall back ไป mock data
- UI ที่ render ได้แต่ใช้ไม่ได้ = mock — ทุก interactive element ต้องทำงานจริงหรือถูกลบออก ไม่มี dead buttons/no-op handlers

### 2. Type And Validation Flow

- Types flow: schema → validation schema → API types → UI types
- ใช้ type inference จาก schema ไม่ประกาศ type ซ้ำ
- หลีกเลี่ยง `any` ใช้ `unknown` แทน

### 3. Safety And User Confirmation

- migrations destructive ต้อง dry-run + user confirm
- external services ไม่พร้อม → report options ก่อน proceed
- secrets/keys ไม่ hardcode ใน code

### 4. Minimal And Maintainable

- อ่าน `/refactor` rules ก่อนลงมือ implement เสมอ — และทำ `/refactor` (`/refactor-to-srp`) หลัง implement เสร็จเสมอ (step 8) ไม่ข้าม
- ทำ `/dont-over-engineer`
- รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน
- ไฟล์ไม่เกิน 250 บรรทัด
- ใช้ /run-build ถ้าจำเป็น

### 5. Plan Always

- ทุกงาน implement ต้องมี plan จาก `/create-plan-in-dot-devin` ก่อน — ห้ามเริ่ม Step 3 โดยไม่มี plan

## Subagents

> Goal: งานอิสระที่ spawn ทำขนานได้ — profile inline ที่นี่ไม่ต้องมีไฟล์แยก; spawn ผ่าน `/use-subagents` ส่ง inputs ตามที่แต่ละ profile กำหนด; `gap-scanner`/`review-sweeper` เป็น read-only, `feature-implementer` แก้เฉพาะ `files` ที่ได้รับ; parent เป็นคนรวมผล + checkpoint commit + verify รวมเสมอ

### feature-implementer — implement feature/gap item เดียว end-to-end — spawn ทีละ item ขนานกัน (full profile: `references/subagent-feature-implementer.md`)

- **Inputs**: `item` (gap item/feature spec จาก gap-scanner หรือ plan file), `files` (scope ไฟล์ที่แก้ได้), `contracts` (types/schemas/API contracts ที่ parent ให้ canonical มา), `conventions` (stack/libraries ที่มีอยู่/style), `verify-cmd` (เช่น `bun test <path>` หรือ `tsc --noEmit`)
- **Tools**: `read`/`write`/`edit` (implement ใน scope `files`), `exec` (รัน `verify-cmd` และ tests — allow `tsc`/`eslint`/`* test`/`* vitest`), `grep` (หา usage patterns เดิม)
- **Execute**: 1 เขียน failing test ที่ lock expected behavior ก่อน (TDD) → 2 implement ตาม `item` ใช้ dep ที่มีก่อน ห้ามเพิ่ม dep ใหม่โดยไม่รายงาน → 3 เชื่อม `contracts` ห้าม redefine types ซ้ำ → 4 รัน `verify-cmd` fail ให้แก้จนผ่านหรือรายงาน blocker → 5 ลบ marker เดิม (`TODO`/`MOCK`/placeholder) เมื่อ implement จริงแล้ว
- **Output**: ตาราง No./File/Change/Test/Notes (เช่น `src/api/users.ts` | real query impl | `pass`); `Test` = `pass`/`fail`/`skipped` + output ถ้า fail; ปิดท้าย files changed, new deps ที่เพิ่ม, markers removed, blockers/deferred items
- **Constraints**: ห้าม mock/stub/placeholder ใหม่ (production code เท่านั้น); รับผิดชอบเฉพาะ `files` (cross-cutting รายงาน parent); ห้าม commit/push — parent เป็นคน checkpoint; secrets ห้าม hardcode — ขาด env/credentials ให้ blocker กลับทันที; ห้าม `git push`/`rm -rf`

### gap-scanner — inventory TODO/MOCK/placeholder/hardcoded ทั้ง codebase (read-only) (full profile: `references/subagent-gap-scanner.md`)

- **Inputs**: `root` (directory ที่ต้องสแกน), `markers` optional (เพิ่มจาก `TODO|FIXME|XXX|HACK|MOCK|FAKE|STUB|placeholder`), `plan-file` optional (path plan/TODO.md ที่ต้องเทียบ items)
- **Tools**: `exec` (รัน ast-grep/grep หา markers + hardcoded values), `read`/`grep` (อ่าน context รอบ marker จำแนกงาน), `find_file_by_name` (หา `TODO.md`, `.env.example`, config files)
- **Execute**: 1 สแกน markers ทั้งหมดใน `root` พร้อม file:line+context รวม dead-UI (`onClick={() => {}}`, `href="#"`, `disabled` ถาวร, `alert(`, 'coming soon'/'ยังไม่พร้อม') → 2 จำแนกแต่ละ item `schema`/`data`/`api`/`ui`/`infra`/`test`/`docs`/`unknown` → 3 เช็คว่าเป็น mock data/stub function/hardcoded value/missing implementation → 4 ถ้ามี `plan-file` เทียบ items → 5 ห้ามแก้ไขไฟล์ (inventory อย่างเดียว)
- **Output**: ตาราง No./Location/Type/Item/Blocking/Effort (เช่น `src/api/users.ts:42` | api | `TODO: real query` | `schema` | small); `Type`=domain category, `Blocking`=item ที่ต้องทำก่อน; ปิดท้าย total items ต่อ domain, suggested order, critical path candidates
- **Constraints**: ห้าม write/edit — scan อย่างเดียว; รายงานทุก marker ที่เจอ ไม่ filter เอง (parent prioritize); อยู่ใน `root` ที่กำหนดเท่านั้น

### review-sweeper — review changes ทีละ domain (security/api/test/observability/resilience) ขนานกัน (read-only) (full profile: `references/subagent-review-sweeper.md`)

- **Inputs**: `domain` เดียว (`security`/`api`/`test`/`observability`/`resilience`), `scope` (ไฟล์/diff ที่ต้อง review), `context` (สิ่งที่ implement ไป)
- **Tools**: `read`/`grep` (อ่าน code + หา patterns ที่เสี่ยง), `exec` (รัน `git diff`, linters, audit commands ของ domain นั้น)
- **Execute**: 1 อ่าน changes ใน `scope` เข้าใจว่า implement อะไร → 2 review ตาม checklist ของ `domain` (security=injection/authz gaps/secrets leak/input validation, api=validation/error handling/rate limit/retry-safety, test=assertion-less tests/unhandled throws/swallowed errors, observability=logging/metrics/correlation IDs, resilience=retry/backoff/graceful degradation/timeouts) → 3 รายงาน findings พร้อม severity ห้ามแก้ไขเอง
- **Output**: ตาราง No./Severity/Location/Finding/Suggested Fix (เช่น high | `src/api/x.ts:20` | unvalidated input to query | use schema validation); `Severity` = `critical`/`high`/`medium`/`low`; ปิดท้าย verdict `pass`/`pass-with-warnings`/`fail` + blocking findings count
- **Constraints**: ห้าม write/edit — review อย่างเดียว; review เฉพาะ `domain` ที่ได้รับ ห้ามข้าม domain; findings ต้องชี้ file:line จริง ห้ามคิดว่าน่าจะมีปัญหา

## Expected Outcome

- ไม่มี TODO/MOCK/placeholder ใน production code — รวม dead UI ทุกจุด
- schema, validation, types, API, UX/UI สมบูรณ์และเชื่อมต่อกัน
- ทุก interactive element ใช้งานได้จริง end-to-end — ผ่าน click-through จริงใน browser
- improvements รอบ scope ถูกหาและแก้ครอบคลุมผ่าน `/improve`
- infrastructure พร้อม production: security, observability, resilience
- ผ่าน canonical verify gate `/ship verify-only` ครบชุด (รวม `/run-test all` และ `/run-verify`) พร้อม handoff ไป `/ship` หรือ `/release-new-version`
- มี rollback plan
