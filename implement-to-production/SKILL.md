---
name: implement-to-production
description: แปลง TODO/MOCK/FAKE/placeholder และ dead UI เป็น production code จริง end-to-end พร้อม improve
argument-hint: "[setup-infra|setup-coverage|deploy-production] [scope-or-plan]"
related:
  - deep-review
  - deep-analyze
  - create-plan-in-dot-devin
  - ask-me
  - check-secrets
  - report-not-implement
  - deep-validate
  - run-verify
  - deep-test
  - resolve-errors
  - use-lib-effective
  - use-my-packages-on-registry
  - use-subagents
  - follow-review
  - refactor
  - follow-lib-drizzle
  - follow-lib-effect-ts
  - follow-lib-orpc
  - follow-lib-tanstack-ecosystem
  - update-todo-md
  - use-astgrep
  - update-references
  - follow-tool-knip
  - run-audit
  - dont-over-engineer
  - improve
  - update-tests
  - watch-browser
  - ship
  - release-new-version
  - follow-secret-manager
  - setup-cicd
  - follow-deploy
  - run-deploy
  - follow-plan
---

## Goal

แปลง TODO, MOCK, FAKE, STUB, placeholder เป็น production code จริง ครบทุกมิติ พร้อม architecture, security, observability และ rollback plan

## Scope

- input เป็นไฟล์แผน `.devin/temp/plan/<workspace>/<title-date>.md` หรือ `TODO.md` task list → ทำ `references/input-flows.md` ก่อน แล้วกลับ flow หลัก
- argument `setup-infra` (`infra`, `env`, `secrets`, `ci`, `observability`) → execute `### 3` ครบทั้ง readiness แล้ว report; `deploy-production` (`deploy`, `production`) → execute `### 9` รวม deploy gate + post-deploy verify; ไม่ระบุ → steps 1-9 ตามลำดับ
- แปลงทุก unfinished features เป็น production code: schema, data, API, UX/UI, external services พร้อม infrastructure จริง end-to-end — ไม่รวมงานที่ควรเริ่มจาก architecture ใหม่ (ใช้ `/deep-review` ก่อน)
- UI ที่ดูเสร็จแต่ใช้ไม่ได้จริง นับเป็น placeholder เช่นกัน — dead buttons, `onClick={() => {}}`, `href="#"`, `disabled` ถาวรโดยไม่มีเหตุผล, dialogs/menus/tabs ที่ไม่เปิด, forms ที่ submit ไม่ได้, 'coming soon' text — ต้อง wire ให้ทำงานจริงหรือลบออก
- ทางเข้าเริ่มต้นคือ `/report-not-implement` (รู้ก่อนว่าอะไรยังไม่มีของ) → implement ทั้งหมดใน report → verify ด้วย `/deep-test` — ห้ามข้าม step แรกหรือเลือกทำเฉพาะบาง item
- ครอบคลุม improvement รอบ scope งาน ไม่ใช่แค่ TODO items — หลัง implement ต้องผ่าน `/improve` domains ที่เกี่ยวข้อง และถ้า scope มี UI ต้องผ่าน `/improve uxui` (review UI ที่ render จริง ไม่ใช่แค่ source) ด้วย

## Execute

### 1. Review And Baseline

> Goal: เข้าใจ scope และปัญหาก่อน implement

