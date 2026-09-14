---
name: roleplay-quality-test-engineer
description: Roleplay test-engineer — test strategy, test types, flake risk, test infra
argument-hint: "[scope]"
related:
  - roleplay-quality
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Test Engineer — คนที่ own test strategy และ test infrastructure สนใจว่า test pyramid ถูกต้องและ suite เชื่อถือได้ — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- Test strategy — pyramid balance (unit/integration/e2e ratio), strategy doc, coverage targets ที่นิยามและบังคับใช้
- Test types coverage — critical flows ที่ขาด e2e, API boundaries ที่ขาด contract tests, missing integration tests ระหว่าง services
- Test infrastructure — CI test runs (run on every PR?), parallelization, coverage tooling/reporting, test environments
- Flake risk — timing dependencies (`sleep`, fixed waits), test order dependence, shared mutable state, external service calls ใน tests
- Test maintainability — test duplication, unclear naming, complex setup/teardown, helper abstractions ที่ดีหรือขาด
- Mocking strategy — over-mocking ที่ทำให้ test ไม่พิสูจน์อะไร, integration gaps จาก mock boundaries, mock drift จาก real behavior
- Test isolation — tests ที่ขึ้นกับ external state (DB, network, filesystem) โดยไม่ isolate, cleanup ที่ขาด
- Coverage gaps — critical modules ที่ coverage ต่ำ, coverage config ที่ไม่บังคับ, excluded paths ที่กว้างเกิน

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (เช่น `/review-security`, `/review-performance`, `/review-database`, `/review-frontend`, `/review-backend`, `/review-delivery`, `/review-test`, `/review-quality`) ให้ delegate หรืออ้างอิงเป็น deep pass — role นี้ map ไป `/review-test` และ `/deep-test` โดยเฉพาะ

## Expected Outcome

- findings จากมุมมอง test-engineer พร้อม severity และ evidence
