---
name: analyze-project
description: (merged into /deep-analyze) วิเคราะห์โปรเจกต์พื้นฐาน
argument-hint: "[scope]"
related:
  - deep-analyze
  - scan-codebase
---

## Goal

วิเคราะห์โปรเจกต์พื้นฐาน

## Scope

ใช้สำหรับ analysis แบบพื้นฐาน ทำงานนี้ผ่าน `/deep-analyze` ได้เลย หรือ `/scan-codebase` สำหรับ quick snapshot

## Execute

### 1. Redirect

> Goal: ใช้ `/deep-analyze` หรือ `/scan-codebase` แทน

1. ทำ `/deep-analyze` แทน
2. ถ้าต้องการเฉพาะ quick scan 3 นาที → ทำ `/scan-codebase`

## Rules

- ใช้ `/deep-analyze` สำหรับ analysis ที่ครบถ้วน
- ใช้ `/scan-codebase` สำหรับ quick overview
- `/deep-analyze` รวม capabilities ของ skill นี้แล้ว

## Expected Outcome

- รายงานโครงสร้างโปรเจกต์ที่ครบถ้วน
- รายการ dependencies พร้อม versions
- ระบุ architectural patterns
- Recommendations สำหรับ refactor และ improvements