1. ทำ `/follow-review` เป็น gate ก่อน implement — เลือกและรัน `review-*` ที่ตรง context แล้วทำ `/deep-review` ครบทุกมิติ เพื่อหา TODO/MOCK/placeholder และ issues
2. ทำ `/report-not-implement` ทั้ง scope เป็น first step เสมอ (read-only) → ได้ตาราง work queue (`missing`/`fake`/`partial`/`unwired`/`promised`) ที่ครอบคลุม markers, stub, dead UI, route/docs ที่ยังไม่มีของ; ห้ามเริ่ม implement โดยไม่มี report — codebase ใหญ่ → ให้ skill นั้น spawn profile `gap-scanner` ของตัวเองขนานตาม directory; ทำ `/deep-analyze` เพื่อเข้าใจ stack/context และ `/deep-research` ถ้าต้องหา external patterns หรือ sources
3. ถ้ามี `.devin/temp/plan/<workspace>/<title-date>.md` → ทำ `## Plan File` ใน `references/input-flows.md` ให้ครบก่อน
4. บันทึก baseline: รายการ unfinished items จาก report ของ step 2, files, dependencies, infrastructure gaps — ถ้างานต้องพึ่ง package ภายนอกที่เรายังไม่ได้ติดตั้ง → รัน `/use-my-packages-on-registry` เพื่อ list packages ที่เราเป็น owner บน registry ไว้เป็นตัวเลือกแรกก่อนหา dep จากภายนอก
5. อ่าน `refactor/SKILL.md` `## Rules` ก่อนเริ่ม implement — code ใหม่ต้องผ่าน refactor standards ตั้งแต่เขียน (รวม SRP split `### 2`): 1 unit = 1 reason to change, ≤250 บรรทัด, preserve public API, minimal change

### 2. Review Architecture

> Goal: ยืนยัน architecture ก่อนลงมือ

1. ทำ `/create-plan-in-dot-devin` เสมอ เพื่อวางแผน implement อย่างละเอียด (ถ้ามี plan file อยู่แล้วให้อ่านและทำตาม) แล้วทำ `/deep-review` เพื่อดู boundary, layer, data flow
2. ทำ `/refactor architecture` เมื่อ implement ใน `packages/`, `crates/` หรือ `apps/` เพื่อ apply pattern convention ของ directory นั้น (`packages/`/`crates/` → `clean`, `apps/` → `layered`; pattern selection อยู่ใน `/follow-architecture` + `follow-architecture/references/architecture.md`)
3. ถ้า architecture ไม่ชัดหรือต้องเปลี่ยน structure ใหญ่ → ทำ `/ask-me` ก่อน; ระบุ critical path: schema → data → API → UX/UI

### 3. Verify And Setup Infrastructure

> Goal: ตรวจและเตรียม infrastructure ให้พร้อมก่อน implement — env vars, secrets, CI, observability ครบและ verify ได้

1. ตรวจ database: connection pool, indexes, migrations (เทียบ pending vs applied ด้วย `/deep-review`), backup
2. ตรวจ API server: endpoints, rate limit, CORS, auth
3. ทำ `/check-secrets env-vars` เทียบ `.env` / `.env.example` / code usage — สร้าง/อัปเดต `.env.example` ให้ครบทุก variable ที่ code ใช้ (ไม่ใส่ค่าจริง); ขาด credentials ที่ user ต้องให้ → `/ask-me` แล้ว stop รอ
4. เก็บ secrets ผ่าน `/follow-secret-manager` — ห้าม commit; inject เข้า platform ตาม target (`wrangler secret put`, dashboard, CI secrets); ทำ `/check-secrets secrets-leak` ยืนยันไม่มี leak ใน code/config
5. ตรวจ external services: credentials, API keys, endpoints, rate limits
6. ตรวจ CI readiness: ทำ `/setup-cicd` หรือตรวจ workflows ที่มี — lint, typecheck, test, build ครบ, CI secrets ครบ (registry/deploy tokens); ต้องติดตั้ง private package ของเราเองจาก registry → เก็บ registry token ด้วย `/follow-secret-manager` แล้ว auth ตาม package manager (`.npmrc`/`NPM_TOKEN`, `CARGO_REGISTRY_*` token, `pip` index auth) ห้าม hardcode token ใน workflow; CI fail → แก้ให้เขียวก่อนไปต่อ
7. Wire observability: structured logging สำหรับ external calls, metrics (response time, error rate), correlation IDs สำหรับ tracing, error tracking/alerting ตาม stack — ไม่มี standard → `/ask-me`
8. Report readiness checklist: app รัน local ด้วย env จริงได้ (ไม่มี missing var errors), migrations applied, external services เชื่อมได้; ถ้า infra ไม่พร้อมและแก้เองไม่ได้ → หยุด, report และ propose options ให้ user เลือก — sub-flow นี้เตรียมความพร้อมเท่านั้น ห้าม deploy หรือแก้ production resources

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
5. กวาด UI ทั้งระบบก่อน — enumerate ทุก route และทุก interactive element จาก render จริง (ไม่ใช่จาก source) ด้วย `/deep-test website` แล้วไล่ code ของแต่ละ element ตาม chain: handler → API/usecase → data source → persistence; จำแนกเป็น `works`/`fake` (no-op, mock, hardcoded)/`missing` และเก็บเป็น checklist ลง plan ไฟล์
6. Audit UI ให้ใช้งานได้จริงทุกจุด — ทุก button/link/nav/menu/tab/dialog/dropdown ต้องทำงาน end-to-end: ไม่มี `onClick={() => {}}`, `href="#"`, `disabled` ถาวรโดยไม่มีเหตุผล, 'coming soon', `alert()` placeholder — wire เข้า real action หรือลบออก; แต่ละ element ที่เป็น `fake`/`missing` → spawn profile `feature-implementer` (ใน `## Subagents`) ทีละ item ขนานกัน โดย file sets ห้ามทับกัน
7. ครบทุก UI state — loading, error (พร้อม retry), empty, success, disabled-during-submit — ทุก form submit ได้จริงและ feedback ชัดเจน
8. ถ้าเหมาะสม → implement optimistic updates; ถ้า validation fail → `/resolve-errors`; หลัง implement ซ้ำ sweep ด้วย `/deep-test website` อีกครั้ง — element ที่ยังใช้ไม่ได้จริง = งานยังไม่เสร็จ

