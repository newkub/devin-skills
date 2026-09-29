---
name: review-api
description: ตรวจ API design — REST conventions, versioning, errors, auth, validation, docs
argument-hint: "[endpoint-or-scope]"
related:
  - review-backend
  - review-security
  - run-test
  - deep-review
  - report
  - check-reference
  - run-review
---

## Goal

ตรวจสอบ API design — REST/resource conventions, versioning, error handling, authn/authz, input validation, response formats และ documentation โดยไม่แก้ไข — ส่งต่อ fix ไปยัง section `## Fix` เมื่อ user confirm

## Scope

ใช้เมื่อต้อง review API surface ของ project: REST, GraphQL, RPC (เช่น oRPC/tRPC) — ครอบคลุม contract, consistency และ security posture — ไม่แก้ไข implementation ระหว่าง review (แก้ไขตาม section `## Fix`)

## Execute

### 1. Discover API Surface

> Goal: รวบรวม endpoints และ API style ทั้งหมด

1. ทำ `/scan-codebase` หา routes, handlers, resolvers และ API schemas
2. ระบุ style: REST, GraphQL, RPC และ versioning approach
3. แสดงรายการ endpoints พร้อม method, path และ auth requirement

### 2. Review Conventions

> Goal: API เป็นไปตาม conventions อย่างสม่ำเสมอ

1. ตรวจ resource naming, HTTP methods และ status codes
2. ตรวจ consistency: pagination, filtering, sorting, error format
3. ตรวจ versioning strategy และ backward compatibility

### 3. Review Validation And Errors

> Goal: input validation และ error responses ครบถ้วน

1. ตรวจ input validation ทุก endpoint (schema validation)
2. ตรวจ error responses: consistent shape, ไม่รั่ว stack traces/secrets
3. ตรวจ rate limiting และ request size limits

### 4. Review Auth And Docs

> Goal: authn/authz และ documentation ครบ

1. ตรวจ authn/authz ครอบคลุมทุก endpoint ที่ต้องการ
2. ตรวจ API docs (OpenAPI/Swagger/schema introspection) ตรงกับ implementation
3. ทำ `/check-reference` สำหรับ docs ที่อ้าง endpoints

### 5. Contract And Governance

> Goal: coverage เพิ่มเติมของ domain — ทำตาม `references/contract.md`

1. OpenAPI/contract drift — spec vs implementation ตรงกัน
2. idempotency keys บน mutating endpoints
3. deprecation/sunset policy — headers, timeline, migration docs

### 6. Headers Caching And Cors

> Goal: HTTP semantics ถูกต้อง — ทำตาม `references/headers-caching.md`

1. `Cache-Control`/`ETag`/`Last-Modified` ตาม resource type — private vs public ถูก
2. CORS policy — origins จำกัด, credentials handling, preflight ไม่ over-permissive (`review-security`)
3. content negotiation — `Accept`/`Content-Type` handling, charset, 415/406 เมื่อไม่รองรับ
4. security headers — `Content-Security-Policy`, `X-Content-Type-Options`, compression safety

### 7. Webhooks And Realtime

> Goal: async surface ครบ — ทำตาม `references/webhooks-realtime.md`

1. webhooks — signature verification, retry/backoff, ordering, idempotent receivers (`review-api`)
2. websockets/SSE — auth on connect, reconnect contract, backpressure, message schema
3. event versioning — payload schema changes มี compat path

### 8. Rate And Report

> Goal: สรุป findings พร้อม severity และ fix direction

1. ทำ `/report` พร้อม columns: No., Endpoint, Severity, Finding, Evidence, Fix
2. ชี้ไป section `## Fix` เมื่อ user confirm ให้แก้


### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `contract`, `versioning`, `drift` — spec vs impl drift | `subskills/check-contract/SKILL.md` |
| `webhooks`, `realtime` — delivery safety + realtime channels | `subskills/check-webhooks/SKILL.md` |
| `endpoints`, `report-endpoints` — endpoint inventory table | `subskills/report-endpoints/SKILL.md` |
| Reconcile contract drift — sync spec/impl (user confirm) | `subskills/update-contract/SKILL.md` |

