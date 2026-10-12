---
name: optimize-cost
description: หา cost optimization ใน scope — infra, API usage, compute, storage — รวม findings แล้วแก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - report-before-after
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "cost improve/optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-cost` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "cost ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-cost` — infra spend, API/token usage, compute/storage efficiency, pricing tier fit

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-cost`
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. วัด baseline ก่อนแก้เสมอ — snapshot cost ปัจจุบัน (billing/usage report)
2. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain ที่ตรง) — แก้ทีละจุด impact มาก→น้อย
3. วัดซ้ำแล้ว `/report-before-after` — ถ้า cost ไม่ลด → revert
4. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-cost`
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- cost cuts ห้ามลด reliability/security — ไม่ดีขึ้น → revert
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม before/after cost report