### 6. Convert TODOs And Placeholders

> Goal: ลบ TODO/FIXME/HACK และ placeholders

1. อ่าน `TODO.md` ใน workspace โดยตรงเพื่อรวบรวม pending items ก่อน implement (หรือ `/update-todo-md` เพื่ออ่าน/enhance prompt)
2. ใช้ทุกรายการจาก `/report-not-implement` (step 1) เป็น queue — ไม่ต้องสแกน marker ซ้ำเอง; พบ item ใหม่ระหว่างทาง → เพิ่มลง queue ทันที; เฉพาะ hardcoded values ที่ report ยังไม่ครอบคลุม → ทำ `/check-secrets hardcoded-values`
3. ถ้า input เป็น `TODO.md` ทั้งงาน → ทำ `## TODO.md` ใน `references/input-flows.md`
4. แทนที่ MOCK/FAKE/STUB ด้วย real implementations ตาม flow ของ skill นี้ — ทำจนครบทุก item ใน queue ห้ามเลือกทำเฉพาะบาง item แล้วรายงานว่าเสร็จ; items ที่ independent กันหลายตัว → spawn profile `feature-implementer` (ใน `## Subagents`) ทีละ item ขนานกัน (ส่ง contracts จากขั้น 4-5 ให้); features ที่ยัง `missing` จาก checklist ของ `### 5` ก็ทำด้วยวิธีเดียวกัน — เฉพาะ core business, งาน net-new ใหญ่ → `/idea-features` + `/create-plan-in-dot-devin` ก่อน
5. implement แต่ละ feature/fix ด้วย TDD loop ใน `references/tdd.md` (merged จาก `/follow-tdd`) — เขียน failing test ที่ lock behavior ก่อน แล้วค่อยเขียน code ให้ผ่าน แล้ว refactor แยก commit
6. ทำ `/use-lib-effective` ก่อนเขียน implementation ใหม่ — ใช้ dep ที่ติดตั้งอยู่หรือ preferred stack ให้เต็มประสิทธิภาพแทนการ reinvent; ถ้ามี library ที่เหมาะกว่า → ทำ `/deep-review`; ต้องเพิ่ม dependency ใหม่ → ทำ `/use-my-packages-on-registry` ก่อน เพื่อติดตั้ง packages ที่เรา publish เองบน registry (เลือก dep class แล้ว verify ผ่าน manifest + tests) แล้วใช้ `/follow-lib-*` ของ package นั้น — ไม่มีตัวที่เหมาะค่อยเลือก dep ภายนอก
7. หลัง implement เสร็จ → ทำ `/update-todo-md` เพื่ออัปเดต status ของ items ที่ทำเสร็จเป็น `done` หรือ `completed`

