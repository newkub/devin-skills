---
name: implement-all
description: ตรวจสอบ implementation completeness ของ areas ที่ review พบ และแปลง TODO, MOCK, FAKE, STUB,
---

## Goal

ตรวจสอบ implementation completeness ของ areas ที่ review พบ และแปลง TODO, MOCK, FAKE, STUB, placeholder เป็น production code

## Scope

ใช้หลัง `review-*` workflows เพื่อ verify ว่า findings ที่พบสามารถ implement ได้จริง — ไม่ใช่ full codebase review เหมือน `/realize-implementation` แต่ focused เฉพาะ areas ที่ review ครอบคลุม

## Execute

### 1. Identify Incomplete Implementations

> Goal: ระบุ TODO, MOCK, FAKE, STUB, placeholder ใน areas ที่ review

1. รวบรวม findings จาก review ที่ระบุ incomplete implementations
2. ทำ `/scan-codebase`, ทำ `/deep-analyze` — ค้นหา TODO, MOCK, FAKE, STUB, placeholder ใน scope ที่ review
3. จัดลำดับตาม critical path: schema → data → API → UX/UI

### 2. Convert Incomplete To Production

> Goal: แปลง incomplete implementations เป็น production code

1. ทำ `/implement-comment-todo`, `/implement-mock`, `/implement-todo-md` — แปลง TODO comments, mock implementations, และ TODO markdown เป็น production code
2. ถ้าพบ missing features → ทำ `/implement-features-to-mvp` เพื่อ implement MVP features
3. ถ้าแปลง fail ให้ทำ `/resolve-errors` ก่อนดำเนินต่อ

### 3. Verify And Report

> Goal: ตรวจสอบว่าไม่มี incomplete implementations เหลือ และรายงานผล

1. ทำ `/update-review-cli-and-run` เพื่อ verify ว่าไม่มี incomplete implementations เหลือใน scope
2. ถ้าพบ incomplete implementations ใหม่ → กลับไปทำ Step 2 (max 3 → stop/report)
3. ทำ `/report-table` เพื่อรายงาน items ที่แปลงเป็น production code
4. ทำ `/suggest-next-action`

## Rules

### 1. Scope Limitation

- ทำเฉพาะใน scope ที่ review ครอบคลุม — ไม่ขยายไปทั้ง codebase
- ถ้าพบ incomplete implementations นอก scope → ระบุเป็น info เท่านั้น

### 2. No Mock In Production

- ไม่มี mock implementations ใน production code — แทนที่ทุก mock data ด้วย real data queries
- UX/UI components ต้องใช้ real API calls ไม่ใช่ hardcoded data

### 3. Error Handling

- ถ้าแปลง incomplete implementation fail ให้ทำ `/resolve-errors` ก่อน
- ถ้าแก้ไม่ได้หลัง retry 3 ครั้ง → stop และ report

## Expected Outcome

- ไม่มี TODO, MOCK, STUB, placeholder เหลือใน scope ที่ review
- รายงานตาราง items ที่แปลงเป็น production code
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
