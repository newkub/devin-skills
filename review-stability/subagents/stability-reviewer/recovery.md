# Recovery And Degradation Checks

## Goal

ระบบพังบางส่วนได้โดยไม่หยุดทำงานทั้งหมด

## Scope

- retry, circuit breaker, fallback, timeout, backoff
- queue, dead letter queue, error recovery workers
- dependencies ที่ไม่มี fallback
- graceful degradation patterns

## Execute

1. ค้นหา retry, circuit breaker, fallback patterns
2. ตรวจสอบ timeout และ backoff strategies
3. ระบุ dependencies ที่ไม่มี fallback
4. ตรวจสอบ queue, dead letter queue, และ error recovery workers
5. ตรวจสอบ graceful degradation: fallback UI, partial functionality, cached data, offline mode
6. ตรวจสอบ error recovery: automatic retry, user-initiated retry, state recovery, error boundary reset, form data preservation
7. ระบุ critical paths ที่ไม่มี recovery

## Rules

- recovery ต้องมี timeout, backoff, max retry
- fallback ต้องไม่ซ่อน error หรือทำให้เกิด data loss

## Skip Conditions

- ถ้า project ไม่มี async/external calls → ข้าม retry/circuit breaker checks
- ถ้า project ไม่มี queues → ข้าม dead letter queue checks

## Expected Outcome

- รายการ recovery patterns, gaps, missing fallback
- ระบุ critical paths ที่ไม่มี recovery/degradation
