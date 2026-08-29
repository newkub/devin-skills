---
name: analyze-attack-surface
description: วิเคราะห์ attack surface และ exposed endpoints ของระบบ
argument-hint: "[app-url|repo-path]"
related:
  - review-security
  - check-secrets-leak
  - list-website-all-routes
  - review-security
---

## Goal
ระบุจุดที attacker อาจโจมตีได้ เช่น endpoints, dependencies, infrastructure

## Scope
- รองรับ web, API, cloud, mobile backends
- ใช้ port scan, dependency scan, route analysis
- รายงานเป้น trust boundary diagram หรือ list

## Execute
### 1. List Exposed Surfaces

> Goal: List Exposed Surfaces

1. ใช้ `list-website-all-routes` หรือ `raindrop list` สำหรับ routes
2. scan ports ด้วย `nmap` ถ้าได้รับอนุญาต
3. หา public IPs, domains, load balancers

### 2. Identify Entry Points

> Goal: Identify Entry Points

1. ระบุ public endpoints: REST, GraphQL, gRPC, WebSocket
2. หา authentication/authorization boundaries
3. หา file uploads, webhooks, admin panels

### 3. Assess Dependencies

> Goal: Assess Dependencies

1. รัน dependency scan หา known vulnerabilities
2. หา third-party services ทีเชื่อมต่อ
3. ตรวจสอบ supply chain risk

### 4. Report

> Goal: Report

1. สรุป attack surface หลัก
2. ระบุ severity ของแต่ละ entry point
3. แนะนำ mitigations เบื้องต้น

## Rules
### 1. Legal

- scan ระบบทีได้รับอนุญาตเท่านั้น
- ไม่ port scan โดยไม่ได้รับอนุญาต
- ไม่ exploit vulnerabilities

### 2. Comprehensive

- ระบุทั้ง network, application, และ human factors
- แยก internal vs external exposure
- ระบุ trust boundaries

## Expected Outcome
- attack surface list พร้อม severity
- trust boundary map
- mitigation recommendations