## Check: API Contract

### Goal

ตรวจว่า API implementation ตรงกับ OpenAPI spec — หา endpoints ที่ implement แต่ไม่มีใน spec, spec มีแต่ไม่ได้ implement, และ response/field types ที่ไม่ตรงกัน

### Scope

- ตรวจ repo ที่มี OpenAPI spec (`openapi.yaml`, `swagger.json`) หรือ generate ผ่าน `/gen-openapi` ก่อน
- เทียบ routes/handlers ใน code กับ paths ใน spec — ทั้ง method, path, params, request/response schema
- Read-only: รายงาน drift — ไม่แก้ spec หรือ code

### Execute

#### 1. Locate Spec And Implementation

> Goal: หา spec file และ source of truth ของ routes

1. หา OpenAPI spec: `openapi.*`, `swagger.*`, `docs/*.yaml`
2. ถ้าไม่มี spec → ทำ `/gen-openapi` เพื่อ generate จาก code ก่อน หรือถาม user ว่า spec คือ source of truth ไหม
3. หา route definitions ใน code ตาม framework (Elysia, Express, Fastify, Hono, Next.js routes)

#### 2. Compare Endpoints

> Goal: หา paths/methods ที่ต่างกัน

1. Extract paths + methods จาก spec
2. Extract routes + handlers จาก code (ใช้ `use-astgrep` หรือ framework-specific patterns)
3. flag:
   - `spec-only`: spec มีแต่ไม่ implement
   - `code-only`: implement แต่ไม่มีใน spec (undocumented endpoint)
   - `method-mismatch`: path เดียวกันแต่ methods ต่างกัน

#### 3. Compare Schemas

> Goal: เทียบ request/response fields ต่อ endpoint

1. เทียบ request body schema กับ validation ใน code (zod, arktype, class-validator)
2. เทียบ response schema กับ return type หรือ serializer
3. flag: fields ขาด, type ต่าง, required ต่าง, enum values ไม่ตรง
4. ถ้าเป็น type-safe framework (tRPC, orpc) → flag ว่า spec อาจ generated และตรวจแค่ version drift

#### 4. Report

> Goal: สรุป contract drift แยกตาม severity

1. ใช้ `/report` คอลัมน์: `No.`, `Endpoint`, `Drift Type`, `Spec`, `Code`, `Severity`
2. Severity: `critical` (spec-only, response shape ต่าง), `high` (code-only, required field ต่าง), `medium` (optional field ต่าง)
3. แนะนำ `/gen-openapi` regenerate หรือ `## Check: API Contract` สำหรับ fix

### Rules

#### 1. Evidence-Based

- ทุก drift ต้องระบุ spec location และ code location
- ระบุว่า spec หรือ code เป็น source of truth ตามที่ project กำหนด

#### 2. Read-Only

- ไม่แก้ spec หรือ code — รายงาน drift แล้วให้ `/gen-openapi` หรือ `## Check: API Contract` แก้

#### 3. Context Aware

- Internal/admin endpoints อาจตั้งใจไม่ใส่ spec — flag เป็น info ไม่ใช่ violation
- Generated spec ให้ตรวจเฉพาะว่า spec ล่าสุดหรือไม่ ไม่ตรวจ field-level
- ใช้ /deep-test api ถ้าจำเป็น
- ใช้ /deep-test contract ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น


### Expected Outcome

- รายการ endpoints ที่ spec กับ code ไม่ตรง พร้อมประเภท drift
- Field-level mismatches สำหรับ request/response schemas
- คำแนะนำว่าควร update spec หรือ fix code

## Check: API Versioning

### Goal

ตรวจ API versioning ว่า consistent และจัดการ lifecycle ถูกต้อง — version strategy ชัดเจน, deprecated versions มี sunset plan, breaking changes ถูกจัดการ

