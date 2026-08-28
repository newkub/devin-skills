---
name: research-dependencies
description: Research dependencies/libraries สำหรับ project โดยเปรียบเทียบ NPM, crates, Go modules, Python
argument-hint: "[package query]"
related:
  - deep-research
  - follow-my-tech-stack
  - follow-best-practice
  - check-reference
  - report-table
---

## Goal

Research dependencies หรือ libraries ที่เหมาะสมกับ project โดยเปรียบเทียบ alternatives จาก package registries, GitHub, และ docs

## Scope

ใช้เมื่อต้องเลือก dependencies ใหม่ เปรียบเทียบ libraries หรือหา compatible versions สำหรับภาษา/tech stack ปัจจุบัน

## Execute

### 1. Identify Dependency Need

> Goal: ระบุว่าต้องหา dependency ประเภทใด

1. ระบุ package name หรือ capability ที่ต้องการ เช่น "table rendering in Rust" หรือ "HTTP client in Bun"
2. ระบุ ecosystem: `npm` / `crates.io` / `go` / `pypi`
3. ระบุ constraints: version, license, bundle size, maintenance
4. ถ้าไม่ชัด → ทำ `/follow-my-tech-stack` ก่อน

### 2. Search Package Registries

> Goal: หา candidates จาก registries

1. ใช้ `npm` registry สำหรับ JS/TS packages (หรือ `jsr` สำหรับ Deno-compatible modules)
2. ใช้ `crates.io` สำหรับ Rust crates
3. ใช้ `pkg.go.dev` สำหรับ Go modules
4. ใช้ `pypi.org` สำหรับ Python packages
5. ค้นหาด้วย keywords ที่ตรงกับ capability

### 3. Compare Candidates

> Goal: เปรียบเทียบทางเลือก

1. รวบรวม 2-5 candidates
2. เปรียบเทียบตาม:
   - Downloads / stars / maintenance
   - License
   - Bundle size หรือ compile time
   - API stability
   - Documentation quality
   - Type safety
3. ตรวจสอบ compatibility กับ tech stack ปัจจุบัน

### 4. Deep Check

> Goal: ตรวจสอบ candidates ทีละตัว

1. อ่าน official docs ผ่าน Context7 หรือ `read_url_content`
2. ดู GitHub: open issues, recent commits, release frequency
3. ตรวจสอบ security advisories ถ้ามี
4. ค้นหา benchmark/comparison blog posts ถ้าจำเป็น
5. ใช้ `/deep-research` เฉพาะเมื่อต้อง cross-check หลายแหล่ง

### 5. Recommend

> Goal: เลือก dependency ทีดีทีสุด

1. ทำ `/report-table` ด้วย columns: No., Package, Version, License, Maintenance, Size, Pros, Cons, Verdict
2. ระบุ primary recommendation พร้อมเหตุผล
3. ระบุ alternatives ถ้าหลักไม่เหมาะ
4. ระบุ install command ตาม ecosystem
5. ทำ `/suggest-next-action` ท้าย report

## Rules

### 1. Ecosystem Aware

- ใช้ package manager ตาม ecosystem: `bun add`, `cargo add`, `go get`, `pip install`
- ตรวจ `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml` ก่อนแนะนำ
- ไม่แนะนำ dependency ที่ซ้ำกับของเดิม

### 2. Quality Check

- ดู last commit ภายใน 6 เดือน
- ระวัง packages ที่ deprecated หรือ archived
- ตรวจ license ว่าเข้ากันกับ project หรือไม่
- ถ้ามี security issues → แจ้งและหา alternatives

### 3. Time Budget

- research เล็กไม่เกิน 5 นาที
- research กลางไม่เกิน 15 นาที
- ถ้าต้องการลึกมากกว่า → ใช้ `/deep-research`

### 4. Integration

- ถ้า library ไม่อยู่ใน `/follow-my-tech-stack` table → ใช้ `/deep-research` เพิ่ม
- ถ้าต้อง add ลง tech stack table → แนะนำ update `/follow-my-tech-stack`

## Expected Outcome

- ตารางเปรียบเทียบ dependencies
- Primary recommendation พร้อมเหตุผล
- Install command ตาม ecosystem
- Security/maintenance notes
- Next action ชัดเจน
