# Resilience Checks

## Goal

ตรวจสอบ resilience: modularity, isolation, side effects, flow, rate limiting, retries, timeouts, circuit breakers, fallback

## Checks

### Side Effects Management

1. ลบ `console.log` ที่ไม่จำเป็น; ใช้ structured logging library
2. สร้าง service abstractions: `Clock`, `Random`, `Env`, `Logger` สำหรับ `Date`/`Math.random`
3. ใช้ Result/Either patterns สำหรับ error handling
4. ใช้ retry logic, timeout handling, resource management patterns
5. ทำให้ code test ง่ายด้วย input/output สำหรับ pure functions และ mock สำหรับ dependencies

### Flow Quality

1. fail fast: validation และ reference checks อยู่ต้น
2. dependencies ชัดเจน ไม่ซ่อน ordering ด้วยคำกำกวม
3. parallel ต้องไม่แชร์ mutable state
4. ระบุ retry limit (max 3 → stop/report) สำหรับ recoverable failures
5. เรียง steps ตาม: foundation → validation → high impact → dependencies → report/cleanup

### Rate Limiting

1. ระบุ limit ที่ชัดเจน: requests/time window/ผู้ใช้
2. ระบุจุดที่ควรใช้ token bucket, sliding window, หรือ leaky bucket
3. คง backward compatibility เมื่อปลอดภัย
4. หลีกเลี่ยงการ block legitimate traffic โดยไม่จำเป็น
5. ตรวจสอบ rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`
6. ตรวจสอบ 429 handling, distributed rate limiting, race condition prevention

### Retries, Timeouts, Idempotency

1. ตรวจสอบ timeout บน external calls: default timeout, connect vs read timeout
2. ตรวจสอบ retry policy: max retries, conditions, exponential backoff, jitter, retry budget
3. ตรวจสอบ idempotency สำหรับ retries และ duplicate requests
4. ตรวจสอบความปลอดภัยของ retry บน non-idempotent operations

### Circuit Breakers And Bulkheads

1. ตรวจสอบ circuit breaker: failure threshold, half-open state, recovery
2. ตรวจสอบ bulkhead / resource isolation: thread pools, semaphores, connection limits
3. ตรวจสอบ load balancing, queue, backpressure, concurrency limits, DLQ
4. ระบุ dependencies ที่ไม่มี circuit breaker หรือ isolation

### Fallback And Graceful Degradation

1. ตรวจสอบ fallback: default value, cached data, cached response
2. ตรวจสอบ graceful degradation: ปิด feature บางส่วน, ลด functionality
3. ตรวจสอบ queue/worker fallback: dead letter queue, error recovery, replay
4. ตรวจสอบ feature flags หรือ toggles สำหรับ degraded mode
5. ระบุ critical paths ที่ไม่มี fallback

## Severity

- Critical: no timeout/retries บน critical external call, no fallback สำหรับ critical dependency, SPOF โดยไม่มี redundancy, missing circuit breaker ที่ก่อ cascade failure, data loss จาก failure ที่ไม่มี recovery
- High: missing retry, missing timeout, missing fallback, missing circuit breaker, missing idempotency, missing graceful degradation, missing queue/DLQ
- Medium: suboptimal retry/backoff, partial health check, missing monitoring บน non-critical path
- Low: cosmetic, documentation gap, minor naming improvement
