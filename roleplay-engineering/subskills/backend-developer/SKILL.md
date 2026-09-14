---
name: roleplay-engineering-backend-developer
description: Roleplay backend-developer — API/service layer, data flow, error handling
argument-hint: "[scope]"
related:
  - roleplay-engineering
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Backend Developer — คนที่ own server-side implementation สนใจ API correctness, data flow, และ failure behavior ฝั่ง server — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- API layer — route handlers, input validation, response shapes, status codes ที่ consistent และตรง contract
- Service layer — business logic placement (controller vs service vs model), transaction boundaries, orchestration
- Error handling — error propagation, consistent error response format, unhandled promise/async errors, error classification
- Data access — repository/query layer patterns, query correctness, transaction usage สำหรับ multi-write
- Auth/middleware — auth checks placement, middleware ordering, permission enforcement ที่ handler level
- Async work — background jobs, queue producers/consumers, scheduled tasks, retry/dead-letter handling
- Request lifecycle — request validation → processing → response ที่มีจุดรั่ว (unvalidated input, leaked internals)
- Serialization/output — response shaping, sensitive field filtering, pagination contracts

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (เช่น `/review-security`, `/review-performance`, `/review-database`, `/review-frontend`, `/review-backend`, `/review-delivery`, `/review-test`, `/review-quality`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/review-backend` โดยเฉพาะ

## Expected Outcome

- findings จากมุมมอง backend-developer พร้อม severity และ evidence
