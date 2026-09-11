---
name: optimize-deps
description: Optimize dependencies — dedupe, prune unused, audit vulnerabilities, update ตาม review-dependencies
argument-hint: "[scope]"
related:
  - review-dependencies
  - run-audit
  - check-unused
  - check-supply-chain
  - research-dependencies
  - run-check
  - run-test
  - report
  - suggest-next-action
---

## Goal

ทำ dependencies ให้สะอาดและปลอดภัย — ลบ unused, dedupe versions, patch vulnerabilities, update stale packages — ตาม findings จาก `/review-dependencies` และ `/run-audit`

## Scope

ใช้เมื่อ dependencies รก ใหญ่ หรือมี vulnerabilities — apply changes จริงไม่ใช่แค่ report

- ถ้าต้องการเลือก dep ใหม่ → `/research-dependencies` ก่อน
- ถ้า supply-chain risk → `/check-supply-chain`

## Execute

### 1. Collect Findings

> Goal: รู้ว่าต้องแก้อะไร

1. ทำ `/review-dependencies` + `/run-audit` หรืออ่าน findings เดิม
2. จัดกลุ่ม: unused deps, duplicate versions, vulnerable packages, stale/outdated, misplaced (dev vs prod)

### 2. Remove Unused Dependencies

> Goal: ลบ deps ที่ไม่ถูกใช้

1. หา unused ด้วย tools ตาม ecosystem (`knip`, `depcheck`, `bun pm ls` + import scan, cargo-udeps) หรือทำ `/check-unused`
2. ระวัง false positives — config files, plugins, peer deps, scripts references
3. ลบทีละกลุ่ม แล้ว `/run-check` + `/run-test` ยืนยันก่อนกลุ่มถัดไป

### 3. Dedupe And Consolidate

> Goal: version เดียวต่อ package เท่าที่ทำได้

1. หา duplicate versions ใน lockfile — dedupe ด้วย package manager (`bun pm dedupe`, `npm dedupe`, resolutions/overrides)
2. conflicting versions ที่ dedupe ไม่ได้ → align ไป version ร่วม
3. overlapping libraries (2 date libs, 2 HTTP clients) → เสนอ consolidate เป็นตัวเดียว

### 4. Fix Vulnerabilities

> Goal: audit ผ่านหรือเหลือเฉพาะ accepted risk

1. Critical/High → upgrade/patch ทันที ตาม audit advisory
2. ถ้า fix ต้อง major upgrade ที่ break → document risk + วาง migration plan
3. transitive deps ที่ fix ไม่ได้ → overrides/resolutions พร้อม verify

### 5. Update Stale Packages

> Goal: deps ทันสมัยโดยไม่ break

1. patch/minor updates → batch update แล้ว `/run-test`
2. major updates → ทีละตัว, อ่าน changelog, แยก commit
3. ห้าม auto-update ไป version ที่เพิ่ง publish <7 วัน (supply-chain hygiene)

### 6. Verify

> Goal: project ทำงานเหมือนเดิม

1. clean install ใหม่ — lockfile regenerate ถูกต้อง
2. `/run-check` + `/run-test` + build ผ่าน
3. bundle size/runtime ไม่ regression

### 7. Report

> Goal: ส่งมอบ

1. ทำ `/report` — removed, deduped, patched, updated พร้อม size/count deltas
2. ระบุ accepted risks (vulns ที่ยังไม่มี fix) + recommendations
3. ทำ `/suggest-next-action`

## Rules

### 1. Incremental With Tests

- เปลี่ยน deps ทีละกลุ่ม — test ระหว่างทาง ไม่ทำพร้อมกันหมด
- ทุก removal ต้องผ่าน `/run-check` + `/run-test` ก่อนไปต่อ

### 2. Verify Unused Claims

- ห้ามลบ dep เพราะ tool บอก unused อย่างเดียว — grep imports, configs, scripts, plugins ก่อน
- peer/optional deps ต้องตรวจ consumers

### 3. Supply Chain Hygiene

- pin versions ไม่ใช่ floating (`latest`, `*`) สำหรับ deps ใหม่
- version ใหม่ต้อง publish มาแล้ว ≥7 วัน เว้นแต่ security patch
- ห้ามเพิ่ม dep ใหม่ใน skill นี้โดยไม่จำเป็น

### 4. Lockfile Integrity

- lockfile ต้อง regenerate สะอาด — ไม่ hand-edit
- ไม่แก้ `.npmrc`/security configs เพื่อผ่าน audit

## Expected Outcome

- unused deps ถูกลบโดยไม่ break, lockfile สะอาด
- vulnerabilities ถูก patch หรือมี documented accepted risk
- duplicates deduped, stale packages updated ตามความปลอดภัย
- tests/build ผ่านทั้งหมด
