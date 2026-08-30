# Testing Checks

## Goal

Review test coverage, quality, isolation และ reliability

## Scope

ใช้กับ project ที่มี tests หรือ test infrastructure

## Checks

1. ตรวจสอบ coverage, test file patterns, test isolation, untested critical paths, E2E coverage, reliability

## Severity

- Critical: untested critical path, no tests at all
- High: low coverage on core logic, flaky tests
- Medium: missing edge case test, test isolation issue
- Low: cosmetic test improvement, naming convention

## Rules

- ถ้า project ไม่มี tests → ข้าม checks นี้
- ทุก finding ต้องมี test file path หรือ function/class ที่ถูกตรวจ
- ทำ review เท่านั้น ไม่แก้ไข test ระหว่าง review
