---
name: review-io
description: Review file and storage I/O, serialization, and network I/O patterns for performance and safety
---


## Goal

Review I/O, storage, และ serialization ของ project ให้ครอบคลุม file I/O, storage patterns, serialization formats, network I/O, database I/O พร้อม review score

## Scope

io review สำหรับ: file I/O, disk I/O, storage formats, serialization, network I/O, database I/O, cache, queues, data persistence, stream/batch patterns, compression, schema validation

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ io stack และปัญหา

1. อ่าน `package.json`, `Cargo.toml`, หรือ manifest ที่เกี่ยวข้อง
2. ระบุ patterns: file I/O, database I/O, network I/O, cache, queues
3. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
4. ถ้าไม่พบ I/O patterns ที่มีความเสี่ยง → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก io dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ io patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. File And Storage I/O Review

> Goal: ครอบคลุม file I/O, storage patterns, latency, และ safety

1. ตรวจสอบ file I/O patterns: synchronous vs asynchronous file operations, blocking calls, stream usage, memory loading vs streaming
2. ตรวจสอบ storage formats: binary, compressed, columnar, text, JSON, CSV, Parquet เหมาะกับ use case หรือไม่
3. ตรวจสอบ disk usage: temp files, log rotation, disk quotas, file cleanup, orphaned temp files
4. ตรวจสอบ error handling: file not found, permission denied, disk full, incomplete writes, partial reads
5. ตรวจสอบ concurrency: file locking, race conditions, multiple writers/readers, atomic writes
6. จัด severity ตาม `## Rules` → Severity Classification

### 4. Serialization Review

> Goal: ครอบคลุม serialization cost, format safety, schema consistency

1. ตรวจสอบ serialization formats: JSON, MessagePack, Protobuf, Avro, YAML, XML ที่ใช้
2. ตรวจสอบ format selection: size, speed, schema compatibility, use case ทีเหมาะสม
3. ตรวจสอบ serialization safety: circular references, duplicate serialization, unnecessary fields, large payload risk
4. ตรวจสอบ schema validation: schema version, backward/forward compatibility, missing validation, type coercion risk
5. ตรวจสอบ deserialization risk: untrusted input, arbitrary code execution, type confusion, missing error handling
6. จัด severity ตาม `## Rules` → Severity Classification

### 5. Network And Database I/O Review

> Goal: ครอบคลุม network I/O, database I/O, round trips, blocking

1. ตรวจสอบ network patterns: connection pooling, keep-alive, batching, retry logic, timeout handling
2. ตรวจสอบ database I/O patterns: N+1 queries, unbounded queries, connection management, transaction scope
3. ตรวจสอบ async vs sync: heavy tasks แบ่งงานเป็น async/streaming หรือไม่
4. ตรวจสอบ queue/cache usage: queue backpressure, cache invalidation ที่กระทบ I/O
5. จัด severity ตาม `## Rules` → Severity Classification

### 6. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี file/storage I/O → ข้าม Step 3
- ถ้า project ไม่มี serialization → ข้าม Step 4
- ถ้า project ไม่มี network/database I/O → ข้าม Step 5

### 2. Severity Classification

- Critical: data loss risk, blocking sync I/O บน critical path, missing error handling ที่ crash, unsafe storage format migration, insecure deserialization, unbounded query/memory usage
- High: missing streaming for large files, missing connection pool, missing schema validation, missing log/temp cleanup, inefficient serialization, missing retry/timeout
- Medium: suboptimal storage format, minor schema drift, missing compression, suboptimal batching, incomplete error messages
- Low: cosmetic, naming convention, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ I/O pattern, storage format, serialization call, หรือ query ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก I/O section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
