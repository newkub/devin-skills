---
name: research-dependencies
description: Research dependencies สำหรับ project โดย analyze manifest, compare และหา fast/modern deps
argument-hint: "[package or manifest]"
allowed-tools:
  - read
  - write
  - edit
  - exec
  - skill
  - ask_user_question
  - todo_write
  - find_file_by_name
  - grep
  - web_search
  - webfetch
  - context7
  - mcp_call_tool
related:
  - deep-research
  - follow-my-tech-stack
  - follow-best-practice
  - check-reference
  - report
  - suggest-next-action
  - search-in-github-star
  - search-in-raindrop-io
  - search-in-npmx
  - list-dependencies
  - check-circular-dependencies
  - open-web-dependencies
---

## Goal

Research dependencies หรือ libraries ที่เหมาะสมกับ project โดย analyze manifest files, เปรียบเทียบ alternatives, และหา fast/modern deps

## Scope

ใช้เมื่อต้องเลือก dependencies ใหม่, เปรียบเทียบ libraries, หา compatible versions หรือตรวจ dependencies ใน project ปัจจุบัน

- รองรับ `Cargo.toml`, `package.json`, `go.mod`, `pyproject.toml`
- ใช้ `/search-in-github-star`, `/search-in-raindrop-io`, `/search-in-npmx` เพื่อหา deps ที fast/modern
- ไม่แก้ไข manifest files โดยตรง — ส่งต่อ `/list-dependencies` หรือ `/review-dependencies`

## Execute

### 1. Identify Dependency Need

> Goal: ระบุว่าต้องหา dependency ประเภทใด

1. ถ้ามี manifest file → อ่าน `Cargo.toml`, `package.json`, `go.mod`, `pyproject.toml`
2. ระบุ package name หรือ capability ที่ต้องการ เช่น "HTTP client in Bun" หรือ "existing deps ที outdated"
3. ระบุ ecosystem: `npm` / `crates.io` / `go` / `pypi`
4. ระบุ constraints: fast, modern, minimal bundle, secure, maintained
5. ถ้าไม่ชัด → ทำ `/follow-my-tech-stack` ก่อน

### 2. Analyze Manifest

> Goal: รวบรวม dependencies ทีมีอยู่

1. ใช้ `/list-dependencies` หรือ `/check-circular-dependencies` ดู tree
2. ตรวจ version ปัจจุบันและ source ของแต่ละ dep
3. ระบุ outdated, duplicate, heavy, หรือ unused deps
4. บันทึก baseline: จำนวน deps, size, จำนวน outdated

### 3. Search Modern/Fast Alternatives

> Goal: หา deps ทีเหมาะกับ tech stack ปัจจุบัน

1. ทำ `/search-in-github-star` หา popular/quality libraries
2. ทำ `/search-in-raindrop-io` หา bookmarks หรือ comparison ที่เคยเก็บไว้
3. ทำ `/search-in-npmx` สำหรับ JS/TS packages
4. ใช้ package registries เบื้องต้น: `npm`, `crates.io`, `pkg.go.dev`, `pypi`
5. ค้นหาด้วย keywords ที่ตรงกับ capability + `fast`, `modern`, `lightweight`, `zero-dependency`

### 4. Compare Candidates

> Goal: เปรียบเทียบทางเลือก

1. รวบรวม 2-5 candidates
2. เปรียบเทียบตาม:
   - Downloads / stars / maintenance
   - License
   - Bundle size หรือ compile time
   - API stability
   - Documentation quality
   - Type safety
   - Last release (prefer ไม่เกิน 6 เดือน)
3. ตรวจสอบ compatibility กับ tech stack ปัจจุบัน
4. ให้ priority กับ fast, modern, minimal deps

### 5. Deep Check

> Goal: ตรวจสอบ candidates ทีละตัว

1. อ่าน official docs ผ่าน `context7` หรือ `webfetch`
2. ดู GitHub: open issues, recent commits, release frequency
3. ตรวจสอบ security advisories
4. ค้นหา benchmark/comparison ถ้าจำเป็น
5. ทำ `/deep-research` เฉพาะเมื่อต้อง cross-check หลายแหล่ง

### 6. Recommend

> Goal: เลือก dependency ทีดีทีสุด

1. ทำ `/report` ด้วย columns: `No.`, `Package`, `Version`, `License`, `Maintenance`, `Size`, `Pros`, `Cons`, `Verdict`
2. ระบุ primary recommendation พร้อมเหตุผล
3. ระบุ alternatives ถ้าหลักไม่เหมาะ
4. ระบุ install command ตาม ecosystem
5. ถ้า analyze project deps → ระบุ outdated/heavy/duplicate พร้อม suggestions
6. ถ้าต้องเปิด website ของ deps → ส่งต่อ `/open-web-dependencies`
7. ทำ `/suggest-next-action` ท้าย report

## Rules

### 1. Ecosystem Aware

- ใช้ package manager ตาม ecosystem: `bun add`, `cargo add`, `go get`, `pip install`
- ตรวจ `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml` ก่อนแนะนำ
- ไม่แนะนำ dependency ที่ซ้ำกับของเดิม

### 2. Prefer Fast And Modern

- ให้ priority กับ deps ที zero/low dependency, fast, modern API
- หลีกเลี่ยง deprecated, archived, หรือ heavy/legacy libraries
- ดู last commit ภายใน 6 เดือน
- ตรวจ license ว่าเข้ากันกับ project

### 3. Time Budget

- research เล็กไม่เกิน 5 นาที
- research กลางไม่เกิน 15 นาที
- ถ้าต้องการลึกมากกว่า → ใช้ `/deep-research`

### 4. Integration

- ถ้า library ไม่อยู่ใน `/follow-my-tech-stack` table → ใช้ `/deep-research` เพิ่ม
- ถ้าต้อง add ลง tech stack table → แนะนำ update `/follow-my-tech-stack`
- ถ้าต้องแก้ไข manifest → ส่งต่อ `/list-dependencies` หรือ `/review-dependencies`

### 5. Safety

- ไม่แก้ไข manifest files โดยตรง
- ใช้ `/check-circular-dependencies` หรือ `/list-dependencies` ก่อนการเปลี่ยนแปลง
- ถ้า dep มี security issues → แจ้งและหา alternatives

- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/check-reference` ถ้าจำเป็น

## Expected Outcome

- ตารางเปรียบเทียบ dependencies
- Primary recommendation พร้อมเหตุผล
- Install command ตาม ecosystem
- รายการ manifest deps ที outdated/heavy/duplicate พร้อม suggestions
- Security/maintenance notes
- Next action ชัดเจน
