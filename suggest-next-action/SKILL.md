---
name: suggest-next-action
description: วิเคราะห์สถานการณ์และแนะนำ action ถัดไปที่ควรทำ
argument-hint: "[context]"
---

## Goal

วิเคราะห์สถานการณ์ปัจจุบันและแนะนำ action ถัดไปที่ควรทำ เพื่อให้การทำงานมีทิศทางชัดเจนและเป็นระบบ

## Scope

ใช้สำหรับวิเคราะห์สถานการณ์หลังจากทำงานเสร็จ task ใด task หนึ่ง หรือเมื่อไม่แน่ใจว่าควรทำอะไรต่อ ครอบคลุมทั้ง context ของโปรเจกต์และสถานะปัจจุบัน

## Execute

### 1. Analyze Current State

> Goal: Analyze Current State

วิเคราะห์สถานการณ์ปัจจุบัน

1. ตรวจสอบ task ล่าสุดที่ทำเสร็จ
2. ดูสถานะของ project (errors, warnings, pending changes)
3. ตรวจสอบ git status (uncommitted changes, branches)
4. ดูสถานะของ dependencies (outdated, vulnerabilities)
5. ตรวจสอบ test coverage และ test failures
6. ดู documentation ที่อาจต้องอัปเดท

### 2. Identify Context

> Goal: Identify Context

ระบุ context ของสถานการณ์

- เป็นการเริ่ม project ใหม่หรือ maintenance
- เป็นการ fix bug หรือ add feature
- เป็นการ refactor หรือ optimization
- เป็นการ prepare สำหรับ release
- เป็นการ review หรือ audit
- เป็นการ learning หรือ research

### 3. Evaluate Priority

> Goal: Evaluate Priority

ประเมินความสำคัญของ actions ที่อาจทำ

- Impact ต่อ users (high/medium/low)
- Impact ต่อ stability (high/medium/low)
- Effort ที่ต้องใช้ (high/medium/low)
- Risk ของการทำ (high/medium/low)
- Dependencies กับ tasks อื่น
- Time sensitivity

### 4. Suggest Actions

> Goal: Suggest Actions

แนะนำ actions ที่ควรทำถัดไป

1. จัดลำดับ actions ตาม priority
2. แนะนำ workflow ที่เหมาะสม (ถ้ามี)
3. ระบุว่า action นั้น critical หรือ optional
4. อธิบาย reason ที่แนะนำ action นั้น
5. ระบุ dependencies ระหว่าง actions
6. ให้ estimate effort ถ้าเป็นไปได้
7. ถ้ามีไฟล์หรือ folder ที่ควรลบ ให้แนะนำ `/delete` พร้อมระบุเหตุผล
8. ถ้ามีไฟล์ที่ควรสรุปเนื้อหา ให้แนะนำ `/report-table`

### 5. Present Options

> Goal: Present Options

นำเสนอ options ให้ผู้ใช้ตัดสินใจ

1. ทำ `/report-table` เพื่อจัดรูปแบบ actions เป็นตาราง: #, Action, Priority, Impact, Effort, Workflow, Reason
2. แสดง actions ที่แนะนำพร้อม priority ในรูปแบบตาราง
3. ให้ผู้ใช้เลือก action ที่ต้องการ
4. อธิบาย trade-offs ระหว่าง options เป็นตาราง: Option, Pros, Cons, Risk
5. ระบุว่า action ไหนสามารถทำ parallel ได้
6. ถ้าต้องการ user confirmation ก่อนดำเนินการ → ทำ `/ask-me` พร้อม recommend action ที่เหมาะสมที่สุด

## Rules

### 1. Context Awareness

ต้องเข้าใจ context ก่อนแนะนำ

- อย่าแนะนำ action โดยไม่เข้าใจ context
- ตรวจสอบสถานะปัจจุบันก่อน
- พิจารณา impact ต่อ project โดยรวม
- พิจารณา state ของ codebase

### 2. Priority Framework

ใช้ framework ในการจัดลำดับ

- High impact, low effort → ทำก่อน
- High impact, high effort → วางแผนให้ดี
- Low impact, low effort → ทำเมื่อมีเวลา
- Low impact, high effort → ทำเมื่อจำเป็น
- Critical issues → ทำทันที
- Blockers → ทำก่อนอื่นๆ

### 3. Action Categories

แบ่ง actions เป็น categories:

- Critical: ต้องทำทันที (security issues, blocking bugs)
- High: ควรทำเร็วๆ (features, important fixes)
- Medium: ทำเมื่อมีเวลา (refactor, improvements)
- Low: ทำเมื่อว่าง (nice-to-have)
- Optional: ทำหรือไม่ก็ได้ (experiments, learning)

### 4. Workflow Suggestions

แนะนำ workflows ที่เหมาะสม

- ถ้ามี workflow ที่ครอบคลุม action นั้น ให้แนะนำใช้ workflow
- อย่าแนะนำ workflow ที่ไม่มีอยู่จริง
- ตรวจสอบ `related_workflows` ก่อนแนะนำ
- อธิบายว่าทำไม workflow นั้นเหมาะสม

### 5. Clarity And Specificity

ให้คำแนะนำที่ชัดเจนและเฉพาะเจาะ

- อย่าแนะนำ "ทำอะไรดี" โดยไม่ระบุ
- ให้คำแนะนำที่ specific และ actionable
- ระบุ file paths หรือ components ที่เกี่ยวข้อง
- ให้ examples ถ้าจำเป็น

### 6. Trade-off Awareness

อธิบาย trade-offs ระหว่าง options

- อธิบาย pros และ cons ของแต่ละ option
- ระบุ risks ที่อาจเกิดขึ้น
- ระบุ opportunity costs
- ให้ผู้ใช้ตัดสินใจขั้นสุดท้าย

## Expected Outcome

- ผู้ใช้ได้รับคำแนะนำที่ชัดเจน
- Actions ถูกจัดลำดับตาม priority
- Context ของสถานการณ์ถูกเข้าใจ
- Workflow ที่เหมาะสมถูกแนะนำ
- Trade-offs ระหว่าง options ชัดเจน
- การทำงานมีทิศทางชัดเจน