### 7. Implement Security, Resilience And Observability

> Goal: code ปลอดภัย resilient และติดตามได้เมื่อขึ้น production

1. ทำ `/deep-review` เพื่อหา vulnerabilities แล้วแก้ findings และ re-review ยืนยันว่าปิดครบ
2. Validate/sanitize user inputs, ใช้ parameterized queries, ห้าม expose secrets — ทำ `/check-secrets secrets-leak` ก่อน ship
3. Implement retry logic, exponential backoff, graceful degradation — ทำ `/deep-review` กับ mutation endpoints ให้ retry-safe
4. ทำ `/deep-review` — ไม่มี throw ที่ไม่มี handler หรือ catch ที่ swallow errors
5. ทำ `/deep-review` กับ endpoints ที่เปิดใหม่ — กัน abuse/brute force/cost exposure
6. Observability ครบตาม `### 3` — structured logging, metrics (response time, error rate), correlation IDs; ทำ `/improve platform` เพื่อหา gaps ครบทั้ง logging/metrics/tracing
7. reviews หลาย domain บน changes เดียวกัน → spawn profile `review-sweeper` (ใน `## Subagents`) ทีละ domain ขนานกัน (read-only) แล้วรวม findings ก่อนแก้

### 8. Refactor And Cleanup

> Goal: ปรับปรุงคุณภาพโค้ด ตรวจ references และ cleanup

1. ทำ `/refactor` เสมอหลัง implementation เสร็จ — ลด long files, SRP issues (`/refactor` step 2 — ทุก unit ที่สร้าง/แตะ = 1 reason to change) และ import/exports ให้ผ่าน refactor rules ที่อ่านไว้ตอน step 1
2. ทำ `/improve uxui` เสมอเมื่อ scope มี UI และ wire ใช้งานได้จริงตาม `### 5` แล้ว — prerequisites ที่ต้องพร้อมก่อนเรียก: dev server รันอยู่ (`/check-open-ports` แล้ว `/run-dev`, reuse ตัวที่รันตอน sweep ของ `### 5`) และ `scope` = ทุก route + element checklist จาก `### 5` step 5 พร้อม browser pass (`/watch-browser fix`) เพื่อ review UI ที่ render จริง; ทำจนครบทุก finding ของ `/improve uxui` ห้ามทำแค่บางส่วน — project ไม่มี UI → ข้ามได้พร้อมรายงานเหตุผล
3. ทำ `/improve` ใน domain อื่นที่แตะ — หา improvements ในไฟล์ที่แตะและระบบที่เกี่ยวข้อง (error handling, consistency, stability, a11y ตาม context) แล้วแก้ผ่าน domain skills — ไม่จำกัดแค่ TODO items
4. ทำ `/update-references` ถ้ามี move/rename/delete
5. ทำ `/follow-tool-knip` — พิจารณาลบหรือ implement dead code ที่พบ
6. ทำ `/update-dot-devin` หรือ `/update-project` ถ้ามี config/manifest/docs เปลี่ยน; `/update-todo-md` ถ้า TODO.md items เปลี่ยน

### 9. Verify, Deploy Gate, Rollback Plan, And Finalize

> Goal: code ผ่าน validation ครบก่อน ship/deploy — gate เขียว, deploy จริง, verify จริง, rollback plan พร้อม

