# Check: Webhook


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

