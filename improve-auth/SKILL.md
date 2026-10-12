---
name: improve-auth
description: หา auth improvements ใน scope — sessions, tokens, OAuth, MFA, RBAC, secrets — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-rbac
  - improve-security
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "auth improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-auth` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "authentication/authorization ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-auth` — sessions, tokens, OAuth flows, MFA, password policy, RBAC/ABAC matrix, secrets handling, audit logging, account recovery
- scope เจาะ RBAC/permissions/roles (authz + role-based UI) → `/improve-rbac`
- findings ที่เป็น general security (injection, headers, supply chain) → `/improve-security` แทน

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-auth`
3. รวบรวม prioritized list พร้อม severity และ evidence — auth findings ส่วนใหญ่เป็น Critical/High ให้เรียง P0 ก่อน

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-auth`)
2. Auth changes ต้องมี tests ครอบ authz matrix — ห้าม relax access control โดยไม่มี test
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-auth`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม bypass/weaken auth เพื่อให้ test ผ่าน
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized auth improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม authz test coverage
