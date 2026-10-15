---
name: implement-to-production
description: แปลง TODO/MOCK/FAKE/placeholder และ dead UI เป็น production code จริง end-to-end พร้อม improve
argument-hint: "[setup-infra|setup-coverage|deploy-production] [scope-or-plan]"
related:
  - report-not-implement
  - design-cli-prototype
  - design-tui-prototype
  - design-web-prototype
  - design-html-prototype
  - deep-review-codebase
  - create-plan-in-dot-devin
  - refactor
  - use-lib-effective
  - use-my-packages-on-registry
  - deep-test
  - update-tests
  - run-verify
  - ship
  - improve
  - update-project
  - resolve-errors
  - follow-secret-manager
  - ask-me
---

## Goal

แปลง TODO, MOCK, FAKE, STUB, placeholder และ dead UI เป็น production code จริง ครบทุกมิติ พร้อม architecture, security, observability และ rollback plan

## Scope

> Argument routing: `setup-infra` (`infra`, `env`, `secrets`, `ci`, `observability`) → ทำ `### 3` ทั้ง readiness แล้ว report · `setup-coverage` (`coverage`) → ทำ `## Setup Coverage` ก่อนเริ่ม TDD loop · `deploy-production` (`deploy`, `production`) → ทำ `### 9` รวม deploy gate + post-deploy verify · ไม่ระบุ → steps 1-9 ตามลำดับ

- input เป็น plan file (`.devin/temp/plan/<workspace>/`), `TODO.md` หรือ loose plan → ทำ `## Input Flows` ก่อน แล้วกลับ flow หลัก
- แปลงทุก unfinished feature เป็น production code: schema, data, API, UX/UI, external services พร้อม infrastructure จริง end-to-end — ไม่รวมงานที่ควรเริ่มจาก architecture ใหม่ (ใช้ `/deep-review-codebase` ก่อน)
- UI ที่ดูเสร็จแต่ใช้ไม่ได้จริงนับเป็น placeholder เช่นกัน — dead buttons, `onClick={() => {}}`, `href="#"`, `disabled` ถาวรโดยไม่มีเหตุผล, dialogs/menus/tabs ที่ไม่เปิด, forms ที่ submit ไม่ได้, 'coming soon' text — ต้อง wire ให้ทำงานจริงหรือลบออก
- ทางเข้าเริ่มต้นคือ `/report-not-implement` (รู้ก่อนว่าอะไรยังไม่มีของ) → implement ทั้งหมดใน report → verify ด้วย `/deep-test` — ห้ามข้าม step แรกหรือเลือกทำเฉพาะบาง item
- item ที่ยังไม่มี design ของ surface (CLI commands/flags, TUI screens, web layout) → ออกแบบก่อนลง code: `/design-cli-prototype` / `/design-tui-prototype` ตอบในแชท หรือ `/design-web-prototype` / `/design-html-prototype` เมื่อต้องเห็นจริง — ห้ามปล่อย stub ใหม่เหลือไว้หลัง implement
- ครอบคลุม improvement รอบ scope งาน ไม่ใช่แค่ TODO items — หลัง implement ต้องผ่าน `/improve` domains ที่เกี่ยวข้อง และถ้า scope มี UI ต้องผ่าน `/improve uxui` (review UI ที่ render จริง ไม่ใช่แค่ source) ด้วย

## Execute

### 1. Review And Baseline

> Goal: เข้าใจ scope และปัญหาก่อน implement

1. ทำ `/review` pre-action gate — เลือกและรัน `review-*` ที่ตรง context แล้วทำ `/deep-review-codebase` ครบทุกมิติหา TODO/MOCK/placeholder และ issues
2. ทำ `/report-not-implement` ทั้ง scope เป็น first step เสมอ (read-only) → ได้ตาราง work queue (`missing`/`fake`/`partial`/`unwired`/`promised`) ครอบคลุม markers, stub, dead UI, route/docs ที่ยังไม่มีของ; ห้ามเริ่ม implement โดยไม่มี report — codebase ใหญ่ → ให้ skill นั้น spawn profile `gap-scanner` ของตัวเองขนานตาม directory; ทำ `/deep-analyze` เพื่อเข้าใจ stack/context และ `/deep-research` ถ้าต้องหา external patterns
3. input เป็น plan file / `TODO.md` / loose plan → ทำ `## Input Flows` ที่ตรงชนิดให้ครบก่อน
4. บันทึก baseline: unfinished items จาก report, files, dependencies, infrastructure gaps — ต้องพึ่ง package ภายนอกที่ยังไม่ได้ติดตั้ง → รัน `/use-my-packages-on-registry` list packages ที่เราเป็น owner ไว้เป็นตัวเลือกแรกก่อนหา dep ภายนอก
5. อ่าน `refactor/SKILL.md` `## Rules` ก่อนเริ่ม implement — code ใหม่ต้องผ่าน refactor standards ตั้งแต่เขียน (รวม SRP split `### 3`): 1 unit = 1 reason to change, ≤250 บรรทัด, preserve public API, minimal change

