# Contract And Governance Checklist — review-api

## Spec Drift

- [ ] OpenAPI/schema spec ตรง implementation — paths, methods, params, request/response shapes
- [ ] spec เป็น source of truth หรือ generated — workflow ชัด (spec-first vs code-first)
- [ ] contract tests ใน CI — spec changes break build หรือ validate อัตโนมัติ
- [ ] undocumented endpoints — routes ที่มีแต่ไม่อยู่ใน spec (shadow API)
- [ ] dead spec entries — endpoints ใน spec ที่ไม่มีจริงแล้ว

## Idempotency

- [ ] mutating endpoints (POST/PUT/PATCH) รองรับ `Idempotency-Key` หรือ natural idempotency
- [ ] retry-safe — client retry ไม่ double-create (unique constraint หรือ dedup store)
- [ ] idempotency window + scope — key expiry, per-account namespacing
- [ ] response replay — same key → same response (ไม่ re-execute)

## Versioning

- [ ] version strategy ชัด — URL path (`/v1/`), header, media type — consistent ทั้ง API
- [ ] breaking vs non-breaking แยก — additive changes ไม่ต้อง version ใหม่
- [ ] version lifecycle — support window, sunset timeline, migration docs
- [ ] ทำ `/check-api-versioning` + `/check-backward-compatibility` เมื่อมีหลาย versions

## Deprecation And Sunset

- [ ] `Deprecation` + `Sunset` headers ตาม RFC 8594/9745
- [ ] deprecation docs — alternative endpoint, timeline, migration guide
- [ ] monitoring deprecated usage — รู้ว่าใครยังใช้ ก่อน remove
- [ ] removal process — warn → sunset → remove, ไม่หายทันที

## Error Contract

- [ ] error shape consistent ทั้ง API — `{ error: { code, message, details } }` หรือ RFC 9457 problem+json
- [ ] error codes stable — machine-readable, versioned, documented
- [ ] field-level validation errors — `details: [{ field, issue }]`
- [ ] no internal leak — stack traces, SQL, internal IDs ไม่หลุดใน 5xx

## Pagination And Filtering

- [ ] pagination style consistent — cursor (ใหญ่) vs offset (เล็ก), `Link` headers หรือ `next` field
- [ ] page size bounded — max limit, default สมเหตุ
- [ ] filter/sort params consistent — naming, operators, whitelist (ไม่ raw `orderBy` จาก client)
- [ ] field selection (`?fields=`) ถ้า support — whitelist, ไม่ expose internals

## Detection

- diff OpenAPI spec vs route table
- grep `Idempotency-Key`, `Deprecation`, `nextCursor`, error envelope helpers

Severity: shadow/undocumented endpoints = High, contract drift on public API = High, no idempotency on payments/writes = High, missing deprecation path = Medium
