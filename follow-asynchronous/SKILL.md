---
name: follow-asynchronous
description: ใช้งาน async patterns ใน JavaScript/TypeScript ให้ถูกต้อง
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
---

## Goal

ใช้งาน asynchronous operations ใน JavaScript/TypeScript ให้ถูกต้อง อ่านง่าย และ maintain ได้

## Scope

ใช้กับโค้ด JS/TS ทีต้องจัดการ async/await, Promises, callbacks, event loop และ concurrency

## Execute

### 1. Identify Async Pattern

> Goal: ระบุลักษณะของงานทีต้องทำ
> Goal: เลือก pattern ทีเหมาะสม

1. ดูว่า tasks เป็น sequential, parallel หรือ race condition
2. ตรวจสอบ dependencies ระหว่าง tasks
3. ระบุว่าจำเป็นต้อง cancel/retry/timeout หรือไม
4. ถ้าไม่ชัดให้ `ask-me`

### 2. Choose The Right Primitive

> Goal: เลือก API ทีเหมาะสมกับงาน
> Goal: ใช้ primitive ทีถูกต้อง

1. `async/await` สำหรับ sequential flow ทั่วไป
2. `Promise.all` เมื่อต้องการ parallel และทุก task ต้องสำเร็จ
3. `Promise.allSettled` เมื่อต้องการรู้ผลทุก task แม้บางอัน fail
4. `Promise.race` สำหรับ timeout หรือ first-responder
5. `AbortController` สำหรับ cancelation

### 3. Implement Error Handling

> Goal: จัดการ error ใน async flow
> Goal: ไม่มี unhandled rejection และ error สามารถ trace ได้

1. ใช้ `try/catch` รอบ `await` หรือ `.catch()` สำหรับ Promise
2. สร้าง custom error class ถ้าต้องการ context เพิ่ม
3. ใช้ `Promise.allSettled` แล้ว filter rejected ถ้าต้องการ handle partial failure
4. หลีกเลี่ยง throw ใน `.forEach` หรือ callbacks ที่ไม่มี await

### 4. Optimize Concurrency

> Goal: ควบคุมจำนวน concurrent operations
> Goal: ได้ประสิทธิภาพทีเหมาะสม

1. ใช้ `p-limit` หรือ `AsyncPool` ถ้าต้องการ limit concurrency
2. ใช้ queues สำหรับ backpressure
3. ระวัง connection pool / rate limits
4. ใช้ `Promise.all` เฉพาะทีจำเป็นจริงๆ

### 5. Test Async Code

> Goal: เขียน test สำหรับ async flow
> Goal: มั่นใจว่า async code ทำงานถูกต้อง

1. ใช้ `async/await` ใน test
2. Mock timers ถ้าต้องทดสอบ timeout/debounce
3. ตรวจสอบ rejections ด้วย `rejects.toThrow()`
4. รัน `run-test` เพื่อ verify

## Rules

### 1. Avoid Callback Hell

- ใช้ `async/await` แทน nested callbacks
- ถ้าต้องใช้ callbacks ให้ใช้ named functions หรือ Promise wrapper
- หลีกเลี่ยง `.then().then().catch()` chains ลึกๆ

### 2. Always Handle Rejections

- ทุก Promise ต้องมี `.catch()` หรือ `try/catch`
- ไม่ปล่อย unhandled promise rejection
- Log error ที่จุดทีถูกต้อง

### 3. Be Explicit About Concurrency

- ระบุว่า operations ทำงาน sequential หรือ parallel
- ใช้ `Promise.all` อย่างระมัดระวังกับ I/O ที่มากเกินไป
- Document สาเหตุทีเลือก pattern นัน

## Expected Outcome

- Async code อ่านง่ายและ maintain ได้
- ไม่มี callback hell หรือ unhandled rejection
- Concurrency ถูกควบคุม
- ผ่าน test และ typecheck
