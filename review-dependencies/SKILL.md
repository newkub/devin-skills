---
name: review-dependencies
description: ตรวจ dependencies — outdated, vulnerabilities, licenses, duplicates, unused packages
argument-hint: "[workspace-or-package]"
related:
  - update-version-to-latest
  - review-security
  - follow-my-tech-stack
  - scan-codebase
  - report
  - run-check
  - ask-me
---

## Goal

ตรวจสอบ dependencies ของ project — outdated versions, vulnerabilities, license compliance, duplicates และ unused packages ก่อนตัดสินใจ update

## Scope

ใช้เมื่อต้อง audit dependencies ของ workspace/monorepo: runtime, dev, peer deps — ครอบคลุม manifests, lockfile, usage จริงใน code และการเปรียบเทียบ alternatives — ไม่ติดตั้งหรืออัปเดต (ใช้ `/update` หรือ package manager)

- รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: use-lib-better)

## Execute

### 1. Inventory Dependencies

> Goal: รายการ deps ทั้งหมดพร้อม version และประเภท

1. อ่าน `package.json`, `Cargo.toml`, `go.mod` หรือ manifests ที่ตรวจพบ
2. รัน outdated check ของ ecosystem (`bun outdated`, `npm outdated`, `cargo outdated`)
3. รัน audit (`bun audit`, `npm audit`, `cargo audit`) สำหรับ vulnerabilities

### 2. Check Usage And Duplicates

> Goal: แยก deps ที่ใช้จริงออกจากที่ไม่ใช้

1. ทำ `/scan-codebase` ค้นหา imports ของแต่ละ dep
2. ระบุ unused packages และ duplicate functionality (หลาย lib ทำอย่างเดียวกัน)
3. ตรวจ version conflicts ใน monorepo workspaces

### 3. Check Licenses And Policies

> Goal: deps ไม่ขัดกับ license policy

1. รัน license check (`license-checker` หรือเทียบเท่า)
2. ระบุ copyleft/restricted licenses ที่ขัด policy
3. ตรวจ abandoned packages (ไม่มี release/commit นาน)

### 4. Assess Update Risk

> Goal: จัดลำดับ update ตาม risk

1. แยก patch/minor/major updates — flag major ที่มี breaking changes
2. ตรวจว่า dep สอดคล้อง `/follow-my-tech-stack` หรือไม่
3. ระบุ deps ที่ต้อง pin version และ deps ที่ auto-update ได้

### 5. Score Alternatives

> Goal: เปรียบเทียบและให้คะแนน candidates สำหรับ deps ที่ควร replace

เมื่อ finding เป็น `replace` หรือต้องเลือก library:

1. หา alternatives ด้วย `/deep-research` หรือ `/learn-web` — npm trends, GitHub stars, release frequency, bundle size, security advisories
2. จำกัดเหลือ 2-3 candidates แล้วให้คะแนน apples-to-apples:

| Criteria | Weight |
|---|:---:|
| Modern / Type Safety / Performance / DX / Maintenance / Bundle Size / Dependencies | 5 ต่อข้อ (รวม 35) |

3. ระบุ Migration Effort และ Risk (Low/Medium/High) ต่อ candidate
4. จัด priority: High = Score ≥25 + Effort Low + Risk Low

### 6. Rate And Report

> Goal: สรุป findings พร้อม action plan

1. ทำ `/report` พร้อม columns: No., Package, Current, Latest, Severity, Issue, Action
2. แยก actions: update now, update with caution, remove, replace, keep
3. ถ้ามี vulnerability → เชื่อม `/review-security` และ `/review-security`

## Rules

### 1. Read Only

- ห้าม install, update หรือแก้ lockfile ระหว่าง review
- ใช้ registry metadata และ local manifests เท่านั้น

### 2. Evidence Based

- ทุก finding ต้องมี source: audit output, registry data, import scan
- ไม่เดาว่า dep ไม่ได้ใช้ — ต้องมี import scan evidence

### 3. Conservative Defaults

- แนะนำ update เฉพาะเมื่อมีเหตุผล (security, bug fix, EOL)
- major updates ต้องมี migration notes ก่อนเสนอ
- ถ้า dep ขัด tech stack → ระบุแต่ไม่ลบเอง

- ใช้ /run-check ถ้าจำเป็น
- ใช้ /ask-me ถ้าจำเป็น

- ใช้ /update-version-to-latest ถ้าจำเป็น

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review` (dependencies)

Merged from: improve-dependencies, optimize-deps, use-lib-effective

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้ (dependencies)
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง (dependencies)
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after` (dependencies)

- `references/fix-improve-dependencies.md` — แก้ findings จาก review-dependencies ทั้ง outdated, vulnerable, unused และ duplicate deps
- `references/fix-optimize-deps.md` — ลดน้ำหนัก dependencies เปลี่ยน lib หนักเป็นตัวเบา ลด dep tree และ bundle impact
- `references/fix-use-lib-effective.md` — แทนที่ custom code ด้วย library functions ที่มีอยู่ ใช้ libs ให้ครบไม่ reinvent
## Expected Outcome

- รายงาน deps ครบ: outdated, vulnerable, unused, license issues
- Action plan ชัดเจนแยกตาม risk
- ไม่มี side effects บน lockfile หรือ `node_modules`
