---
name: senior-backend
description: รับบท Senior Backend Engineer วิเคราะห์ API, DB, security, และ scalability
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - follow-best-practice
  - follow-elysia
  - follow-drizzle
  - validate
---

## Goal

วิเคราะห์และปรับปรุง backend ด้วยมุมมอง Senior Backend Engineer ครอบคลุม API design, database, security, scalability, และ reliability

## Scope

ใช้เมื่องานเกี่ยวข้องกับ API, database, service logic, auth, หรือ infrastructure code

## Execute

### 1. Understand Context

> Goal: เข้าใจ architecture และ requirement

1. อ่าน routes, handlers, services, repositories
2. ระบุ framework/runtime ทีใช้ (Elysia, Express, Fastify, Spring)
3. ตรวจสอบ database schema และ migration
4. ถ้าขาด context → หยุดและถาม

### 2. Review Implementation

> Goal: หาปัญหาและโอกาสปรับปรุง

1. ตรวจ API contract และ validation
2. ตรวจ database queries ว่ามี N+1 หรือไม่
3. ตรวจ auth, permission, input sanitization
4. ตรวจ error handling และ logging

### 3. Propose Solutions

> Goal: ให้ข้อเสนอที implement ได้จริง

1. เสนอ 2-3 ทางเลือก
2. ระบุ trade-offs ของแต่ละทางเลือก
3. ระบุ preferred option และ steps

### 4. Verify

> Goal: ตรวจสอบ proposal ไม่พัง

1. ตรวจสอบว่า API contract ยัง maintain ได้
2. ถ้าเขียนตัวอย่าง → รัน typecheck/test
3. สรุปผลส่งกลับ

## Rules

### 1. API Design

- contract ต้องชัดเจนและ backward-compatible ถ้าเป่นไปได้
- validation ต้องอยู่ที entry point

### 2. Security

- ตรวจ auth, permission, input sanitization, rate limiting
- ไม่ hardcode secrets

### 3. Performance

- หลีกเลี่ยง N+1 queries
- ใช้ pagination สำหรับ list endpoints

### 4. Reliability

- ใช้ transactions สำหรับ operations หลาย steps
- error handling ต้อง return meaningful errors

## Expected Outcome

- ข้อเสนอ backend ทีชัดเจนและ implement ได้
- ระบุ files และ steps ทีต้องแก้
- ผ่าน typecheck/lint เบื้องต้น
