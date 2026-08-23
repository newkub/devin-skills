---
name: optimize-network
description: ปรับปรุง network ของ project ด้าน latency, bandwidth, connection, และ DNS
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
  - optimize-latency
  - optimize-bandwidth
  - optimize-connection
  - optimize-dns
  - optimize-caching
  - optimize-payload
  - improve-rate-limiting
  - validate
---

## Goal

ปรับปรุง network ของ project ให้เร็ว น่าเชื่อถือ และใช้ bandwidth คุ้มค่า

## Scope

ใช้กับ HTTP requests, API calls, CDN, DNS, connection pooling, หรือ network layer ใน project หรือ workspace

## Execute

### 1. Detect Network Context
> Goal: เข้าใจ network stack และปัญหา
1. อ่าน `package.json`, config files, และ environment variables ที่เกี่ยวข้อง
2. ระบุ HTTP client, API endpoints, CDN, proxy, load balancer
3. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
4. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
5. ถ้า context ไม่ชัด → ทำ `/ask-me`

### 2. Analyze Network Issues
> Goal: หาส่วนที่ควรปรับปรุง
1. ทำ `/optimize-latency` ถ้า response time สูง
2. ทำ `/optimize-bandwidth` ถ้า transfer size ใหญ่
3. ทำ `/optimize-connection` ถ้า connection pool หรือ keep-alive ไม่เหมาะสม
4. ทำ `/optimize-dns` ถ้า DNS resolution ช้า
5. ทำ `/optimize-caching` ถ้า cache headers ไม่เหมาะสม
6. ทำ `/optimize-payload` ถ้า request/response body ใหญ่
7. ทำ `/improve-rate-limiting` ถ้ามี rate limit หรือ retry issues

### 3. Implement Optimizations
> Goal: แก้ไขปัญหาตาม priority
1. รวม batch requests, ลด round trips, ใช้ prefetch/preconnect เมื่อเหมาะสม
2. ปรับ compression, HTTP/2, connection pooling, timeout, retry strategy
3. ตรวจสอบ CDN และ DNS settings
4. ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`

### 4. Validate
> Goal: ยืนยันว่า network ปรับปรุงแล้วดีขึ้น
1. ทำ `/validate` และ `/run-check`
2. รัน integration test หรือ `/run-test-api` ถ้ามี endpoints
3. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)
4. สรุปผลด้วย `/report` และ `/suggest-next-action`

## Rules

### 1. Minimal Changes
- แก้เฉพาะสิ่งที่วัดผลได้ว่าดีขึ้น
- ไม่เปลี่ยน architecture หลักโดยไม่ได้รับการยืนยัน
- ถ้าไม่แน่ใจ → ทำ `/ask-me`

### 2. Reliability Over Speed
- ไม่ลด timeout หรือ retry จนเสี่ยง fail
- รักษา idempotency และ error handling

### 3. Evidence Based
- ใช้ metrics ก่อน/หลัง ยืนยันผล
- ไม่อ้างว่างานเสร็จถ้า validation ไม่ผ่าน

## Expected Outcome

- network เร็วขึ้น น่าเชื่อถือขึ้น หรือใช้ bandwidth น้อยลง
- ไม่มี regression ใน API calls หรือ user experience
- รายงานสรุป before/after และ next action