---
name: improve-resilience
description: ปรับปรุง resilience, modularity, isolation, side effects, flow, และ rate limiting
---

## Goal

ปรับปรุง resilience ของ project ให้ maintainable, testable, predictable และสามารถจัดการ load ได้ดีขึ้น

## Scope

ใช้กับ project หรือ workspace ที่ต้องการปรับปรุง modularity, isolation, side effects, workflow flow, และ rate limiting — ไม่รวมการ refactor ลึกซึ้ง (ใช้ `/refactor`)

## Execute

### 1. Analyze
> Goal: วิเคราะห์สถานะ modularity, isolation, side effects, และ rate limiting
1. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ modules ที่ tightly coupled, ขาด isolation, side effects ที่กระจัดกระจาย, และ rate limiting ที่ไม่เหมาะสม
4. ถ้าไม่พบ issues → stop และ report

### 2. Improve Isolation
> Goal: แยก modules และ responsibilities ให้ชัดเจน
1. แยก concerns: UI, business logic, data access, I/O
2. ลด coupling ระหว่าง modules ด้วย interfaces, events, หรือ dependency injection
3. หาและแก้ไข circular dependencies
4. ใช้ `/follow-best-practice` หรือ `/learn-from-web` หา patterns เฉพาะ ecosystem

### 3. Separate Pure And Impure Functions
> Goal: ทำให้ business logic pure และ side effects อยู่นอก
1. ทำ `/follow-functional-programming` เพื่อเข้าใจ pure/impure separation
2. แยก functional core ออกจาก imperative shell
3. สร้าง pure functions สำหรับ calculations, validations, transformations
4. ย้าย side effects (DB, API, file I/O, logging, timers) ไปยัง outer layer
5. ใช้ dependency injection สำหรับ impure dependencies

### 4. Manage Side Effects
> Goal: จัดการ side effects ให้ controllable
1. ลบ `console.log` ที่ไม่จำเป็น; ใช้ structured logging library
2. สร้าง service abstractions: `Clock`, `Random`, `Env`, `Logger` สำหรับ `Date`/`Math.random`
3. ใช้ Result/Either patterns สำหรับ error handling
4. ใช้ retry logic, timeout handling, resource management patterns
5. ทำให้ code test ง่ายด้วย input/output สำหรับ pure functions และ mock สำหรับ dependencies

### 5. Improve Flow
> Goal: ทำให้ workflow fail-fast ชัดเจน ลด bottleneck
1. อ่าน workflow ที่ต้องปรับปรุง พร้อม frontmatter และ `related`
2. หา validation หรือ reference check ที่ควรย้ายไปต้น (fail-fast)
3. หา hidden dependencies และ steps ที่รวมเป็น parallel batch ได้
4. ระบุ condition สำหรับทุก branch: `ถ้า X → Y`, `ถ้าไม่ X → Z`
5. เรียง steps ตาม: foundation → validation → high impact → dependencies → report/cleanup
6. ใช้ `/follow-parallel` สำหรับ independent reads/scans/searches
7. ทำ `/follow-deterministic` เพื่อตรวจสอบว่า parallel ไม่เปลี่ยนผลลัพธ์

### 6. Improve Rate Limiting
> Goal: ปรับปรุง rate limiting ให้ควบคุม load ได้
1. ใช้ `/follow-best-practice` หรือ `/learn-from-web` หา patterns สำหรับ rate limit
2. ระบุจุดที่ควรใช้ token bucket, sliding window, หรือ leaky bucket
3. แก้ไขปัญหาตาม priority: ระดับ API, middleware, service
4. ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`

### 7. Validate
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ `/run-check` เพื่อตรวจ quality pipeline
2. ทำ `/validate`
3. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)
4. ทำ `/suggest-next-action`

## Rules

### 1. Minimal Changes
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ → stop และ `/ask-me`

### 2. Separation Of Concerns
- business logic ต้องเป็น pure functions
- side effects อยู่ใน imperative shell
- แยก core จาก shell ด้วย dependency injection

### 3. Flow Quality
- fail fast: validation และ reference checks อยู่ต้น
- dependencies ชัดเจน ไม่ซ่อน ordering ด้วยคำกำกวม
- parallel ต้องไม่แชร์ mutable state
- ระบุ retry limit (max 3 → stop/report) สำหรับ recoverable failures

### 4. Deterministic
- flow เดียวกัน input เดียวกัน → ผลลัพธ์เดียวกัน
- ไม่พึ่ง execution order ของ parallel results
- ใช้ key หรือ label ระบุผลลัพธ์

### 5. Rate Limiting
- ระบุ limit ที่ชัดเจน: requests/time window/ผู้ใช้
- คง backward compatibility เมื่อปลอดภัย
- หลีกเลี่ยงการ block legitimate traffic โดยไม่จำเป็น

## Expected Outcome
- modularity, isolation ดีขึ้น
- pure functions สำหรับ business logic และ side effects ถูกจัดการ
- workflow flow fail-fast ชัดเจน ลด bottleneck
- rate limiting ดีขึ้นตาม criteria
- ไม่มี regression
- รายงานสรุปผล
