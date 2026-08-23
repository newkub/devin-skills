---
name: review-network
description: Review network สำหรับ DNS, connection, bandwidth, latency, caching, payload
---


## Goal

Review network ครอบคลุม DNS, connection, bandwidth, latency, caching, payload พร้อม review score

## Scope

network review สำหรับ: HTTP requests, API calls, CDN, DNS resolution, connection pooling, compression, cache headers, response time, payload size

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ network stack และ context

1. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ HTTP client, API endpoints, CDN, proxy, load balancer
4. ถ้า project ไม่มี network layer → stop และ report

### 2. DNS Review

> Goal: ตรวจสอบ DNS resolution และ routing

1. ตรวจสอบ DNS records, TTL, และจำนวน round-trips
2. ตรวจสอบการใช้ DNS prefetch/preconnect สำหรับ third-party origins
3. ตรวจสอบ CDN edge locations และ routing
4. ตรวจสอบว่า best practices สำหรับ DNS ถูกนำไปใช้

### 3. Connection Review

> Goal: ตรวจสอบ connection reuse และ reliability

1. ตรวจสอบ keep-alive, connection pool size, timeout
2. ตรวจสอบการใช้ HTTP/2 หรือ HTTP/3
3. ตรวจสอบ retry strategy ว่ามี exponential backoff
4. ตรวจสอบ circuit breaker สำหรับ cascading failures

### 4. Bandwidth Review

> Goal: ตรวจสอบการใช้ bandwidth

1. ตรวจสอบ compression (gzip, brotli) สำหรับ text responses
2. ตรวจสอบ unnecessary headers, cookies, หรือ payload fields
3. ตรวจสอบ batch requests, ลด round trips, prefetch/preconnect
4. ตรวจสอบ CDN cache hit ratio

### 5. Latency Review

> Goal: ตรวจสอบ response time และ bottlenecks

1. ตรวจสอบ response time / TTFB ของ endpoints
2. ตรวจสอบ DNS resolution time
3. ตรวจสอบ TCP/TLS handshake time
4. ตรวจสอบ server processing time บน critical path
5. ตรวจสอบ third-party origins ที่ก่อให้เกิด latency

### 6. Caching Review

> Goal: ตรวจสอบ caching strategy บน network layer

1. ตรวจสอบ cache headers: `Cache-Control`, `ETag`, `Last-Modified`
2. ตรวจสอบ TTL configuration, expiration policy, และ cache eviction
3. ตรวจสอบ CDN/edge caching และ cache key design
4. ตรวจสอบ browser caching และ stale-while-revalidate patterns
5. ตรวจสอบ cache invalidation strategy

### 7. Payload Review

> Goal: ตรวจสอบ request/response payload

1. ตรวจสอบ request/response body size
2. ตรวจสอบ unnecessary fields, headers, cookies ใน payload
3. ตรวจสอบ compression สำหรับ text responses
4. ตรวจสอบ JSON serialization overhead และ duplicate fields
5. ตรวจสอบ pagination/batch request size

### 8. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี network layer → ข้ามทั้งหมด
- ถ้า project ไม่มี CDN → ข้าม Section 2 item 3
- ถ้า project ไม่มี third-party origins → ข้าม Section 2 item 2
- ถ้า project ไม่มี connection pool → ข้าม Section 3 item 1
- ถ้า project ไม่มี HTTP/2 หรือ HTTP/3 → ข้าม Section 3 item 2
- ถ้า project ไม่มี caching → ข้าม Section 6

### 2. Severity Classification

- Critical: broken endpoint, no compression บน text responses, missing cache invalidation ทำให้ข้อมูลผิด, broken DNS ทำให้ service down
- High: high latency บน critical path, missing keep-alive, missing retry strategy, missing cache headers บน static assets, large payload ทำให้ช้า
- Medium: suboptimal TTL, suboptimal connection pool size, minor cache key issue, unnecessary headers
- Low: cosmetic, documentation gap, minor naming

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ endpoint, HTTP method, header, หรือ config ที่เกี่ยวข้อง
- ใช้ metrics ก่อน/หลัง ยืนยันผลเมื่อได้

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก network section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
