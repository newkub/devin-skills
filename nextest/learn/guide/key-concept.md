---
title: Key Concepts
description: แนวคิดหลักของ cargo-nextest
---

## Core Concepts

### 1. Parallel Execution

nextest รัน tests แบบ parallel โดย default ซึ่งเร็วกว่า cargo test ที่รัน sequential

### 2. Smart Test Selection

- รันเฉพาะ tests ที่เกี่ยวข้องกับ code ที่เปลี่ยน
- ใช้ dependency graph สำหรับ optimize test order

### 3. Test Caching

- cache test results สำหรับ tests ที่ไม่ได้เปลี่ยน
- skip tests ที่ pass แล้วถ้า code ไม่เปลี่ยน

### 4. Better Output

- formatted output ที่อ่านง่าย
- color-coded results
- progress bars

### 5. Integration

- ทำงานร่วมกับ cargo-llvm-cov สำหรับ coverage
- compatible กับ cargo test ทั่วไป