1. ทำ `/ship verify-only` เป็น canonical verify gate (ห้าม duplicate gate เอง — reference `/ship` ตาม SSOT ของ repo): รัน `/deep-review` → `/deep-validate` → `/run-check` → `/update-tests` + `/deep-test all` → `/run-dev` + `/deep-test usage` ครบชุด แล้วหยุดก่อน push/merge — test gaps ที่เจอระหว่างทาง → `/improve tests` แล้วเขียน/แก้ specs ผ่าน `/update-tests`; ถ้า project มี coverage target → `/deep-test coverage` จนถึงเป้า (default 100%)
2. ทำ `/run-verify` เพื่อตรวจ scan, format, lint, typecheck, test, build — ไม่ผ่าน → `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง; ยัง fail → stop report ห้าม deploy
3. pre-ship sweep: scan debug leftovers ด้วย `rg "console\.(log|debug)|debugger"`, `/check-secrets secrets-leak` ยืนยันไม่มี secrets หลุด, และ `/run-audit` ตรวจ dependency vulnerabilities
4. ทำ `/deep-test website` (Roleplay Mode) แบบครบทุก route — dispatch user-roleplay subagents ทุก route ใน app (ไม่ใช่แค่ route ที่แตะ): ทุก interactive element, forms valid + invalid, flows หลัก, error/empty/loading states พร้อม evidence; จากนั้น codify flows ที่ผ่านเป็น Playwright suite ผ่าน `/deep-test e2e` — Playwright report คือ authoritative result
5. ยืนยัน rollback plan แบบ executable ไม่ใช่แค่ note: ระบุ method (`git revert <merge-commit>`, redeploy เวอร์ชันเดิม, platform rollback) และบันทึก current production version/revision ไว้เทียบ; deploy เป็น destructive (DB migration, breaking API) → `/ask-me` confirm ก่อน
6. ถ้าต้อง deploy จริง: ทำ `/run-deploy` หรือ `/follow-deploy` (dispatch ไป `deploy-to-<platform>`) — deploy staging/preview ก่อนถ้า platform รองรับ, เก็บ deployment URL + version/revision เสมอ
7. post-deploy verify: smoke test critical paths บน production URL จริง, ตรวจ logs/metrics/error tracking ไม่มี error spike, เทียบ behavior กับผล `/run-check` ที่ผ่านมา — fail → execute rollback plan ทันทีแล้ว report
8. ถ้างานซับซ้อนหรือหลาย workspace → ทำ deep pass เพิ่ม: front-load `/deep-thinking`, `/deep-impact` สำหรับ high-impact changes, จัดลำดับ critical path (schema → data → API → UX) และกำหนด rollback plan ก่อนแต่ละ batch
9. ถ้างานนี้ implement จาก GitHub issue ที่สร้างโดยฉัน → `/resolve-github-issue-by-me` เพื่อ comment ผลและปิด issue; งานค้าง/blocked/deferred → `/save-to-todo-md` เก็บ remaining items ลง `TODO.md`
10. ทำ `/suggest-next-action` — ถ้าทุกอย่างผ่านและ user ต้องการขึ้น production → ทำ `/ship` ตัวเต็ม (commit/push → PR review gate → merge `main`) หรือ `/release-new-version` เมื่อต้องออก version

### Workflows

> Goal: dispatch ไปยัง workflow ตาม topic/argument

| Topic/Argument | Workflow |
|----------------|----------|
| `setup-coverage`, `coverage` | `workflows/setup-coverage/SKILL.md` — coverage tooling ตาม ecosystem (vitest, llvm-cov, go cover) ก่อนเริ่ม TDD loop |

1. ถ้า argument ตรง topic → อ่าน `workflows/<name>/SKILL.md` แล้วทำตาม flow ในนั้น — ไม่ execute จากตารางนี้โดยตรง
2. ถ้าไม่ระบุ → ทำตาม steps 1-10 ตามลำดับ

## Rules

### 1. No Mock In Production

- เริ่มงานด้วย `/report-not-implement` เสมอ แล้วปิดให้ครบทุก item ใน report — item ที่ทำไม่ได้ต้อง report เป็น blocked/deferred พร้อมเหตุผล ไม่ใช่หายไปเงียบๆ
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
- secrets/keys ไม่ hardcode ใน code — ห้าม hardcode "ให้ผ่าน" ใช้ `/follow-secret-manager` เสมอ
- gate ใน `### 9` ต้องเขียวก่อน deploy ไม่มี exception; เก็บ URL + version ทุก deploy

