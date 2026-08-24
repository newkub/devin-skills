---
name: review-dx
description: Review developer experience ด้าน tooling, onboarding, docs, และ feedback loops พร้อม review score
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - suggest-next-action
  - validate
---

## Goal

Review developer experience ด้าน tooling, onboarding, docs, และ feedback loops พร้อม review score

## Scope

DX review สำหรับ: package scripts, dev server, build, lint, test, README, setup guide, contributing guide, documentation, error messages, HMR, pre-commit hooks, และ feedback loops — ไม่รวมการ fix

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ DX ปัจจุบันของ project

1. ทำ `/scan-codebase` เพื่อหา project structure, tech stack, และ config files
2. ระบุ package manager, dev server, build scripts, test commands, lint commands
3. อ่าน `README`, `CONTRIBUTING`, `docs/onboarding.md`, `.devin/onboarding.md` ถ้ามี
4. ระบุ tooling ที่มี: IDE setup, formatter, linter, type checker, pre-commit hooks

### 2. Review Checklist For Developer Experience

> Goal: ตรวจสอบทุก dimension ของ developer experience ผ่าน review checks

#### 2.1 Tooling

> Goal: build, dev, lint, test, และ IDE ทำงานราบรื่น

1. ตรวจสอบ package scripts (`dev`, `build`, `test`, `lint`, `typecheck`) ใช้งานได้และไม่ซ้ำซ้อน
2. ตรวจสอบ dev server startup time และ hot reload / HMR
3. ตรวจสอบ build time, incremental build, และ cache usage
4. ตรวจสอบ lint, format, type check runtime เร็วพอ
5. ตรวจสอบ IDE integrations, extensions, และ editor config (`editorconfig`, `.vscode/settings.json`)
6. ตรวจสอบ pre-commit hooks ไม่ช้าและไม่ block

#### 2.2 Onboarding

> Goal: developer ใหม่เริ่มต้นได้เร็ว

1. ตรวจสอบ README มี overview, installation, usage, contributing
2. ตรวจสอบ setup guide เป็น step-by-step บน clean environment
3. ตรวจสอบ prerequisites, env vars, และ secrets setup
4. ตรวจสอบ one-command setup เช่น `bun install && bun dev`
5. ตรวจสอบ troubleshooting guide สำหรับข้อผิดพลาดทั่วไป

#### 2.3 Docs

> Goal: documentation ถูกต้อง ครบถ้วน และทันสมัย

1. ตรวจสอบ API docs / `JSDoc` / `TSDoc` ครอบคลุม public API
2. ตรวจสอบ examples runnable และ up-to-date
3. ตรวจสอบ changelog / migration guide ถ้ามี breaking changes
4. ตรวจสอบ doc tools (`VitePress`, `Docusaurus`, `Storybook`) ตรงกับ code
5. ตรวจสอบ docs ไม่มี broken links, missing pages, stale screenshots

#### 2.4 Feedback Loops

> Goal: ลดเวลารอและข้อผิดพลาด

1. ตรวจสอบ error messages บอกสาเหตุ, วิธีแก้, และตำแหน่ง
2. ตรวจสอบ stack traces อ่านง่ายและมี context
3. ตรวจสอบ test feedback loop เร็ว (unit, integration, watch mode)
4. ตรวจสอบ lint / type check feedback ใน IDE และ CI
5. ตรวจสอบ observability สำหรับ debug: logs, metrics, tracing
6. ตรวจสอบ build / deploy error feedback ชัดเจน

### 3. Validate And Report

> Goal: report ชัดเจน actionable สอดคล้อง Goal

1. ทำ `/validate` เพื่อตรวจสอบ findings
2. ทำ `/report` พร้อม `/report-table`
3. ให้ score ตาม DX dimensions: tooling, onboarding, docs, feedback loops
4. จำแนก severity: critical (ไม่สามารถ run dev/build ได้), high (no HMR / slow build > 1 นาที), medium (poor error messages / missing docs), low (cosmetic)
5. สร้างตาราง: dimension | issues found | severity | action item
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Only And No Deletions

- ทำ review เท่านั้น ไม่ fix, ไม่ลบ, และไม่แก้ไข code ระหว่าง review
- แยก review process จาก fix process
- ถ้าต้องแก้ไข ให้ทำ `/resolve-errors` หลัง review

### 2. Fast Feedback Loops

- Build ควรใช้เวลา < 1 นาที
- Tests ควรรันเร็ว
- Linting ควรเร็ว
- HMR ควร instant
- ไม่ block developers ด้วย slow processes

### 3. Clear Error Messages

- บอกสิ่งที่ผิด
- บอกวิธีแก้
- บอกที่มาของ error
- ใช้ภาษาที่เข้าใจง่าย

### 4. Evidence-Based

- ทุก finding ต้องมี file path, line number, หรือ doc URL
- ใช้ tools สำหรับ verification
- ไม่เดา

### 5. Non-Redundancy

- รายละเอียด config review อยู่ใน `/review-codebase` แล้ว
- workflow นี้เป็น review เท่านั้น ไม่ fix

### 6. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ระบุเป็น low หรือไม่รวมใน report หลัก
- ห้าม TODO, MOCK, placeholder

### 7. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- ตาราง: dimension | issues found | severity | action item
- DX gaps ถูกระบุและจัดลำดับ
- Review score สำหรับ developer experience
- Action items ชัดเจนสำหรับขั้นตอนถัดไป