### Scope

- ตรวจ versioned endpoints: URL paths (`/v1/`, `/v2/`), header versioning, query versioning
- ครอบคลุม: version strategy consistency, deprecated-but-live versions, sunset headers, version docs, breaking change policy
- Read-only: รายงาน — แก้ผ่าน `## Check: API Contract` remediation

### Execute

#### 1. Map API Versions

> Goal: รวบรวม versions ทั้งหมดที่ live

1. หา versioned routes/handlers — `/v1/*`, `/v2/*`, `Accept-Version` headers, query params
2. ระบุ versions ที่ active, deprecated, sunset — จาก code + docs + config
3. flag: endpoints ที่ไม่มี version เลยปนกับที่มี (inconsistent strategy)

#### 2. Check Strategy Consistency

> Goal: ตรวจว่า versioning approach เดียวกันทั้ง API

1. Path vs header vs query — mixing strategies = inconsistency
2. Default version behavior — unversioned requests ไป version ไหน
3. Version granularity — per-resource vs per-API
4. ทำ `## Check: Backward Compatibility` ตรวจ spec กับ impl ตรงกันไหมต่อ version

#### 3. Check Deprecation Lifecycle

> Goal: ตรวจว่า old versions ตายอย่างเป็นระบบ

1. Deprecated versions ต้องมี: `Sunset`/`Deprecation` headers, docs, timeline
2. flag: versions ที่ deprecated นานแต่ยัง serve traffic เต็ม — ไม่มี sunset plan
3. flag: consumers ที่ยังใช้ old versions (จาก logs/analytics ถ้ามี)
4. ทำ `/review-code-quality` ร่วมสำหรับ deprecated symbols ใน code

#### 4. Check Breaking Change Hygiene

> Goal: ตรวจว่า changes ไม่ break existing versions

1. ทำ `## Check: API Versioning` เทียบ version ปัจจุบันกับก่อนหน้า
2. flag: fields ที่หาย/เปลี่ยน type ใน version เดียวกัน
3. flag: version bumps ที่ไม่มี changelog/migration guide

#### 5. Report

> Goal: สรุป versioning health

1. ใช้ `/report`: `No.`, `Version`, `Status`, `Consumers`, `Issue`, `Severity`, `Action`
2. Severity: `critical` (breaking ใน live version), `high` (deprecated ไม่มี sunset), `medium` (inconsistent strategy)

### Rules

#### 1. Evidence-Based

- version status ต้องมาจาก code/docs/headers จริง — ไม่เดา
- consumer data ใช้เฉพาะที่มีจริง — ไม่มีให้ระบุ `unknown`

#### 2. Read-Only

- ไม่แก้ routes/versions — รายงานให้ remediation แยก
- ไม่ deprecate version เอง

#### 3. Contract Aware

- ทุก version ต้องมี spec/contract ที่ตรง — ทำ `/gen-openapi` per version ถ้าขาด
- breaking changes ระหว่าง versions ต้อง documented
- ใช้ /deep-test api ถ้าจำเป็น
- ใช้ /run-release ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น


### Expected Outcome

- Version inventory พร้อม status ต่อ version
- Deprecation/sunset gaps และ breaking change risks
- Strategy consistency assessment

## Check: Rate Limiting

### Goal

ตรวจว่า API endpoints มี rate limiting ครอบคลุมหรือไม่ — โดยเฉพาะ auth, expensive operations และ public endpoints ที่เสี่ยง abuse/brute force/cost

### Scope

- ตรวจ route definitions และ middleware chain ของ framework ที่ใช้ (Elysia, Express, Hono, Next.js, Fastify)
- ครอบคลุม: login/auth endpoints, password reset, expensive queries, file uploads, AI/LLM endpoints, public APIs
- Read-only: รายงาน gaps — เพิ่ม rate limiting ผ่าน `/review-security`

### Execute

#### 1. Map Endpoints

