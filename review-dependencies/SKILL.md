---
name: review-dependencies
description: Review dependencies ครอบคลุม versions, security, unused, circular, และ license พร้อมแนะนำการปรับปรุง
---

## Goal

Review dependencies ของ project ครอบคลุม versions, security vulnerabilities, unused deps, circular dependencies, license compliance, และ bundle impact พร้อม findings, severity, review score และแนะนำการปรับปรุง

## Scope

ใช้สำหรับ project หรือ workspace ที่มี dependencies (`package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`) — เน้น review และปรับปรุง ไม่รวมการติดตั้งใหม่ (ใช้ `/run-install`)

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ dependency landscape ของ project

1. ทำ `/scan-codebase` เพื่อหา manifest files และ lockfiles
2. ระบุ package manager: `bun`, `npm`, `pnpm`, `yarn`, `cargo`, `pip`, `go`
3. ทำ `/list-dependencies` เพื่อดู dependencies ทั้งหมด
4. ถ้าเป็น monorepo → ตรวจทุก workspaces และ dependency graph ข้าม workspaces
5. ถ้าไม่มี dependencies → stop และ report

### 2. Review Versions And Freshness

> Goal: dependencies ใช้ version ที่เหมาะสมและทันสมัย

1. ตรวจสอบ version ปัจจุบันเทียบกับ latest stable ด้วย `/update-dependencies-latest` (dry run)
2. ระบุ dependencies ที่ outdated: major, minor, patch
3. ตรวจสอบ floating ranges (`latest`, `*`, unbounded `>=`) ที่ auto-resolve เป็น brand-new releases
4. ตรวจสอบ peer dependencies และ compatibility
5. ตรวจสอบ lockfile consistency กับ manifest

### 3. Review Security

> Goal: ไม่มี known vulnerabilities ใน dependencies

1. รัน `bun audit` หรือ `npm audit` หรือ `cargo audit` ตาม package manager
2. ทำ `/run-audit` สำหรับ security scan
3. ระบุ vulnerabilities ตาม severity: Critical, High, Medium, Low
4. ตรวจสอบ fixed versions ที่มีให้
5. ตรวจสอบ dependencies ที่ abandoned หรือ unmaintained

### 4. Review Unused And Duplicate

> Goal: ไม่มี dependencies ที่ไม่ได้ใช้หรือซ้ำซ้อน

1. ทำ `/check-unused-deps` เพื่อหา dependencies ที่ไม่ได้ใช้
2. ทำ `/check-circular-dependencies` เพื่อหา circular dependencies
3. ระบุ duplicate dependencies ที่ทำงานเหมือนกัน (เช่น `lodash` + `es-toolkit`)
4. ตรวจสอบ dev dependencies ที่ควรเป็น production หรือกลับกัน
5. ตรวจสอบ dependencies ที่ประกาศแต่ไม่ import ใน code

### 5. Review License Compliance

> Goal: licenses สอดคล้องกับ project license

1. ระบุ license ของ dependencies ทั้งหมด
2. ตรวจสอบ compatibility กับ project license
3. ระบุ licenses ที่มีข้อจำกัด (GPL, AGPL, copyleft) ในโปรเจกต์ non-GPL
4. ระบุ licenses ที่ต้อง attribution หรือ notice
5. รายงาน license conflicts พร้อม recommendation

### 6. Review Bundle Impact

> Goal: dependencies ไม่ทำให้ bundle ใหญ่เกินจำเป็น

1. ทำ `/report-bundle` เพื่อดู bundle size และ contribution ของแต่ละ dependency
2. ระบุ dependencies ที่มีขนาดใหญ่ผิดปกติ
3. ตรวจสอบ tree-shaking compatibility
4. ระบุ dependencies ที่ควรเป็น peer dependency แทน direct dependency
5. แนะนำ lightweight alternatives ถ้ามี

### 7. Improve

> Goal: ปรับปรุง dependencies ตาม findings

1. อัปเดต dependencies ที่มี security vulnerabilities ก่อน
2. ลบ unused dependencies ด้วย `/run-clean`
3. แทนที่ duplicate dependencies ด้วยตัวเดียว
4. อัปเดต outdated dependencies ทีละรุ่นเพื่อหลีกเลี่ยง breaking changes
5. แก้ floating ranges เป็น pinned versions
6. ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`
7. ทำ `/run-check` เพื่อ verify หลังแก้

### 8. Validate And Report

> Goal: ยืนยัน findings และรายงานผล

1. ทำ `/validate` เพื่อตรวจ findings
2. จัดลำดับ findings ตาม severity: Critical → High → Medium → Low
3. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
4. ทำ `/report` พร้อม `/report-table`
5. ทำ `/suggest-next-action`

## Rules

### 1. Evidence First

- ทุก finding ต้องมี dependency name, version, และ evidence
- ห้ามเดา issues โดยไม่มี evidence
- ใช้ tools หรือ scripts ก่อน manual inspection

### 2. Review Independence

- ทำ review ก่อนแก้ไข
- ถ้าแก้ไข → ทำหลัง review เสร็จและ report แยก

### 3. Safety

- ไม่ upgrade major version โดยไม่ตรวจ breaking changes
- ไม่ลบ dependencies โดยไม่ตรวจ consumers ก่อน
- ทำ dry run ก่อน bulk update
- ถ้ามี breaking changes → ระบุ migration steps

### 4. Scope Control

- review เฉพาะ dependencies ที่ระบุ
- ถ้าพบ issues นอก scope → รายงาน ไม่แก้

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน findings พร้อม evidence: dependency, version, issue, severity
- ครอบคลุม versions, security, unused, circular, license, bundle impact
- review score คำนวณจาก severity weighted average
- ปรับปรุง dependencies ตาม priority: security ก่อน, unused สอง, outdated สาม
- ไม่มี regression หลังปรับปรุง
