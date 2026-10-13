---
name: check-flaky-tests
description: ตรวจ flaky tests — re-run analysis, CI history, quarantine — แล้วส่งต่อ fix
argument-hint: "[scope]"
related:
  - improve-tests
  - optimize-test-suite
  - run-test
  - follow-test
  - check-test-correctness
  - deep-review
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "มี flaky tests ตัวไหนบ้าง และจัดการยังไง" — สแกนประวัติ re-run/CI หา test ที่ผลไม่ deterministic, quarantine อย่างมีหลักฐาน แล้วส่ง finding ไป fix ผ่าน `/improve-tests` / `/optimize-test-suite`

## Scope

ใช้เมื่อสงสัยว่า test suite มี flakiness — check workflow ตรง (ไม่ใช่ thin review entry); คุมเฉพาะ detection + quarantine policy ไม่แก้ assertion เอง

- Detection: re-run N ครั้งเทียบผล, CI history failure rate ต่อ test, time-of-day/parallelism correlation
- Quarantine policy: mark + issue + owner + expiry — ห้าม quarantine ถาวร
- Root causes ที่พบบ่อย: shared state, timing/race, wall-clock dependence, external services — สอดคล้อง `/follow-test`
- test ที่ assert ผิดจริง (ไม่ flaky) → `/check-test-correctness`; suite ช้า → `/optimize-test-suite`

## Execute

### 1. Detect

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. รัน test ที่สงสัยซ้ำ (เช่น 10–20 iterations ผ่าน `/run-test` หรือ `--repeat`) จดผลที่กลับกัน (pass↔fail)
3. เช็ก CI history ผ่าน `/check-git-logs` / `gh run list` — failure ที่ไม่ผูกกับ diff = flaky candidate

### 2. Report + Quarantine

1. ทำ `/report` ตาราง: Test, Fail rate, Correlation (parallel/time/deps), Quarantine decision
2. Quarantine เฉพาะตัวที่พิสูจน์แล้วว่าไม่ deterministic — ใส่ tag/skip พร้อม reason + issue + expiry date
3. ห้าม quarantine เพื่อปลด CI โดยไม่มีหลักฐาน re-run

### 3. Route Fixes

1. flaky ที่เกิดจาก test design (shared state, sleep) → `/improve-tests`
2. flaky จาก infra/parallelism ทั้ง suite → `/optimize-test-suite`
3. flaky จาก product code race → `/improve-correctness`; ปิดด้วย `/suggest-next-action`

## Rules

- ทุก flaky verdict ต้องมีหลักฐาน re-run/CI — ห้ามเดาจาก fail ครั้งเดียว
- Quarantine มี owner + expiry เสมอ
- ไม่แก้ test ใน skill นี้ — ทำ routing ต่อ skill เจ้าของ fix

## Expected Outcome

- รายการ flaky tests พร้อม fail rate และหลักฐาน
- Quarantine ที่ manage ได้ (ไม่รั่วเป็น ignore ถาวร)
- ทุก finding ถูกส่งต่อ skill fix ที่ถูกต้อง
