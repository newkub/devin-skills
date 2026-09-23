# Fix Guide

(merged from: improve-performance)

## Goal

แก้ไข performance findings จาก `/review-performance` ตาม severity — ครอบคลุม network, bundle, runtime, memory, I/O, caching และ database

## Scope

- รับ findings จาก `/review-performance` หรือ `/check-bottlenecks`
- แก้ไขจริงตามประเภท: `/review-bundle`, `/review-database`, `references/fix-optimize-network.md`, `references/fix-optimize-memory.md` ตาม domain
- Action-oriented: ทุก fix ต้องวัดผลหรือมี evidence รองรับ

## Execute

### 1. Triage Findings

> Goal: เรียง findings ตาม severity และ impact

1. อ่าน findings จาก `/review-performance` report ล่าสุด หรือรัน `/check-bottlenecks` ถ้าไม่มี
2. จัดกลุ่มตาม domain: network, bundle, runtime, memory, io, caching, database, complexity
3. เรียง: critical → high → medium → low และประเมิน effort ต่อ finding

### 2. Route To Domain Fix

> Goal: เลือก optimize skill ที่ตรงกับ domain

1. Bundle/bundler issues → `/review-bundle`
2. Network/API latency, waterfalls → `references/fix-optimize-network.md`
3. Memory leaks, GC pressure → `references/fix-optimize-memory.md`
4. Database/N+1/slow queries → `/review-database`
5. Runtime/hot paths → `/run-profiler` หา hotspot แล้ว refactor algorithm
6. Caching issues → แก้ invalidation, TTL, stampede protection
7. Rendering/UI → `/review-frontend`

### 3. Apply Fixes

> Goal: แก้ทีละ finding ตาม priority

1. แก้ critical ก่อน — blocking bottlenecks, CWV violations, N+1
2. แก้ครั้งละ finding — verify ผลทันทีก่อนไปต่อ
3. สำหรับ algorithm fixes: เทียบ Big O ก่อน-หลัง และใช้ `/run-bench` ยืนยัน

### 4. Verify And Report

> Goal: ยืนยัน improvement พร้อมตัวเลข

1. วัดผลต่อ finding: profiler, benchmark, bundle size, timing
2. `/run-test` + `/run-check` ต้องผ่าน — ไม่มี regression
3. ใช้ `/report-before-after` สรุป fixes และ metrics
4. อัปเดต review findings ที่ resolve แล้ว

## Rules

### 1. Evidence-Based

- แก้เฉพาะ findings ที่มี evidence — ไม่ optimize แบบคาดเดา
- ทุก fix ต้องมี before/after measurement หรือ reasoning ที่ชัดเจน

### 2. Preserve Correctness

- Tests ต้องผ่านทุก fix — performance fix ห้ามเปลี่ยน behavior
- ระวัง caching fixes ที่อาจ serve stale data

### 3. Prioritized

- แก้ตาม severity × impact — ไม่ fix micro-optimizations ก่อน bottlenecks จริง
- ถ้า fix เสี่ยงสูง (architectural) → เสนอแผนก่อนลงมือ ผ่าน `/ask-me`

## Expected Outcome

- Findings ถูกแก้ตาม priority พร้อมผลวัดจริง
- ตัวชี้วัดหลัก (latency, bundle, memory, query time) ดีขึ้น
- รายงาน fixes พร้อม before/after metrics
