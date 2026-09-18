# Logging And Debugging Checks

## Goal

Review logging practices, error messages, stack traces และ debuggability

## Scope

ใช้กับ project ที่มี logging, error handling, debugging tools

## Checks

1. ตรวจสอบ log levels, structured logging, log consistency, sensitive data exposure, PII, secret leakage
2. ตรวจสอบ error message clarity, stack trace quality, source map coverage, reproducibility

## Severity

- Critical: secrets in logs, PII exposure, silent failure, no error context
- High: missing structured logging, unclear error message, no debug logging in critical path
- Medium: inconsistent log levels, missing stack trace
- Low: log formatting, minor error message improvement

## Rules

- ถ้า project ไม่มี logging → ข้าม checks นี้
- ทุก finding ต้องมี file path หรือ log/config ที่เกี่ยวข้อง
- ทำ review เท่านั้น ไม่แก้ไข logging หรือ error handling ระหว่าง review
