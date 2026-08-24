---
name: follow-parallel
description: รวม independent operations เป็น parallel execution เพื่อลดเวลาและเพิ่ม efficiency
---

## Goal

รวม independent operations เป็น parallel execution เพื่อลดเวลา total execution time และเพิ่ม efficiency โดยไม่ทำลาย deterministic และ safety

## Scope

ใช้สำหรับจัดการ parallel execution ใน 3 ระดับ: tool calls, script execution, และ workflow orchestration — ไม่ครอบคลุม concurrent programming ใน application code (ใช้ `/follow-concurrent-programming`)

## Execute

### 1. Identify Parallelizable Operations

> Goal: วิเคราะห์ operations ที่สามารถทำ parallel ได้
> Goal: รู้ว่า operations ไหนทำ parallel ได้และไหนต้อง sequential

1. จัดกลุ่ม operations เป็น independent sets — แต่ละ set ไม่มี data dependency กัน
2. ระบุ dependencies: ถ้า operation B ต้องใช้ผลจาก operation A → sequential
3. ระบุ side effects: ถ้า operations แชร์ mutable state หรือ resource → sequential
4. ระบุ read-only operations: อ่านไฟล์, ค้นหา, สแกน → parallel ได้
5. ระบุ write operations: แก้ไขไฟล์, สร้างไฟล์ → sequential ถ้าเขียนไฟล์เดียวกัน

### 2. Batch Tool Calls

> Goal: รวม independent tool calls เป็น parallel batch
> Goal: ลดจำนวนรอบและ context accumulation

1. รวม independent `read_file` calls เป็น batch เดียว — อ่านหลายไฟล์พร้อมกัน
2. รวม independent `grep_search` calls เป็น batch เดียว — ค้นหาหลาย patterns พร้อมกัน
3. รวม independent `find_by_name` calls เป็น batch เดียว — ค้นหาหลาย patterns พร้อมกัน
4. รวม independent `run_command` calls เป็น batch เดียว — รันคำสั่งที่ไม่มี dependency พร้อมกัน
5. ถ้า tool call B ต้องใช้ผลจาก tool call A → แยกเป็น sequential ไม่ batch

### 3. Parallel Script Execution

> Goal: ใช้ `Promise.all` และ `Promise.allSettled` ใน scripts สำหรับ parallel data processing
> Goal: Script ประมวลผลข้อมูลหลาย sources พร้อมกัน

1. ใช้ `Promise.all` เมื่อทุก operation ต้องสำเร็จ — ถ้าตัวใดตัวหนึ่ง fail ทั้งหมด fail
2. ใช้ `Promise.allSettled` เมื่อต้องเก็บผลทั้งสำเร็จและ fail — แต่ละ operation อิสระ
3. ใช้ `Bun.$` template literals สำหรับ parallel shell commands: `await Promise.all([await $`cmd1`, await $`cmd2`])`
4. ใช้ `Bun.spawn` สำหรับ parallel subprocesses พร้อมเก็บ exit codes
5. จำกัด concurrency ด้วย simple pool pattern เมื่อ operations >10 เพื่อไม่กิน resource

### 4. Parallel Workflow Orchestration

> Goal: รัน independent workflows แบบ parallel ใน orchestrator workflows
> Goal: Orchestrator รัน sub-workflows ที่ independent พร้อมกัน

1. ระบุ sub-workflows ที่ independent — ไม่มี data dependency กัน
2. รัน independent sub-workflows พร้อมกัน เช่น `/review-quality`, `/check-unused-files`, `/check-unused-deps`
3. รัน dependent sub-workflows แบบ sequential เช่น `/validate` หลัง `/review-*`
4. รวบรวม results จากทุก sub-workflow ก่อน aggregate report
5. ถ้า sub-workflow หนึ่งพบ critical issue → หยุดและ validate ก่อนดำเนินต่อ

### 5. Verify And Report

> Goal: ตรวจสอบผลลัพธ์และรายงาน
> Goal: ผลลัพธ์ครบถ้วน ถูกต้อง ไม่มี missing results

1. ตรวจว่าทุก parallel operation มีผลลัพธ์ครบ — ไม่มี operation ที่หายไป
2. ตรวจ errors จาก `Promise.allSettled` — แยก fulfilled และ rejected
3. ถ้ามี rejected operations → ระบุสาเหตุและ retry หรือ report
4. ทำ `/report-table` สรุปผลลัพธ์เป็นตาราง
5. ระบุใน report ว่า operations ไหนรัน parallel และใช้เวลาเท่าไหร่

## Rules

### 1. When To Parallelize

- independent read operations, independent searches, independent scans, independent checks
- operations ที่ไม่แชร์ mutable state หรือ resource
- Sequential: operation B ต้องใช้ผลจาก operation A
- Sequential: operations ที่เขียนไฟล์เดียวกันหรือแก้ไข state เดียวกัน
- Sequential: operations ที่มี ordering requirement เช่น build ก่อน test

### 2. Error Handling

- `Promise.all`: ถ้าตัวใดตัวหนึ่ง reject ทั้งหมด reject — ใช้เมื่อทุกตัวต้องสำเร็จ
- `Promise.allSettled`: ทุกตัว complete ไม่ว่าจะสำเร็จหรือ fail — ใช้เมื่อต้องเก็บผลทั้งหมด
- ตรวจ `result.status` เป็น `fulfilled` หรือ `rejected` จาก `Promise.allSettled`
- ถ้า parallel operation fail → retry ครั้งเดียว ถ้ายัง fail → report และ continue หรือ stop ตาม severity
- ไม่ซ่อน errors จาก parallel operations — รายงานทุก failure

### 3. Concurrency Limits

- จำกัด parallel operations ไม่เกิน 10 ต่อ batch เพื่อไม่กิน resource
- ถ้า operations >10 → แบ่งเป็น batches หรือใช้ pool pattern
- ใช้ `BUN_CONFIG_MAX_HTTP_REQUESTS` สำหรับจำกัด concurrent HTTP requests
- ตรวจสอบ rate limits ของ external APIs ก่อน parallel calls

### 4. Deterministic Guarantees

- ผลลัพธ์จาก parallel execution ต้องเหมือนกับ sequential execution — แค่เร็วกว่า
- ไม่พึ่งพา ordering ของ parallel results — ใช้ key หรือ label ระบุผลลัพธ์
- ถ้าผลลัพธ์ต้องเรียงลำดับ → sort หลังรวบรวม ไม่พึ่งพา execution order
- Parallel execution ไม่สร้าง side effects ซ้ำ — แต่ละ operation ทำงานอิสระ

### 5. High Impact Content

- รวม independent tool calls เป็น parallel เสมอเมื่อเป็นไปได้ — ลด context accumulation
- ระบุ parallelizable tasks ใน `/deep-plan` และ `/report-plan`
- ใช้ parallel execution ใน `/run-check` สำหรับ lint, typecheck, scan
- ไม่ parallelize operations ที่มี dependencies โดยไม่จำเป็น

## Expected Outcome

- Independent operations รัน parallel ลด total execution time
- Tool calls ถูก batch ลดจำนวนรอบและ context accumulation
- Scripts ใช้ `Promise.all` และ `Promise.allSettled` อย่างถูกต้อง
- Errors จาก parallel operations ถูกรายงานครบถ้วน
- ผลลัพธ์ deterministic — parallel และ sequential ให้ผลเหมือนกัน
