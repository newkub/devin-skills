---
name: improve-auth
description: หา auth improvements ใน scope — sessions, tokens, OAuth, MFA, RBAC, secrets — แก้หลัง user confirm
argument-hint: "[scope]"
related:
  - improve
  - improve-security
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "auth improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-auth` เป็น prioritized list แล้วส่งต่อไปแก้หลัง user confirm

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "authentication/authorization ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-auth` — sessions, tokens, OAuth flows, MFA, password policy, RBAC/ABAC matrix, secrets handling, audit logging, account recovery
- findings ที่เป็น general security (injection, headers, supply chain) → `/improve-security` แทน

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-auth`
3. รวบรวม prioritized list พร้อม severity และ evidence — auth findings ส่วนใหญ่เป็น Critical/High ให้เรียง P0 ก่อน

### 2. Present And Confirm

> Goal: แสดงผลและให้ user เลือกสิ่งที่จะแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ถาม user ว่าจะแก้ข้อไหน — รอการยืนยันก่อนลงมือ

### 3. Fix Confirmed Items

> Goal: แก้เฉพาะสิ่งที่ user เลือก

1. ส่งแต่ละ finding ที่ confirm ไป `/deep-review-then-fix` (domain `review-auth`)
2. Auth changes ต้องมี tests ครอบ authz matrix — ห้าม relax access control โดยไม่มี test
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-auth`
- ไม่แก้ไขโดยไม่ได้ user confirm
- ห้าม bypass/weaken auth เพื่อให้ test ผ่าน
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized auth improvement list จาก `/deep-review`
- User เลือกสิ่งที่จะแก้
- Findings ที่ confirm ถูกแก้ผ่าน `/deep-review-then-fix` พร้อม authz test coverage