### 4. Minimal And Maintainable

- อ่าน `/refactor` rules ก่อนลงมือ implement เสมอ — และทำ `/refactor` (step 2 SRP split) หลัง implement เสร็จเสมอ (step 8) ไม่ข้าม
- ทำ `/dont-over-engineer` — จะเขียนใหม่หรือเจอ duplicates → `/use-lib-effective`; จะเพิ่ม dependency ใหม่ → เช็ค packages ที่เราเป็น owner บน registry ด้วย `/use-my-packages-on-registry` ก่อน dep ภายนอก (re-use งานเดิมของเราง่ายกว่า ไม่ต้อง maintain ซ้ำ)
- รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน
- ไฟล์ไม่เกิน 250 บรรทัด; ใช้ `/run-build` ถ้าจำเป็น

### 5. Plan Always

- ทุกงาน implement ต้องมี plan จาก `/create-plan-in-dot-devin` ก่อน — ห้ามเริ่ม Step 3 โดยไม่มี plan

### 6. Test First

- ไม่มี production code โดยไม่มี failing test ที่ lock behavior ก่อน — ทำตาม TDD loop ใน `references/tdd.md` (merged จาก `/follow-tdd`)
- project ยังไม่มี coverage tooling → ทำ `/implement-to-production` argument `setup-coverage` ก่อน เพื่อวัดผลได้จริง
- หลัง implement ครบทุก item → ทำ `/deep-test` ทุก domain ที่แตะ (`unit`/`integration`/`api`/`e2e`/`website`) จนเขียว ก่อนเข้า verify gate ใน `### 9` — test ที่ยังไม่เขียว = งานยังไม่เสร็จ
- แยก commit: test ที่ red → implementation ที่ green → refactor ตาม `### 8` ไม่ mix behavior

## Input Flows

input เป็น plan file ใน `.devin/temp/plan/<workspace>/` หรือ `TODO.md` → ทำตาม `references/input-flows.md` (`## Plan File`, `## TODO.md`) แล้วกลับ flow หลัก; แผนที่ไม่ต้องลบไฟล์ (ใน `AGENTS.md` หรือเอกสารทั่วไป) → ใช้ `/follow-plan` แทน

## Subagents

> Goal: งานอิสระที่ spawn ทำขนานได้ — profile inline ที่นี่ไม่ต้องมีไฟล์แยก; spawn ผ่าน `/use-subagents` ส่ง inputs ตามที่แต่ละ profile กำหนด; `review-sweeper` เป็น read-only, `feature-implementer` แก้เฉพาะ `files` ที่ได้รับ; inventory gaps ใช้ profile `gap-scanner` ของ `/report-not-implement` (owner เดียว ห้าม copy มาไว้ที่นี่); parent เป็นคนรวมผล + checkpoint commit + verify รวมเสมอ

### feature-implementer — implement feature/gap item เดียว end-to-end — spawn ทีละ item ขนานกัน

- **Inputs**: `item` (gap item/feature spec จาก `/report-not-implement` หรือ plan file), `files` (scope ไฟล์ที่แก้ได้), `contracts` (types/schemas/API contracts ที่ parent ให้ canonical มา), `conventions` (stack/libraries ที่มีอยู่/style), `verify-cmd` (เช่น `bun test <path>` หรือ `tsc --noEmit`)
- **Execute**: ใช้ `read`/`write`/`edit` ใน scope `files`, `grep` หา usage patterns เดิม, `exec` รัน `verify-cmd` และ tests (allow `tsc`/`eslint`/`* test`/`* vitest`) — 1 เขียน failing test ที่ lock expected behavior ก่อน (TDD) → 2 implement ตาม `item` ใช้ dep ที่มีก่อน ห้ามเพิ่ม dep ใหม่โดยไม่รายงาน → 3 เชื่อม `contracts` ห้าม redefine types ซ้ำ → 4 รัน `verify-cmd` fail ให้แก้จนผ่านหรือรายงาน blocker → 5 ลบ marker เดิม (`TODO`/`MOCK`/placeholder) เมื่อ implement จริงแล้ว
- **Output**: ตาราง No./File/Change/Test/Notes (เช่น `src/api/users.ts` | real query impl | `pass`); `Test` = `pass`/`fail`/`skipped` + output ถ้า fail; ปิดท้าย files changed, new deps ที่เพิ่ม, markers removed, blockers/deferred items
- **Constraints**: ห้าม mock/stub/placeholder ใหม่ (production code เท่านั้น); รับผิดชอบเฉพาะ `files` ที่ได้รับ (cross-cutting รายงาน parent); ไม่เพิ่ม dep เอง — ถ้าต้องใช้ package ที่ยังไม่ได้ติดตั้ง ให้ blocker กลับพร้อมเหตุผล เพื่อ parent รัน `/use-my-packages-on-registry` หรือเลือก dep ก่อน; ห้าม commit/push — parent เป็นคน checkpoint; secrets ห้าม hardcode — ขาด env/credentials ให้ blocker กลับทันที; ห้าม `git push`/`rm -rf`