### 2. Review Architecture

> Goal: ยืนยัน architecture ก่อนลงมือ

1. ทำ `/create-plan-in-dot-devin` เสมอ (มี plan file แล้ว → อ่านและทำตาม) แล้วทำ `/deep-review-codebase` เพื่อดู boundary, layer, data flow
2. implement ใน `packages/`, `crates/` หรือ `apps/` → ทำ `/follow-architecture` เพื่อเลือก+apply pattern ของ directory นั้น (`packages/`/`crates/` → `clean`, `apps/` → `layered`)
3. architecture ไม่ชัดหรือต้องเปลี่ยน structure ใหญ่ → ทำ `/ask-me` ก่อน; ระบุ critical path: schema → data → API → UX/UI

### 3. Verify And Setup Infrastructure

> Goal: env vars, secrets, CI, observability ครบและ verify ได้ก่อน implement

1. ตรวจ database: connection pool, indexes, migrations (pending vs applied ด้วย `/deep-review-codebase`), backup — และ API server: endpoints, rate limit, CORS, auth
2. ทำ `/check-secrets env-vars` เทียบ `.env` / `.env.example` / code usage — อัปเดต `.env.example` ให้ครบทุก variable ที่ code ใช้ (ไม่ใส่ค่าจริง); ขาด credentials ที่ user ต้องให้ → `/ask-me` แล้ว stop รอ
3. เก็บ secrets ผ่าน `/follow-secret-manager` — ห้าม commit; inject เข้า platform ตาม target (`wrangler secret put`, dashboard, CI secrets); ทำ `/check-secrets secrets-leak` ยืนยันไม่มี leak ใน code/config
4. ตรวจ external services: credentials, API keys, endpoints, rate limits
5. ตรวจ CI readiness: ทำ `/setup-cicd` หรือตรวจ workflows ที่มี — lint, typecheck, test, build ครบ, CI secrets ครบ; ติดตั้ง private package ของเราเองจาก registry → เก็บ registry token ด้วย `/follow-secret-manager` แล้ว auth ตาม package manager (`.npmrc`/`NPM_TOKEN`, `CARGO_REGISTRY_*`) ห้าม hardcode token ใน workflow; CI fail → แก้ให้เขียวก่อนไปต่อ
6. Wire observability: structured logging สำหรับ external calls, metrics (response time, error rate), correlation IDs, error tracking/alerting ตาม stack — ไม่มี standard → `/ask-me`
7. Report readiness checklist: app รัน local ด้วย env จริงได้, migrations applied, external services เชื่อมได้; infra ไม่พร้อมและแก้เองไม่ได้ → หยุด, report และ propose options ให้ user เลือก — sub-flow นี้เตรียมความพร้อมเท่านั้น ห้าม deploy หรือแก้ production resources

### 4. Implement Schema And Data Layer

> Goal: schema, validation และ data layer สมบูรณ์

1. สร้าง schema สำหรับ data models ที่ขาด + validation schemas และ types; ตรวจ type flow: schema → validation schema → API types → UI types
2. สร้าง migrations ด้วย dry-run ก่อน apply — ถ้า destructive ต้อง user confirm
3. แทนที่ mock data ด้วย real queries — implement repository/queries; project ใช้/เลือก ORM → ทำ `/follow-lib-drizzle` สำหรับ schema, migrations, queries (ORM อื่น → `/refactor` orm scope)
4. สร้าง seed script สำหรับ test/dev; migrations/seed fail → `/resolve-errors` ก่อนดำเนินต่อ

### 5. Implement API And UX/UI Layer

> Goal: API handlers และ UX/UI เชื่อมกับ API จริง — ทุก interactive element ใช้งานได้ end-to-end