> Goal: รวบรวม routes ทั้งหมดพร้อมความเสี่ยง

1. ใช้ `scan-codebase`/`use-astgrep` หา route registrations ทั้งหมด
2. จัดประเภทความเสี่ยง:
   - `auth`: login, signup, password reset, OTP — brute force target
   - `expensive`: reports, exports, AI calls, heavy queries — cost target
   - `public`: unauthenticated endpoints ทั้งหมด — abuse target
   - `internal`: authenticated CRUD ทั่วไป
3. flag mutation methods (POST/PUT/DELETE) เป็นพิเศษ

#### 2. Detect Existing Protection

> Goal: หา rate limiting ที่มีอยู่

1. ค้น middleware/plugins: `rateLimit`, `rate-limit`, `throttle`, `slowDown`, platform-level (Cloudflare rules, API gateway)
2. ตรวจว่า apply global หรือ per-route — global limit อาจ loose เกินสำหรับ auth endpoints
3. ตรวจ keyed-by: IP, user, API key — per-IP alone bypass ได้ง่าย

#### 3. Evaluate Coverage

> Goal: เทียบความเสี่ยงกับ protection

1. flag endpoints ความเสี่ยงสูงที่ไม่มี limit เลย
2. flag limits ที่ loose เกิน (เช่น login 1000/min)
3. flag missing: lockout, exponential backoff, CAPTCHA escalation สำหรับ auth flows
4. ตรวจ response: มี `429` + `Retry-After` headers ถูกต้องไหม

#### 4. Report

> Goal: สรุป coverage gaps พร้อม severity

1. ใช้ `/report` คอลัมน์: `No.`, `Endpoint`, `Risk Type`, `Current Limit`, `Severity`, `Recommendation`
2. Severity: `critical` (auth ไม่มี limit), `high` (expensive/public ไม่มี), `medium` (limit loose), `info` (มีแล้ว)
3. แนะนำ limits ที่เหมาะต่อประเภท endpoint

### Rules

#### 1. Evidence-Based

- ทุก finding ต้องอิง route definition และ middleware chain จริง
- ระบุว่า protection อยู่ระดับไหน (app middleware vs platform/edge)

#### 2. Read-Only

- ไม่แก้ rate limiting — รายงานแล้วทำ `/review-security`
- ไม่ยิง endpoints จริงเพื่อทดสอบ limits — ใช้ `/run-load-test` แยกถ้าต้องการ

#### 3. Context Aware

- Internal/admin endpoints อาจไม่ต้องการ rate limit — flag info ไม่ใช่ violation
- Platform-level limiting (Cloudflare) นับเป็น protection — ระบุชัดว่าอยู่ชั้นไหน

### Expected Outcome

- ตาราง endpoints พร้อม risk level และ current limits
- Gaps ที่ critical โดยเฉพาะ auth และ expensive endpoints
- คำแนะนำ rate limit policy ต่อประเภท

## Check: Webhook

### Goal

ตรวจ webhook receivers ครบทั้งสองด้าน — security (verify signatures, กัน replay, จำกัดสิทธิ์ endpoint) และ delivery reliability (retries, ordering, dead-letter handling)

### Scope

- ใช้กับ webhook endpoints ของ providers เช่น Stripe, GitHub, LINE, Slack
- `--security` → เช็คเฉพาะด้าน security; `--delivery` → เช็คเฉพาะ delivery; ไม่ระบุ → เช็คทั้งสอง
- Read-only: รายงาน — แก้ผ่าน section `## Fix` ของ `/review-auth` หรือ `review-*` ที่เกี่ยวข้อง

### Execute

#### 1. Map Webhook Endpoints

> Goal: หา webhook receivers ทั้งหมด

1. ค้น route handlers ที่รับ webhook (`/webhook`, `/hooks`, provider-specific paths)
2. ระบุ provider ของแต่ละ endpoint
3. ตรวจ config ระดับ platform (gateway, Cloudflare, ngrok)

