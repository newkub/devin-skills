---
name: improve-correctness
description: ตรวจสอบและปรับปรุงความถูกต้อง, type safety, และ test coverage ของ code, config, rules, หรือ skills
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - find_file_by_name
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - check-reference
  - report-table
  - resolve-errors
  - suggest-next-action
  - use-scripts
  - validate
---

## Goal

ตรวจสอบและปรับปรุงความถูกต้องของเป้าหมายที่ระบุ รวมถึง type safety และ test coverage โดยใช้ tools หรือ scripts หาปัญหาก่อนแก้ไข

## Scope

ใช้สำหรับ code, configuration, rule files, workflows, หรือ skills ที่ต้องตรวจสอบความถูกต้องตาม criteria, standards, หรือ requirements ที่ระบุ — รวมถึง TypeScript type safety และ test coverage

## Execute

### 1. Gather Criteria
> Goal: รวบรวม criteria และ context ที่ใช้ตรวจสอบ
1. อ่าน requirements, rules, standards ที่ user ระบุ
2. ถ้าเป็น skill → อ่าน `global_rules.md` และ skill conventions
3. ระบุ criteria ที่ concrete และ measurable
4. ถ้า criteria ไม่ชัด → stop และ `/ask-me`

### 2. Detect Issues
> Goal: ค้นหาปัญหาด้วย tools หรือ scripts
1. ใช้ `read`, `grep`, `glob` เพื่อ scan ไฟล์ที่เกี่ยวข้อง
2. ใช้ `exec` รัน commands ที่ตรวจสอบได้ (เช่น `git diff --check`, `bun run lint`, `bun run typecheck`)
3. ถ้าต้อง scan ซับซ้อน → ทำ `/use-scripts` เพื่อเขียน temporary script ตรวจ
4. บันทึก issues พร้อม evidence (ไฟล์, บรรทัด, output)

### 3. Prioritize
> Goal: จัดลำดับ issues ก่อนแก้ไข
1. แบ่ง severity: Critical, High, Medium, Low
2. เรียง Critical → High → Medium → Low
3. ถ้า issues มาก > 20 → ทำ `/report-table` หรือ `/report-plan`
4. ขอ user confirm ก่อนแก้ถ้ามี high-impact หรือ destructive changes

### 4. Fix Issues
> Goal: แก้ไข issues ตาม priority
1. แก้ไขปัญหาแต่ละข้อด้วย `edit` หรือ `write`
2. ทดสอบแก้ไขด้วยคำสั่งหรือ script ที่เหมาะสม
3. ถ้าพบปัญหาใหม่ระหว่างแก้ → บันทึกและจัดลำดับใหม่
4. ไม่แก้ไขนอก scope โดยไม่รายงาน

### 5. Improve Type Safety
> Goal: ลด type issues และเพิ่ม strictness
1. รัน `tsc --noEmit` และ scan หา `any`, `as`, non-null assertions, `@ts-ignore`, `@ts-expect-error`
2. แทน `any` ด้วย `unknown` + type narrowing หรือ specific types
3. ลบ `as` assertions ที่ไม่จำเป็น, ใช้ type guards หรือ proper definitions แทน
4. ลบ `@ts-ignore` และ `@ts-expect-error` — แก้ root cause แทนการ suppress
5. เพิ่ม `tsconfig.json` strict options ทีละ option พร้อมแก้ errors ก่อนเพิ่มถัดไป

### 6. Improve Test Coverage
> Goal: ปิด gap ของ critical paths, error paths, และ edge cases
1. รัน `bun run test:coverage` เพื่อหา untested paths
2. เขียน unit/integration tests สำหรับ critical paths ที่ขาด
3. เขียน tests สำหรับ error paths: invalid input, network errors, timeout, permission denied
4. เขียน tests สำหรับ edge cases: empty, boundary, null/undefined, concurrency
5. ทุก test ต้อง isolated, มี clear assertion, ใช้ชื่อ descriptive

### 7. Verify
> Goal: ตรวจสอบว่าแก้ไขแล้วถูกต้อง
1. รัน checks เดิมซ้ำเพื่อ verify
2. ทำ `/check-reference` เพื่อตรวจ references
3. ทำ `/validate` ถ้าเป็น skill หรือ workflow
4. ถ้ายังพบ issues → กลับไป Execute 4-6 (max 3 รอบ)

### 8. Report
> Goal: สรุปผลการปรับปรุง
1. ใช้ `/report-table` สรุป issues ที่พบและแก้ไข
2. ระบุ issues ที่ยังเหลือ (ถ้ามี) พร้อมเหตุผล
3. ทำ `/suggest-next-action` เพื่อแนะนำ next action

## Rules

### 1. Evidence First
- ห้ามเดา issues โดยไม่มี evidence
- ทุก issue ต้องระบุไฟล์ บรรทัด หรือ output
- ใช้ tools หรือ scripts ก่อน manual inspection

### 2. Type And Test Quality
- ไม่มี `any` ใน production code — ใช้ `unknown` + narrowing แทน
- ไม่ใช้ `@ts-ignore` หรือ `@ts-expect-error` โดยไม่จำเป็น
- ทุก test มี clear assertion, isolated, และมี value จริง
- แก้ critical paths ก่อน edge cases

### 3. Scope Control
- แก้ไขเฉพาะ issues ใน scope ที่ระบุ
- ถ้าพบ issues นอก scope → รายงาน ไม่แก้โดยไม่ได้รับอนุญาต
- ไม่ลบหรือ overwrite ไฟล์โดยไม่มี dry run

### 4. Safety
- ทำ dry run ก่อน destructive fixes
- ถ้าแก้ไข > 10 ไฟล์ หรือ > 250 บรรทัด → ใช้ `/use-scripts`
- ไม่แก้ security policies, credentials, หรือ compliance controls

## Expected Outcome
- หา issues ตาม criteria ได้ครบถ้วนด้วย tools หรือ scripts
- แก้ไข issues ตาม priority และ verify ผ่าน
- Type safety และ test coverage ดีขึ้น
- References และ links ทั้งหมดถูกต้อง
- รายงานผล พร้อม issues ที่เหลือ (ถ้ามี)