1. Implement API handlers ที่ query data source จริง พร้อม validation, auth middleware, rate limit — project ใช้ oRPC → ทำ `/follow-lib-orpc` (contracts, procedures, typed errors); domain services/error handling ด้วย Effect → ทำ `/follow-lib-effect-ts`; ตรวจ API types ตรงกับ schema และ validation schemas
2. แทนที่ mock data ใน components ด้วย real API calls — เชื่อมผ่าน lib ของ project: TanStack → ทำ `/follow-lib-tanstack-ecosystem` (`Query` = server state, `Form` = forms+validation, `Store` = client state)
3. Implement form validation ด้วย schemas ที่ตรงกับ API และเชื่อม auth UI กับ auth service จริง
4. กวาด UI ทั้งระบบก่อน — enumerate ทุก route และทุก interactive element จาก render จริง (ไม่ใช่จาก source) ด้วย `/deep-test website` แล้วไล่ code ของแต่ละ element ตาม chain: handler → API/usecase → data source → persistence; จำแนกเป็น `works`/`fake` (no-op, mock, hardcoded)/`missing` และเก็บเป็น checklist ลง plan ไฟล์
5. Audit UI ให้ใช้งานได้จริงทุกจุด — ทุก button/link/nav/menu/tab/dialog/dropdown ทำงาน end-to-end: ไม่มี `onClick={() => {}}`, `href="#"`, `disabled` ถาวรโดยไม่มีเหตุผล, 'coming soon', `alert()` placeholder — wire เข้า real action หรือลบออก; แต่ละ element ที่เป็น `fake`/`missing` → spawn profile `feature-implementer` (ใน `## Subagents`) ทีละ item ขนานกัน โดย file sets ห้ามทับกัน
6. ครบทุก UI state — loading, error (พร้อม retry), empty, success, disabled-during-submit — ทุก form submit ได้จริงและ feedback ชัดเจน; ถ้าเหมาะสม → optimistic updates; validation fail → `/resolve-errors`; หลัง implement ซ้ำ → sweep ด้วย `/deep-test website` อีกครั้ง — element ที่ยังใช้ไม่ได้จริง = งานยังไม่เสร็จ

### 6. Convert TODOs And Placeholders

> Goal: ลบ TODO/FIXME/HACK และ placeholders ให้หมด

1. อ่าน `TODO.md` ใน workspace ตรงๆ เพื่อรวบรวม pending items ก่อน implement (หรือ `/update-todo-md` เพื่ออ่าน/enhance prompt)
2. ใช้ทุกรายการจาก `/report-not-implement` (step 1) เป็น queue — ไม่ต้องสแกน marker ซ้ำเอง; พบ item ใหม่ระหว่างทาง → เพิ่มลง queue ทันที; เฉพาะ hardcoded values ที่ report ยังไม่ครอบคลุม → ทำ `/check-secrets hardcoded-values`
3. ถ้า input เป็น `TODO.md` ทั้งงาน → ทำ `## Input Flows` → `TODO.md`
4. แทนที่ MOCK/FAKE/STUB ด้วย real implementations ตาม flow ของ skill นี้ — ทำจนครบทุก item ใน queue ห้ามเลือกทำเฉพาะบาง item แล้วรายงานว่าเสร็จ; items ที่ independent กันหลายตัว → spawn profile `feature-implementer` ทีละ item ขนานกัน (ส่ง contracts จากขั้น 4-5 ให้); features ที่ยัง `missing` จาก checklist ของ `### 5` ก็ทำด้วยวิธีเดียวกัน — เฉพาะ core business, งาน net-new ใหญ่ → `/idea-features` + `/create-plan-in-dot-devin` ก่อน
5. implement แต่ละ feature/fix ด้วย `## TDD Loop` — เขียน failing test ที่ lock behavior ก่อน แล้วเขียน code ให้ผ่าน แล้ว refactor แยก commit
6. ทำ `/use-lib-effective` ก่อนเขียน implementation ใหม่ — ใช้ dep ที่ติดตั้งอยู่หรือ preferred stack ให้เต็มประสิทธิภาพ; ต้องเพิ่ม dependency ใหม่ → ทำ `/use-my-packages-on-registry` ก่อน เพื่อติดตั้ง packages ที่เรา publish เองบน registry แล้วใช้ `/follow-lib-*` ของ package นั้น — ไม่มีตัวที่เหมาะค่อยเลือก dep ภายนอก
7. หลัง implement เสร็จ → ทำ `/update-todo-md` เพื่ออัปเดต status ของ items ที่ทำเสร็จเป็น `done` หรือ `completed`

### 7. Implement Security, Resilience And Observability

> Goal: code ปลอดภัย resilient และติดตามได้เมื่อขึ้น production

