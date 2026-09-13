---
name: update-tests-update-snapshot
description: Regenerate/review snapshots อย่างปลอดภัย — diff ทุก snapshot ก่อน accept
argument-hint: "[scope-or-test-file]"
related:
  - update-tests
  - run-test

  - follow-tool-vitest
  - resolve-errors
  - report-before-after
---

## Goal

อัปเดต test snapshots (inline, file, visual) หลัง output เปลี่ยนอย่างตั้งใจ — review diff ทุก snapshot ก่อน accept ไม่ blind-update

## Scope

- ใช้เมื่อ output/markup/serialization เปลี่ยนทำให้ snapshot tests fail
- ครอบคลุม: serializer snapshots (Vitest/Jest), component snapshots, visual snapshots
- unit tests ทั่วไป → `subskills/update-unit/SKILL.md`; e2e → `subskills/update-e2e/SKILL.md`

## Execute

### 1. Collect Snapshot Failures

> Goal: รู้ว่า snapshot ไหน fail และทำไม

1. รัน `/run-test` — เก็บ snapshot mismatches ทั้งหมด
2. map แต่ละ mismatch กับ code change — intended change vs unintended regression
3. แยกชัด: snapshot ล้าสมัย (accept ได้) vs output เสียจริง (fix code แยก)

### 2. Review Diffs Before Accept

> Goal: accept เฉพาะ changes ที่ตั้งใจ

1. อ่าน diff ของทุก snapshot ที่จะ update — ทีละไฟล์ ไม่ mass-accept
2. ตรวจว่า diff ตรงกับ intended change เท่านั้น — keys เพิ่ม/หาย, ordering, whitespace, ids/timestamps ที่ไม่ deterministic
3. ถ้า diff มีค่าที่ไม่ deterministic → แก้ test ให้ serialize เสถียร (mock time/ids) ก่อน snapshot ใหม่

### 3. Regenerate

> Goal: snapshots ใหม่สะอาดและ deterministic

1. regenerate ด้วย update flag ของ runner ที่ project ใช้ (เช่น `vitest -u`, `jest -u`) — เฉพาะ scope ที่ review แล้ว
2. visual snapshots → อัปเดตผ่าน `/run-test` แล้ว review ภาพ diff ทีละภาพ
3. ลบ snapshot files ที่ orphan (test ถูกลบแต่ snapshot เหลือ)

### 4. Verify

> Goal: suite เขียวและ snapshots มีเสถียรภาพ

1. `/run-test` ผ่าน แล้วรันซ้ำ 2-3 ครั้ง — snapshots ต้อง match เดิมทุกครั้ง
2. git diff snapshot files — ครบเท่าที่ review ไว้ ไม่มีการเปลี่ยนแปลงเกิน
3. `/report-before-after` — snapshots updated/removed, intended changes ที่ยืนยัน

## Rules

- ห้าม blind `-u` ทั้ง suite — review diff ทุก snapshot ก่อน accept
- snapshots ต้อง deterministic — ไม่มี timestamps, random ids, env-dependent values
- ห้าม accept diff ที่ไม่ตรง intended change — flag เป็น regression แยก
- snapshot ใหญ่เกินจน review ไม่ได้ → แนะนำแยก assertions แทนใน report
- fix-verify loop สูงสุด 3 รอบ → ถ้าไม่ผ่าน stop และ report

## Expected Outcome

- snapshots ตรงกับ intended output ใหม่ — ไม่มี unintended diffs หลุดเข้าไป
- suite ผ่าน deterministic, ไม่มี orphan snapshot files
- report สรุป snapshots ที่ accept/ลบ พร้อม regressions ที่ flag

