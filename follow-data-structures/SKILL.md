---
name: follow-data-structures
description: เลือกและใช้งาน data structures ตามลักษณะข้อมูลและ operations
related:
  - follow-math-graph-theory
  - follow-math-set-theory
  - follow-math-linear-algebra
  - delete
  - follow-programming-paradigm
  - ask-me
---

## Goal

เลือกและใช้งาน data structure ทีเหมาะสมกับ access pattern และ operation requirements

## Scope

ใช้เมื่อต้องออกแบบหรือ refactor โครงสร้างข้อมูลใน project

## Execute

### 1. Analyze Data Access Patterns

> Goal: เข้าใจวิธีทีข้อมูลถูกใช้

1. ระบุ operations ทีต้องทำบ่อย (insert, delete, search, access, traverse)
2. ระบุ order ของข้อมูล (sorted, random, LIFO, FIFO)
3. ระบุ constraints (memory, performance)
4. ถ้าไม่ชัดให้ `ask-me`

### 2. Choose Data Structure

> Goal: เลือก data structure ตาม complexity ของ operations

1. ใช้ Array/Vector สำหรับ random access บ่อย
2. ใช้ Linked List ถ้า insert/delete บ่อยตรงกลาง
3. ใช้ Hash Map/Set สำหรับ lookup O(1)
4. ใช้ Tree/Balanced Tree สำหรับ sorted data และ range queries
5. ใช้ Graph สำหรับ relationship และ path finding
6. ใช้ Queue/Stack สำหรับ BFS/DFS หรือ order processing

### 3. Consider Language And Libraries

> Goal: ใช้สิ่งที ecosystem มีให้

1. ใช้ built-in types ก่อน (array, map, set, list)
2. ใช้ libraries เชื่อถือได้สำหรับ tree/graph
3. พิจารณา immutable structures ถ้า functional style
4. ทำ `/follow-programming-paradigm` ถ้าใช้ functional data structures

### 4. Implement And Encapsulate

> Goal: สร้าง abstraction ที่เหมาะสม

1. สร้าง class/type ทีซ่อน internal representation
2. ให้ methods ชัดเจนตาม operations ทีต้องการ
3. Validate invariants (เช่น sorted tree)
4. เพิ่ม unit tests

### 5. Profile And Refactor

> Goal: ตรวจสอบว่า structure ตอบสนองต่อ use case

1. วัด time ของ operations หลัก
2. เปรียบเทียบกับ alternative structure ถ้าสงสัย
3. Refactor เฉพาะทีมี evidence
4. เอกสารสาเหตุทีเลือก/เปลี่ยน

## Rules

### 1. Right Structure For Right Operation

- อย่าใช้ Array สำหรับ frequent lookup by key
- อย่าใช้ Hash Map สำหรับ sorted iteration
- พิจารณา trade-off ระหว่าง memory และ speed

### 2. Encapsulate Invariants

- ซ่อน internal state ไม่ให้ external code แก้ไขโดยตรง
- Validate ก่อน/หลัง operations ทีซับซ้อน
- ใช้ types บังคับ invariant เมื่อเป็นไปได้

### 3. Document Access Patterns

- ระบุ time complexity ของแต่ละ operation
- อธิบายทำไมถึงเลือก structure นี
- บอก limitations

- ใช้ /follow-math-graph-theory ถ้าจำเป็น
- ใช้ /follow-math-set-theory ถ้าจำเป็น
- ใช้ /follow-math-linear-algebra ถ้าจำเป็น

## Expected Outcome

- Data structure ทีเลือกเหมาะสมกับ access pattern
- Implementation encapsulated และ tested
- เอกสารครบถ้วน
- ไม่ over-engineer