#### 2. Dispatch To Subskills

> Goal: ตรวจแต่ละด้านผ่าน subskill ที่เฉพาะเจาะจง

| Flag         | Subskill |
|--------------|----------|
| `--security` | ``#### Security`` — signature, replay, endpoint auth |
| `--delivery` | ``#### Delivery`` — retries, ordering, dead-letter |

1. ถ้าระบุ `--security` → อ่านและทำตาม ``#### Security``
2. ถ้าระบุ `--delivery` → อ่านและทำตาม ``#### Delivery``
3. ถ้าไม่ระบุ → ทำทั้งสองตามลำดับ security ก่อน delivery

#### 3. Report

> Goal: สรุปผลพร้อม severity และ fix

1. ใช้ `/report` คอลัมน์: No., Endpoint, Provider, Area, Finding, Severity, Fix
2. เรียงตาม Severity: Critical → Info

### Rules

- Evidence-based — อ่าน handler code จริง ไม่เดา
- Read-only — ไม่แก้ไข code
- ไม่ expose secrets ที่พบใน report
- ใช้ /deep-test api ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น

### Expected Outcome

- ตาราง findings ครอบคลุมทั้ง security และ delivery พร้อม severity และ fix suggestions

### Delivery

##### Goal

ตรวจ webhook delivery pipeline ว่า reliable — retries เมื่อ fail, ordering guarantees, dead-letter handling และ observability เมื่อ delivery ล่ม

##### Scope

- ตรวจทั้งสองฝั่ง: outbound webhooks (เราส่ง) และ inbound handlers (เรารับ)
- ครอบคลุม: retry policies, exponential backoff, delivery ordering, dead-letter queues, timeout handling, delivery logs
- Read-only: รายงาน — แก้ผ่าน `/review-stability` remediation

##### Execute

###### 1. Map Delivery Paths

> Goal: รวบรวม webhook flows ทั้งสองทิศ

1. Inbound: handlers ที่รับ events — process sync หรือ queue?
2. Outbound: จุดที่ส่ง webhooks — direct HTTP หรือผ่าน queue/worker?
3. ระบุ failure modes ต่อ path: network fail, receiver down, slow processing

###### 2. Check Retry And Ordering

> Goal: ตรวจ delivery guarantees

1. Retries: มี retry policy ไหม — count, backoff, max attempts
2. Ordering: events ที่ต้องเรียง (created→updated→deleted) รับ out-of-order ได้ไหม
3. Idempotency: handler รับ duplicate delivery ปลอดภัยไหม — ทำ `## Check: Webhook` ร่วม
4. Timeout: processing timeout vs provider retry window — flag handlers ช้ากว่า provider timeout

###### 3. Check Failure Handling

> Goal: ตรวจว่า failed deliveries ไม่หาย

1. Dead-letter queue / failed event store — events ที่ fail หมด retries ไปไหน
2. Alerting เมื่อ delivery fail — silent failures คือ finding
3. Recovery path: replay failed events ได้ไหม
4. Sync vs async processing — handlers ที่ process sync ทั้งก้อนเสี่ยง timeout

###### 4. Check Observability

> Goal: delivery status มองเห็นได้ไหม

1. Delivery logs/metrics: success rate, latency, retry counts
2. Correlation: event IDs traceable ข้าม sender/receiver
3. Dashboard/alerting สำหรับ delivery health — ทำ `/review-observability` ถ้าขาด

###### 5. Report

> Goal: สรุป reliability gaps

1. ใช้ `/report table`: `No.`, `Path`, `Issue`, `Failure Mode`, `Severity`, `Fix`
2. Severity: `critical` (events หายเงียบๆ), `high` (no retries/DLQ), `medium` (ordering unhandled), `low` (observability gaps)

##### Rules

###### 1. Evidence-Based

- ทุก finding อ้าง code path จริง — retry counts, timeout values, queue config
- แยก "ไม่มี mechanism" ออกจาก "มีแต่ misconfigured"