### review-sweeper — review changes ทีละ domain (security/api/test/observability/resilience) ขนานกัน (read-only)

- **Inputs**: `domain` เดียว (`security`/`api`/`test`/`observability`/`resilience`), `scope` (ไฟล์/diff ที่ต้อง review), `context` (สิ่งที่ implement ไป)
- **Execute**: ใช้ `read`/`grep` อ่าน code + หา patterns ที่เสี่ยง, `exec` รัน `git diff`, linters, audit commands ของ domain นั้น — 1 อ่าน changes ใน `scope` เข้าใจว่า implement อะไร → 2 review ตาม checklist ของ `domain` (security=injection/authz gaps/secrets leak/input validation, api=validation/error handling/rate limit/retry-safety, test=assertion-less tests/unhandled throws/swallowed errors, observability=logging/metrics/correlation IDs, resilience=retry/backoff/graceful degradation/timeouts) → 3 รายงาน findings พร้อม severity ห้ามแก้ไขเอง
- **Output**: ตาราง No./Severity/Location/Finding/Suggested Fix (เช่น high | `src/api/x.ts:20` | unvalidated input to query | use schema validation); `Severity` = `critical`/`high`/`medium`/`low`; ปิดท้าย verdict `pass`/`pass-with-warnings`/`fail` + blocking findings count
- **Constraints**: ห้าม write/edit — review อย่างเดียว; review เฉพาะ `domain` ที่ได้รับ ห้ามข้าม domain; findings ต้องชี้ file:line จริง ห้ามคิดว่าน่าจะมีปัญหา

## Expected Outcome

- รู้รายการสิ่งที่ยังไม่ implement จริงทั้ง scope จาก `/report-not-implement` ก่อนเริ่ม แล้วปิดครบทุก item (หรือ report เป็น blocked/deferred พร้อมเหตุผล)
- ไม่มี TODO/MOCK/placeholder ใน production code — รวม dead UI ทุกจุด
- schema, validation, types, API, UX/UI สมบูรณ์และเชื่อมต่อกัน
- ทุก interactive element ใช้งานได้จริง end-to-end — ผ่าน click-through จริงใน browser
- improvements รอบ scope ถูกหาและแก้ครอบคลุมผ่าน `/improve`; UI ผ่าน `/improve uxui` บน render จริงครบทุก finding (หรือข้ามพร้อมเหตุผลถ้าไม่มี UI); dependency ใหม่ที่จำเป็นถูกเลือกผ่าน `/use-my-packages-on-registry` ก่อน dep ภายนอก แล้วติดตั้งพร้อม verify ใน manifest/lockfile
- infrastructure พร้อม production: security, observability, resilience — env/secrets ครบ, CI เขียว, observability wired
- ผ่าน canonical verify gate `/ship verify-only` ครบชุด (รวม `/deep-test all` และ `/run-verify`) พร้อม handoff ไป `/ship` หรือ `/release-new-version`; ถ้า deploy → post-deploy verify ผ่านพร้อม URL + version
- มี rollback plan
