---
name: report-devin-usage
description: สรุป Devin session usage และ cost ตาม billing tags พร้อม trend และ top consumers
argument-hint: "[period-or-tag]"
related:
  - list-devin-session
  - report-table
---

## Goal

สรุป Devin usage เป็นรายงาน — sessions ตามช่วงเวลา, billing tags, งานที่ทำ และ cost signals — เพื่อรีวิว usage patterns และหาจุดเสียเปล่า

## Scope

- ใช้ MCP tools ของ Devin platform (`devin_session_search`, `devin_billing_tag_manage`, `devin_session_*`) เมื่อมี — หรือข้อมูล session ที่เข้าถึงได้
- ครอบคลุม: session counts, status distribution, billing tag breakdown, recurring task patterns, failure rates
- Read-only: รายงาน — ไม่แก้ sessions หรือ billing config

## Execute

### 1. Gather Session Data

> Goal: รวบรวม sessions ตามช่วงเวลา/tag

1. ใช้ `devin_session_search` หรือ `/list-devin-session` ดึง sessions ตาม argument (period/tag)
2. ใช้ `devin_billing_tag_manage` ดึง billing tags และ members ถ้ามี
3. ถ้าไม่มี API access → ใช้ session history files/summaries ที่มี locally

### 2. Aggregate Metrics

> Goal: สรุป usage patterns

1. Sessions per day/week, success/failure/stopped distribution
2. Tag breakdown — งานไหนกิน sessions เยอะสุด
3. Task type patterns: งานประเภทไหนถูกสั่งบ่อย (สร้าง skills, fix bugs, reviews)
4. Long-running/retry-heavy sessions — candidates สำหรับ playbooks/automation

### 3. Identify Insights

> Goal: หาสิ่งที่ actionable จาก usage

1. flag: sessions ที่ fail/timeout ซ้ำบน task เดียวกัน — ควรเป็น skill/automation
2. flag: manual recurring work ที่ `devin_automation` หรือ playbook ทำแทนได้
3. flag: tags/projects ที่ usage สูงผิดปกติ

### 4. Report

> Goal: สรุป usage พร้อม recommendations

1. ใช้ `/report-table`: `No.`, `Period/Tag`, `Sessions`, `Success %`, `Top Task Type`, `Note`
2. Insights section: automation candidates, waste signals, trends
3. แนะนำ `/idea-from-session` สำหรับ recurring patterns ที่เจอ

## Rules

### 1. Evidence-Based

- ทุกตัวเลขจากข้อมูลจริง — ระบุ data source และช่วงเวลา
- ถ้าข้อมูลไม่ครบ (ไม่มี billing access) → ระบุชัดเจน

### 2. Read-Only

- ไม่แก้ sessions, tags หรือ billing — รายงานอย่างเดียว
- ไม่ expose เนื้อหา sessions ที่ไม่เกี่ยว — สรุป metadata เท่านั้น

### 3. Actionable

- รายงานต้องมี "แล้วไง" — insights และ recommendations ไม่ใช่แค่ตัวเลข
- แยก facts จาก interpretation

## Expected Outcome

- Usage report ตาม period/tags พร้อม distributions
- Automation candidates จาก recurring patterns
- Waste/efficiency insights ที่ actionable
