# All Files In Workspace Refactor

> Merged จาก `/refactor-all-files-in-workspace` — ใช้เมื่อ "refactor ทุกไฟล์ใน workspace เดียว" จนครบ (single workspace/package) — ไฟล์ที่ระบุ → `scope-file.md`, ทุก workspace ใน monorepo → `scope-all-workspace.md`, workspace boundaries → `/refactor-workspace`

## Goal

Refactor ทุกไฟล์ใน workspace ตาม file refactor scope ของ `/refactor` จนครบทุกไฟล์ — SRP, naming, structure, imports — โดย preserve behavior และ verify ต่อ batch

## Steps

### 1. Discover Files

1. ทำ `/deep-analyze` เพื่อดู structure และ conventions ของ workspace
2. List ไฟล์ source ทั้งหมด — respect `.gitignore`, ข้าม generated/lock/binary/test snapshots
3. จัดลำดับไฟล์: foundation ก่อน (config, types, utilities) → dependents ทีหลัง
4. ถ้าไฟล์เยอะ → spawn `refactor` profile `hotspot-scout` (`SKILL.md ## Subagents`) เก็บ evidence แทนการสแกนเอง

### 2. Baseline

1. ทำ `/check-long-files` หาไฟล์ >250 บรรทัด, `/check-code-structure` (`sg outline`) เก็บ symbol-level baseline และ `/deep-review` หา SRP/naming issues
2. บันทึก baseline: file count, structure metrics, lint/typecheck/test status — ใช้เทียบหลังจบ

### 3. Refactor Each File

1. Refactor ทีละไฟล์ตาม file refactor scope (`scope-file.md`) — read → review → minimal edit → preserve public API
2. ไฟล์อิสระกันหลายไฟล์ → spawn `refactor` profile `file-worker` ทีละไฟล์ขนานกันผ่าน `/use-subagents` — parent rewire consumers + commit รวมเสมอ
3. ไฟล์ >250 บรรทัดหรือหลาย responsibility → ใช้ `/refactor-to-srp` split → `/update-references` ทันที
4. เจอ bug หรือต้องเปลี่ยน behavior → commit fix แยกก่อน (Two Hats) แล้วค่อย refactor ต่อ
5. ทำ `/git-commit` checkpoint ทุก batch ที่สัมพันธ์กัน

### 4. Update References

1. ทำ `/update-references` สำหรับทุก rename/move/split — verify ไม่เหลือ refs เก่า
2. ถ้า broken → ทำ `/resolve-errors`

### 5. Verify

1. ทำ `/run-verify` (lint, typecheck, test, build ของ workspace)
2. ทำ `/check-code-structure` เทียบ structure metrics กับ baseline จาก step 2 — ไม่ผ่าน → กลับแก้ที่ไฟล์ที่ fail (max 3 รอบ → stop + report)

## Rules

- ทำ files ที่เป็น foundation ก่อน (config, types, utilities) — dependents ทีหลัง เพื่อ fail fast ลด rework
- อ่าน files แบบ parallel — แก้ไขแบบ sequential หรือผ่าน `file-worker` subagents ที่ scope ไม่ทับกัน
- mechanical batch (rename/pattern เดียวหลายไฟล์) → `/use-astgrep rewrite` (dry-run + confirm ก่อนเขียนทับ)
- Preserve behavior/public API เสมอ; destructive → dry run + confirm; ย้าย/ลบ → `/update-references` ทุกครั้ง
- บันทึกไฟล์ที่มีปัญหา → `/resolve-errors`; เกิน 3 รอบ → stop + report

## Expected Outcome

- ทุกไฟล์ใน workspace ผ่าน refactor ครบ — SRP ชัด, ≤250 บรรทัด, imports สะอาด
- ไม่มี broken references; ผ่าน `/run-verify`
- รายงาน before/after เทียบ baseline ครบ
