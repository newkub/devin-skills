---
name: follow-create-cli
description: สร้าง CLI applications ด้วย Rust หรือ Bun พร้อม review และเลือก stack ที่เหมาะสม
---

## Goal

สร้าง CLI applications ด้วย Rust หรือ Bun ตาม context และ requirements พร้อม review คุณภาพด้วย `/update-review-cli-and-run`

## Scope

ใช้เมื่อต้องสร้าง CLI ใหม่ หรือสร้าง tools CLI (เช่น `tools/review-codebase`, `tools/analyze`) — เลือกระหว่าง `/follow-create-rust-cli` และ `/follow-create-bun-cli` ตาม performance, distribution, ecosystem

## Execute

### 1. Decide CLI Stack

> Goal: พิจารณาเลือก stack ที่เหมาะสม

1. วิเคราะห์ requirements: performance, distribution, ecosystem, team skill
2. เลือก Rust ถ้า: ต้องการ binary เดียว, performance สูง, zero runtime dependency
3. เลือก Bun ถ้า: ทีมใช้ TypeScript, ต้องการ rapid development, มี Bun runtime ติดตั้ง
4. ถ้าไม่ชัด → ใช้ `/ask-me` หรือ `/compare` ก่อน

ดู [references/cli-frameworks.md](references/cli-frameworks.md) สำหรับ stack comparison และ framework examples

### 2. Create CLI Project

> Goal: สร้างโครงสร้างตาม stack ที่เลือก

1. ถ้าเลือก Rust → ทำ `/follow-create-rust-cli`
2. ถ้าเลือก Bun → ทำ `/follow-create-bun-cli`
3. ทำ `/follow-architecture` เพื่อวางโครงสร้าง layers ให้ชัดเจน
4. สร้าง `tools/<tool-name>/` ถ้าเป็น tooling CLI ใน monorepo

### 3. Review CLI

> Goal: ตรวจสอบคุณภาพ CLI หลังสร้าง

1. ทำ `/update-review-cli-and-run` เพื่อตรวจสอบ design, structure, UX, error handling
2. แก้ไขตาม findings ที่ `/update-review-cli-and-run` ระบุ
3. รัน lint และ test ตาม stack ที่เลือก

### 4. Integrate Into Workspace

> Goal: ผสาน CLI เข้ากับ workspace

1. เพิ่ม scripts ใน package manifest หรือ task runner ตาม `/follow-tasks`
2. ถ้าเป็น monorepo → ทำ `/follow-monorepo` เพื่อกำหนด workspace และ dependencies
3. อัปเดต references ใน `README.md` และ `AGENTS.md` ถ้าจำเป็น

### 5. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Stack Selection

- Rust: เหมาะกับ binary distribution, performance critical, ไม่ต้อง runtime
- Bun: เหมาะกับทีม TypeScript, rapid iteration, ใช้ Bun runtime
- ไม่ force ใช้ stack ที่ไม่เหมาะกับ context
- บันทึกเหตุผลที่เลือก stack ใน `README.md` หรือ plan

ดู [references/cli-frameworks.md](references/cli-frameworks.md) สำหรับ framework details และ stack selection guide

### 2. Clean Architecture

- ทุก CLI ต้องแยก concerns ชัดเจน
- Domain layer ต้อง pure ไม่มี side effects
- Adapters จัดการ I/O และ external dependencies
- Presentation เป็น entry points

### 3. Review Before Ship

- ทำ `/update-review-cli-and-run` ก่อน commit
- รองรับ `--help`, `--version`, error messages ที่ชัดเจน
- มี tests ครอบคลุม critical paths
- มี logging หรือ tracing ตาม stack

## Expected Outcome

- CLI project ที่เลือก stack เหมาะสม
- โครงสร้างตาม Clean Architecture
- ผ่าน `/update-review-cli-and-run`
- ผสานเข้ากับ workspace ได้
