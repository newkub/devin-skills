---
name: run-test-coverage
description: รัน test coverage analysis ตรวจสอบ framework และบรรลุ 100% coverage
argument-hint: "[scope]"
related:
  - follow-coverage
  - review-content-coverage
  - run-test
  - run-check
  - run-verify
  - suggest-next-action
  - review-quality
  - improve-test-coverage
---

## Goal

ทำ `/run-test-coverage` เพื่อตรวจสอบ test framework ที่ใช้ และบรรลุ 100% coverage ทุกประเภท

## Scope

ใช้สำหรับวิเคราะห์ test coverage ตรวจสอบ test framework และบรรลุ 100% coverage ทุกประเภท

## Execute

### 1. Detect Test Framework

> Goal: Detect Test Framework

ตรวจสอบ test framework ที่ project ใช้

1. ตรวจสอบ `package.json` สำหรับ test dependencies (`vitest`, `jest`, `mocha`, `pytest`, `go test`)
2. ตรวจสอบ config files (`vitest.config.ts`, `jest.config.js`, `pytest.ini`, `go.mod`)
3. ตรวจสอบ test files patterns (`*.test.ts`, `*_test.go`, `test_*.py`)
4. ตรวจสอบ coverage tools ที่ framework รองรับ (`c8`, `istanbul`, `coverage.py`, `go test -cover`)
5. บันทึก test framework และ coverage tools ที่ใช้

### 2. Setup Coverage Config

> Goal: Setup Coverage Config

ตั้งค่า coverage ตาม framework ที่ตรวจพบ

1. ตรวจสอบ coverage config ใน framework config
2. ตั้งค่า coverage thresholds เป็น 100% ทุก category
3. ตั้งค่า coverage output directory
4. ตั้งค่า coverage reporters (`html`, `json`, `text`, `lcov`)
5. ตรวจสอบ coverage excludes สำหรับ test files และ config

### 3. Run Coverage Analysis

> Goal: Run Coverage Analysis

รัน coverage analysis ตาม framework ที่ใช้

1. รัน coverage command ตาม framework (`bun run test:coverage`, `pytest --cov`, `go test -cover`)
2. รอ tests เสร็จสิ้น
3. ตรวจสอบ coverage report ถูกสร้าง
4. บันทึก coverage metrics ทุก category
5. บันทึก report location

### 4. Verify And Loop Until 100% Coverage

> Goal: Verify And Loop Until 100% Coverage

ตรวจสอบว่า coverage ถึง 100% ทุกประเภท ถ้าไม่ถึงให้เขียน tests แล้ว run ใหม่จนกว่าจะ 100%

1. ตรวจสอบ `lines` coverage ถึง 100%
2. ตรวจสอบ `branches` coverage ถึง 100%
3. ตรวจสอบ `functions` coverage ถึง 100%
4. ตรวจสอบ `statements` coverage ถึง 100%
5. ถ้า coverage ถึง 100% ทุก category → ไป Report
6. ถ้า coverage ไม่ถึง 100% → ทำ `/improve-test-coverage` วิเคราะห์ gaps เติม tests ทีขาด
7. ถ้าเขียน tests แล้ว → กลับไป Step 3 Run Coverage Analysis ใหม่
8. วนซ้ำสูงสุด 5 รอบ ถ้าเกิน → stop และ report พร้อม remaining gaps

### 5. Report

> Goal: Report coverage result

1. ถ้า coverage ถึง 100% → report framework, metrics, report location
2. ถ้าไม่ถึง 100% → report remaining gaps, categories ที่ยังไม่ผ่าน, next step
3. ทำ `/suggest-next-action`

## Rules

### 1. Framework Detection

ตรวจสอบ test framework ที่ project ใช้

- ตรวจสอบ `package.json` สำหรับ test dependencies
- ตรวจสอบ config files ของ framework
- ตรวจสอบ test files patterns
- ตรวจสอบ coverage tools ที่ framework รองรับ
- ใช้ coverage command ที่ถูกต้องตาม framework

### 2. Coverage Configuration

ตั้งค่า coverage ตาม framework ที่ใช้

- ตั้งค่า coverage thresholds เป็น 100% ทุก category
- ตั้งค่า coverage output directory
- ตั้งค่า coverage reporters ที่เหมาะสม
- ตั้งค่า coverage excludes สำหรับ test files
- ตรวจสอบ config ถูกต้องตาม framework

### 3. Coverage Metrics

ตรวจสอบ coverage ทุก category ตามมาตรฐาน

- `lines` - % ของ lines ที่ถูก execute
- `functions` - % ของ functions ที่ถูก call
- `branches` - % ของ branches ที่ถูก test
- `statements` - % ของ statements ที่ถูก execute
- ทุก category ต้องถึง 100%

### 4. Coverage Threshold And Loop

เป้าหมาย coverage ต้องถึง 100% ทุก category โดยไม่มีข้อยกเว้น วน loop จนกว่าจะ 100%

- Coverage 100% ทุก category เท่านั้นที่ผ่าน
- หาก coverage ไม่ถึง 100% ต้องทำ `/review-quality` เพื่อวิเคราะห์ gaps และเขียน tests ที่ขาด
- วน loop run coverage → write tests → run coverage จนกว่าจะ 100% สูงสุด 5 รอบ
- ถ้าเกิน 5 รอบ → stop และ report remaining gaps
- ไม่มีข้อยกเว้นสำหรับ critical code
- ไม่มีข้อยกเว้นสำหรับ edge cases
- ไม่มีข้อยกเว้นสำหรับ error paths

- ใช้ /follow-coverage ถ้าจำเป็น
- ใช้ /review-content-coverage ถ้าจำเป็น
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /run-verify ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น

## Expected Outcome

- Test framework ถูกระบุอย่างถูกต้อง
- Coverage config ถูกตั้งค่า thresholds 100% ทุก category
- Coverage report ถูกสร้าง
- Coverage ถึง 100% ทุก category (lines, branches, functions, statements)
- ถ้าไม่ถึง 100% วน loop เขียน tests แล้ว run coverage จนกว่าจะ 100% สูงสุด 5 รอบ
- ถ้าเกิน 5 รอบ → report remaining gaps และ next step