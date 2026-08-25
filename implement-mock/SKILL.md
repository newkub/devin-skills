---
name: implement-mock
description: แปลง MOCK, FAKE, STUB implementations เป็น production code
---

## Goal

แปลง mock implementations ทั้งหมดให้เป็น production code ที่เชื่อมต่อกับ infrastructure จริง ไม่ใช้ mock data หรือ simulation

## Scope

ใช้สำหรับ project ที่มี MOCK, FAKE, STUB implementations ที่ต้องแปลงเป็น production code

## Execute

### 1. Search Mock Implementations

> Goal: Search Mock Implementations

ค้นหาและจัดกลุ่ม mock implementations ทั้งหมดใน codebase

1. ใช้ `Grep` สำหรับ patterns: `MOCK`, `FAKE`, `STUB`, `mock_`, `fake_`, `stub_`, `InMemory`
2. จัดกลุ่มตามประเภท (database, API, service, external dependency)
3. วิเคราะห์ dependencies และ features ที่จำเป็นสำหรับการ implement

### 2. Implement Real Database

> Goal: Implement Real Database

แทนที่ InMemory/Stub database ด้วย real database connections

1. ติดตั้ง database client library ตาม database type
2. สร้าง database connection pool และ configuration
3. เขียน repository layer ด้วย real queries และ prepared statements
4. เพิ่ม retry logic, indexes, และ error handling
5. ทำ `/run-test` เพื่อทดสอบ

### 3. Implement Real API Calls

> Goal: Implement Real API Calls

แทนที่ mock API responses ด้วย real HTTP calls

1. ติดตั้ง HTTP client library และเขียน API client layer
2. เพิ่ม authentication, rate limiting, circuit breaker
3. เพิ่ม retry logic ด้วย exponential backoff
4. ทำ `/run-test` เพื่อทดสอบ

### 4. Implement Real External Services

> Goal: Implement Real External Services

แทนที่ mock external services ด้วย real integrations

1. ติดตั้ง SDK หรือ client library สำหรับ service
2. เชื่อมต่อกับ production endpoints และตั้งค่า authentication
3. เพิ่ม error handling, timeout, และ logging
4. ทำ `/run-test` เพื่อทดสอบ

### 5. Verify No Mocks Remain

> Goal: Verify No Mocks Remain

ตรวจสอบและยืนยันว่าไม่มี mock implementations เหลือ

1. ใช้ `Grep` อีกครั้งสำหรับ MOCK, FAKE, STUB
2. ตรวจสอบ imports และ configuration
3. ทำ `/run-test` และ `/run-lint` เพื่อทดสอบ

## Rules

### No Mocks in Production

แทนที่ทุก mock implementations ด้วย real code

- ไม่มี InMemory implementations ใน production
- ไม่มี fake data ใน production code
- ไม่มี stub functions ที่ return hardcoded values
- แทนที่ด้วย real database queries
- แทนที่ด้วย real API calls
- แทนที่ด้วย real service integrations

### Fail Fast on Missing Config

Throw error ถ้า required configuration ไม่มี

- Throw error ถ้า database connection string ไม่มี
- Throw error ถ้า API endpoint ไม่มี
- Throw error ถ้า API key ไม่มี
- ไม่ silently fall back ไปใช้ mock data
- Clear error messages บอกว่าต้องตั้งค่าอะไร

### Security by Default

ใช้ secure configurations สำหรับ production

- HTTPS/TLS เท่านั้นสำหรับ external calls
- API keys ต้องอยู่ใน environment variables หรือ secrets manager
- No credentials ใน codebase
- Use connection encryption สำหรับ databases
- Validate SSL certificates

### Observability

ใช้ structured logging สำหรับทุก external call

- Log request/response สำหรับ API calls
- Log query execution สำหรับ database
- Log errors ด้วย context เต็ม
- Metrics สำหรับ response times
- Metrics สำหรับ error rates
- Distributed tracing ถ้าเป็นไปได้

### Error Handling

ใช้ proper error handling สำหรับ external dependencies

- Handle transient errors ด้วย retry
- Handle network timeouts
- Handle service unavailable errors
- Return user-friendly error messages
- ไม่ crash application เมื่อ service ล่ม
- Graceful degradation ถ้าเป็นไปได้

## Expected Outcome

- ไม่มี MOCK, FAKE, STUB ใน production code
- ทุก implementations เชื่อมต่อกับ infrastructure จริง
- มี proper error handling สำหรับ external dependencies
- ไม่มี mock data หรือ simulation ใน codebase