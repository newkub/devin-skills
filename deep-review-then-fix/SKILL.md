---
name: deep-review-then-fix
description: Review แล้วค่อย fix ตาม context โดยขอ user confirm
argument-hint: "[scope]"
related:
  - review
  - fix
  - watch-browser
  - follow-best-practice
  - deep-review
  - deep-plan
  - suggest-next-action
  - resolve-errors
  - run-review
---

## Goal

Canonical fix skill — review แล้ว fix findings ทุก domain ตาม Domain Map อ่าน fix guides จาก `review-*/references/` (merged from: `review-then-fix`, `deep-review-codebase-then-fix`)



## Scope

ใช้เมื่อต้องการทั้ง review และ fix โดยไม่เฉพาะจอดจง รองรับ code, docs, และ skills

- Scope เล็ก/เฉพาะจุด → ใช้ `/review` domain ที่ตรง; scope ทั้ง codebase → ใช้ `/deep-review` เป็น review pass (merged from: `deep-review-codebase-then-fix`)
- Fix findings หลัง review ตาม Domain Map ด้านล่าง 
- Fix mode: user confirm ตาม findings (default), ตาม suggestion เดิม (`/follow-your-suggestion`), หรือ `fix all` ตามที่ user ระบุ

ดูเพิ่มเติม: /deep-review

## Domain Map

fix guides อยู่ใน `references/` ของ `review-*` ตัวที่ตรง domain — อ่านก่อนแก้เสมอ

| Domain | Review skill | Fix guides |
|--------|-------------|------------|
| seo | `/review-seo` | `review-seo/references/fix-*.md` |
| security | `/review-security` | `review-security/references/fix-*.md` |
| auth | `/review-auth` | `review-auth/references/fix-*.md` |
| api | `/review-api` | `review-api/references/fix-*.md` |
| database | `/review-database` | `review-database/references/fix-*.md` |
| dependencies | `/review-dependencies` | `review-dependencies/references/fix-*.md` |
| bundle+assets | `/review-bundle` | `review-bundle/references/fix-*.md` |
| performance | `/review-performance` | `review-performance/references/fix-*.md` |
| ci/delivery | `/review-delivery` | `review-delivery/references/fix-*.md` |
| cost | `/review-cost` | `review-cost/references/fix-*.md` |
| docs | `/review-docs` | `review-docs/references/fix-*.md` |
| tests | `/review-test` | `review-test/references/fix-*.md` + `/update-tests` สำหรับเขียน test ใหม่ |
| uxui | `/review-uxui` | `review-uxui/references/fix-*.md` + `/improve-uxui` (browser pass) |
| stability | `/review-stability` | `review-stability/references/fix-*.md` |
| observability | `/review-observability` | `review-observability/references/fix-*.md` |
| cli | `/review-cli` | `review-quality/references/fix-improve-cli-ux.md` |
| config | `/review-config` | `review-config/references/fix-*.md` |
| migration | `/review-migration` | `review-migration/references/fix-*.md` |
| accessibility | `/review-accessibility` | `review-accessibility/references/fix-*.md` |
| frontend | `/review-frontend` | `review-frontend/references/fix-*.md` |
| backend | `/review-backend` | `review-backend/references/fix-*.md` |
| quality/types | `/review-quality` | `review-quality/references/fix-*.md` |
| i18n | `/review-i18n` | `review-i18n` `## Fix` steps |
| mobile | `/review-mobile` | `review-mobile` `## Fix` steps |
| desktop | `/review-desktop-app` | `review-desktop-app` `## Fix` steps |
| browser-ext | `/review-browser-ext` | `review-browser-ext` `## Fix` steps |
| dx | `/review-dx` | `review-dx` `## Fix` steps |
| iac | `/review-iac` | `review-iac` `## Fix` steps |
| sdk | `/review-sdk` | `review-sdk` `## Fix` steps |
| usage | `/review-usage` | `review-usage` `## Fix` steps |
| ai | `/review-ai` | `review-ai` `## Fix` steps |
| mcp | `/review-mcp` | `review-mcp` `## Fix` steps |
| events | `/review-events` | `review-events` `## Fix` steps |
| อื่นๆ | `/review-<domain>` | `review-<domain>/references/fix-*.md` ถ้ามี — ไม่มีให้แก้ตาม findings ตรงๆ |

## Execute

### 1. Identify Scope

> Goal: รู้ว่าจะ review และ fix อะไร

1. ดูรายละเอียดใน [references/identify-scope.md](references/identify-scope.md)
2. บันทึก findings พร้อม severity และ evidence

### 2. Plan Fixes

> Goal: วางแผนการแก้ไข

1. ดูรายละเอียดใน [references/plan-fixes.md](references/plan-fixes.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Confirm

> Goal: ขอ approval ก่อน fix

1. ดูรายละเอียดใน [references/confirm.md](references/confirm.md)
2. บันทึก findings พร้อม severity และ evidence

### 4. Apply Fixes

> Goal: แก้ไข issues ตามแผน

1. ดูรายละเอียดใน [references/apply-fixes.md](references/apply-fixes.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Verify

> Goal: ตรวจสอบผลหลัง fix

1. ดูรายละเอียดใน [references/verify.md](references/verify.md)
2. บันทึก findings พร้อม severity และ evidence

## Rules

### 1. Review Before Fix
- ต้อง `/review` และ report ก่อนแก้ไข
- ไม่แก้ไขโดยไม่ได้รับ confirmation

### 2. Incremental Fix
- แก้ทีละไฟล์หรือ small batch
- ตรวจ verify หลังแก้

### 3. Evidence
- ทุก fix ต้องมีเหตุผลจาก review
- ระบุ file path และ line number

- ใช้ /fix ถ้าต้องการให้ fix ตาม suggestion หรือ fix all
- ใช้ /watch-browser-fix ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Metrics

- ดู metrics สำหรับ review ใน [references/scoring.md](references/scoring.md) (then fix)

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review` หรือ `/review` (then fix)

Merged from: improve

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้ (then fix)
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง (then fix)
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test` ถ้ามี แล้วสรุปผลด้วย `/report-before-after` (then fix)

- `references/fix-improve.md` — ปรับปรุงสิ่งใดๆ ใน project ตาม context โดยหา gaps แล้วแก้ไข
## References

- [Full-dimension checklist](references/checklist.md)
- ใช้ /run-review ถ้าจำเป็น

- ใช้ /deep-plan ถ้าจำเป็น

## Expected Outcome

- รายงาน issues ก่อน fix
- issues ถูกแก้ไขตามที่ user ตกลง
- ผ่าน verify
- สรุป next action พร้อม `/review` และ `/fix`