1. ทำ `/deep-review-codebase` เพื่อหา vulnerabilities แล้วแก้ findings และ re-review ยืนยันว่าปิดครบ
2. Validate/sanitize user inputs, ใช้ parameterized queries, ห้าม expose secrets — ทำ `/check-secrets secrets-leak` ก่อน ship
3. Implement retry logic, exponential backoff, graceful degradation — ทำ `/deep-review-codebase` กับ mutation endpoints ให้ retry-safe
4. ทำ `/deep-review-codebase` — ไม่มี throw ที่ไม่มี handler หรือ catch ที่ swallow errors; กับ endpoints ที่เปิดใหม่ — กัน abuse/brute force/cost exposure
5. Observability ครบตาม `### 3` — structured logging, metrics, correlation IDs; ทำ `/improve platform` เพื่อหา gaps ครบทั้ง logging/metrics/tracing
6. reviews หลาย domain บน changes เดียวกัน → spawn profile `review-sweeper` (ใน `## Subagents`) ทีละ domain ขนานกัน (read-only) แล้วรวม findings ก่อนแก้

### 8. Refactor And Cleanup

> Goal: ปรับปรุงคุณภาพโค้ด ตรวจ references และ cleanup

1. ทำ `/refactor` เสมอหลัง implementation เสร็จ — ลด long files, SRP issues (`### 3` file/SRP bullet) และ import/exports ให้ผ่าน refactor rules ที่อ่านไว้ตอน step 1
2. ทำ `/improve uxui` เสมอเมื่อ scope มี UI และ wire ใช้งานได้จริงตาม `### 5` แล้ว — prerequisites: dev server รันอยู่ (`/check-open-ports` แล้ว `/run-dev`, reuse ตัวที่รันตอน sweep ของ `### 5`) และ `scope` = ทุก route + element checklist จาก `### 5` พร้อม browser pass (`/watch-browser fix`) เพื่อ review UI ที่ render จริง; ทำจนครบทุก finding ห้ามทำแค่บางส่วน — project ไม่มี UI → ข้ามได้พร้อมรายงานเหตุผล
3. ทำ `/improve` ใน domain อื่นที่แตะ — ไฟล์ที่แตะและระบบที่เกี่ยวข้อง (error handling, consistency, stability, a11y ตาม context); ไม่จำกัดแค่ TODO items
4. ทำ `/update-references` ถ้ามี move/rename/delete; ทำ `/follow-tool-knip` — พิจารณาลบหรือ implement dead code ที่พบ
5. ทำ `/update-project` เสมอหลัง implement + refactor เสร็จ — sync docs, config, rules, AGENTS.md, README, tooling ให้ตรง codebase ปัจจุบัน (ห้ามข้าม เพราะ docs จะ stale ก่อน verify gate); ทำ `/update-dot-devin` ถ้าโครงสร้าง `.devin/` เปลี่ยน; `/update-todo-md` ถ้า TODO.md items เปลี่ยน

### 9. Verify, Deploy Gate, Rollback Plan, And Finalize

> Goal: code ผ่าน validation ครบก่อน ship/deploy — gate เขียว, deploy จริง, verify จริง, rollback plan พร้อม