###### 2. Both Directions

- ตรวจทั้งส่งและรับ — reliability มีสองฝั่ง
- provider delivery guarantees (at-least-once ส่วนใหญ่) ต้อง match handler design

###### 3. Read-Only

- ไม่แก้ pipeline — รายงานแล้ว remediate แยก
- ไม่ trigger real deliveries เพื่อทดสอบบน production

##### Expected Outcome

- Delivery reliability assessment ทั้ง inbound/outbound
- Failure modes พร้อม severity และ fix paths
- Observability gaps ที่ต้องปิด

### Security

##### Goal

ตรวจ webhook receivers ว่าปลอดภัย — verify signatures จาก provider, กัน replay attacks และจำกัดสิทธิ์การเข้าถึง endpoint

##### Scope

- ตรวจ webhook handlers: Stripe, GitHub, Twilio, LINE, custom webhooks ตามที่ project รับ
- ครอบคลุม: signature verification, timestamp tolerance, replay protection, secret management, endpoint exposure
- Read-only: รายงาน — แก้ผ่าน `/review-auth` หรือ `/review-security`

##### Execute

###### 1. Map Webhook Handlers

> Goal: รวบรวม webhook endpoints ทั้งหมด

1. ใช้ `scan-codebase`/`use-astgrep` หา webhook route handlers — patterns เช่น `/webhook`, `/hooks/`, provider-specific paths
2. ระบุ provider ต่อ endpoint (Stripe, GitHub, custom) — แต่ละ provider มี signature scheme ต่างกัน
3. flag endpoints ที่รับ POST จาก external แต่ไม่มี verification เลย

###### 2. Verify Signature Checks

> Goal: ตรวจว่า signature verification ถูกต้อง

1. มีไหม: handler ต้อง verify signature ก่อน process — flag ที่ parse payload ก่อน verify
2. ถูกไหม: ใช้ provider SDK verification (เช่น `stripe.webhooks.constructEvent`) ไม่ใช่ compare เอง
3. Raw body: signature คำนวณบน raw body — flag body parsing ที่ทำลาย raw bytes ก่อน verify
4. Timing-safe: comparison ต้อง timing-safe (HMAC compare) ไม่ใช่ `===`

###### 3. Check Replay And Secret Hygiene

> Goal: ตรวจ replay protection และ secret handling

1. Timestamp tolerance — รับ events เก่าแค่ไหน (Stripe: ±5min default)
2. Replay protection: event ID dedup, timestamp validation, nonce handling
3. Secret: webhook secrets ต้องอยู่ใน env/secret manager — ทำ `/check-secrets secrets-leak` ร่วม
4. Endpoint exposure: ไม่ leak internal paths, มี rate limiting (`## Check: Webhook`)

###### 4. Report

> Goal: สรุป findings พร้อม severity

1. ใช้ `/report table`: `No.`, `Endpoint`, `Provider`, `Issue`, `Severity`, `Fix`
2. Severity: `critical` (no verification), `high` (broken verification, replay possible), `medium` (weak tolerance, missing dedup)
3. ระบุ provider-specific best practices ที่ขาด

##### Rules

###### 1. Evidence-Based

- ทุก finding อ้าง code/config จริง — ไม่ assume ว่า "น่าจะ verify"
- ทดสอบด้วย crafted requests เฉพาะบน local/staging เท่านั้น

###### 2. Read-Only

- ไม่แก้ handlers — รายงานให้ remediation แยก
- ไม่ส่ง fake webhooks ไป production

###### 3. Provider Aware

- แต่ละ provider มี scheme ต่างกัน — ใช้ provider SDK/docs เป็น reference
- Custom webhooks: ต้องมี HMAC signature + timestamp + dedup เป็น minimum

##### Expected Outcome

- รายการ webhook security findings พร้อม severity
- Verification gaps และ replay risks ที่ชัดเจน
- Provider-specific recommendations

