---
name: run-test
description: รัน unit tests (alias สำหรับ /run-test-unit)
related:
  - run-test-unit
  - run-test-all
  - run-test-integration
  - run-test-e2e
  - run-test-api
  - run-test-coverage
  - improve-test-coverage
  - deep-validate
---

## Goal

รัน unit tests อย่างรวดเร็ว โดย `/run-test` หมายถึง `/run-test-unit`

## Scope

ใช้เป็นคำสั่งพื้นฐานสำหรับรัน unit tests สำหรับ pure functions และ business logic
ถ้าต้องการรัน test suite ทั้งหมด ให้ใช้ `/run-test-all`

## Execute

### 1. Run Unit Tests

> Goal: รัน unit tests

1. ทำ `/run-test-unit`
2. บันทึกผลลัพธ์, duration, และรายการ tests ที่ fail

## Rules

### 1. Default Is Unit

- `/run-test` หมายถึง `/run-test-unit` เสมอ
- ถ้าต้องการ integration, e2e, api, หรือ coverage ให้ใช้ `/run-test-all` หรือ skill เฉพาะทาง

### 2. No Auto Fix

- ห้ามแก้ source หรือ test โดยไม่มี evidence
- ถ้า fail → ทำ `/deep-validate` กับ source แล้ว report ก่อนแก้ไข

- ใช้ /run-test-integration ถ้าจำเป็น
- ใช้ /run-test-e2e ถ้าจำเป็น
- ใช้ /run-test-api ถ้าจำเป็น
- ใช้ /run-test-coverage ถ้าจำเป็น

## Expected Outcome

- Unit tests ถูกรัน
- ผลลัพธ์ถูกรายงานชัดเจน
- ถ้ามี fail ให้ไป validate/review ต่อ
