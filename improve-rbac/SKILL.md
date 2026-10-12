---
name: improve-rbac
description: หา RBAC improvements ใน scope — roles, permission matrix, guards, role-based UI — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-auth
  - improve-security
  - improve-uxui
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "RBAC improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domains `review-auth` + `review-frontend` เฉพาะ authorization/RBAC surface เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "RBAC/permissions/roles ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-auth` (authz scope) — role definitions, permission matrix coverage, policy enforcement points, privilege escalation paths, role assignment, tenancy isolation, audit logging ของ authz decisions
- `review-frontend` (role-based UI) — menu/nav/action gating ตาม role, route guards, forbidden states, capability checks ที่ action level ไม่ใช่แค่ page level (hidden ≠ secure)
- authn (sessions, tokens, OAuth, MFA, password policy) → `/improve-auth`; injection/secrets/supply chain → `/improve-security`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-auth` เฉพาะ authorization + `review-frontend` เฉพาะ role-based UI — permission matrix coverage, missing guards, privilege escalation, inconsistent role checks
3. รวบรวม prioritized list พร้อม severity และ evidence — RBAC findings ส่วนใหญ่เป็น Critical/High ให้เรียง P0 ก่อน

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-auth` หรือ `review-frontend` ตามจุด)
2. Authorization changes ต้องมี tests ครอบ permission matrix ทุก role × resource — ห้าม weaken access control โดยไม่มี test
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains `review-auth` + `review-frontend` (RBAC surface)
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้าม bypass/weaken authorization เพื่อให้ test ผ่าน — deny-by-default เสมอ
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized RBAC improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม authz test coverage ครบ role × resource
