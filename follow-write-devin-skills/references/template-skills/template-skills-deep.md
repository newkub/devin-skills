---
name: template-skills-deep
description: Template สำหรับ deep-* skills วิเคราะห์เชิงลึก
allowed-tools:
  - read
  - grep
  - glob
  - exec
  - ask_user_question
  - run_subagent
triggers:
  - user
  - model
---

## Goal

Template สำหรับสร้าง `deep-*` skills ที่วิเคราะห์หลายมิติอย่างลึกซึ้ง พร้อม cross-reference และ comprehensive output

## Scope

ใช้สำหรับ skills ที่ต้องการ analysis เชิงลึก เช่น `deep-analyze`, `deep-debug`, `deep-review`

## Execute

### 1. Define Dimensions

กำหนดมิติที่จะวิเคราะห์

> Goal: รู้ว่าจะวิเคราะห์อะไรบ้าง ครบไม่ตกหล่น

1. ระบุ target และ scope ของการวิเคราะห์
2. กำหนด dimensions ที่จะวิเคราะห์ (เช่น architecture, performance, security, maintainability)
3. ระบุ criteria สำหรับแต่ละ dimension
4. ถ้า target ไม่ชัด → ทำ `/ask-me` ก่อนเริ่ม

### 2. Research

ค้นคว้าข้อมูลเพิ่มเติม

> Goal: ข้อมูลครบ ถูกต้อง ทันสมัย

1. ทำ `/deep-research`, ทำ `/learn-from-web`, ทำ `/check-reference`
2. ถ้าข้อมูลไม่พอ → ระบุความไม่แน่นอน

### 3. Analyze Per Dimension

วิเคราะห์ทีละ dimension

> Goal: แต่ละ dimension มี findings ครบพร้อม evidence

1. ทำ `/deep-analyze` สำหรับแต่ละ dimension
2. จับ findings พร้อม evidence (file, line, code, metric)
3. ระบุ root cause ของแต่ละ finding
4. คำนึงถึง context rot → ทำ `/improve-context-rot` ถ้า analysis ยาว

### 4. Cross-Reference

เชื่อมโยง findings ระหว่าง dimensions

> Goal: พบ patterns และ root causes ที่เชื่อมโยงกัน

1. หา findings ที่ซ้ำซ้อนระหว่าง dimensions, หา root causes ที่ส่งผลต่อหลาย dimensions
2. จัดกลุ่ม findings ที่เกี่ยวข้อง
3. ระบุ dependencies ระหว่าง issues

### 5. Report

สร้าง comprehensive report

> Goal: Report ครบทุกมิติ อ่านง่าย ลำดับชัดเจน

1. ทำ `/report-table` สำหรับ summary
2. จัดลำดับ findings ตาม impact และ effort
3. ระบุ immediate actions และ long-term actions
4. ทำ `/suggest-next-action`

## Rules

### 1. Depth Over Speed

- วิเคราะห์ให้ลึก ไม่รีบสรุป
- ถ้าไม่แน่ใจ → ค้นคว้าเพิ่ม
- ระบุ assumptions ที่ใช้

### 2. Context Management

- ถ้า analysis ยาว → ทำ `/improve-context-rot`
- ใช้ notes หรือ progress files เมื่อจำเป็น
- สรุป findings ก่อนขยายไป dimension ถัดไป

### 3. Evidence-Based

- ทุก finding ต้องมี evidence
- ถ้าเป็น opinion → ระบุว่าเป็น opinion
- อ้างอิง file, line, metric หรือ external source

### 4. Completeness

- ครบทุก dimensions ที่กำหนด
- ถ้า dimension หนึ่งไม่มี findings → ระบุว่า "no issues"
- ไม่ข้าม dimensions เพราะเวลาจำกัด

## Expected Outcome

- Comprehensive analysis ครบทุก dimensions
- Cross-referenced findings พร้อม root causes
- Report ที่อ่านง่าย ลำดับชัดเจน
- Immediate และ long-term actions แยกกัน
