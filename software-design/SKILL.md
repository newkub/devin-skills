---
name: software-design
description: ออกแบบ software ด้วย principles, patterns และ architecture ทีเหมาะสม
triggers:
  - user
  - model
related:
  - follow-architecture
  - follow-clean-architecture
  - follow-software-engineering
---

## Goal

เลือกและประยุกต์ใช้หลักการออกแบบ software ให้เหมาะกับ context

## Scope

ใช้เมื่อต้องออกแบบระบบ, refactor, หรือเลือก architecture pattern

## Execute

### 1. Understand Requirements

1. เก็บ functional และ non-functional requirements
2. ระบุ constraints (time, budget, team, tech stack)
3. หา core use cases และ bounded contexts

### 2. Choose Principles

1. SOLID สำหรับ OOP
2. DRY, KISS, YAGNI สำหรับ simplicity
3. Coupling/Cohesion สำหรับ maintainability
4. Failure modes สำหรับ resilience

### 3. Select Patterns

1. Creational/Structural/Behavioral patterns ตามปัญหา
2. Architectural pattern: Monolith, Microservices, Modular Monolith, Serverless
3. DDD สำหรับ complex domains
4. Event-driven สำหรับ async workflows

### 4. Design Components

1. กำหนด boundaries และ interfaces
2. ระบุ data flow
3. เลือก coupling ระหว่าง modules
4. วาด diagram เพื่อสื่อสาร

### 5. Evaluate Trade-offs

1. เปรียบเทียบ alternatives
2. ตรวจสอบ scalability, security, cost
3. ทบทวนด้วย /review-architecture

## Rules

- ไม่ over-engineer
- ใช้ patterns ตามปัญหา ไม่ใช้ pattern เพื่อใช้
- แยก concerns ชัดเจน
- เอกสาร decision และ trade-off

## Expected Outcome

- Design ทีตอบโจทย์
- Architecture diagram และ rationale
- ผ่าน review
