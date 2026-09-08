---
name: deep-verify
description: Verify ลึกแบบ end-to-end ว่า project ทำงานได้จริง — static gates, build, tests, runtime, e2e, usage
argument-hint: "[scope]"
related:
  - deep-validate
  - run-verify
  - run-test-all
  - run-test-e2e
  - test-usage
  - deep-review-codebase-then-fix
  - watch-browser-and-fix
  - check-open-ports
  - resolve-errors
  - report-in-table
---

## Goal

Verify ลึกครบวงจรว่า project ทำงานได้จริง — ไม่ใช่แค่ static checks: build ผ่าน, tests ผ่าน, runtime จริง, e2e ผ่าน, usage examples ใช้ได้จริง พร้อม evidence ทุก gate

## Scope

ใช้เมื่อต้องยืนยันความพร้อมจริงก่อน ship/deploy หรือหลังงานใหญ่ (refactor, implement, migrate)

- ต่างจาก `/deep-validate` — validate วิเคราะห์ correctness หลายมิติแบบ static; skill นี้รัน verification จริง end-to-end
- ต่างจาก `/run-verify` — run-verify ครอบ scan/lint/typecheck/test/build; skill นี้เพิ่ม e2e, runtime smoke, usage verification และ deep validation pass

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้าตามลำดับ

### 1. Static Gates

> Goal: code ผ่าน static checks ทั้งหมด

1. ทำ `/run-lint` เพื่อตรวจ lint
2. ทำ `/run-typecheck` เพื่อตรวจ types
3. ทำ `/run-format` ใน check mode ถ้า project มี formatter
4. ถ้า fail → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง → stop + report

### 2. Build And Test Gates

> Goal: build และ test suite ผ่าน

1. ทำ `/run-build` เพื่อยืนยัน build สำเร็จ
2. ทำ `/run-test-all` เพื่อรัน test suite ทั้งหมด
3. ทำ `/run-test-coverage` ถ้า project กำหนด coverage target
4. ถ้า fail → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง → stop + report

### 3. Runtime And E2E Gates

> Goal: ระบบทำงานได้จริงใน runtime

1. ทำ `/run-test-e2e` ถ้ามี UI flows หรือ critical paths
2. ทำ `/check-open-ports` แล้ว smoke test entry points จริง
3. ทำ `/watch-browser-and-fix` ถ้ามี web URL เพื่อจับ console/network errors
4. ทำ `/test-usage` เพื่อยืนยัน usage examples ใน README/docs ทำงานได้จริง
5. ถ้า fail → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง → stop + report

### 4. Deep Validation Pass

> Goal: ตรวจข้ามมิติที่ static/runtime gates ไม่ครอบ

1. ทำ `/deep-validate` สำหรับ cross-reference, compliance, security ครั้งสุดท้าย
2. ถ้าพบ issues → ทำ `/deep-review-codebase-then-fix` แล้วกลับมา verify ใหม่
3. ถ้า fail → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง → stop + report

### 5. Report

> Goal: สรุปผลทุก gate พร้อม evidence

1. ทำ `/report-in-table` คอลัมน์: No., Gate, Result, Evidence, Fix ที่ทำ
2. สรุปสถานะความพร้อม: ready / not-ready พร้อมเหตุผล
3. ทำ `/suggest-next-action`

## Rules

- รันจริงทุก gate — ห้ามเดาว่าผ่านหรือข้าม gate เพราะ "น่าจะผ่าน"
- แต่ละ gate fail → fix แล้วเริ่ม gate นั้นใหม่ ไม่ข้ามไป gate ถัดไป
- verify เท่านั้น ไม่เพิ่ม features หรือ refactor ใหญ่ระหว่าง verify
- ทุก result ต้องมี evidence (command output, test result, URL)
- ใช้ /deep-review-codebase-then-fix ถ้าจำเป็น

## Expected Outcome

- ทุก verification gate ผ่านด้วย evidence จริง
- รู้สถานะความพร้อม production ชัดเจน (ready / not-ready)
- มี report ตารางผลทุก gate
