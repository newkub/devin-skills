---
name: improve-deps
description: หา dependency improvements ใน scope — outdated, vulnerabilities, unused, duplicates — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - improve-techstack
  - improve-security
  - optimize-bundle
  - deep-review
  - deep-review-then-fix
  - run-bench-deps
  - run-audit
  - update-version-to-latest
  - follow-tool-knip
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "dependencies improve อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-dependencies` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "dependencies ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-dependencies` — outdated versions, security vulnerabilities, unused deps, duplicate/transitive bloat, license issues, lockfile drift
- framework/stack choices กว้างกว่า deps → `/improve-techstack`; vulnerable versions เป็น security → `/improve-security` severity; size impact → `/optimize-bundle`

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-dependencies` — outdated/vulnerable/unused/duplicate, lockfile drift, version pinning issues
3. รวบรวม prioritized list พร้อม severity และ evidence — ใช้ `/run-bench-deps` เป็น baseline table + `/run-audit` สำหรับ vulns

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-dependencies`)
2. Bulk version updates → `/update-version-to-latest`; unused detection → `/follow-tool-knip`
3. หลัง update ทุกครั้ง → รัน tests ยืนยันไม่ break (`/run-test` domain ที่ตรง)
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-dependencies`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- ห้ามลบ dep โดยไม่ตรวจ transitive usage — ใช้ knip/madge เป็น evidence
- Major version bumps ต้องอ่าน changelog/migration guide ก่อน
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized deps improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` — ไม่มี unused/vulnerable deps เหลือ
