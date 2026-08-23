---
name: optimize-io
description: ปรับปรุง io, storage และ serialization ของ project
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - optimize-codebase
  - validate
---

## Goal

ปรับปรุง io, storage, serialization ของ project ให้เร็ว ปลอดภัย และ scale ได้

## Scope

ใช้กับ file I/O, disk I/O, network I/O, serialization, storage formats, หรือ data persistence ใน project หรือ workspace

## Execute

### 1. Detect IO Context
> Goal: เข้าใจ io stack และปัญหา
1. อ่าน `package.json`, `Cargo.toml`, หรือ manifest ที่เกี่ยวข้อง
2. ระบุ patterns: file I/O, database I/O, network I/O, cache, queues
3. ทำ /scan-codebase เพื่อหา issues ที่เกี่ยวข้อง
4. ทำ /review-codebase เพื่อรายละเอียดเพิ่ม
5. ถ้าไม่พบ issues → stop และ report

### 2. Optimize File And Storage IO
> Goal: ลด latency และขนาดข้อมูล
1. ใช้ streaming แทน loading ทั้งหมดลง memory
2. ลด synchronous file operations
3. ใช้ appropriate storage format (binary, compressed, columnar)
4. ตรวจสอบ disk quotas, temp files, log rotation

### 3. Optimize Serialization
> Goal: ลด serialization cost
1. ตรวจสอบ serialization formats: JSON, MessagePack, Protobuf, Avro
2. เลือก format ทีเหมาะกับ use case (size, speed, schema)
3. ลด unnecessary fields, circular structures, duplicate serialization
4. ใช้ schema validation ถ้าจำเป็น

### 4. Optimize Network And Database IO
> Goal: ลด round trips และ blocking
1. ใช้ connection pooling, keep-alive, batching
2. ใช้ /optimize-database ถ้า database เป็นปัญหา
3. ใช้ /optimize-network ถ้า API/network เป็นปัญหา
4. แบ่งงานหนักออกเป็น async/streaming

### 5. Validate
> Goal: ยืนยันว่า io ปรับปรุงแล้วดีขึ้น
1. ทำ /validate และ /run-check
2. รัน benchmark เปรียบเทียบ before/after
3. ถ้าไม่ผ่าน → ทำ /resolve-errors แล้ว retry (max 3)
4. สรุปผลด้วย /report และ /suggest-next-action

## Rules

### 1. Minimal Changes
- แก้เฉพาะสิ่งที่วัดผลได้ว่าดีขึ้น
- ไม่เปลี่ยน storage format หลักโดยไม่ได้รับการยืนยัน
- ถ้าไม่แน่ใจ → ทำ /ask-me

### 2. Safety First
- สำรอง data ก่อนเปลี่ยน storage format
- ทำ dry run กับ io migrations

### 3. Evidence Based
- ใช้ benchmarks, throughput, latency metrics ก่อน/หลัง
- ไม่อ้างว่างานเสร็จถ้า validation ไม่ผ่าน

## Expected Outcome

- io เร็วขึ้น ลด latency หรือ throughput สูงขึ้น
- ไม่มี data loss หรือ regression
- รายงานสรุป before/after และ next action
