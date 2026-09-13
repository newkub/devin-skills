---
name: deep-review-then-fix-fix-by-domain
description: Dispatch approved fixes ไปยัง fix/improve/update subskill ของ review domain ที่ตรงกัน
argument-hint: "[domain]"
related:
  - deep-review-then-fix
  - review-security
  - review-api
  - review-auth
  - review-database
  - review-frontend
  - review-quality
  - review-test
  - update-tests
  - ask-me
---

## Goal

Dispatch finding ที่ user approve แล้วไปยัง fix subskill ของ domain นั้น — subskill นี้ทำ routing เท่านั้น

## Scope

- ใช้ใน `/deep-review-then-fix` step "fix" — เมื่อ findings ถูก approve แล้วต้องแก้ตาม domain
- domain mapping: security, api, auth, database, frontend, quality, seo, accessibility, bundle, cost, performance, uxui, test

## Execute

### Domain Dispatch

| Domain | Target |
|---|---|
| secrets leak | `review-security/subskills/fix-secrets` |
| security headers | `review-security/subskills/fix-headers` |
| vulnerable deps | `review-security/subskills/fix-vuln-deps` |
| api contract | `review-api/subskills/fix-contract` |
| api versioning | `review-api/subskills/fix-versioning` |
| auth tokens | `review-auth/subskills/fix-tokens` |
| auth sessions | `review-auth/subskills/fix-sessions` |
| migrations | `review-database/subskills/fix-migrations` |
| queries | `review-database/subskills/optimize-queries` |
| hydration | `review-frontend/subskills/fix-hydration` |
| rendering | `review-frontend/subskills/improve-rendering` |
| complexity | `review-quality/subskills/fix-complexity` |
| imports | `review-quality/subskills/fix-imports` |
| a11y | `review-accessibility/subskills/improve-a11y` |
| seo | `review-seo/subskills/improve-seo` |
| bundle | `review-bundle/subskills/optimize-bundle` |
| cost | `review-cost/subskills/optimize-cost` |
| performance | `review-performance/subskills/optimize-performance` |
| uxui | `review-uxui/subskills/improve-uxui-fix` |
| flaky tests | `review-test/subskills/fix-flaky` |
| coverage | `review-test/subskills/improve-coverage` |
| e2e tests | `update-tests/subskills/update-e2e` |
| unit tests | `update-tests/subskills/update-unit` |
| snapshots | `update-tests/subskills/update-snapshot` |

1. จัดกลุ่ม approved findings ตาม domain
2. แต่ละ domain → ทำตาม target subskill ในตาราง
3. domain ที่ไม่มีในตาราง → `/ask-me` ก่อนแก้

## Rules

- แก้เฉพาะ findings ที่ user approve เท่านั้น — ห้ามแก้นอก scope
- หลัง fix แต่ละ domain → re-check ตาม validation ของ subskill นั้น
- ถ้า fix fail → `/resolve-errors` max 3 รอบแล้ว stop

## Expected Outcome

- findings ที่ approve ถูก fix โดย subskill ที่ตรง domain ครบทุกกลุ่ม
