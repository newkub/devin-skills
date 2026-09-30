---
name: follow-tdd-setup-coverage
description: ติดตั้ง coverage tooling ตาม ecosystem — vitest coverage, llvm-cov, go cover
argument-hint: "[scope]"
related:
  - follow-coverage
  - run-test
  - follow-test
  - follow-tool-vitest
  - use-related-skills
  - setup-cicd
  - resolve-errors
  - ask-me
---

## Goal

ติดตั้งและตั้งค่า coverage tooling ให้ project วัด coverage ได้ตาม ecosystem — พร้อมใช้ใน TDD loop และ CI

## Scope

- ใช้เมื่อ project ยังไม่มี coverage tooling หรือต้อง setup ใหม่ก่อนเริ่ม TDD
- รองรับ Bun/Node (vitest), Rust (llvm-cov), Go (built-in cover), Python (pytest-cov)
- ไม่ครอบคลุมการเขียน tests หรือเพิ่ม coverage — setup tooling เท่านั้น

## Execute

### 1. Detect Ecosystem And State

> Goal: รู้ stack และ current coverage state ก่อน install

1. ตรวจ manifest: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`
2. ตรวจ test framework ที่มี — vitest, cargo test/nextest, go test, pytest
3. ตรวจว่า coverage setup ไปแล้วหรือยัง — config, devDeps, CI step (idempotent check)
4. ถ้าไม่มี test framework → ทำ `/use-related-skills` เพื่อหา `follow-tool-vitest` ฯลฯ ก่อน

### 2. Install Coverage Tooling

> Goal: tool ตรง ecosystem และติดตั้งตาม official docs

เลือกตาม ecosystem ที่ตรวจพบ:

| Ecosystem | Tool | Run |
|-----------|------|-----|
| Bun/Node | `@vitest/coverage-v8` | `vitest run --coverage` |
| Rust | `cargo-llvm-cov` | `cargo llvm-cov` |
| Go | built-in | `go test -coverprofile=coverage.out ./...` |
| Python | `pytest-cov` | `pytest --cov` |

1. ติดตั้ง devDependency/tool ตาม package manager ของ project — ดู official docs ถ้าไม่แน่ใจ
2. เพิ่ม script `test:coverage` ใน manifest (ตามตาราง `/follow-test` rules)
3. ตั้ง coverage config ขั้นต่ำ — provider, include/exclude patterns, reporters

### 3. Configure Thresholds And Output

> Goal: coverage วัดและ enforce ได้

1. ตั้ง output dir (เช่น `coverage/`) และเพิ่มใน `.gitignore`
2. ตั้ง thresholds ตาม level ของ `/follow-test` (Minimal 70% / Standard ~85% / Complete ~90%+) ถ้า tool รองรับ
3. ตั้ง reporters: text สำหรับ terminal + html/lcov สำหรับ CI

### 4. Wire CI And Verify

> Goal: coverage รันใน CI และทำงานจริง

1. เพิ่ม coverage step ใน CI workflow ถ้ามี — ถ้ายังไม่มี pipeline ทำ `/setup-cicd`
2. รัน coverage command — ต้องออก report สำเร็จ
3. ทำ `/run-test` (coverage) ยืนยัน report ถูกต้อง
4. ถ้า fail → `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ใช้ coverage tool มาตรฐานของ ecosystem เท่านั้น — ห้ามเพิ่ม tool ซ้ำซ้อน
- thresholds ตาม level ที่ project เลือกใน `/follow-test` — อย่าตั้งเกินจน block TDD loop
- coverage output ห้าม commit — gitignore เสมอ
- ถ้า tool/version ไม่แน่ใจ → ดู official docs ก่อน install ห้ามเดา flags

## Expected Outcome

- coverage tooling ติดตั้งตาม ecosystem และ `test:coverage` script รันได้
- thresholds/reporters ตั้งตาม level ของ project
- coverage รันใน CI และ report ออกถูกต้อง

