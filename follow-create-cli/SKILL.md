---
name: follow-create-cli
description: สร้าง CLI applications ด้วย Rust หรือ Bun พร้อมเลือก stack และ architecture ที่เหมาะสม
related:
  - follow-create-bun-cli
  - follow-create-rust-cli
  - follow-architecture
  - follow-flat-folders
  - follow-my-tech-stack
  - ship
  - review-techstack
  - rethink
---
## Goal

สร้าง CLI applications ด้วย Rust หรือ Bun ตาม context และ requirements พร้อม review คุณภาพด้วย `/deep-review`

## Scope

ใช้เมื่อต้องสร้าง CLI ใหม่ หรือสร้าง tools CLI (เช่น `tools/review-codebase`, `tools/analyze`) — เลือกระหว่าง `/follow-create-rust-cli` และ `/follow-create-bun-cli` ตาม performance, distribution, ecosystem

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Decide CLI Stack

> Goal: พิจารณาเลือก stack ที่เหมาะสม

1. วิเคราะห์ requirements: performance, distribution, ecosystem, team skill
2. เลือก Rust ถ้า: ต้องการ binary เดียว, performance สูง, zero runtime dependency
3. เลือก Bun ถ้า: ทีมใช้ TypeScript, ต้องการ rapid development, มี Bun runtime ติดตั้ง
4. ถ้าไม่ชัด → ใช้ `/ask-me` หรือ `/vs` ก่อน

ดู [references/cli-frameworks.md](references/cli-frameworks.md) สำหรับ stack comparison และ framework examples

### 3. Create CLI Project

> Goal: สร้างโครงสร้างตาม stack ที่เลือก

1. ถ้าเลือก Rust → ทำ `/follow-create-rust-cli`
2. ถ้าเลือก Bun → ทำ `/follow-create-bun-cli`
3. ทำ `/follow-architecture` หรือ `/review-architecture` เพื่อเลือก architecture ตาม context ไม่บังคับ Clean
4. ถ้า directory ซ้อนลึกเกิน 3 ระดับและไม่จำเป็น → ทำ `/follow-flat-folders`
5. ถ้า CLI ต้องมี table, command, prompt, หรือ TUI → ทำ `/follow-my-tech-stack` เพื่อเลือก libraries ตาม tech stack ที่กำหนดไว้
6. สร้าง `tools/<tool-name>/` ถ้าเป็น tooling CLI ใน monorepo

### 4. Review CLI

> Goal: ตรวจสอบคุณภาพ CLI หลังสร้าง

1. ทำ `/deep-review` เพื่อตรวจสอบ design, structure, UX, error handling
2. แก้ไขตาม findings ที่ `/deep-review` ระบุ
3. รัน lint และ test ตาม stack ที่เลือก

### 5. Integrate Into Workspace

> Goal: ผสาน CLI เข้ากับ workspace

1. เพิ่ม scripts ใน package manifest หรือ task runner ตาม `/follow-tasks`
2. ถ้าเป็น monorepo → ทำ `/follow-monorepo` เพื่อกำหนด workspace และ dependencies
3. อัปเดต references ใน `README.md` และ `AGENTS.md` ถ้าจำเป็น

### 6. Ship

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

### 2. Architecture Selection

- ทุก CLI ต้องแยก concerns ชัดเจน
- ใช้ `/follow-architecture` เลือก architecture ตาม context ไม่บังคับ Clean หรือ Layered
- Domain layer ต้อง pure ไม่มี side effects เมื่อเหมาะสม
- Adapters จัดการ I/O และ external dependencies
- Presentation เป็น entry points

### 3. Library Selection

- ถ้า CLI ต้องแสดงตาราง → ใช้ libraries จาก `/follow-my-tech-stack` เช่น `comfy-table` (Rust) หรือ `TanStack Table` (Bun/TS)
- ถ้า CLI ต้องรับ command/subcommand → ใช้ `clap` (Rust) หรือ `cac` (Bun/TS)
- ถ้า CLI ต้อง interactive prompt → ใช้ `dialoguer`/`inquire` (Rust) หรือ `@clack/prompts`/`inquirer` (Bun/TS)
- ถ้า CLI ต้อง TUI → ใช้ `ratatui` (Rust) หรือ `blessed`/`ink` (Bun/TS)
- ทำ `/follow-my-tech-stack` ก่อนเลือก libraries ใหม เพื่อไม่ให้ขัดแย้งกับ tech stack ปัจจุบัน

### 4. Review Before Ship

- ทำ `/deep-review` ก่อน commit
- รองรับ `--help`, `--version`, error messages ที่ชัดเจน
- มี tests ครอบคลุม critical paths
- มี logging หรือ tracing ตาม stack

- ใช้ /rethink ถ้าจำเป็น

## Expected Outcome

- CLI project ที่เลือก stack เหมาะสม
- โครงสร้างตาม architecture ที่เลือกไม่บังคับ Clean
- Directory ไม่ซ้อนลึกเกินไป (ใช้ `/follow-flat-folders` ถ้าจำเป็น)
- ผ่าน `/deep-review`
- ผสานเข้ากับ workspace ได้

