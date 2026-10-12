---
name: improve-algorithm
description: หา algorithm improvements ใน scope — time/space complexity, data structures, hot paths — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - deep-review
  - deep-review-then-fix
  - run-bench
  - report
  - suggest-next-action
  - ask-me
---

## Goal

ตอบคำถาม "algorithm improve/optimize อะไรได้บ้าง" สำหรับ scope ที่ user ระบุ — รวม findings จาก `/deep-review` domain `review-algorithm` เป็น prioritized list แล้วส่งต่อไปแก้ทันที

## Scope

ใช้เมื่อ user ถามว่า scope นี้ "algorithm/data structure ควร improve อะไร" — thin entry point ที่ delegate การ review ไป `/deep-review` ไม่ทำ review เองและไม่แก้ไขโดยตรง

- `review-algorithm` — time/space complexity เทียบ input bounds, data structure selection, memory/allocation patterns, numeric safety, hot paths

## Execute

### 1. Review

> Goal: ได้ prioritized findings

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` กับ scope นั้น domain `review-algorithm`
3. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่งแต่ละ finding ไป `/deep-review-then-fix` (domain `review-algorithm`)
2. Complexity fix ต้อง verify ด้วย `/run-bench` หลาย input sizes — ห้าม optimize ก่อนมี evidence
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domain `review-algorithm`
- แก้ทุก finding ทันทีโดยไม่รอ confirm — algorithm changes preserve output เสมอ
- วัดก่อน optimize — ทุก complexity claim ต้องมี benchmark evidence
- ทุก improvement ต้อง map ไปยัง skill ที่ทำได้จริง

## Expected Outcome

- Prioritized algorithm improvement list จาก `/deep-review`
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Findings ทั้งหมดถูกแก้ผ่าน `/deep-review-then-fix` พร้อม benchmark evidence