1. ทำ `/ship verify-only` เป็น canonical verify gate (ห้าม duplicate gate เอง — reference `/ship` ตาม SSOT ของ repo): รัน `/deep-review-codebase` → `/deep-validate` → `/run-check` → `/update-tests` + `/deep-test all` → `/run-dev` + `/deep-test usage` ครบชุด แล้วหยุดก่อน push/merge — test gaps ที่เจอระหว่างทาง → `/improve tests` แล้วเขียน/แก้ specs ผ่าน `/update-tests`; ถ้า project มี coverage target → `/deep-test coverage` จนถึงเป้า (default 100%)
2. ทำ `/run-verify` เพื่อตรวจ scan, format, lint, typecheck, test, build — ไม่ผ่าน → `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง; ยัง fail → stop report ห้าม deploy
3. pre-ship sweep: scan debug leftovers ด้วย `rg "console\.(log|debug)|debugger"`, `/check-secrets secrets-leak` ยืนยันไม่มี secrets หลุด, และ `/run-audit` ตรวจ dependency vulnerabilities
4. ทำ `/deep-test website` (Roleplay Mode) ครบทุก route ใน app (ไม่ใช่แค่ route ที่แตะ): ทุก interactive element, forms valid + invalid, flows หลัก, error/empty/loading states พร้อม evidence; จากนั้น codify flows ที่ผ่านเป็น Playwright suite ผ่าน `/deep-test e2e` — Playwright report คือ authoritative result
5. ยืนยัน rollback plan แบบ executable ไม่ใช่แค่ note: ระบุ method (`git revert <merge-commit>`, redeploy เวอร์ชันเดิม, platform rollback) และบันทึก current production version/revision ไว้เทียบ; deploy เป็น destructive (DB migration, breaking API) → `/ask-me` confirm ก่อน
6. ถ้าต้อง deploy จริง: ทำ `/run-deploy` หรือ `/follow-deploy` (dispatch ไป `deploy-to-<platform>`) — deploy staging/preview ก่อนถ้า platform รองรับ, เก็บ deployment URL + version/revision เสมอ
7. post-deploy verify: smoke test critical paths บน production URL จริง, ตรวจ logs/metrics/error tracking ไม่มี error spike, เทียบ behavior กับผล `/run-check` ที่ผ่านมา — fail → execute rollback plan ทันทีแล้ว report
8. ถ้างานซับซ้อนหรือหลาย workspace → ทำ deep pass เพิ่ม: front-load `/deep-thinking`, `/deep-analyze` สำหรับ high-impact changes, จัดลำดับ critical path (schema → data → API → UX) และกำหนด rollback plan ก่อนแต่ละ batch
9. ถ้างานนี้ implement จาก GitHub issue ที่สร้างโดยฉัน → `/resolve-github-issue-by-me` เพื่อ comment ผลและปิด issue; งานค้าง/blocked/deferred → `/save-to-todo-md` เก็บ remaining items ลง `TODO.md`
10. ทำ `/suggest-next-action` — ถ้าทุกอย่างผ่านและ user ต้องการขึ้น production → ทำ `/ship` ตัวเต็ม (commit/push → PR review gate → merge `main`) หรือ `/release-new-version` เมื่อต้องออก version

## TDD Loop

> merged จาก `/follow-tdd` (จาก `references/tdd.md`) — ใช้กับทุกงานที่สร้าง/เปลี่ยน behavior; ข้ามได้เฉพาะ pure docs/config/style edits ที่ไม่มี runtime behavior; project ยังไม่มี test framework หรือ coverage tooling → ทำ `## Setup Coverage` (หรือ `/follow-tool-vitest`/`/follow-tool-nextest`) ก่อน; behavior contract ไม่ชัด → `/ask-me` ก่อนเขียน test

1. Understand: อ่าน spec/issue/plan item/`TODO.md` row — expected input/output และ error cases ต้องระบุได้ในประโยคเดียว; เช็ค tests เดิมของ unit นั้น — extend แทน to duplicate; ทำทีละ smallest testable behavior (หนึ่ง function, หนึ่ง rule, หนึ่ง endpoint response)
2. Write the failing test: หนึ่ง test = หนึ่ง behavior, ชื่อ state scenario + expectation (`rejects expired token` ไม่ใช่ `test1`); assert บน public contract จริง (return value, thrown error, HTTP status, rendered state) ไม่ใช่ internal calls; รันแล้วต้อง fail ด้วยเหตุผลที่คาด — pass ครั้งแรก = test ไม่ assert อะไรเลยหรือ feature มีอยู่แล้ว; ห้าม placeholder assertions/empty tests
3. Make it pass: เขียน code แค่พอให้ test ผ่าน — ไม่ speculative branches, ไม่ extra features, ไม่ refactor ในขั้นนี้ (Two Hats); รันทั้ง suite ไม่ใช่แค่ test ใหม่ — test อื่นพัง → แก้ก่อนไปต่อ; เพิ่ม dep เฉพาะเมื่อ manifest/catalog รับรองแล้ว
4. Refactor: rename, ลด duplication, split by concern — apply `/refactor` `## Rules` + `## Smells → Techniques`; re-run tests หลัง refactor ทีละครั้ง — suite แดงกลางทาง → revert เฉพาะ step นั้น; หยุดเมื่อ code อ่านชัด (`/dont-over-engineer`, rule of three); structural changes อยู่คนละ commit กับ implementation
5. Repeat and integrate: วนข้อ 2-4 ทีละ behavior, `/git-commit` checkpoint ทุก green cycle; cover boundary cases ที่ implementation เผยออก: empty/invalid input, concurrent/duplicate calls, permission denied, upstream failure; property-based/fuzz → `/deep-test property`, database-backed → `/deep-test database`, cross-module contracts → `/deep-test contract`; จบ item → full suite + `/run-check` + `/run-verify`
- ไม่มี production code โดยไม่มี failing test ที่ lock behavior ก่อน — test ที่เขียนหลัง code พิสูจน์ไม่ได้ว่า behavior ถูก lock; untested legacy code → characterization tests ก่อน (`/update-tests`)
- หนึ่ง test asserts หนึ่ง behavior — หลาย behavior ใน test เดียว → split; หนึ่ง cycle commit หนึ่ง concern ไม่ mix refactor/fix/feature; ทุก cycle จบด้วย green suite ไม่ใช่ visual check; assertion ที่ไม่มีทาง fail = dead test → ตรวจ/แก้ผ่าน `/deep-test test-correctness`

