---
name: analyze-project
description: วิเคราะห์โปรเจกต์พื้นฐานด้วยเลือกใช้ tools ที่เหมาะสมกับงาน
argument-hint: "[scope]"
related:
  - scan-codebase
  - use-astgrep
  - use-scripts
  - follow-my-global-cli
  - deep-analyze
  - deep-review
  - review-quality
---

## Goal

วิเคราะห์โปรเจกต์อย่างมีประสิทธิภาพด้วยการเลือกใช้ tools ที่เหมาะสมกับงาน

## Scope

ครอบคลุมการวิเคราะห์โปรเจกต์พื้นฐานด้วย 4 tools หลัก: `/scan-codebase`, `/use-astgrep`, `/use-scripts`, `/follow-my-global-cli`

Note: ถ้าต้องการวิเคราะห์อย่างลึกซึ้งครบทุกมิติ ให้ทำ `/deep-analyze` แทน

## Execute

### 1. Tool Selection

> Goal: Tool Selection

1. ทำ `/follow-my-global-cli` เพื่อเช็ค CLI tools ที่ติดตั้ง
2. เลือกใช้ tools ตามความเหมาะสมตาม ## Rules ข้อ 1

### 2. Codebase Scanning

> Goal: Codebase Scanning

1. ทำ `/scan-codebase` เพื่อ scan structure, patterns, และ quality อย่างรวดเร็ว
2. ใช้ผลลัพธ์จาก `/scan-codebase` เป็น foundation สำหรับขั้นตอนถัดไป
3. ทำ `/deep-review` เพื่อดูโครงสร้างไฟล์และ folders เพิ่มเติมถ้าจำเป็น

### 3. Data Collection

> Goal: Data Collection

1. อ่าน manifest files แบบ parallel
2. ทำ `/scan-codebase` ค้นหา code patterns และ symbols
3. ทำ `/use-astgrep` สำหรับ AST-based code search
4. ทำ `/use-scripts` สำหรับ data processing ซับซ้อน

### 4. Architecture And Dependencies

> Goal: Architecture And Dependencies

1. ทำ `/deep-review` เพื่อระบุ architectural pattern
2. ทำ `/scan-codebase` วิเคราะหา data flow
3. ระบุ tech stack และ dependencies

### 5. Code Analysis

> Goal: Code Analysis

1. ทำ `/use-astgrep` หา patterns, anti-patterns, design patterns
2. ทำ `/scan-codebase` หา code smells
3. ทำ `/use-scripts` คำนวณ metrics
4. ตรวจสอบ naming conventions

### 6. Quality And Security

> Goal: Quality And Security

1. ทำ `/review-quality`, `/check-unused-files`, `/check-unused-deps` แบบ parallel
2. ทำ `/run-audit` ตรวจสอบ security
3. ทำ `/scan-codebase` ตรวจหา hardcoded secrets

### 7. Report And Recommendations

> Goal: Report And Recommendations

1. ทำ `/report` สร้างตารางจัดกลุ่มตามหมวดหมู่
2. ท้า /suggest-next-action เพือแนะนำอก์ชันถัดไป้
2. ให้ recommendations ตาม priority

## Rules

- ทำ `/scan-codebase` สำหรับค้นหา code patterns, symbols, และ references
- ใช้ `/use-astgrep` สำหรับ pattern matching และ structural search
- ใช้ `/use-scripts` สำหรับ metrics calculation และ complex processing
- ทำ `/follow-my-global-cli` สำหรับเช็คและใช้ CLI tools ที่ติดตั้ง
- อ่าน manifest files พร้อมกัน
- รัน checks หลายอย่างพร้อมกัน
- รัน `/scan-codebase` patterns พร้อมกัน
- Long functions: > 50 lines
- Deep nesting: > 3 levels
- High complexity: cyclomatic complexity > 10
- Large files: > 300 lines

## Expected Outcome

- รายงานโครงสร้างโปรเจกต์ที่ครบถ้วน
- รายการ dependencies พร้อม versions
- ระบุ architectural patterns ที่ใช้
- รายการ code patterns และ anti-patterns ที่พบ
- รายการ code smells พร้อม locations
- รายการ design patterns ที่ใช้
- Code metrics (complexity, coupling, cohesion)
- รายการ naming violations
- รายการ security vulnerabilities
- Recommendations สำหรับ refactor และ improvements ตาม priority