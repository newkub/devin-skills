---
name: improve-security
description: หา security improvements ใน scope รวม findings แล้วแก้ผ่าน deep-review Fix ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-rbac
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "security improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-security` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "ควร improve security อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` (domain `review-security`) ไม่ทำ review เองและไม่แก้ไขโดยตรง

## Execute

### 1. Review Security

> Goal: ได้ prioritized security findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-security` — auth/authz, input validation, secrets, injection, dependencies vulnerabilities, OWASP checks (RBAC-focused findings → `/improve-rbac`)
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง security improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-security`)
2. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-security`
- แก้ทุก finding ทันทีโดยไม่รอ confirm — Critical findings เสนอเป็น priority แรก
- ห้าม commit secrets หรือ log credentials ในรายงาน — ระบุแค่ location/type
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized security improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix`
