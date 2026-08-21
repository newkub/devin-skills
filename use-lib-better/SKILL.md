---
name: use-lib-better
description: เปรียบเทียบ dependencies ปัจจุบัน และสรุปว่าควรใช้ dependency อะไร
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related:
  - follow-skills
  - learn-from-web
  - follow-my-tech-stack
  - deep-research
  - review-codebase
---

## Goal

วิเคราะห์ dependencies ปัจจุบัน, เปรียบเทียบ alternatives, และสรุปว่าควรใช้ dependency อะไร

## Scope

ใช้เมื่อต้องเปรียบเทียบ dependencies เพื่อตัดสินใจเลือก library หรือ framework ไม่รวมการ execute การเปลี่ยนแปลง

## Execute

### 1. Read Context

> Goal: อ่าน workflows และ skills ที่เกี่ยวข้องกับ dependencies และ libraries
> Goal: เข้าใจมาตรฐานและ patterns ก่อนเริ่มวิเคราะห์ dependencies

1. ทำ `/follow-skills` เพื่ออ่าน global และ project workflows ที่เกี่ยวข้อง
2. ทำ `/follow-skills` เพื่ออ่าน skills ที่เกี่ยวข้องกับ libraries และ dependencies

### 2. Snapshot Current Dependencies

> Goal: รวบรวม dependencies ปัจจุบันทั้งหมด
> Goal: รู้ dependencies ปัจจุบันทั้งหมดพร้อม version และสถานะ

1. ทำ `/follow-my-tech-stack` เพื่อดู tech stack ทั้งหมด
2. อ่าน `package.json` หรือ manifest ที่เกี่ยวข้อง
3. ระบุ version ปัจจุบัน, duplicate, deprecated, หรือ packages ที่ไม่ค่อย maintain

### 3. Analyze Usage

> Goal: ตรวจสอบการใช้งานจริงของแต่ละ package
> Goal: รู้ว่า package ไหนใช้จริง และ package ไหนเป็น candidate สำหรับ replace

1. ค้นหา imports ของแต่ละ package ใน codebase
2. ตรวจสอบว่า package ถูกใช้จริงหรือเป็น dead dependency
3. ระบุ packages ที่เป็น candidate สำหรับการ replace หรือ upgrade

### 4. Research Alternatives

> Goal: ค้นหาและศึกษา alternatives จาก official sources
> Goal: รู้ alternatives ที่ดีกว่าพร้อมข้อมูลเปรียบเทียบจาก official sources

1. ใช้ `/deep-research` เพื่อหา dependencies ทางเลือกที่ดีกว่า
2. ทำ `/learn-from-web` เพื่อศึกษา documentation และ features ของ alternatives
3. ดู npm trends, Bundlephobia, GitHub stars/forks, release frequency
4. เปรียบเทียบ apples-to-apples กับ version ล่าสุด

### 5. Evaluate Candidates

> Goal: ให้คะแนนแต่ละ candidate ตามเกณฑ์ที่กำหนด
> Goal: มี scoring ชัดเจนสำหรับแต่ละ candidate

1. ให้คะแนนแต่ละ candidate ตามเกณฑ์ (1-5 points):
   - Modern: ใช้ latest standards, APIs, patterns
   - Type Safety: มี TypeScript definitions หรือ built-in types ที่ดี
   - Performance: Benchmarks ดีกว่าหรือเทียบเท่า
   - DX: API ใช้งานง่าย, documentation ดี, error messages ชัดเจน
   - Maintenance: Active development, responsive maintainers, security updates
   - Bundle Size: เล็กกว่าหรือเท่ากับปัจจุบัน
   - Dependencies: น้อยกว่าหรือเท่ากับปัจจุบัน
2. คำนวณ Total Score (สูงสุด 35 points)
3. ประเมิน Migration Effort และ Risk Level (Low/Medium/High)

### 6. Recommend Dependencies

> Goal: สรุป dependencies ที่ควรใช้พร้อม priority
> Goal: รายการ deps ที่ควรใช้พร้อม priority และเหตุผล

1. ตอบแบบ list "ควรใช้อะไร" แยกตาม category (framework, ui, database, testing, tooling)
2. ระบุ priority สำหรับแต่ละ dep:
   - High: Score >= 25, Effort: Low, Risk: Low
   - Medium: Score 20-24, Effort: Medium, Risk: Medium
   - Low: Score < 20, Effort: High, Risk: High
3. ให้เหตุผลสั้น ๆ ว่าทำไมถึงเลือกตัวนั้น
4. ถ้าต้องการ execute การเปลี่ยนแปลงจริง ให้ส่งต่อไปยัง `/review-codebase`

## Rules

- ตอบแค่ deps ที่ควรใช้ ไม่ execute การเปลี่ยนแปลง package ใด ๆ
- ถ้าพบ unused, duplicate, security issues ให้ reference ไป `/review-codebase`
- ใช้ scoring system ชัดเจน (1-35 points)
- เปรียบเทียบ apples-to-apples กับ version ล่าสุด
- ไม่ต้องเขียน migration plan ละเอียด (ให้ `/review-codebase` ทำ)

## Expected Outcome

- รายการ deps ที่ควรใช้ พร้อมคะแนนและ priority
- ไม่มีการ execute changes
- ชัดเจนว่าอะไรควร replace, add, remove, upgrade
