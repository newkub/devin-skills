---
name: write-solutions
description: เขียน solution documents และ problem-solving workflows
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
---

## Goal

สร้าง solution documents และ workflows สำหรับแก้ปัญหาอย่างเป็นระบบ

## Scope

เขียน solutions สำหรับปัญหาที่พบใน development, operations, และ business

## Execute

### 1. Analyze Problem
> Goal: Analyze Problem

วิเคราะห์ปัญหาอย่างละเอียด

1. ทำ `/follow-root-cause-analysis` เพื่อหาสาเหตุหลัก
2. ระบุ scope และ impact ของปัญหา
3. รวบรวม context และ constraints

### 2. Research Solutions
> Goal: Research Solutions

ค้นหาแนวทางแก้ไขที่เหมาะสม

1. ทำ `/deep-research` สำหรับ solutions ที่เกี่ยวข้อง
2. อ่าน official docs และ best practices
3. ศึกษา solutions ที่ใช้ใน projects อื่น

### 3. Design Solution
> Goal: Design Solution

ออกแบบ solution ที่เหมาะสมกับ context

1. ทำ `/follow-architecture` เพื่อออกแบบโครงสร้าง
2. พิจารณา trade-offs และ alternatives
3. ตั้งค่า success criteria ชัดเจน

### 4. Write Solution Document
> Goal: Write Solution Document

เขียน solution document ตามมาตรฐาน

1. ทำ `/follow-write-devin-skills` สำหรับ structure
2. เขียน problem statement, solution approach, และ implementation plan
3. เพิ่ม examples และ edge cases

### 5. Validate And Refine
> Goal: Validate And Refine

ตรวจสอบและปรับปรุง solution

1. ทำ `/resolve-errors` เพื่อ validate solution
2. ทดสอบ solution กับ real scenarios
3. ปรับปรุงตาม feedback

## Rules

### 1. Problem Analysis

วิเคราะห์ปัญหาอย่างลึกซึ้ง

- ระบุ root cause ด้วย systematic approach
- วัด impact และ priority ของปัญหา
- รวบรวม context: logs, metrics, user feedback
- ตรวจสอบ assumptions และ validate hypotheses

### 2. Solution Design

ออกแบบ solution ที่เหมาะสม

- เลือก approach ที่ balance ระหว่าง complexity และ effectiveness
- พิจารณา alternatives และ trade-offs
- ตั้งค่า measurable success criteria
- ออกแบบ สำหรับ maintainability และ scalability

### 3. Documentation Standards

เขียน solution document ตามมาตรฐาน

- ใช้ structure: Problem, Analysis, Solution, Implementation, Validation
- เพิ่ม code examples และ diagrams ที่จำเป็น
- ระบุ dependencies และ risks
- เขียนให้เข้าใจง่าย สำหรับทั้ง technical และ non-technical

### 4. Implementation Guidelines

จัดการ implementation อย่างเป็นระบบ

- ทำ `/resolve-errors` สำหรับ minimal changes
- ทำ `/dont-over-engineer` เพื่อลดความซับซ้อน
- เพิ่ม regression tests สำหรับ critical fixes
- Document changes และ update references

### 5. Validation And Monitoring

ตรวจสอบและ monitor solution

- ทำ `/run-test` เพื่อ validate ใน production-like environment
- ตั้งค่า monitoring และ alerts สำหรับ metrics ที่เกี่ยวข้อง
- รวบรวม feedback จาก users และ stakeholders
- ปรับปรุง solution ตาม data และ feedback

## Expected Outcome

- Solution documents มีโครงสร้างชัดเจน อ่านง่าย
- Solutions ถูก validate ก่อน implementation
- มี monitoring และ feedback loops สำหรับ continuous improvement
- Solutions ครอบคลุม edge cases และ long-term considerations

## Common Mistakes (optional)

ข้อผิดพลาดที่พบบ่อย:

- ไม่วิเคราะห์ root cause แต่แก้ไข symptoms
- Over-engineer solutions โดยไม่พิจารณา trade-offs
- ไม่มี success criteria ที่ measurable
- ไม่ test solutions ก่อน deploy
- ไม่ document หรือ update references หลัง implementation
