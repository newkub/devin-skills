---
name: report-api
description: สรุป API endpoints: paths, methods, validation, auth, rate limiting
allowed-tools:
  - read
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - report-format-table
  - scan-codebase
  - review-codebase
  - resolve-errors
  - suggest-next-action
---

## Goal

รายงาน API endpoints ของโปรเจกต์: paths, methods, input validation, auth requirements, rate limiting และ status

## Scope

ใช้สำหรับการรายงาน API layer จาก codebase — ไม่รวมการ review API quality (ใช้ `/review-codebase` สำหรับ review)

## Execute

### 1. Gather Data

ค้นหาและรวบรวม API endpoints และ metadata ทั้งหมด

> Goal: มี endpoints และ metadata ครบสำหรับการรายงาน

1. ทำ `/scan-codebase` เพื่อค้นหา API route definitions (oRPC procedures, server functions, route handlers)
2. ค้นหา patterns: `osapi.`, `createServerFn`, `router.`, `app.get`, `app.post`, `defineHandler`
3. ระบุ path, HTTP method, input/output schema (Zod), auth requirement, rate limiting, middleware ของแต่ละ endpoint
4. แยกตามประเภท: public API, internal API, webhook endpoints

### 2. Analyze

วิเคราะห์ความครอบคลุมและสุขภาพของ API

> Goal: เข้าใจ coverage gaps และ health issues ของ API

1. จัดกลุ่ม endpoints ตาม module/domain: auth, booking, payment, user, admin
2. ระบุ CRUD completeness และ endpoints ที่ขาด validation, auth หรือ rate limiting
3. ระบุ endpoints ที่ไม่มี error handling, เปิดเผย sensitive data, ไม่มี input sanitization, มี N+1 query risk
4. ระบุ endpoints ที่ไม่มี OpenAPI documentation

### 3. Format

จัดรูปแบบรายงานให้อ่านง่าย

> Goal: รายงานครบ อ่านง่าย มี insights

1. ทำ `/report-format-table` เพื่อจัดรูปแบบเป็นตาราง
2. แสดงผลตามลำดับ: Summary → Endpoints → Coverage Gaps → Health Issues
3. กำหนด columns: No., Method, Path, Module, Auth, Validation, Rate Limit, Docs
4. จัดกลุ่มตาม module

### 4. Present

นำเสนอ report พร้อม insights และ recommendations

> Goal: ผู้อ่านรู้ว่าต้องปรับปรุงอะไร

1. สรุปจำนวน endpoints แยกตาม module และ method
2. ระบุ priority actions: endpoints ที่ขาด auth ก่อน, จากนั้น validation, จากนั้น rate limiting
3. แนะนำ next steps: `/review-codebase` สำหรับ review, `/resolve-errors` สำหรับแก้ issues
4. ทำ `/suggest-next-action`

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-format-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-format-terminal` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Read-Only

- ไม่แก้ไข API code — รายงานเท่านั้น
- ใช้ `/review-codebase` สำหรับ review API quality
- ใช้ `/resolve-errors` สำหรับการแก้ไข

### Output Format

- ทำ `/report-format-table` สำหรับจัดรูปแบบผลลัพธ์
- จัดกลุ่มตาม module
- ใช้ symbols: ✅ has, ❌ missing, ⚠️ partial

### High Impact Content

- ชี้เน้น endpoints ที่ขาด auth ที่ควรมี
- ชี้เน้น endpoints ที่ขาด validation
- ถ้ามีมากกว่า 50 endpoints → แสดงเฉพาะที่มี issues
- ชี้เน้น endpoints ที่เปิดเผย sensitive data

### Non-Redundancy

- การ review API quality อยู่ใน `/review-codebase` แล้ว
- การค้นหา code อยู่ใน `/scan-codebase` แล้ว
- การรายงาน OpenAPI docs อยู่ใน `/review-codebase` แล้ว

## Expected Outcome

- รายการ API endpoints ทั้งหมดในตารางที่อ่านง่าย
- ข้อมูลครบ: method, path, module, auth, validation, rate limit, docs
- ระบุ coverage gaps และ health issues
- มี recommendations ชัดเจน
- ไม่มีการแก้ไข API code — read-only report
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
