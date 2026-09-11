# review-api — Full Dimension Checklist

## 1. Surface And Conventions

- [ ] endpoint inventory: method, path, auth requirement
- [ ] resource naming, HTTP methods, status codes ถูกต้อง
- [ ] consistency: pagination (cursor/offset), filtering, sorting, field selection
- [ ] versioning strategy + deprecated endpoints tracking (`/check-api-versioning`)

## 2. Validation And Errors

- [ ] schema validation ทุก endpoint (body, query, params, headers)
- [ ] error format consistent (RFC 7807 problem+json ถ้าใช้)
- [ ] ไม่รั่ว stack traces/secrets/internal paths
- [ ] rate limiting, request size limits, timeouts

## 3. Semantics

- [ ] idempotency: PUT/DELETE idempotent, POST มี idempotency-key ถ้าจำเป็น (`/check-idempotency`)
- [ ] conditional requests: ETag/If-Match สำหรับ caching และ concurrent updates
- [ ] async operations: 202 + status endpoint/webhook
- [ ] CORS policy แคบพอ (`/check-cors-policy`)

## 4. AuthN/AuthZ

- [ ] auth ครบทุก endpoint ที่ต้องการ — ไม่มี unauthenticated leaks
- [ ] object-level authorization (BOLA/IDOR) ต่อ resource
- [ ] token expiry, scope enforcement, key rotation

## 5. Contracts And Docs

- [ ] OpenAPI/schema introspection ตรง implementation
- [ ] backward compatibility (`/check-backward-compatibility`)
- [ ] breaking change policy, deprecation headers (Sunset)
- [ ] webhooks: signature, retry, ordering (`/check-webhook`)

## 6. Performance And Reliability

- [ ] N+1 queries, over-fetching/under-fetching
- [ ] response size, compression, pagination caps
- [ ] timeouts, circuit breakers, graceful degradation
- [ ] GraphQL: query depth/complexity limits, persisted queries

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
