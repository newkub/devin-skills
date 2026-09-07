# Fix Guide

(merged from: optimize-serialization)

## Goal

ลด serialization cost — response payload size, serialization CPU และ transfer time — ด้วย field selection, compression, pagination และ format ที่เหมาะ

## Scope

- ตรวจ API responses, message payloads, cache serialization, inter-service payloads
- ครอบคลุม: over-fetching fields, missing compression, N+1 serialization, big JSON trees, format choice (JSON vs MessagePack/Protobuf)
- Action-oriented: แก้ serialization จริง — วัด bytes/time ก่อน-หลัง

## Execute

### 1. Measure Payloads

> Goal: วัดขนาดและเวลาของ payloads หลัก

1. จับ response sizes ของ endpoints หลัก — แยก top offenders
2. วัด serialization time ถ้าเป็น hot path (`/run-profiler`)
3. flag: responses >100KB, nested objects ลึก, arrays ไม่จำกัด

### 2. Find Waste

> Goal: หา data ที่ส่งเกินความจำเป็น

1. Over-fetching: response มี fields ที่ client ไม่ใช้ — เทียบกับ consumers จริง
2. Missing pagination: arrays ทั้งก้อนแทน cursor/offset pages
3. Redundant nesting: objects ที่ wrap ซ้ำหรือ include relations ทั้งต้น
4. Missing compression: API ไม่มี gzip/brotli — ตรวจ `Content-Encoding`
5. Format mismatch: JSON สำหรับ internal high-volume calls ที่ binary format เหมาะกว่า
6. Repeated keys: arrays of objects ที่ key ซ้ำทุก item — columnar/flatten ได้

### 3. Apply Optimizations

> Goal: ลด payload ตาม impact

1. Field selection: sparse fieldsets (`?fields=`), GraphQL-style selection หรือ DTO shaping
2. Compression: เปิด gzip/brotli middleware — brotli สำหรับ static, gzip สำหรับ dynamic
3. Pagination: ใส่ `limit`/`cursor` บน list endpoints — ทำ `/check-api-contract` ตรวจ spec ตรง
4. Slim DTOs: response models ที่ตัด internal fields (dates, ids ภายใน, computed)
5. Binary formats: Protobuf/MessagePack สำหรับ internal services ที่ volume สูง — ชั่ง trade-off debuggability
6. ETag/caching: conditional requests (`ETag`, `304`) ลด transfer ซ้ำ

### 4. Verify

> Goal: ยืนยัน contract ไม่เปลี่ยนผิดและเล็กลง

1. `/run-test-api` — responses ต้อง valid ตาม contract
2. เทียบ bytes และ serialization time — `/report-before-after`
3. ระวัง: field removal = breaking change สำหรับ external consumers — ตรวจ `/check-backward-compatibility`

## Rules

### 1. Contract Aware

- ห้ามตัด fields ที่ consumers ใช้ — ตรวจ usage หรือทำ versioning
- API surface changes ต้องผ่าน contract check

### 2. Measure First

- มีขนาด/เวลา baseline — รายงาน delta จริง
- อย่าเปลี่ยน format (JSON→binary) ถ้าไม่มี evidence ว่าคุ้ม

### 3. Debuggability Trade-off

- binary formats เร็วกว่าแต่อ่านยาก — ใช้เฉพาะ internal high-volume paths
- เก็บ human-readable option สำหรับ debug (`?format=json`)

## Expected Outcome

- Payload sizes ลดลงพร้อมตัวเลขต่อ endpoint
- Compression/pagination/field selection ครบตามที่เหมาะ
- Contract compatibility รักษาไว้หรือระบุ breaking ชัดเจน
