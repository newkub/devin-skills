# App Stability Checks

## Crash Boundaries

- ตรวจสอบ React Error Boundaries, Vue error handlers, หรือ framework equivalent
- ระบุ components หรือ modules ที่ไม่มี error boundary
- ตรวจสอบ graceful fallback UI เมื่อ error
- ตรวจสอบ process-level crash handlers สำหรับ backend/CLI
- ค้นหา memory leaks, infinite loops, recursive calls ที่อาจทำให้ crash

## Health Checks

- ค้นหา health check endpoints `/health`, `/ready`, `/live`
- ตรวจสอบว่า health checks ตรวจ dependencies จริง เช่น database, queue
- ระบุ health checks ที่ dummy หรือไม่ตรวจอะไร
- ตรวจสอบ startup/shutdown hooks

## Monitoring And Logging

- ตรวจสอบ logging framework และ log levels
- ระบุ logs ที่ขาด context หรือ trace ID
- ตรวจสอบ monitoring, alerts, metrics ถ้ามี
- ระบุ critical paths ที่ไม่มี logs

## Recovery And Degradation

- ค้นหา retry, circuit breaker, fallback patterns
- ตรวจสอบ timeout และ backoff strategies
- ระบุ dependencies ที่ไม่มี fallback
- ตรวจสอบ queue, dead letter queue, และ error recovery workers

## Stability Criteria

- ระบุ crashes, unhandled exceptions, OOM, infinite loops
- ระบุ error boundaries และ fallback UI
- ระบุ monitoring gaps, missing logs, missing health checks
- ระบุ recovery patterns, retries, circuit breakers
