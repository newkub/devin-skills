---
name: improve-api
description: ปรับปรุง API endpoints ด้าน performance, structure, error handling, caching และ security
argument-hint: "[route-or-pattern]"
related:
  - improve-codebase-everything
  - improve-data-validation
  - improve-database
  - optimize-codebase-everything
  - deep-review
  - run-test
  - resolve-errors
---

## Goal

ปรับปรุง API endpoints ทาง performance, structure, error handling, caching และ security

## Scope

ใช้กับ REST, RPC, tRPC, orpc, Hono, Express โดย audit endpoints และ implement best practices

## Execute

### 1. Audit API Structure

> Goal: เข้าใจ API ปัจจุบัน

1. ตรวจ route files ใน `src/routes`, `src/server`, `src/api`
2. ตรวจ API contracts, schemas
3. ตรวจ response formats
4. บันทึก endpoints ทั้งหมด

### 2. Optimize Performance

> Goal: ลด latency

1. ใช้ pagination สำหรับ list endpoints
2. ใช้ cursor pagination ถ้า dataset ใหญ่
3. ลด fields ใน response ด้วย field selection
4. ใช้ batch endpoints แทน N+1
5. ใช้ caching headers (`Cache-Control`, `ETag`)
6. ใช้ response compression

### 3. Improve Error Handling

> Goal: API errors ชัดเจน

1. ใช้ consistent error response format
2. ใช้ HTTP status codes ทีถูกต้อง
3. ไม่ expose internal errors ใน production
4. ใส่ requestId/traceId ใน error responses
5. Log errors ด้วย severity ทีเหมาะสม

### 4. Strengthen Security

> Goal: ป้องกัน common API attacks

1. Validate auth ทุก protected endpoint
2. ตรวจ rate limiting
3. Sanitize input
4. ใช้ parameterized queries
5. ตรวจ IDOR (user A เข้าถึง user B)
6. ใช้ CSRF protection ถ้าจำเป็น

### 5. Validate

> Goal: ยืนยัน API ยังทำงาน

1. รัน `/run-test-api` หรือ integration tests
2. รัน `/run-test`
3. ใช้ load test ถ้าจำเป็น
4. ทำ `/deep-review` สำหรับ security

## Rules

### 1. Consistent Contract

- ใช้ schema สำหรับ request/response
- ไม่เปลี่ยน response format โดยไม่ versioning
- Document breaking changes

### 2. Minimal Response

- ส่งเฉพาะ fields ทีจำเป็น
- ใช้ pagination สำหรับทุก list
- ไม่ส่ง sensitive data

### 3. Idempotency

- Mutating endpoints ควร idempotent ถ้าได้
- ใช้ idempotency key สำหรับ payment/booking

### 4. Caching

- ใช้ cache สำหรับ read-heavy endpoints
- Invalid cache ถ้า data เปลี่ยน
- ตั้ง cache headers ชัดเจน

### 5. Observability

- Log ทุก error
- ใช้ metrics สำหรับ latency, status codes
- Trace requests ข้าม services

## Expected Outcome

- API latency ลดลง
- Error handling สม่ำเสมอ
- Security แข็งแรงขึ้น
- Tests ผ่าน
- Documentation อัปเดต
