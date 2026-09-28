---
name: review-auth-report-authz
description: สร้าง authz matrix report — role × resource table, gaps, escalation paths
argument-hint: "[scope]"
related:
  - review-auth
  - report
  - create-report-in-dot-devin
---

## Goal

แปลง authorization findings ของ `/review-auth` เป็น permission matrix report — role × resource ที่เห็น gaps ทันที

## Scope

- ใช้เมื่อ `/review-auth` dispatch มาที่ `report-authz`/`matrix` หรือเรียก standalone กับ authz inventory ที่มีอยู่
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin`

## Execute

### 1. Build Matrix

> Goal: matrix ที่ audit ได้ทันที

1. ตาราง role × resource: cells = allowed/denied/partial
2. flag cells ที่ config ไม่ชัด (implicit allow, missing policy)
3. แยกตาราง findings: `No.`, `Endpoint`, `Required`, `Actual`, `Severity`, `Fix`

### 2. Escalation Paths

> Goal: เส้นทาง privilege escalation เห็นชัด

1. list paths: role A → role B ผ่าน action ใด (self-role-change, invite, token grant)
2. ทุก path มี evidence: handler file + missing check

### 3. Summarize

> Goal: verdict + actions

1. coverage: % protected actions ที่มี explicit policy
2. top risks + fix route → parent `## Fix` หรือ `../improve-auth/SKILL.md`
3. ถ้าต้องเก็บถาวร → `/create-report-in-dot-devin` — authz matrix มี sensitive structure อยู่ใน `.devin/` เท่านั้น

## Rules

- matrix ต้อง derive จาก code จริง — ห้ามเดา permission model
- ทุก gap มี endpoint + expected vs actual
- report อาจเปิดเผย attack surface — ห้าม commit ไป repo สาธารณะ

## Expected Outcome

- Role × resource matrix พร้อม implicit-allow gaps
- Escalation paths + prioritized fixes
