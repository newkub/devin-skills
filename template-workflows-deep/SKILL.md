---
name: template-workflows-deep
description: Template สำหรับสร้าง deep-* workflows ที่วิเคราะห์หลายมิติอย่างลึกซึ้ง
---

## Goal

Template สำหรับสร้าง `deep-*` workflows ที่วิเคราะห์หลายมิติอย่างลึกซึ้ง พร้อม cross-reference และ comprehensive output

## Scope

ใช้สำหรับ workflows ที่ต้องการ analysis เชิงลึก เช่น `deep-analyze`, `deep-debug`, `deep-review`

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

1. ทำ `/report-format-table` สำหรับ summary
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

## Example Template

```markdown
---
title: Deep Review
description: Deep review ครบทุกมิติอย่างลึกซึ้งพร้อม severity และ recommendations
auto_execution_mode: 3
related:
  - /deep-analyze
  - /deep-research
  - /report-format-table
---

## Goal
Deep review ครบทุกมิติพร้อม cross-reference และ actionable recommendations

## Scope
ใช้สำหรับ comprehensive review ที่ต้องวิเคราะห์หลาย dimensions

## Execute

### 1. Define Dimensions
กำหนดมิติ

> Goal: รู้ว่าจะวิเคราะห์อะไร

1. ระบุ target และ dimensions (เช่น security, performance, maintainability)

### 2. Research
ค้นคว้า

> Goal: ข้อมูลครบ ทันสมัย

1. ทำ `/deep-research`, ทำ `/learn-from-web`

### 3. Analyze Per Dimension
วิเคราะห์ทีละ dimension

> Goal: findings ครบพร้อม evidence

1. ทำ `/deep-analyze` สำหรับแต่ละ dimension
2. จับ findings พร้อม evidence

### 4. Cross-Reference
เชื่อมโยง findings

> Goal: พบ patterns ข้าม dimensions

1. หา root causes ที่ส่งผลต่อหลาย dimensions

### 5. Report
สร้าง report

> Goal: Report ครบ อ่านง่าย

1. ทำ `/report-format-table`
2. ทำ `/suggest-next-action`

## Rules

### 1. Depth Over Speed
- วิเคราะห์ให้ลึก ไม่รีบสรุป

### 2. Evidence-Based
- ทุก finding ต้องมี evidence

## Expected Outcome
- Comprehensive review ครบทุก dimensions พร้อม recommendations
```
