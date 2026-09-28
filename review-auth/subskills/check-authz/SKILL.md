---
name: review-auth-check-authz
description: Check authorization — permission checks ทุก mutation, IDOR, privilege escalation
argument-hint: "[scope]"
related:
  - review-auth
  - use-astgrep
  - report
---

## Goal

Run the authorization dimension of `/review-auth` แบบ focused — ทุก protected action มี server-side check จริง

## Scope

- ใช้เมื่อ `/review-auth` dispatch มาที่ `authz`/`permissions`/`rbac` หรือเรียก standalone
- ครอบคลุม: permission checks, IDOR/BOLA, privilege escalation paths, authz matrix completeness

## Execute

### 1. Build Authz Matrix

> Goal: role × resource ครบทุก protected action

ทำตาม `../../references/auth-checklist.md` (authorization section)

1. inventory protected routes/actions — middleware, decorators, guards
2. map role × resource — action ไหน role ไหนทำได้
3. flag actions ที่ไม่มีใน matrix

### 2. IDOR And Escalation Checks

> Goal: object-level + privilege-level authz ครบ

1. IDOR — resource access by ID ที่ขาด ownership check (`/use-astgrep` หา patterns)
2. privilege escalation — mass assignment, role fields ใน request body, admin endpoints
3. tenant isolation — cross-tenant data access paths

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Endpoint/Action`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี file path + line — endpoint + missing check location
- IDOR บน critical resource / privilege escalation = Critical

## Expected Outcome

- Authz matrix พร้อม gaps flagged
- IDOR/escalation findings พร้อม affected endpoints