## Check: Idempotency

### Goal

ตรวจ mutation operations ว่า idempotent หรือไม่ — retry, double-click, webhook redelivery แล้วไม่เกิด side effects ซ้ำ (double charge, duplicate records, repeated emails)

### Scope

- ตรวจ POST/PUT/PATCH/DELETE endpoints และ async handlers (webhooks, queues, consumers)
- ครอบคลุม: idempotency keys, natural dedup keys, unique constraints, at-least-once delivery handlers, retry-unsafe side effects
- Read-only: รายงาน gaps — แก้ไขผ่าน `## Check: Idempotency` remediation หรือ `/deep-review-then-fix`

### Execute

#### 1. Map Mutation Surface

> Goal: รวบรวม operations ที่มี side effects

1. หา mutation endpoints ทั้งหมด + webhook handlers + queue consumers
2. จัดประเภทตาม side effect ที่ซ้ำแล้วเจ็บ: payments, record creation, emails/notifications, external API calls, file writes
3. severity สูงสุด: money-moving และ irreversible operations

#### 2. Detect Idempotency Mechanisms

> Goal: ตรวจว่าแต่ละ operation ปลอดภัยต่อการซ้ำไหม

1. หา `Idempotency-Key` header handling, dedup tables, `ON CONFLICT`/upsert patterns
2. ตรวจ natural keys: unique constraints ที่ทำให้ duplicate insert fail อย่างถูกต้อง
3. ตรวจ webhook handlers: event id dedup (stripe event ids, delivery ids)
4. ตรวจ queue consumers: มี idempotent processing หรือ assume exactly-once

#### 3. Analyze Retry Paths

> Goal: ตามหาจุดที่ซ้ำได้จริง

1. Client retry + timeout → อาจยิงซ้ำระหว่าง server ยัง process
2. Webhook redelivery → providers ส่งซ้ำเป็นเรื่องปกติ
3. Queue at-least-once → handler เห็น message ซ้ำได้
4. UI double-submit → ไม่มี button disable + ไม่มี server dedup

#### 4. Report

> Goal: สรุป non-idempotent operations พร้อม severity

1. ใช้ `/report` คอลัมน์: `No.`, `Operation`, `Side Effect`, `Protection`, `Retry Risk`, `Severity`, `Fix`
2. Severity: `critical` (payments/irreversible ไม่มี protection), `high` (webhook/queue ไม่ dedup), `medium` (forms ไม่มี idempotency key)
3. แนะนำ fix ต่อประเภท: idempotency keys, unique constraints, event dedup store, request fingerprinting

### Rules

#### 1. Evidence-Based

- ทุก finding ต้อง trace side effect จริง — ไม่ flag read-only endpoints
- ระบุ mechanism ที่มีอยู่หรือขาดอย่างชัดเจน

#### 2. Read-Only

- ไม่แก้ code — รายงานแล้วให้ remediation แยก
- ไม่ replay requests จริงเพื่อทดสอบ — วิเคราะห์จาก code

#### 3. Severity By Impact

- เรียงตามความเสียหายเมื่อซ้ำ — money > notifications > convenience duplicates
- GET/HEAD/OPTIONS ไม่ตรวจ (idempotent by definition)

### Expected Outcome

- รายการ operations ที่ retry-unsafe พร้อม severity
- ช่องทางซ้ำที่เป็นไปได้ต่อ operation
- คำแนะนำ idempotency mechanism ที่เหมาะต่อตัว

## Check: Backward Compatibility

### Goal
ตรวจสอบว่าการเปลี่ยนแปลงใน public API หรือ schema ทำให้ consumer เดิมใช้ไม่ได้หรือไม่

### Scope
- รองรับ REST API, GraphQL, gRPC, library public API
- เปรียบเทียบสองเวอร์ชัน
- รายงาน breaking, deprecated, non-breaking changes

### Execute
#### 1. Identify Public API

> Goal: Identify Public API

