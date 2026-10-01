---
name: deep-research-dependencies
description: Research dependencies สำหรับ project — analyze manifest, compare alternatives, หา fast/modern deps
argument-hint: "[package or manifest]"
related:
  - deep-research
  - list-dependencies
  - open-web-dependencies
  - run-bench-deps
  - run-install
  - report
---

## Goal

Research dependencies หรือ libraries ที่เหมาะสมกับ project — analyze manifest, เปรียบเทียบ alternatives, หา fast/modern deps (merged `/research-dependencies`)

## Scope

- เลือก dependencies ใหม่, เปรียบเทียบ libraries, หา compatible versions, ตรวจ deps ใน project
- รองรับ `Cargo.toml`, `package.json`, `go.mod`, `pyproject.toml`
- ไม่แก้ไข manifest files โดยตรง — ส่งต่อ `/list-dependencies` หรือ `/deep-review`
- ตาราง bench/compare ของ deps ที่มีอยู่ → `/run-bench-deps` (CLI report, no research)

## Execute

### 1. Identify Dependency Need

> Goal: ระบุว่าต้องหา dependency ประเภทใด

1. ถ้ามี manifest file → อ่าน `Cargo.toml`, `package.json`, `go.mod`, `pyproject.toml`
2. ระบุ package name หรือ capability ที่ต้องการ เช่น "HTTP client in Bun" หรือ "existing deps ที่ outdated"
3. ระบุ ecosystem: `npm` / `crates.io` / `go` / `pypi`
4. ระบุ constraints: fast, modern, minimal bundle, secure, maintained

### 2. Analyze Manifest

> Goal: รวบรวม dependencies ที่มีอยู่

1. ใช้ `/list-dependencies` หรือ `/follow-tool-madge` ดู tree
2. ตรวจ version ปัจจุบันและ source ของแต่ละ dep
3. ระบุ outdated, duplicate, heavy, หรือ unused deps
4. บันทึก baseline: จำนวน deps, size, จำนวน outdated

### 3. Search Modern/Fast Alternatives

> Goal: หา deps ที่เหมาะกับ tech stack ปัจจุบัน

1. ทำ `/search-github-star` หา popular/quality libraries
2. ทำ `/search-raindrop` หา bookmarks หรือ comparison ที่เคยเก็บไว้
3. ทำ `/search-npmx` สำหรับ JS/TS packages
4. ใช้ package registries: `npm`, `crates.io`, `pkg.go.dev`, `pypi`
5. ค้นหาด้วย keywords ที่ตรงกับ capability + `fast`, `modern`, `lightweight`, `zero-dependency`

### 4. Compare Candidates

> Goal: เปรียบเทียบทางเลือก

1. รวบรวม 2-5 candidates — เปรียบเทียบ: downloads/stars/maintenance, license, bundle size/compile time, API stability, docs quality, type safety, last release (prefer ≤ 6 เดือน)
2. ตรวจสอบ compatibility กับ tech stack ปัจจุบัน
3. ให้ priority กับ fast, modern, minimal deps

### 5. Deep Check

> Goal: ตรวจสอบ candidates ทีละตัว

1. อ่าน official docs ผ่าน `context7` หรือ `webfetch`
2. ดู GitHub: open issues, recent commits, release frequency
3. ตรวจสอบ security advisories
4. ค้นหา benchmark/comparison ถ้าจำเป็น

### 6. Recommend

> Goal: เลือก dependency ที่ดีที่สุด

1. ทำ `/report` ด้วย columns: `No.`, `Package`, `Version`, `License`, `Maintenance`, `Size`, `Pros`, `Cons`, `Verdict`
2. ระบุ primary recommendation + alternatives + install command ตาม ecosystem
3. ถ้า analyze project deps → ระบุ outdated/heavy/duplicate พร้อม suggestions
4. ถ้าต้องเปิด website ของ deps → `/open-web-dependencies`; ทำ `/suggest-next-action` ท้าย report

## Rules

- ใช้ package manager ตาม ecosystem: `bun add`, `cargo add`, `go get`, `pip install` — ไม่แนะนำ dep ซ้ำกับของเดิม
- Prefer zero/low-dependency, fast, modern API — หลีกเลี่ยง deprecated, archived, heavy/legacy; last commit ≤ 6 เดือน; license เข้ากับ project
- Time budget: เล็ก ≤ 5 นาที, กลาง ≤ 15 นาที — ลึกกว่านั้นกลับไป `/deep-research` (general pipeline)
- Safety: ไม่แก้ไข manifest โดยตรง; dep ที่มี security issues → แจ้งและหา alternatives
- ใช้ `/follow-best-practice`, `/check-reference`, `/run-install` ถ้าจำเป็น

## Expected Outcome

- ตารางเปรียบเทียบ deps + primary recommendation + install command + security/maintenance notes