## Input Flows

> merged จาก `references/input-flows.md` — input เป็น artifact (plan file, `TODO.md`, loose plan) → แปลงเป็น task queue เดียวก่อน แล้วกลับ flow หลัก (`### 1`–`### 9`); input เป็น source of truth ของ scope ไม่ใช่ implementation strategy; ห้ามทำ task ที่ยังไม่ถูกถอดลง queue และห้าม task ซ้ำสองแหล่ง; อัปเดต status ในไฟล์ทันทีที่เสร็จแต่ละ task; งานค้าง/blocked → `/save-to-todo-md` ก่อนจบ session

- Plan File (`.devin/temp/plan/<workspace>/<title-date>.md`): ระบุไฟล์จาก argument (path/title; ไม่มี → list แล้วถาม user เลือก) → สร้าง task list จาก task `status: pending` จัดลำดับตาม `## Execution Order` แล้วทำทีละข้อจาก critical path (ซับซ้อน → `/create-plan-in-dot-devin` ซ้ำก่อนลงมือ) → อัปเดต status `in-progress`/`completed` ระหว่างทำ → ทุก task `completed` → `/deep-validate` + `/run-verify` → ลบไฟล์แผนเมื่องานครบเท่านั้น (ห้ามลบก่อนยืนยัน) → รายงานสรุป; ต้องเปลี่ยนแผนหรือ task เสี่ยงสูง → `/ask-me` ก่อน; ถ้าแผนไม่ต้องลบไฟล์ → ใช้ bullet Loose Plan แทน
- TODO.md (project root — ไม่มี → stop และ report): แยก table rows (Title/Description/Status/Priority/Created) → กรอง `pending`/`in-progress` เรียง priority high→medium→low, task ที่ไม่มี blocker ก่อน, created เก่า→ใหม่ → implement ทีละ task ด้วย flow หลัก (task ง่ายและมี state อยู่แล้ว → `/continue`; ซับซ้อน → `/create-plan-in-dot-devin` ก่อน; ไม่ชัดเจน → ถาม user) → mark `completed`/`blocked` พร้อมเหตุผลทันที เพิ่ม sub-task เมื่อจำเป็น → วนจนไม่มี `pending` (`blocked` เหลือ → report และถาม user) → ปิดท้าย `/deep-validate` → `/run-verify` → `/ship` → `/report` สรุปทุก task
- Loose Plan (`AGENTS.md`/`PLAN.md`/เอกสารทั่วไป — merged จาก `/follow-plan`, ไม่ต้องลบไฟล์): อ่าน `AGENTS.md` ใน project root → ไม่พบ → หา `PLAN.md`, `plan.md`, `TODO.md` หรือ context ที่ user ให้ → สกัด steps จาก headings/bullets/numbered list (ไม่มี plan → stop และ report) → แปลงแต่ละ step เป็น workflow (`/name`), skill, shell command หรือ decision + ระบุลำดับ/dependencies (step ไม่ชัด → ถาม user) → สร้าง todo list, ทำทีละ step (มีหนึ่ง `in_progress` เท่านั้น), อ่าน workflow/skill file จริงก่อน invoke แล้วทำตาม `## Execute` ของมัน, ตรวจ `## Expected Outcome` ก่อน mark `completed`, workflow ที่มี sub-workflows → ทำ recursive — ไม่ตีความ "ทำ xxx" เป็น concept ต้องทำจริง, ไม่ทำ step ที่ไม่ได้ระบุใน plan โดยไม่ได้รับอนุญาต → step ไม่ผ่าน → `/resolve-errors` retry ≤3 ยังไม่ผ่าน → stop + report; user อนุญาตข้าม → mark ⏭️ → ทุก step จบ → รวมผลเป็นตาราง status (✅/❌/⏭️) แล้วกลับ flow หลัก; step เสี่ยงสูง (deploy, push, delete) → `/ask-me` ก่อน, ไม่ force push/force merge; งานค้าง → `/suggest-next-action`

## Setup Coverage

