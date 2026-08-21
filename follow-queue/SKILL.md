---
name: follow-queue
description: ออกแบบและใช้งาน job queue ในระบบ
triggers:
  - user
  - model
related:
  - follow-concurrent-programming
  - follow-async
---

## Goal

เลือกและตั้งค่า job queue ที่เหมาะสมกับ workload

## Scope

ใช้เมื่อระบบต้องจัดการ background jobs, retries, concurrency

## Execute

### 1. Identify Requirements

1. ประเภทของ jobs (CPU, I/O, delayed, scheduled)
2. Volume และ throughput ที่คาดหวัง
3. Durability, retry, dead-letter requirements
4. Message ordering และ priority

### 2. Choose Queue

1. In-memory: BullMQ, Bull, kue
2. Message broker: RabbitMQ, SQS, Kafka, Redis Streams
3. Database-backed: pg-boss, sqlite-queue
4. ใช้ framework-specific เมื่อเหมาะสม

### 3. Setup

1. ติดตั้ง package ตาม ecosystem
2. ตั้งค่า producer และ consumer
3. กำหนด concurrency, retry, timeout
4. ตั้งค่า monitoring

### 4. Implement Patterns

1. Idempotency
2. Retry with backoff
3. Dead letter queue
4. Rate limiting

## Rules

- Jobs ต้อง idempotent
- กำหนด retry limit และ backoff
- ใช้ DLQ สำหรับ jobs ที่ fail ตลอด
- Monitor queue depth และ processing time

## Expected Outcome

- Queue ทำงานเสถียร
- Jobs ถูกประมวลผลถูกต้อง
- Failures ถูกจัดการ
