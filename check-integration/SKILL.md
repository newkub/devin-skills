---
name: check-integration
description: ตรวจสอบ integration points และ data flow
---

## Goal

ตรวจสอบ integration points และ data flow ระหว่าง components และ services

## Execute

### 1. Check API Integration

1. ตรวจสอบ API contracts ถูกต้อง
2. ตรวจสอบ request/response formats
3. ตรวจสอบ error handling สำหรับ API calls
4. ตรวจสอบ retry mechanisms

### 2. Check Database Integration

1. ตรวจสอบ database connections
2. ตรวจสอบ query efficiency
3. ตรวจสอบ transaction handling
4. ตรวจสอบ data consistency

### 3. Check Third-Party Integration

1. ตรวจสอบ third-party API keys
2. ตรวจสอบ rate limiting handling
3. ตรวจสอบ fallback mechanisms
4. ตรวจสอบ service availability

### 4. Check Data Flow

1. ตรวจสอบ data flow diagrams
2. ตรวจสอบ data transformations
3. ตรวจสอบ data validation
4. ตรวจสอบ data sanitization

### 5. Check Error Propagation

1. ตรวจสอบ error handling ระหว่าง services
2. ตรวจสอบ error logging ที่ integration points
3. ตรวจสอบ error recovery strategies
4. ตรวจสอบ graceful degradation

### 6. Run Integration Tests

1. รัน integration test suite
2. ทดสอบ critical integration points
3. ทดสอบ error scenarios
4. ทดสอบ performance ของ integrations

## Rules

### 1. API Integration

- ใช้ typed contracts (OpenAPI, GraphQL schema)
- ตรวจสอบ version compatibility
- ใช้ circuit breakers สำหรับ external services
- ใช้ timeouts สำหรับ external calls

### 2. Database Integration

- ใช้ connection pooling
- ใช้ prepared statements
- ใช้ transactions สำหรับ critical operations
- ใช้ migrations สำหรับ schema changes

### 3. Third-Party Integration

- ใช้ abstraction layers
- ใช้ mock services สำหรับ testing
- ใช้ rate limiting
- ใช้ caching สำหรับ expensive calls

### 4. Priority Levels

- Critical: integration ไม่ทำงาน
- High: integration ทำงานไม่ถูกต้อง
- Medium: integration ทำงานช้า
- Low: เป็น best practices

## Expected Outcome

- API integrations ทำงานถูกต้อง
- Database integrations ทำงานถูกต้อง
- Third-party integrations ทำงานถูกต้อง
- Data flow ถูกต้อง
- Error propagation ถูกต้อง
- Integration tests ผ่าน