> merged จาก `workflows/setup-coverage/` — dispatch จาก `## Scope` argument `setup-coverage`/`coverage`; ใช้เมื่อ project ยังไม่มี coverage tooling หรือต้อง setup ใหม่ก่อนเริ่ม TDD loop; รองรับ Bun/Node (vitest), Rust (llvm-cov), Go (built-in), Python (pytest-cov); setup tooling เท่านั้น — เขียน test → `/update-tests`, เติม gap coverage → `/improve coverage`

1. Detect ecosystem and state: ตรวจ manifest (`package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`), test framework ที่มี (vitest, cargo test/nextest, go test, pytest) และ coverage state เดิม (config, devDeps, CI step — idempotent check); ไม่มี test framework → `/use-related-skills` เพื่อหา `follow-tool-vitest` ฯลฯ ก่อน
2. Install ตาม ecosystem (ใช้ tool มาตรฐานเท่านั้น — ห้ามซ้ำซ้อน; tool/version ไม่แน่ใจ → ดู official docs ก่อน install ห้ามเดา flags): Bun/Node → `@vitest/coverage-v8` (`vitest run --coverage`) · Rust → `cargo-llvm-cov` (`cargo llvm-cov`) · Go → built-in (`go test -coverprofile=coverage.out ./...`) · Python → `pytest-cov` (`pytest --cov`); ติดตั้งผ่าน package manager ของ project; เพิ่ม script `test:coverage` ใน manifest (ตาม `/follow-test` rules); ตั้ง coverage config ขั้นต่ำ — provider, include/exclude patterns, reporters
3. Configure thresholds and output: ตั้ง output dir (เช่น `coverage/`) และเพิ่มใน `.gitignore` — coverage output ห้าม commit เสมอ; thresholds ตาม level ของ `/follow-test` (Minimal 70% / Standard ~85% / Complete ~90%+) ถ้า tool รองรับ — อย่าตั้งเกินจน block TDD loop; reporters: text สำหรับ terminal + html/lcov สำหรับ CI
4. Wire CI and verify: เพิ่ม coverage step ใน CI workflow ถ้ามี — ยังไม่มี pipeline → `/setup-cicd`; รัน coverage command ต้องออก report สำเร็จ; ทำ `/deep-test coverage` ยืนยัน report ถูกต้อง (ยังไม่มี test suite → `/update-tests` ก่อนวัด); fail → `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- No Mock In Production — เริ่มงานด้วย `/report-not-implement` เสมอ ปิดให้ครบทุก item — ทำไม่ได้ต้อง report เป็น blocked/deferred พร้อมเหตุผล ไม่ใช่หายไปเงียบๆ; ไม่มี mock implementations, simulated delay, in-memory stores แทน real services หรือ silent fallback ไป mock data ใน production code; UI ที่ render ได้แต่ใช้ไม่ได้ = mock — ทุก interactive element ต้องทำงานจริงหรือถูกลบออก
- Type And Validation Flow — types flow: schema → validation schema → API types → UI types; ใช้ type inference จาก schema ไม่ประกาศ type ซ้ำ; หลีกเลี่ยง `any` ใช้ `unknown` แทน
- Safety And User Confirmation — migrations destructive ต้อง dry-run + user confirm; external services ไม่พร้อม → report options ก่อน proceed; secrets/keys ไม่ hardcode — เก็บด้วย `/follow-secret-manager` เสมอ; gate ใน `### 9` ต้องเขียวก่อน deploy ไม่มี exception; เก็บ URL + version ทุก deploy
- Minimal And Maintainable — อ่าน `/refactor` rules ก่อนลงมือ implement เสมอ และทำ `/refactor` หลัง implement เสร็จเสมอ (step 8) ไม่ข้าม; ทำ `/dont-over-engineer` — จะเขียนใหม่หรือเจอ duplicates → `/use-lib-effective`; dep ใหม่ → เช็ค packages ที่เราเป็น owner ด้วย `/use-my-packages-on-registry` ก่อน dep ภายนอก; รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน; ไฟล์ไม่เกิน 250 บรรทัด
- Plan Always — ทุกงาน implement ต้องมี plan จาก `/create-plan-in-dot-devin` ก่อน — ห้ามเริ่ม Step 3 โดยไม่มี plan
- Test First — ไม่มี production code โดยไม่มี failing test ที่ lock behavior ก่อน (ตาม `## TDD Loop`); project ยังไม่มี coverage tooling → ทำ `## Setup Coverage` ก่อนเพื่อวัดผลได้จริง; หลัง implement ครบทุก item → `/deep-test` ทุก domain ที่แตะ (`unit`/`integration`/`api`/`e2e`/`website`) จนเขียวก่อนเข้า verify gate ใน `### 9` — test ที่ยังไม่เขียว = งานยังไม่เสร็จ; แยก commit: test ที่ red → implementation ที่ green → refactor ตาม `### 8` ไม่ mix behavior

