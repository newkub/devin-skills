---
name: optimize-memory
description: ปรับปรุง memory usage: leaks, large objects, caches, garbage collection
argument-hint: "[component-or-worker]"
related:
  - report-table
---

## Goal

ปรับปรุง memory usage: ลด leaks, จัดการ large objects, cache size, garbage collection pressure

## Scope

ใช้กับ frontend, backend, workers โดย measure heap และ optimize

## Execute

### 1. Measure Memory

> Goal: Measure Memory

1. ใช้ DevTools Memory panel
2. ใช้ `process.memoryUsage()` บน Node
3. บันทึก heap snapshot
4. ระบุ leaks และ large objects

### 2. Fix Memory Leaks

> Goal: Fix Memory Leaks

1. ลบ event listeners ทีไม่ใช้
2. Clear timers/intervals
3. Unsubscribe observables
4. ใช้ `WeakRef` หรือ `WeakMap` ถ้าเหมาะสม

### 3. Optimize Caches

> Goal: Optimize Caches

1. ตั้ง cache size limits
2. ใช้ TTL สำหรับ cache entries
3. ใช้ LRU cache
4. ตรวจ duplicate caches

### 4. Reduce Large Objects

> Goal: Reduce Large Objects

1. ไม่เก็บ full dataset ใน memory
2. ใช้ pagination
3. Stream data แทน buffer
4. ลด serialization overhead

### 5. Validate

> Goal: Validate

1. วัด memory ใหม่
2. รัน `/run-test`
3. ทำ `/report-table` สรุป

## Rules

- Measure ก่อน optimize
- ไม่ micro-manage GC
- ใช้ cache limits

## Expected Outcome

- Memory usage ลดลง
- Leaks ลดลง
- GC pressure ลดลง
