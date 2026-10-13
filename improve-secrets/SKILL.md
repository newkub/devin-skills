---
name: improve-secrets
description: ปรับปรุง secrets hygiene — ย้าย hardcoded values ไป secret store, fix leaks, rot — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-security
  - improve-config
  - check-secrets
  - follow-secret-manager
  - follow-tool-gitleaks
  - deep-review
  - deep-review-then-fix
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "secrets hygiene improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/check-secrets` + `/deep-review` domains `review-security + review-config` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "secrets ควร improve อะไร" — thin entry ที่ delegate การตรวจไป `/check-secrets` และการ review ไป `/deep-review` ไม่ทำเองและไม่แก้ไขโดยตรง

- `review-security` (secrets scope) — hardcoded values ใน source, secret ที่หลุดเข้า git history, token หมดอายุ/ไม่ rot, permission กว้างเกิน
- `review-config` (secrets scope) — env var ตั้งชื่อ/จัดกลุ่มไม่ตรง, missing secret ในบาง environment, committed `.env`
- ตรวจอย่างเดียว (report-only) → `/check-secrets`; secret manager tooling → `/follow-secret-manager`; scan git history → `/follow-tool-gitleaks`; general vulnerabilities → `/improve-security`
- เกณฑ์ boundary เต็ม: `follow-improve/references/scope-map.md`

## Execute

### 1. Detect And Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/check-secrets` เพื่อเก็บรายการพบ (ไฟล์, ตำแหน่ง, ประเภท)
3. ทำ `/deep-review` กับ scope นั้น domains `review-security + review-config` (secrets scope)
4. รวบรวม prioritized list พร้อม severity และ evidence — secret ที่ live อยู่ = Critical

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill — redact ตัวค่า secret ในรายงาน_show แค่ชื่อ/ตำแหน่ง
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง) — ย้ายค่าไป env/secret store ผ่าน `/follow-secret-manager`
2. secret ที่หลุดเข้า git แล้ว → rotate ค่าใหม่เสมอ + ล้าง history ผ่าน `/follow-tool-gitleaks`/`/deep-review-then-fix` — การลบไฟล์อย่างเดียวไม่พอ
3. ห้าม commit ตัวค่า secret ระหว่างแก้ — ตรวจซ้ำด้วย `/check-secrets` หลังแก้ครบ
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ detection/review เอง — delegate ไป `/check-secrets` + `/deep-review` domains ที่ระบุ
- แก้ทุก finding ทันทีโดยไม่รอ confirm (ตัว secret ต้อง rotate โดย owner ของระบบนั้น — เสนอให้ user ทำถ้าสิทธิ์ไม่ถึง)
- ห้าม print ตัวค่า secret ใน report/log — แสดงเฉพาะชื่อและตำแหน่งไฟล์
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized secrets hygiene improvement list จาก `/check-secrets` + `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม re-scan สะอาด