## Subagents

> Goal: งานอิสระที่ spawn ทำขนานได้ผ่าน `/use-subagents` — profile inline ที่นี่; parent เป็นคนรวมผล + checkpoint commit + verify รวมเสมอ; inventory gaps ใช้ profile `gap-scanner` ของ `/report-not-implement` (owner เดียว ห้าม copy มาไว้ที่นี่)

- `feature-implementer` — implement feature/gap item เดียว end-to-end (spawn ทีละ item ขนานกัน, file sets ห้ามทับกัน): inputs `item` (gap item จาก `/report-not-implement` หรือ plan file), `files` (scope ที่แก้ได้), `contracts` (types/schemas/API ที่ parent ให้ canonical มา — ห้าม redefine ซ้ำ), `conventions` (stack/libraries/style), `verify-cmd` (เช่น `bun test <path>`, `tsc --noEmit`); Execute: เขียน failing test ที่ lock expected behavior ก่อน (TDD) → implement ตาม `item` ใช้ dep ที่มีก่อน → เชื่อม `contracts` → รัน `verify-cmd` fail → แก้หรือรายงาน blocker → ลบ marker เดิมเมื่อ implement จริง; Output: ตาราง No./File/Change/Test (`pass`/`fail`/`skipped`)/Notes + files changed + new deps + markers removed + blockers; Constraints: ห้าม mock/stub/placeholder ใหม่, ไม่เพิ่ม dep เอง (ต้องใช้ package ที่ยังไม่ได้ติดตั้ง → blocker กลับพร้อมเหตุผล ให้ parent รัน `/use-my-packages-on-registry` ก่อน), ไม่ commit/push (parent checkpoint), secrets ห้าม hardcode — ขาด env/credentials → blocker ทันที, ห้าม `git push`/`rm -rf`
- `review-sweeper` — review changes ทีละ domain ขนานกัน (read-only): inputs `domain` เดียว (`security`/`api`/`test`/`observability`/`resilience`), `scope` (ไฟล์/diff), `context`; Execute: อ่าน changes → review ตาม checklist ของ domain (security = injection/authz gaps/secrets leak/input validation, api = validation/error handling/rate limit/retry-safety, test = assertion-less tests/unhandled throws/swallowed errors, observability = logging/metrics/correlation IDs, resilience = retry/backoff/graceful degradation/timeouts) → รายงาน findings พร้อม severity ห้ามแก้ไขเอง; Output: ตาราง No./Severity (`critical`/`high`/`medium`/`low`)/Location/Finding/Suggested Fix + verdict `pass`/`pass-with-warnings`/`fail` + blocking count; Constraints: ห้าม write/edit, review เฉพาะ domain ที่ได้รับ, findings ต้องชี้ file:line จริงห้ามเดา

## Expected Outcome

- รู้รายการสิ่งที่ยังไม่ implement จริงทั้ง scope จาก `/report-not-implement` ก่อนเริ่ม แล้วปิดครบทุก item (หรือ report เป็น blocked/deferred พร้อมเหตุผล)
- ไม่มี TODO/MOCK/placeholder ใน production code — รวม dead UI ทุกจุด; schema, validation, types, API, UX/UI สมบูรณ์และเชื่อมต่อกัน
- ทุก interactive element ใช้งานได้จริง end-to-end — ผ่าน click-through จริงใน browser
- improvements รอบ scope ถูกหาและแก้ครอบคลุมผ่าน `/improve`; UI ผ่าน `/improve uxui` บน render จริงครบทุก finding (หรือข้ามพร้อมเหตุผลถ้าไม่มี UI); dep ใหม่ที่จำเป็นถูกเลือกผ่าน `/use-my-packages-on-registry` ก่อน dep ภายนอก พร้อม verify ใน manifest/lockfile
- infrastructure พร้อม production: security, observability, resilience — env/secrets ครบ, CI เขียว, observability wired
- ผ่าน canonical verify gate `/ship verify-only` ครบชุด (รวม `/deep-test all` และ `/run-verify`) พร้อม handoff ไป `/ship` หรือ `/release-new-version`; ถ้า deploy → post-deploy verify ผ่านพร้อม URL + version
- มี rollback plan แบบ executable และ suite เขียวตาม `## TDD Loop` ทุก behavior ที่ implement
