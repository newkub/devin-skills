---
name: review-lib
description: Review library design: API surface, bundle size, tree-shaking, peer deps, semver, compatibility
---

## Goal

Review library design ครอบคลุม API surface, bundle size, tree-shaking, peer deps, semver, export strategy พร้อม review score

## Scope

library review สำหรับ: library API design, public API surface, export strategy (barrel, named, default), tree-shaking support, side effects declaration, bundle size, peer dependencies, semver compliance, breaking change policy, compatibility matrix, library documentation, `package.json` config, publish config, module format (`ESM`, `CJS`, `UMD`), TypeScript declarations

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ library structure และ publish config

1. ทำ `/scan-codebase` เพื่อเข้าใจ library structure
2. ระบุ package type (library vs app), publish target (`npm`, private registry), module format, bundler (`tsdown`, `tsup`, `bunup`) ที่ใช้
3. ถ้า project ไม่ใช่ library → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก library dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ library patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต `ast-grep` rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. API Surface And Export Review

> Goal: ครอบคลุม API design, exports, module format

1. ตรวจสอบ public API surface: exported functions/classes/types, API naming consistency, API discoverability, API minimalism (no over-export), API stability
2. ตรวจสอบ export strategy: barrel exports (`index.ts`), named exports vs default export, re-export patterns, export from subpaths, export conditions (import, require, types)
3. ตรวจสอบ module format: `ESM` support, `CJS` support, `UMD` support (if needed), dual package hazard prevention, module resolution strategy, `package.json` exports field
4. ตรวจสอบ TypeScript declarations: `.d.ts` generation, declaration map, source map, type-only exports, ambient declarations, types field in `package.json`

### 4. Bundle, Dependencies And Compatibility Review

> Goal: ครอบคลุม bundle size, tree-shaking, peer deps, semver

1. ตรวจสอบ bundle size: bundle size limits, bundle size tracking, bundle composition, dependency size impact, export size analysis
2. ตรวจสอบ tree-shaking: side effects declaration (`sideEffects` field), tree-shakeable exports, pure function annotations, dead code elimination, import granularity
3. ตรวจสอบ peer dependencies: peer dep declaration, peer dep version range, peer dep minimal, optional peer deps, peer dep meta
4. ตรวจสอบ semver compliance: version bump strategy, breaking change detection, changelog generation, deprecation policy, sunset policy
5. ตรวจสอบ compatibility: `Node.js` version support, browser support, bundler compatibility (`Vite`, `webpack`, `Rollup`), engine field, compatibility matrix documentation
6. ตรวจสอบ `package.json` config: name, version, description, keywords, license, author, repository, homepage, bugs, files field, publishConfig, `sideEffects`, type field

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่ใช่ library → ข้ามทั้งหมด
- ถ้า library ไม่มี `CJS` support → ข้าม Step 3 item 3 สำหรับ `CJS`
- ถ้า library ไม่มี peer deps → ข้าม Step 4 item 3

### 2. Severity Classification

- Critical: dual package hazard, missing TypeScript declarations, broken export, circular export, missing peer deps declaration, broken tree-shaking, export ที่ไม่มี implementation
- High: over-exported API, missing barrel export, inconsistent export naming, missing export conditions, missing semver compliance, missing compatibility matrix, over-sized bundle, missing `sideEffects` field
- Medium: suboptimal export strategy, missing declaration map, minor bundle size, missing deprecation policy, missing files field
- Low: cosmetic, minor `package.json` improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ export, `package.json` field, หรือ module ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก library section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
