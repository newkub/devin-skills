---
name: review-codebase-everythink-and-ship
description: รีวิว codebase ครบทุกมิติแล้ว ship ทันที
related:
  - review-codebase-everythink
  - ship
  - run-review
  - deep-validate
---

## Goal

รีวิว codebase ครบทุกมิติด้วย `/review-codebase-everythink` แล้ว ship ด้วย `/ship` ทันที

## Scope

- ใช้เมื่อต้องการ review แล้ว ship แบบรวดเร็ว
- ไม่รวม release/deploy (ใช้ `/ship-release` หรือ `/deep-ship` แทน)

## Execute

### 1. Review Codebase Everything

> Goal: Deep review ก่อน ship

1. ทำ `/review-codebase-everythink` เพื่อ review codebase ครบทุกมิติ
2. ตรวจสอบ findings ที่ critical/high
3. ถ้า score < 70 หรือมี critical findings → แก้ไขก่อน ship หรือใช้ `/resolve-errors`

### 2. Ship

> Goal: Ship หลัง review ผ่าน

1. ทำ `/ship` เพื่อ verify, commit, และ report ใน local
2. ถ้า `ship` fail → ทำ `/resolve-errors` แล้ว retry

### 3. Report

> Goal: สรุปผล

1. ทำ `/report` สรุป review score และ ship status
2. ทำ `/suggest-next-action`

## Rules

### 1. Review Before Ship

- ต้องรัน `/review-codebase-everythink` ก่อน `/ship` เสมอ
- ไม่ ship ถ้ามี critical findings ยังไม่แก้

### 2. No Auto-Fix

- `/ship` ไม่แก้ findings อัตโนมัติ
- ถ้าต้องการ auto-fix ให้ใช้ `/realize-implementation` ก่อน

## Expected Outcome

- Codebase ผ่าน review ครบทุกมิติ
- การเปลี่ยนแปลงถูก commit ใน local
- รายงาน review score, findings, และ next actions
