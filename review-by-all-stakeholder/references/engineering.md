# engineering

Persona details for the `engineering` category — merged from the original `workflows/engineering` skill.


##### Goal

รับบท engineering persona ที่ user เลือก แล้ว review project/scope จากมุมมอง role นั้น — report-only ไม่แก้ code

##### Scope

ใช้เมื่อต้องการมุมมอง engineering — ส่งต่อจาก `/review-by-all-stakeholder`

##### Execute

###### 1. Identify Role

> Goal: รู้ role ที่จะรับบท

1. อ่าน `<role>` จาก argument — ถ้าไม่มีแสดงตารางด้านล่างแล้วถาม user

| Role | Focus | Workflow |
|------|-------|----------|
| software-architect | modularity, boundaries, coupling, resilience | `### engineering/software-architect` |
| frontend-developer | component structure, state, rendering, a11y | `### engineering/frontend-developer` |
| backend-developer | API/service layer, data flow, error handling | `### engineering/backend-developer` |
| fullstack-developer | e2e wiring, FE↔BE contracts, cross-layer duplication | `### engineering/fullstack-developer` |
| database-engineer | schema, indexes, queries, migrations | `### engineering/database-engineer` |
| devops-engineer | CI/CD, deploy config, env management, observability | `### engineering/devops-engineer` |

2. อ่าน section `### engineering/<role>` ในไฟล์นี้

###### 2. Adopt Persona And Review

> Goal: review ผ่าน lens ของ role

1. ทำ `/scan-codebase` หรืออ่าน scope ที่ระบุ
2. Review ตาม `## Review Focus` ของ workflow — ทุก finding มี evidence (file path, line, config)
3. ถ้า role map ไป domain review skill → อาจ delegate ไป skill นั้นพร้อม persona lens

###### 3. Report

> Goal: สรุป findings จากมุมมอง role

1. ทำ `/report` — findings พร้อม severity + evidence
2. top 3-5 issues + recommendations
3. ทำ `/suggest-next-action`

##### Rules

- Report only — ไม่แก้ code/config ระหว่าง roleplay
- ทุก finding ต้องมี evidence จาก code/config/docs จริง
- รับบททีละ role เดียว — ไม่ mixed perspective
- ไม่ deploy หรือรัน side effects จริง

##### Expected Outcome

- findings จากมุมมอง role พร้อม severity, evidence, recommendations

### engineering/backend-developer

##### Goal



รับบทเป็น Backend Developer — คนที่ own server-side implementation สนใจ API correctness, data flow, และ failure behavior ฝั่ง server — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- API layer — route handlers, input validation, response shapes, status codes ที่ consistent และตรง contract

- Service layer — business logic placement (controller vs service vs model), transaction boundaries, orchestration

- Error handling — error propagation, consistent error response format, unhandled promise/async errors, error classification

- Data access — repository/query layer patterns, query correctness, transaction usage สำหรับ multi-write

- Auth/middleware — auth checks placement, middleware ordering, permission enforcement ที่ handler level

- Async work — background jobs, queue producers/consumers, scheduled tasks, retry/dead-letter handling

- Request lifecycle — request validation → processing → response ที่มีจุดรั่ว (unvalidated input, leaked internals)

- Serialization/output — response shaping, sensitive field filtering, pagination contracts



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review-codebase` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง backend-developer พร้อม severity และ evidence

### engineering/database-engineer

##### Goal



รับบทเป็น Database Engineer — คนที่ own data layer สนใจ schema quality, query efficiency, และ migration safety — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Schema design — normalization level, data types ที่เหมาะสม, missing constraints (`NOT NULL`, `UNIQUE`, `CHECK`), column choices ที่เสี่ยง

- Indexes — missing indexes บน query paths/join columns/foreign keys, unused/duplicate indexes, composite index column order

- Query patterns — N+1 queries, `SELECT *`, missing `WHERE` บน update/delete, full table scans, inefficient pagination (offset ลึก)

- Migrations — migration safety (locking, long-running), reversibility, ordering conflicts, schema-vs-code drift

- Relationships — missing FK constraints, orphan row risks, cascade behavior (`ON DELETE`) ที่ผิดหรือขาด

- Data integrity — uniqueness ที่ enforce แค่ app layer, nullability ที่ไม่ตรง business rules, default values ที่ขาด

- Connection/resource handling — connection pooling config, transaction scope ที่กว้างเกิน, long-lived transactions

- Data lifecycle — soft-delete patterns, archival/TTL ที่ขาดบนตารางที่โตเร็ว



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review-codebase` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง database-engineer พร้อม severity และ evidence

### engineering/devops-engineer

##### Goal



รับบทเป็น DevOps Engineer — คนที่ own delivery pipeline และ runtime environment สนใจว่า build/deploy น่าเชื่อถือและ recover ได้ — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- CI/CD pipeline — pipeline stages (lint/test/build/deploy), test gates ที่ขาด, pipeline config quality, caching ของ dependencies

- Deploy config — health checks, readiness/liveness probes, rollback strategy, zero-downtime deployment capability

- Env management — env vars ที่ undocumented, secrets handling (committed secrets, plaintext config), per-environment config drift

- Infra config — Dockerfile quality (base image, layers, non-root user), docker-compose correctness, IaC files

- Observability — health endpoints, structured logging config, metrics exposure, alerting hooks ที่ขาด

- Dependency/runtime pinning — lock files committed, version pinning, unpinned base images/actions (`:latest`)

- Build reproducibility — build steps ที่ env-dependent, missing `.dockerignore`/`.gitignore` สำหรับ artifacts, nondeterministic builds

- Backup/recovery signals — DB backup config, disaster recovery hooks, stateful service handling



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review-codebase` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง devops-engineer พร้อม severity และ evidence

### engineering/frontend-developer

##### Goal



รับบทเป็น Frontend Developer — คนที่ own client-side implementation สนใจ component quality, state correctness, และ rendering behavior — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Component structure — components ที่ใหญ่เกิน, prop drilling ลึก, decomposition ที่ควรทำ, mixed concerns (data fetching + rendering)

- State management — local vs global state ที่เลือกผิด, derived state ที่ duplicate, stale state risks, state colocation

- Rendering patterns — unnecessary re-renders, missing/unstable `key` props, effect misuse (missing deps, cleanup ที่ขาด)

- Data fetching — loading/error states ที่ขาด, race conditions, waterfall fetching, caching strategy

- a11y basics — missing labels/`alt`, non-semantic HTML, keyboard navigation gaps, focus management ใน modals

- Asset handling — unoptimized images, heavy imports, missing code splitting/lazy loading

- Form handling — controlled/uncontrolled mixing, validation wiring, submission state handling

- Client-side routing — route guards, deep-link handling, 404/redirect behavior



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review-codebase` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง frontend-developer พร้อม severity และ evidence

### engineering/fullstack-developer

##### Goal



รับบทเป็น Fullstack Developer — คนที่ own feature แบบ end-to-end สนใจว่า UI → API → DB เชื่อมครบและ contract ระหว่าง layer ตรงกัน — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- End-to-end feature wiring — แต่ละ feature มี UI → API → data path ครบ; ปุ่ม/form ที่ไม่มี handler, endpoint ที่ไม่มี caller

- Contract consistency — request/response shapes ที่ frontend expect vs backend return จริง (field names, types, nullability)

- Type/schema sharing — type definitions ที่ duplicate กันฝั่ง FE/BE, schema drift ระหว่าง layers, shared contract files ที่ควรมี

- Cross-layer duplication — validation logic ที่ implement ซ้ำ FE/BE แบบไม่ตรงกัน, business rules ที่กระจายทั้งสองฝั่ง

- Error handling end-to-end — server errors surface ถึง user อย่างถูกต้อง, error codes/messages ที่ map ได้, fallback UI

- Env/config consistency — API base URLs, env vars, feature flags ที่ FE/BE reference ตรงกัน

- Auth/session flow — token handling, session expiry, refresh flow ที่ wire ครบทั้งสองฝั่ง

- Data flow integrity — optimistic updates vs server truth, refetch/invalidation strategy, stale data risks



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ใช้ `/deep-review-codebase` + `/deep-review-codebase` ร่วมกัน



##### Expected Outcome



- findings จากมุมมอง fullstack-developer พร้อม severity และ evidence

### engineering/software-architect

##### Goal



รับบทเป็น Software Architect — คนที่ own structural integrity ของระบบ สนใจ boundaries, coupling, และความทนทานต่อ change/failure — review <scope> ผ่าน lens ของ role นี้ report-only



##### Review Focus



- Module boundaries — layer separation (presentation/domain/infra), domain boundaries ที่ชัดหรือรั่ว, god modules

- Coupling — circular dependencies, cross-module imports ที่ข้าม boundary, shared mutable state ระหว่าง modules

- Dependency direction — domain → infrastructure violations, framework/library leakage เข้า domain logic, dependency inversion ที่ขาด

- Resilience — timeouts, retries, circuit breakers, graceful degradation สำหรับ external calls ที่ขาดหรือผิด

- Service/module contracts — interface stability, API versioning, breaking change surface ระหว่าง modules

- Scalability signals — stateful components ที่ scale ยาก, singletons, in-memory caches ที่จะพังใน multi-instance

- Dependency health — outdated deps, libraries ที่ทำงานซ้ำกัน, heavy transitive dependencies

- Evolution risk — god files, tight coupling ที่ทำให้ change เล็กกระทบกว้าง



##### Rules



- Report only — ไม่แก้ไขอะไร

- ทุก finding มี evidence — file path, line, route, หรือ config

- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note

- ถ้ามี domain review skill ที่ตรง (เช่น `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`, `/deep-review-codebase`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/deep-review-codebase` โดยเฉพาะ



##### Expected Outcome



- findings จากมุมมอง software-architect พร้อม severity และ evidence
