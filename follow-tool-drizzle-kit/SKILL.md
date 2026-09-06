---
name: follow-tool-drizzle-kit
description: ใช้ drizzle-kit จัดการ migrations — generate, migrate, push, studio
argument-hint: "[target-or-scope]"
related:
  - follow-best-practice
  - run-verify
  - run-test
  - report-table
---

## Goal

ใช้ drizzle-kit จัดการ migrations — generate, migrate, push, studio

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. `drizzle-kit generate` สร้าง SQL migration จาก schema diff
1. `drizzle-kit migrate` apply migrations; `push` สำหรับ dev prototyping
1. ตั้ง `drizzle.config.ts`: schema path, dialect, dbCredentials
1. ใช้ `drizzle-kit studio` หรือ `/run-drizzle-studio` สำหรับ data browsing

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- production ใช้ `migrate` เสมอ — `push` เฉพาะ dev
- review generated SQL ก่อน commit — rename detection ไม่สมบูรณ์
- เก็บ migrations ใน version control เสมอ
- อย่าแก้ migration ที่ applied แล้ว — สร้าง migration ใหม่

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน