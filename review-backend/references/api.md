# API Design And Versioning Checks

## Scope

API review สำหรับ: API design, endpoint patterns, HTTP methods, RESTful conventions, versioning, documentation, error handling, rate limiting, input validation, response format consistency

## Checklist

### API Design

- ตรวจสอบ handler patterns, request/response typing, response format consistency, status code usage
- ตรวจสอบ endpoint patterns: RESTful conventions, route naming, HTTP method usage, route grouping, nested routes
- ตรวจสอบ middleware: middleware chains, order of execution, auth middleware, CORS config, logging middleware, error middleware
- ตรวจสอบ input validation และ idempotency: input validation coverage, Zod schema coverage, idempotency key support, duplicate request handling, safe retries, idempotent write patterns
- ตรวจสอบ pagination: pagination strategy (offset, cursor, keyset), page size limits, pagination metadata, total count accuracy

### Versioning

- API versioning strategy, backward compatibility, deprecation headers, sunset headers

### Documentation

- OpenAPI/Swagger spec, endpoint documentation, request/response examples, error code documentation

### Errors

- error middleware, error response format, status code usage, safe error messages

### Rate Limiting

- rate limit configuration, per-endpoint limits, IP-based vs user-based, rate limit headers, 429 handling

## Skip Conditions

- ถ้า project ไม่มี API layer → ข้ามทั้งหมด
- ถ้า project ไม่มี middleware → ข้ามส่วน middleware
- ถ้า project ไม่มี rate limiting → ข้ามส่วน rate limiting
- ถ้า project ไม่มี pagination → ข้ามส่วน pagination
- ถ้า project ไม่มี API versioning → ข้ามส่วน versioning

## Severity

- Critical: unauthenticated endpoint, missing input validation, data corruption risk, no error handling on critical path, broken endpoint
- High: missing rate limiting, inconsistent response format, missing idempotency, missing pagination, no API documentation
- Medium: inconsistent endpoint naming, missing middleware, suboptimal pagination, missing versioning
- Low: cosmetic, documentation gap, minor naming
