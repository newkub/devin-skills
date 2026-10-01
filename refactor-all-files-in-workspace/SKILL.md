---
name: refactor-all-files-in-workspace
description: Refactor ทุกไฟล์ใน workspace จนครบ — SRP, naming, structure ทีละไฟล์พร้อม verify
argument-hint: "[workspace-path | glob]"
related:
  - refactor
  - all-files
  - refactor-all-workspace
  - refactor-workspace
  - check-long-files
  - deep-review
  - update-references
  - run-verify
  - resolve-errors
  - use-subagents

---

## Goal

Refactor ทุกไฟล์ใน workspace (single workspace/package) ตาม file refactor scope ของ `/refactor` จนครบทุกไฟล์ — SRP, naming, structure, imports — โดย preserve behavior และ verify ต่อ batch

## Scope

ใช้เมื่อ context คือ "refactor ทุกไฟล์ใน workspace เดียว" หรือ `/refactor` dispatch มา — ทุก workspace ใน monorepo → `/refactor-all-workspace`; ไฟล์ที่ระบุ → `/refactor` file scope; workspace boundaries → `/refactor-workspace`

## Execute

### 1. Discover Files

> Goal: ได้รายการไฟล์ทั้งหมดใน workspace ที่ต้อง refactor

1. ทำ `/deep-analyze` เพื่อดู structure และ conventions ของ workspace
2. List ไฟล์ source ทั้งหมดด้วย `find_file_by_name`/`list_dir` — respect `.gitignore`, ข้าม generated/lock/binary/test snapshots
3. จัดลำดับไฟล์: foundation ก่อน (config, types, utilities) → dependents ทีหลัง
4. ถ้าไฟล์เยอะ → spawn `refactor/subagents/hotspot-scout.md` เก็บ evidence แทนการสแกนเอง

### 2. Baseline

> Goal: มี baseline ก่อนลงมือ

1. ทำ `/check-long-files` หาไฟล์ >250 บรรทัด และ `/deep-review` หา SRP/naming issues
2. บันทึก baseline: file count, lint/typecheck/test status — ใช้เทียบหลังจบ

### 3. Refactor Each File

> Goal: ทุกไฟล์ผ่าน file refactor ครบ

1. Refactor ทีละไฟล์ตาม file refactor scope ของ `/refactor` — read → review → minimal edit → preserve public API
2. ไฟล์อิสระกันหลายไฟล์ → spawn `refactor/subagents/file-worker.md` ทีละไฟล์ขนานกันผ่าน `/use-subagents` — parent rewire consumers + commit รวมเสมอ
3. ไฟล์ >250 บรรทัดหรือหลาย responsibility → ใช้ `/refactor` `### /refactor-to-srp` split → `/update-references` ทันที
4. เจอ bug หรือต้องเปลี่ยน behavior → commit fix แยกก่อน (Two Hats) แล้วค่อย refactor ต่อ
5. ทำ `/git-commit` checkpoint ทุก batch ที่สัมพันธ์กัน

### 4. Update References

> Goal: ไม่มี broken references

1. ทำ `/update-references` สำหรับทุก rename/move/split — verify ไม่เหลือ refs เก่า
2. ถ้า broken → ทำ `/resolve-errors`

### 5. Verify

> Goal: refactor ผ่านทั้ง workspace

1. ทำ `/run-verify` (lint, typecheck, test, build ของ workspace)
2. เทียบ baseline จาก step 2 — ไม่ผ่าน → กลับแก้ที่ไฟล์ที่ fail (max 3 รอบ → stop + report)

## Rules

### 1. Processing Order

- ทำ files ที่เป็น foundation ก่อน (config, types, utilities) — dependents ทีหลัง เพื่อ fail fast ลด rework

### 2. Batch Operations

- อ่าน files แบบ parallel — แก้ไขแบบ sequential หรือผ่าน `file-worker` subagents ที่ scope ไม่ทับกัน
- mechanical batch (rename/pattern เดียวหลายไฟล์) → `/use-astgrep rewrite` (dry-run + confirm ก่อนเขียนทับ)

### 3. Safety

- Preserve behavior/public API เสมอ; destructive → dry run + confirm; ย้าย/ลบ → `/update-references` ทุกครั้ง
- บันทึกไฟล์ที่มีปัญหา → `/resolve-errors`; เกิน 3 รอบ → stop + report

## Expected Outcome

- ทุกไฟล์ใน workspace ผ่าน refactor ครบ — SRP ชัด, ≤250 บรรทัด, imports สะอาด
- ไม่มี broken references; ผ่าน `/run-verify`
- รายงาน before/after เทียบ baseline ครบ
