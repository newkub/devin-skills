---
name: analyze-cost-impact
description: ประเมิน cost impact ของ code, infra, หรือ architectural changes
argument-hint: "[change-desc|config-path]"
related:
  - analyze-dependencies
  - analyze-performance-profile
  - improve
  - plan
---

## Goal
ประเมินค่าใช้จ่ายทีอาจเกิดขึ้นจากการเปลี่ยนแปลง infrastructure, dependencies, หรือ architecture

## Scope
- รองรับ cloud, serverless, API usage, storage
- ใช้ pricing data จาก provider
- รายงาน estimate ระดับ rough ถึง detailed

## Execute
### 1. Identify Resources

> Goal: Identify Resources

1. ระบุ services ที่เกี่ยวข้องกับ change เช่น compute, storage, bandwidth
2. หา config files เช่น `serverless.yml`, terraform, CDK
3. ระบุ usage metrics ปัจจุบัน

### 2. Estimate Usage

> Goal: Estimate Usage

1. คาดการณ์ request count, data transfer, compute time
2. ใช้ load/performance test results ถ้ามี
3. ระบุ peak และ average scenarios

### 3. Calculate Cost

> Goal: Calculate Cost

1. ใช้ pricing calculator ของ provider
2. บวก fixed cost และ variable cost
3. เปรียบเทียบกับ baseline

### 4. Report

> Goal: Report

1. สรุป cost estimate ตาม scenario
2. ระบุ uncertainty และ sensitivity
3. แนะนำ optimizations เพื่อลด cost

## Rules
### 1. Transparency

- ระบุ assumptions ทั้งหมด
- แจ้งว่าเป็น estimate ไม่ใช่ invoice
- ใช้ public pricing ไม่ใช่ committed use

### 2. Scope

- ไม่ประเมิน cost นอก scope ทีระบุ
- แยก one-time กับ recurring
- รวม hidden costs เช่น data transfer, logging

## Expected Outcome
- cost estimate ตาม scenario
- assumptions และ sensitivity
- cost optimization recommendations
