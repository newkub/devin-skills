---
name: improve-backend
description: แก้ไข backend findings ด้าน API, service, database, data flow
argument-hint: "[target-or-scope]"
related:
  - review-backend
  - review-api
  - review-database
  - review-security
  - review-stability
  - improve-api
  - improve-database
  - improve-security
  - improve-stability
  - resolve-errors
  - run-test
  - run-verify
  - report-table
  - suggest-next-action
---

## Goal

แก้ไข backend findings จาก `/review-backend` ครอบคลุม API design, service logic, database access, data flow, และ infrastructure integration

## Scope

ใช้กับ backend services, APIs, database layers, workers, queues — ไม่รวม frontend หรือ business domain เฉพาะ (ใช้ `/improve-frontend`, `/improve-business` แทน)

## Execute

### 1. Review Findings

> Goal: เข้าใจ backend findings

1. อ่าน report จาก `/review-backend`
2. แบ่ง findings ตาม area: API, service, database, data flow, security, stability
3. จัดลำดับตาม impact และ effort
4. ระบุ files และ consumers ที่กระทบ

### 2. Fix API Issues

> Goal: API ถูกต้องและใช้งานง่าย

1. ทำ `/improve-api` สำหรับ API findings
2. แก้ validation, auth, error responses
3. อัปเดต OpenAPI/docs ถ้ามี
4. รัน API tests

### 3. Fix Service Logic

> Goal: business logic ใน service layer ถูกต้อง

1. แก้ service functions ตาม findings
2. แยก concerns: controller, service, repository
3. ลด coupling ระหว่าง services
4. รัน unit/integration tests

### 4. Fix Database Issues

> Goal: database access มีประสิทธิภาพและถูกต้อง

1. ทำ `/improve-database` สำหรับ schema/query issues
2. แก้ N+1, missing indexes, slow queries
3. ตรวจ migrations และ data integrity
4. รัน database tests

### 5. Fix Data Flow

> Goal: data flow ระหว่าง components ถูกต้อง

1. แก้ event/queue/message flow
2. ตรวจ serialization/deserialization
3. แก้ race conditions หรือ ordering issues
4. รัน integration tests

### 6. Improve Security And Stability

> Goal: backend ปลอดภัยและเสถียน

1. ทำ `/improve-security` สำหรับ vulnerabilities
2. ทำ `/improve-stability` สำหรับ error handling/recovery
3. เพิ่ม rate limiting ถ้าจำเป็น
4. รัน security/stability tests ถ้ามี

### 7. Validate Backend

> Goal: ยืนยัน backend ทำงานได้

1. รัน `run-test`
2. รัน `run-verify`
3. รัน integration/e2e tests ถ้ามี
4. ตรวจ logs/metrics หลัง tests

### 8. Report

> Goal: สรุปผล

1. ทำ `/report-table` สรุป fixes
2. ทำ `/review-backend` อีกครั้งเพื่อ verify
3. ทำ `/suggest-next-action`

## Rules

### 1. Preserve Contracts

- ไม่เปลี่ยน public API โดยไม่ versioning หรือ migration
- รักษา backward compatibility ถ้าเป็นไปได้

### 2. Test Coverage

- ทุก fix ต้องมี test coverage
- รัน integration tests สำหรับ data flow ที่แก้

### 3. Minimal Coupling

- แก้เฉพาะ layer ทีมีปัญหา
- ไม่ refactor ทั้ง backend ถ้าไม่จำเป็น

### 4. Security First

- ไม่ expose secrets หรือ sensitive data
- validate/sanitize ทุก input

## Expected Outcome

- API, service, database, data flow ถูกต้องและมีประสิทธิภาพ
- `run-test` และ `run-verify` ผ่าน
- `/review-backend` ไม่พบ issues เดิม
- รายงาน fixes พร้อม next action
