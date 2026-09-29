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

Canonical fix skill — review แล้ว fix findings ทุก domain ตาม Domain Map ผ่าน `## Fix` section และ `subskills/` ของ `review-*` แต่ละตัว

## Scope

ใช้เมื่อต้องการทั้ง review และ fix โดยไม่เฉพาะจอดจง รองรับ code, docs, และ skills

- Scope เล็ก/เฉพาะจุด → ใช้ `/review` domain ที่ตรง; scope ทั้ง codebase → ใช้ `/deep-review` เป็น review pass
- Fix findings หลัง review ตาม Domain Map ด้านล่าง
- Fix mode: user confirm ตาม findings (default), ตาม suggestion เดิม (`/follow-your-suggestion`), หรือ `fix all` ตามที่ user ระบุ

ดูเพิ่มเติม: /deep-review

## Domain Map

fix ทำผ่าน `## Fix` section หรือ `subskills/` ของ `review-*` ตัวที่ตรง domain — อ่านก่อนแก้เสมอ

| Domain | Review skill | Fix route |
|--------|-------------|-----------|
| seo | `/review-seo` | `subskills/improve-seo` |
| security | `/review-security` | `## Fix` — secrets rotation, headers, vuln deps |
| auth | `/review-auth` | `## Fix` — sessions, tokens |
| api | `/review-api` | `## Fix` — contract drift, versioning |
| database | `/review-database` | `## Fix` (migrations) + `subskills/optimize-queries` |
| bundle+assets | `/review-bundle` | `subskills/optimize-bundle` |
| performance | `/review-performance` | `subskills/optimize-performance` |
| cost | `/review-cost` | `subskills/optimize-cost` |
| tests | `/review-test` | `## Fix` (flaky) + `subskills/improve-coverage` + `/update-tests` สำหรับเขียน test ใหม่ |
| uxui | `/review-uxui` | `subskills/improve-uxui-fix` + `/watch-browser-and-improve-uxui` (browser pass) |
| observability | `/review-observability` | `subskills/improve-observability` |
| accessibility | `/review-accessibility` | `subskills/improve-a11y` |
| frontend | `/review-frontend` | `## Fix` (hydration) + `subskills/improve-rendering` |
| quality/types | `/review-code-quality` | `## Fix` — complexity, imports |
| อื่นๆ (cli, config, migration, backend, dependencies, delivery, docs, stability, i18n, mobile, desktop, browser-ext, dx, iac, sdk, usage, ai, mcp, events) | `/review-<domain>` | `## Fix` section ของ review skill นั้น — แก้ตาม findings ตรงๆ |

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
2. Dispatch approved fixes ตาม domain — จัดกลุ่ม findings แล้ว map ไป `## Fix` section หรือ subskills ของ `review-*` ตาม Domain Map ด้านบน; domain ที่ไม่มีในตาราง → `/ask-me` ก่อนแก้
3. บันทึก findings พร้อม severity และ evidence

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

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. จัดลำดับ findings ตาม severity — canonical steps ที่ `../shared/review-fix.md`
2. เลือก fix route ที่ตรงกับ finding จาก Domain Map ด้านบน (then fix)
3. preserve behavior + verify + report — canonical ที่ `../shared/review-fix.md`

## References

- [Full-dimension checklist](references/checklist.md)
- ใช้ /run-review ถ้าจำเป็น

- ใช้ /deep-plan ถ้าจำเป็น

## Expected Outcome

- รายงาน issues ก่อน fix
- issues ถูกแก้ไขตามที่ user ตกลง
- ผ่าน verify
- สรุป next action พร้อม `/review` และ `/fix`
