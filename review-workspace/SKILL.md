---
name: review-workspace
description: Review workspace ใน monorepo หรือ project เดี่ยว ครอบคลุม manifest, dependencies, scripts, config
---

## Goal

Review workspace เดี่ยวใน monorepo หรือ project เดี่ยว ให้ครบถ้วนตามมาตรฐาน พร้อม review score และ actionable recommendations

## Scope

ใช้สำหรับ review workspace หนึ่ง โดย focus ที่ structure, package manifest, dependencies, scripts, และ config readiness ไม่รวม deep category reviews เช่น `/review-codebase-everything`

## Execute

### 1. Identify Workspace

ระบุ workspace ที่จะ review

> Goal: รู้ว่า review workspace ใด และอยู่ที่ไหน

1. ถ้ามี argument ให้ใช้เป็นค่าเริ่มต้น ถ้าไม่มีให้ใช้ current working directory
2. ทำ `/check-monorepo` เพื่อตรวจสอบว่าเป็น monorepo หรือไม่
3. ถ้าเป็น monorepo ให้ทำ `/list-workspaces` เพื่อแสดงรายการ workspaces ทั้งหมด
4. ระบุ target workspace path และ root workspace path
5. ถ้า workspace ไม่พบให้ stop และ report

### 2. Analyze Manifest

วิเคราะห์ package manifest ของ workspace

> Goal: ตรวจสอบ manifest quality และ scripts

1. อ่าน `package.json` หรือ `Cargo.toml` ของ workspace
2. ตรวจสอบ `name`, `version`, `description`, `main`, `types` หรือ `bin`
3. ตรวจสอบ `scripts` ว่ามี `dev`, `build`, `test`, `lint`, `typecheck`, `verify`, `ci` ตาม `/follow-package-manifest`
4. ตรวจสอบ `exports`, `files`, `publishConfig` สำหรับ library packages
5. บันทึก findings พร้อม evidence

### 3. Review Structure

ตรวจสอบโครงสร้าง directory ของ workspace

> Goal: โครงสร้าง workspace สอดคล้องกับ tech stack และ conventions

1. ทำ `/scan-codebase` ใน target workspace
2. ตรวจสอบ source directory, test directory, config directory
3. ตรวจสอบว่ามี `README.md`, `LICENSE`, `.gitignore` หรือไม่
4. ตรวจสอบ file size เกิน 250 บรรทัดหรือไม่
5. ระบุ files ที่ไม่มีการใช้งานหรือ orphan files
6. ตรวจสอบว่า workspace มีขนาดเหมาะสมและ single responsibility — ถ้าใหญ่เกินไป, เล็กเกินไป, ทำหลายสิ่ง, หรือไม่มีเหตุผลชัดเจนที่แยกเป็น workspace ให้พิจารณา `/refactor-packages`

### 4. Review Dependencies

ตรวจสอบ dependencies ของ workspace

> Goal: dependencies ถูกต้อง ไม่ซ้ำซ้อน ไม่ขาด ไม่เกิน

1. แยก `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`
2. ระบุ `workspace:*` dependencies และตรวจสอบว่ามีอยู่จริง
3. ทำ `/check-unused-deps` เพื่อหา unused dependencies
4. ทำ `/run-audit` เพื่อตรวจ security vulnerabilities
5. ตรวจสอบ version constraints ระหว่าง workspaces ว่าสอดคล้องกัน

### 5. Review Config Consistency

ตรวจสอบ config files ของ workspace

> Goal: config files สอดคล้องกับ root workspace และ project standards

1. ทำ `/review-codebase-everything` สำหรับ tsconfig, vite, biome, eslint, prettier, lefthook, turbo
2. เปรียบเทียบ config กับ root workspace ถ้ามี
3. ตรวจสอบ `.env.example`, `.env.local` ว่ามีหรือไม่
4. ตรวจสอบ config drift ระหว่าง workspaces ถ้าเป็น monorepo

### 6. Run Checks

รัน verification commands เพื่อตรวจสอบ workspace health

> Goal: พบ runtime และ build issues ก่อน report

1. ทำ `/run-verify` เพื่อรัน lint, typecheck, scan
2. ถ้ามี scripts ให้รัน `bun run verify` หรือ `bun run ci` ตามลำดับ
3. ถ้าเป็น Rust ให้รัน `cargo clippy && cargo check && cargo test`
4. บันทึก errors และ failures พร้อม evidence

### 7. Validate Findings And Report

validate findings และสรุปผล

> Goal: findings ถูกต้อง พร้อม review score และ recommendations

1. ทำ `/validate` เพื่อตรวจสอบ findings
2. ให้ severity ต่อ finding: Critical, High, Medium, Low, Info
3. คำนวณ review score โดย weighted average
4. ทำ `/report-table` สำหรับ summary
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Scope Boundary

- review หนึ่ง workspace ต่อการเรียก
- ไม่ duplicate กับ `/review-codebase-everything`
- ถ้าพบ issues นอก scope ให้ระบุเป็น Info และอ้างอิง skill ที่เหมาะสม

### 2. Evidence Quality

- ทุก finding ต้องมี file path, line number หรือ config evidence
- ไม่ report โดยไม่มี evidence
- ถ้า evidence ไม่เพียงพอให้ทำ `/scan-codebase` เพิ่มเติม

### 3. Monorepo Context

- ถ้าเป็น monorepo ให้เปรียบเทียบกับ root workspace
- ตรวจสอบ workspace dependencies ว่าถูกต้อง
- ใช้ monorepo run command ที่เหมาะสม เช่น `moon run <project>:<task>` หรือ `bun --filter <workspace> <script>`

### 4. Health Score

- คำนวณ review score เป็น percentage 0-100
- Critical=0, High=25, Medium=50, Low=75, Info=100
- แสดง overall score และ score ต่อ dimension

### 5. Formatting

- ใช้ backticks สำหรับ paths, commands, skill names
- ไม่ใช้ bold markers `**`
- รายงานเป็นตารางด้วย `/report-table`

### 6. Workspace Size And Responsibility

- single responsibility คือรวม code ที่เปลี่ยนด้วยกัน, deploy ด้วยกัน, test ด้วยกัน
- ถ้า workspace ทับซ้อนกับ workspace อื่น ให้พิจารณา merge หรือลบ
- ใช้ `/refactor-packages` เมื่อต้อง split, merge, หรือ relocate packages/modules

## Expected Outcome

- Review report ของ single workspace พร้อม review score
- Findings ที่มี severity, evidence, และ recommendations
- รายการ config drift, dependency issues, script gaps, และ SRP/size issues
- คำแนะนำ `/refactor-packages` ถ้า workspace ใหญ่เกินไป, เล็กเกินไป, หรือทำหลายสิ่ง
- Review score ต่อ dimension และ overall
- คำแนะนำ action ถัดไปผ่าน `/suggest-next-action`
