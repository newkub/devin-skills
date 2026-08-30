---
name: review-techstack
description: Review tech stack, dependencies และ library design ครอบคลุม versions, security, API, bundle
related:
  - review-codebase-everything
  - follow-my-tech-stack
  - run-review
  - deep-analyze
  - deep-validate
  - report-table
  - suggest-next-action
  - follow-package-manifest
  - list-dependencies
  - update-version-latest
  - update-runtime-latest
  - update-dependencies-latest
---

## Goal

Review tech stack, dependencies และ library design ครอบคลุม framework choices, library versions, runtime compatibility, dependency versions, security vulnerabilities, unused packages, circular dependencies, license compliance, bundle size, tree-shaking, peer deps, semver, API surface, export strategy, type declarations และ cloud/infrastructure selection พร้อม review score

## Scope

ใช้สำหรับ project หรือ workspace ที่มี manifest files (`package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`) — ครอบคลุม framework selection, library versions, runtime compatibility, build tools, package manager, technology alignment, dependency versions, security, unused dependencies, transitive dependencies, duplicate packages, circular dependencies, license compliance, bundle impact, library API design, export strategy, module format, tree-shaking, peer deps, semver compliance, compatibility matrix, type declarations และ cloud/infrastructure selection — เน้น review และปรับปรุง ไม่รวมการติดตั้งใหม่ (ใช้ `/run-install`)

## Execute

### 1. Prepare

> Goal: เข้าใจ tech stack structure, dependency landscape และ library config

ทำตาม `references/prepare.md`

### 2. Deep Analyze

> Goal: วิเคราะห์ tech stack และ dependencies อย่างลึกซึ้ง

ทำตาม `references/deep-analyze.md`

### 3. Tech Stack Selection

> Goal: ตรวจสอบ decision process เมื่อเลือก tech stack ใหม่

ทำตาม `references/choosing.md`

### 4. Cloud And Infrastructure

> Goal: เลือก cloud providers และ deployment targets ให้เหมาะสมกับ workload

ทำตาม `references/cloud-selection.md`

### 5. Review Dimensions

> Goal: ตรวจสอบทุก dimension ตาม reference files

ทำตาม `references/techstack.md`, `references/dependencies.md`, `references/lib-design.md` และ `references/type-declarations.md`

### 6. Validate Findings

> Goal: Findings ถูกต้องและจัดลำดับตาม severity

ทำตาม `references/validate.md`

### 7. Report

> Goal: รายงาน findings พร้อม actionable recommendations

ทำตาม `references/report.md`

### 8. Implement All

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

ทำตาม `references/implement.md`

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
- ครอบคลุม tech stack, dependencies, library design, bundle impact, type declarations และ cloud/infrastructure selection
- review score คำนวณจาก severity weighted average และ supplementary metrics
- รายงาน recommended actions พร้อม priority: security ก่อน, unused สอง, outdated สาม
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
- ไม่มี regression หลังปรับปรุง
