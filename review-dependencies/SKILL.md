---
name: review-dependencies
description: ตรวจ dependencies — outdated, vulnerabilities, licenses, duplicates, unused packages
argument-hint: "[workspace-or-package]"
related:
  - update-dependencies-latest
  - review-security
  - follow-my-tech-stack
  - scan-codebase
  - report-table
  - run-check
  - ask-me
---

## Goal

ตรวจสอบ dependencies ของ project — outdated versions, vulnerabilities, license compliance, duplicates และ unused packages ก่อนตัดสินใจ update

## Scope

ใช้เมื่อต้อง audit dependencies ของ workspace/monorepo: runtime, dev, peer deps — ครอบคลุม manifests, lockfile และ usage จริงใน code — ไม่ติดตั้งหรืออัปเดต (ใช้ `/update` หรือ package manager)

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

### 5. Rate And Report

> Goal: สรุป findings พร้อม action plan

1. ทำ `/report-table` พร้อม columns: No., Package, Current, Latest, Severity, Issue, Action
2. แยก actions: update now, update with caution, remove, replace, keep
3. ถ้ามี vulnerability → เชื่อม `/review-security` และ `/improve-security`

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

- ใช้ /update-dependencies-latest ถ้าจำเป็น

## Expected Outcome

- รายงาน deps ครบ: outdated, vulnerable, unused, license issues
- Action plan ชัดเจนแยกตาม risk
- ไม่มี side effects บน lockfile หรือ `node_modules`
