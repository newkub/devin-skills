# Integration And Client Checks

## Scope

integration review สำหรับ: API client design, timeout configuration, connection pooling, error handling, retry strategies, circuit breaker patterns, vendor lock-in risk, abstraction layer, swappability, rate limit handling, fallback/degradation, integration health monitoring, integration testability, webhook integration, OAuth integration, SDK usage

## Checklist

### API Client And Connection

- ตรวจสอบ API client design: client instantiation, client reuse vs per-request, client configuration, base URL management, header management, auth token injection, client typing
- ตรวจสอบ timeout configuration: request timeout, connection timeout, read timeout, write timeout, retry timeout, timeout per endpoint
- ตรวจสอบ connection pooling: pool size, pool configuration, connection reuse, connection cleanup, connection leak prevention, keep-alive strategy
- ตรวจสอบ error handling: HTTP error mapping, network error handling, timeout error handling, 5xx vs 4xx handling, error propagation, error retry decision

### Resilience And Abstraction

- ตรวจสอบ retry strategies: retry on failure, retry conditions (5xx, network, timeout), max retries, backoff strategy (exponential, jitter), retry budget, retry idempotency
- ตรวจสอบ circuit breaker: circuit breaker pattern, failure threshold, recovery strategy, half-open state, circuit breaker per service, fallback on open circuit
- ตรวจสอบ vendor lock-in risk: abstraction layer, swappability, vendor-specific code isolation, interface-based integration, adapter pattern
- ตรวจสอบ rate limit handling: rate limit header parsing, rate limit backoff, rate limit queue, 429 handling, rate limit per service
- ตรวจสอบ fallback/degradation: fallback strategy, degraded mode operation, cached response fallback, default value fallback, user-facing fallback message
- ตรวจสอบ integration health monitoring: integration health check, integration metrics, integration alerting, integration status dashboard, dependency status page
- ตรวจสอบ integration testability: integration test strategy, mock/stub patterns, integration test coverage, contract testing, sandbox vs production

## Skip Conditions

- ถ้า integration ไม่มี retry → ข้ามส่วน retry strategies
- ถ้า integration ไม่มี circuit breaker → ข้ามส่วน circuit breaker
- ถ้า integration ไม่มี rate limit → ข้ามส่วน rate limit handling

## Severity

- Critical: no timeout on external call, no error handling on critical integration, connection leak, no circuit breaker on critical dependency, no fallback on critical integration, hardcoded vendor dependency ที่ไม่มี abstraction, no retry on critical integration
- High: missing timeout configuration, inconsistent error handling, missing connection pooling, missing retry, no rate limit handling, missing fallback, missing integration health monitoring, untestable integration
- Medium: suboptimal retry strategy, missing abstraction layer, minor vendor lock-in, missing integration metrics, incomplete test coverage
- Low: cosmetic, minor client improvement, documentation gap
