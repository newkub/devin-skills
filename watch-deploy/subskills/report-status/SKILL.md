---
name: watch-deploy-report-status
description: สร้าง deploy watch report — poll timeline, health transitions, time-to-live
argument-hint: "[url]"
related:
  - report
  - follow-deploy
---

## Goal

แปลง poll session ของ `/watch-deploy` เป็น status report — timeline ของ health transitions และ time-to-live

## Scope

- ใช้เมื่อ `/watch-deploy` dispatch มาที่ `report`/`status` หรือเรียกหลัง poll จบ
- Chat-only report — ไม่สร้างไฟล์ถาวร

## Execute

### 1. Collect Poll Results

> Goal: รวมผลแต่ละ poll

1. รวม status code + latency ต่อ poll พร้อม timestamps
2. ระบุ transitions: `deploying` → `healthy` / `failed`
3. คำนวณ time-to-live (first poll → first 200)

### 2. Build Status Report

> Goal: ตอบว่า deploy สำเร็จไหมและนานแค่ไหน

1. Summary: URL, total polls, duration, final status
2. ตาราง: `No.`, `Time`, `Status`, `Latency`, `Notes` — show transitions + ตัวอย่าง polls (ไม่ใช่ทุก poll)
3. flag anomalies: status flapping, slow-but-200

### 3. Verdict

> Goal: สรุปผล deploy

1. Verdict: `live` / `timeout` / `unhealthy` / `flapping`
2. ถ้าไม่ live → แนะนำ `follow-deploy/subskills/verify-deploy/SKILL.md` หรือ rollback path
3. เทียบ time-to-live กับ deploys ก่อนหน้าถ้ามีข้อมูล

## Rules

- ไม่ list ทุก poll — แสดง transitions + samples เป็นพอ
- ระบุ poll interval และ timeout ที่ใช้
- timeout ≠ failed เสมอ — ระบุว่า app อาจกำลัง warm up

## Expected Outcome

- Status report พร้อม time-to-live + verdict
