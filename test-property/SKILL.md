---
name: test-property
description: รัน property-based + fuzz tests — invariants บน generated inputs, shrinking, seeds (fast-check, proptest, hypothesis, go/cargo fuzz)
argument-hint: "[scope] [--runs N] [--seed N]"
related:
  - run-test
  - test-all
  - test-unit
  - test-mutation
  - deep-review
  - deep-test
  - update-tests
  - resolve-errors
  - follow-lib-fast-check
  - run-verify
  - create-report-in-dot-devin
  - report
---

## Goal

รัน property-based tests และ fuzz tests — ตรวจ invariants บน generated inputs แทนตัวอย่างเดียว, shrink หา minimal counterexample — signals: `fast-check`, `proptest`, `hypothesis`, `go test -fuzz`, `cargo-fuzz`, `quickcheck`

## Scope

ใช้เมื่อต้องรัน property/fuzz tests — run-only ไม่แก้ tests (analysis ลึก → `/deep-test`; เขียน properties ใหม่ → `/update-tests` + `/follow-lib-fast-check`)

- Fixed example tests → `/test-unit`; assertion strength → `/test-mutation`; throughput fuzz → `/test-load`

## Execute

> Pre-Run: ทำ `/deep-review` ก่อนเสมอ — `test-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน (test)

### 1. Detect

JS/TS → `fast-check` (`fc.assert`, `fc.property`); Rust → `proptest`/`cargo-fuzz` (`fuzz_targets/`); Python → `hypothesis` (`@given`); Go → `go test -fuzz=FuzzX`; runner ตาม ecosystem นั้น (`bunx vitest run`, `cargo test`, `pytest`, `go test`)

### 2. Run

จำกัด runs/duration ให้เหมาะ CI (`--runs`, `numRuns`, `-fuzztime`); บันทึก seed/counterexample ทุก failure — seed สำคัญสำหรับ repro; fuzz targets → รัน time-boxed (เช่น `-fuzztime=60s`) ไม่ใช่ open-ended

### 3. Classify

counterexample/shrunk case → source bug จริง → `/resolve-errors` พร้อม minimal input; generator ผิด/ขัด spec → test → `/update-tests`; timeout/env limit → environment; failure เดิมซ้ำ ≥3 → stop+report

### 4. Report

persist → `.devin/temp/report/<workspace>/property-test-<time>.md` — properties ผ่าน, seeds, minimal counterexamples; ผ่านหมด → `/run-verify`

## Rules

- run-only (analysis ลึก → `/deep-test`)
- ทุก failure ต้องบันทึก seed + shrunk counterexample — ห้าม report "failed" โดยไม่มี repro input
- ห้ามลด `numRuns`/เพิ่ม arbitrary constraints เพื่อให้ผ่าน — เสมือน weaken assertion
- Fuzz runs ต้อง time-boxed เสมอ ไม่ทิ้ง fuzzer รันค้าง

## Expected Outcome

- Property/fuzz tests รันครบ พร้อม seeds ที่ repro ได้
- Failures ถูก classify พร้อม minimal counterexample
- Report persist ใน `.devin/temp/report/`
