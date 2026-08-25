---
name: review-techstack
description: Review tech stack, dependencies และ library design ครอบคลุม versions, security, API, bundle
---

## Goal

Review tech stack, dependencies และ library design ครอบคลุม framework choices, library versions, runtime compatibility, dependency versions, security vulnerabilities, unused packages, circular dependencies, license compliance, bundle size, tree-shaking, peer deps, semver, API surface และ export strategy พร้อม review score

## Scope

ใช้สำหรับ project หรือ workspace ที่มี manifest files (`package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`) — ครอบคลุม framework selection, library versions, runtime compatibility, build tools, package manager, technology alignment, dependency versions, security, unused dependencies, transitive dependencies, duplicate packages, circular dependencies, license compliance, bundle impact, library API design, export strategy, module format, tree-shaking, peer deps, semver compliance และ compatibility matrix — เน้น review และปรับปรุง ไม่รวมการติดตั้งใหม่ (ใช้ `/run-install`)

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ tech stack structure, dependency landscape และ library config

1. ทำ `/scan-codebase` เพื่อเข้าใจ tech stack structure และหา manifest files และ lockfiles
2. ระบุ frameworks, runtimes, build tools, package manager และ bundler ที่ใช้
3. ระบุ package type: library vs app และ publish target (`npm`, private registry)
4. ทำ `/list-dependencies` เพื่อดู dependencies ทั้งหมด
5. ถ้าเป็น monorepo → ตรวจทุก workspaces และ dependency graph ข้าม workspaces
6. ถ้าไม่มี dependencies → stop และ report
7. ถ้า project ไม่ใช่ library → ข้าม library design checks ใน Step 3

### 2. Deep Analyze

วิเคราะห์ tech stack และ dependencies อย่างลึกซึ้ง

> Goal: ครอบคลุมทุก dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter tools-review review:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
6. Analyzer ตรวจสอบ framework versions, compatibility matrix, และ EOL status — ดู `references/techstack.md`
7. Analyzer ตรวจสอบ dependency versions, security, unused, circular, license — ดู `references/dependencies.md`
8. Analyzer ตรวจสอบ library API, bundle size, tree-shaking, peer deps, semver — ดู `references/lib-design.md`
9. Review CLI คำนวณ tech stack review score จาก review report — ดู `references/scoring.md`
10. ถ้า review CLI ไม่ผ่าน → ทำ `/update-create-review-cli` แล้ว re-run ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report

### 3. Review Dimensions

ตรวจสอบทุก dimension ตาม reference files

> Goal: ครอบคลุม tech stack, dependencies และ library design

1. ตรวจสอบ tech stack และ runtime: framework versions, library alignment, build tools, package manager, runtime requirements — ดู `references/techstack.md`
2. ตรวจสอบ dependency health: versions, security, unused, circular, license, bundle impact — ดู `references/dependencies.md`
3. ถ้า project เป็น library → ตรวจสอบ library design: API surface, export strategy, module format, tree-shaking, peer deps, semver, compatibility — ดู `references/lib-design.md`
4. ตรวจสอบ type declarations: `.d.ts` files ใน project และ `node_modules`, missing declarations, circular type references, `@types` packages — ดู `references/type-declarations.md`

### 4. Validate Findings

ตรวจสอบว่า findings แต่ละอย่างถูกต้อง

> Goal: Findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low

### 5. Report

รายงานผล review ในรูปแบบตาราง

> Goal: รายงาน findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Tech Stack Metrics Summary: framework versions, library alignment, build tools, security vulnerabilities, unused packages, duplicate packages พร้อม status
3. สร้างตาราง Dependency Health: dependency, version, issue, severity, recommendation
4. สร้างตาราง Library Design: API surface, export strategy, bundle size, peer deps, semver, severity
5. สร้างตาราง Findings by Category: Category, Finding, Severity, Location, Recommendation
6. สร้างตาราง Recommended Actions: Priority, Action, Impact, Effort, Workflow
7. แสดง tech stack review score พร้อม progress bar และ grade
8. ทำ `/suggest-next-action`

### 6. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Severity Classification

- Critical: EOL framework, incompatible runtime, security-impacted version, critical vulnerability, incompatible dependency, dual package hazard, missing TypeScript declarations, broken export, circular export, missing peer deps declaration, broken tree-shaking
- High: outdated major version, redundant library, missing compatibility, high vulnerability, outdated major dependency version, over-exported API, missing barrel export, inconsistent export naming, missing semver compliance, over-sized bundle, missing `sideEffects` field
- Medium: minor version lag, suboptimal build tool, inconsistent package manager, unused dependency, outdated minor dependency version, suboptimal export strategy, missing declaration map, minor bundle size, missing deprecation policy
- Low: cosmetic config improvement, naming convention, outdated patch version, duplicate package, documentation gap

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number หรือ package name และ version
- ห้ามเดา issues โดยไม่มี evidence
- ใช้ tools หรือ scripts ก่อน manual inspection

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ถ้าแก้ไข → ทำหลัง review เสร็จและ report แยก

### 4. Safety

- ไม่ upgrade major version โดยไม่ตรวจ breaking changes
- ไม่ลบ dependencies โดยไม่ตรวจ consumers ก่อน
- ทำ dry run ก่อน bulk update
- ถ้ามี breaking changes → ระบุ migration steps

### 5. Skip Conditions

- ถ้า project ไม่ใช่ library → ข้าม library design checks
- ถ้า library ไม่มี `CJS` support → ข้าม CJS checks
- ถ้า library ไม่มี peer deps → ข้าม peer deps checks

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง findings พร้อม severity และ location
- ครอบคลุม tech stack, dependencies, library design และ bundle impact
- review score คำนวณจาก severity weighted average
- รายงาน recommended actions พร้อม priority: security ก่อน, unused สอง, outdated สาม
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
- ไม่มี regression หลังปรับปรุง