1. ระบุ public API หรือ schema ที่ต้องตรวจ
2. ใช้ OpenAPI, GraphQL schema, หรือ exports ของ library
3. เก็บ snapshot ของ base version

#### 2. Compare

> Goal: Compare

1. ใช้ `oasdiff` สำหรับ OpenAPI
2. ใช้ `graphql-inspector` สำหรับ GraphQL
3. ใช้ `ts-api-guardian` หรือ `api-extractor` สำหรับ TypeScript library
4. ใช้ `buf breaking` สำหรับ gRPC/Protobuf

#### 3. Classify

> Goal: Classify

1. แบ่งเป็น breaking, deprecated, non-breaking
2. ระบุ consumers ทีอาจ affected
3. ตรวจสอบ semantic version bump ทีเหมาะสม

#### 4. Report

> Goal: Report

1. สรุป changes พร้อม migration guide
2. ระบุ version bump แนะนำ
3. แนะนำ next action: fix, deprecate, หรือ bump major

### Rules
#### 1. Public Only

- ตรวจเฉพาะ public API ไม่ใช่ internal
- ข้าม internal modules โดย default
- ระบุ stability level ถ้ามี

#### 2. Semver

- แนะนำ version bump ตาม semver
- breaking change → major
- new feature non-breaking → minor
- bug fix → patch

- ใช้ /review-devin-global-harness ถ้าจำเป็น
- ใช้ /run-release ถ้าจำเป็น

### Expected Outcome
- รายการ breaking และ deprecated changes
- recommended version bump
- migration guide สั้นๆ

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `api-contract` | `## Check: API Contract` |
| `api-versioning` | `## Check: API Versioning` |
| `rate-limiting` | `## Check: Rate Limiting` |
| `webhook` | `## Check: Webhook` |
| `idempotency` | `## Check: Idempotency` |
| `backward-compatibility` | `## Check: Backward Compatibility` |

## Rules

### 1. Contract First

- ประเมินจาก contract ที่ client เห็น ไม่ใช่แค่ implementation
- ทุก finding ต้องมี endpoint, method และ evidence

### 2. Non-Destructive

- ใช้ read-only calls (GET) เมื่อทดสอบ live endpoints
- ห้ามเรียก mutating endpoints บน production

### 3. Consistency Over Preference

- ตัดสินตาม existing conventions ของ project ไม่บังคับ style ใหม่
- ถ้า project ไม่มี convention → อ้างอิง standard ที่กำหนดใน findings

- ใช้ /review-backend ถ้าจำเป็น
- ใช้ /deep-test api ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. validation: schema ที่ boundary ทุก endpoint — 4xx พร้อม field-level errors
2. error format เดียวทั้ง API, status codes ถูก, ไม่ leak internals
3. contract drift: ทำ `## Check: API Contract` diff spec vs impl — ยึด contract ที่ client ใช้จริง, แก้ฝั่งที่ผิด (impl หรือ spec/docs) → verify `## Check: API Contract` + `## Check: Backward Compatibility` ซ้ำ
4. versioning: unify scheme ตาม convention เดิม (ไม่มี → `/ask-me`), version ที่ boundary เดียว, breaking → version ใหม่ควบคู่ + `Deprecation`/`Sunset` headers + timeline, prefer additive changes — verify `## Check: API Versioning` ซ้ำ
4. pagination/limits: cursor สำหรับใหญ่, page-size caps, rate limiting
5. verify: `## Check: API Contract` diff = intended only, tests ผ่าน

## References

- [Full-dimension checklist](references/checklist.md)
- [Contract and governance checklist](references/contract.md)
- [Headers caching and CORS checklist](references/headers-caching.md)
- [Webhooks and realtime checklist](references/webhooks-realtime.md)
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น


## Expected Outcome

- รายงาน API findings ครอบคลุม conventions, validation, errors, auth, docs
- ทุก finding มี endpoint evidence และ severity
- next action ชัดเจนผ่าน section `## Fix`
