---
name: deep-analyze
description: วิเคราะห์โปรเจกต์อย่างลึกซึ้งครบทุกมิติ ด้วย tools, scripts, CLI, และ external research
argument-hint: "[scope]"
related:
  - deep-thinking
  - scan-codebase
  - check-code-structure
  - use-astgrep
  - use-astgrep-programmatic
  - deep-report
  - deep-research
  - run-audit
  - use-scripts
---

## Goal

วิเคราะห์โปรเจกต์อย่างลึกซึ้งครบทุกมิติ เพื่อเข้าใจ architecture, patterns, quality, และ opportunities สำหรับ improvements

## Scope

ครอบคลุมการวิเคราะห์หลายมิติ (merged from: `analyze-project`, `deep-analyze-by-use-scripts`, `scan-codebase`, `check-code-structure`):

- Architecture และ design patterns
- Code quality และ technical debt
- Features และ business logic
- Dependencies และ tech stack
- Performance และ security
- External research สำหรับ best practices
- Recommendations สำหรับ improvements

## Execute

### 1. Deep Thinking Phase

> Goal: วิเคราะห์ปัญหาและวางแผนก่อนเริ่ม

1. ทำ `/deep-thinking` เพื่อกำหนด objectives, sub-problems, assumptions และ action plan
2. ระบุ scope และ thresholds ตาม ## Rules ข้อ 4

### 2. Quick Scan Phase

> Goal: Scan codebase อย่างรวดเร็วและเลือก analysis depth

1. ทำ `/scan-codebase` ดู structure, patterns, quality ใน 3 นาที
2. ถ้าต้องการ analysis ด้วย review CLI, ast-grep NAPI, Bun scripts:
   - ตรวจสอบ `tools/review-codebase` กับ `tools/analyze`
   - ใช้ `@ast-grep/napi` หรือ `oxc-parser` สำหรับ programmatic AST analysis
   - รวบรวม metrics จาก knip, biome, vitest, madge, `ast-grep scan`
3. สร้าง structured data สำหรับ analysis

### 3. Structure Analysis

> Goal: วิเคราะห์โครงสร้างไฟล์และ symbols

1. รัน tree command ดู directory structure
2. ทำ `/check-code-structure` เพื่อใช้ `ast-grep outline`
3. วิเคราะห์ top-level symbols, exports, members, SRP violations, cohesion
4. ตรวจสอบ file patterns, naming conventions, และ cross-layer imports

### 4. Architecture Analysis

> Goal: วิเคราะห์ architecture และ design patterns

1. ทำ `/use-astgrep` ระบุ architectural patterns
2. วิเคราะห์ data flow ด้วย `Grep`
3. ระบุ design patterns และ adherence ต่อ principles
4. วิเคราะห์ coupling และ cohesion

### 5. Features Analysis

> Goal: วิเคราะห์ features และ business logic

1. Discovery และ inventory features ทั้งหมด
2. Categorize และ group features
3. Document features ในรูปแบบ systematic
4. Validate และ review features

### 6. Code Quality Analysis

> Goal: วิเคราะห์ code quality อย่างละเอียด

1. ทำ `/use-astgrep` หา patterns, anti-patterns, design patterns
2. ทำ `/use-astgrep-programmatic` สำหรับ AST-based metrics ถ้าต้องการ
3. หา code smells ด้วย `Grep` multiline mode
4. ใช้ `/use-scripts` คำนวณ metrics (complexity, coupling, cohesion)
5. ทำ `/review-quality`, `/check-unused` แบบ parallel
6. ตรวจหา hardcoded secrets ด้วย `Grep`

### 7. Dependencies And Tech Stack

> Goal: วิเคราะห์ dependencies และ tech stack

1. อ่าน manifest files แบบ parallel
2. ระบุ tech stack และ versions
3. วิเคราะห์ dependency graph
4. ตรวจสอบ outdated dependencies
5. วิเคราะห์ security vulnerabilities ด้วย `/run-audit`

### 8. Performance And Security

> Goal: วิเคราะห์ performance และ security

1. วิเคราะห์ performance bottlenecks
2. ตรวจสอบ security vulnerabilities
3. วิเคราะห์ error handling และ resilience
4. ตรวจสอบ caching strategies
5. วิเคราะห์ database queries ถ้ามี

### 9. External Research

> Goal: ทำ `/deep-research` เพื่อค้นหา best practices

1. ค้นหา best practices สำหรับ tech stack ที่ใช้
2. ค้นหา alternatives ที่ดีกว่าสำหรับ dependencies
3. ค้นหา official documentation
4. เปรียบเทียบ findings กับ project ปัจจุบัน
5. ระบุ gaps ระหว่าง current implementation และ best practices

### 10. Comprehensive Report

> Goal: สร้างรายงานครบถ้วน

1. ทำ `/deep-report` สร้างตาราง 7 columns: Scope, File, Cause, Solutions, Severity, Review Workflow, Evidence
2. ทำ `/report` สรุปตารางจัดกลุ่มตามหมวดหมู่ถ้าต้องการ chat output
3. ให้ recommendations ตาม priority และ impact
4. ระบุ action items ที่ชัดเจน
5. สร้าง roadmap สำหรับ improvements

## Rules

### 1. Analysis Depth

- ใช้ `/deep-thinking` ก่อนเริ่มเสมอ
- ใช้ `/scan-codebase` สำหรับ quick overview
- ใช้ workflows เฉพาะทางสำหรับแต่ละมิติ
- ใช้ `/deep-research` สำหรับ external validation
- ไม่ข้ามขั้นตอน analysis ใดๆ

### 2. Tool Selection

- Structure: `/scan-codebase`, tree, `ast-grep outline`, `/check-code-structure`
- Architecture: `/use-astgrep`, `Grep`
- Features: `/scan-codebase`, `/use-astgrep`
- Code Quality: `/use-astgrep`, `/use-astgrep-programmatic`, `Grep`, `/use-scripts`
- Dependencies: manifest files, `/run-audit`
- Research: `/deep-research`, DeepWiki, Context7, WebSearch

### 3. Parallel Processing

- อ่าน manifest files พร้อมกัน
- รัน checks หลายอย่างพร้อมกัน
- รัน `Grep` patterns พร้อมกัน
- รัน ast-grep patterns พร้อมกัน

### 4. Metric Thresholds

- Long functions: > 50 lines
- Deep nesting: > 3 levels
- High complexity: cyclomatic complexity > 10
- Large files: > 300 lines
- High coupling: > 7 dependencies
- Low cohesion: < 0.3

### 5. Research Validation

- ใช้ multiple sources สำหรับ validation
- ตรวจสอบ credibility ของ sources
- เปรียบเทียบกับ project context
- ระบุ assumptions ที่ใช้

### 6. Report Quality

- จัดกลุ่ม findings ตามหมวดหมู่
- ให้ recommendations ตาม priority และ impact
- ระบุ action items ที่ชัดเจน
- สร้าง roadmap สำหรับ improvements
- ใช้ `/deep-report` สำหรับ detailed report
- ใช้ `/report` สำหรับ chat table

### 7. Deep Analysis Scripts

- ตรวจสอบ `tools/review-codebase` ก่อนใช้
- ตรวจสอบ `tools/analyze` ถ้ามี
- ใช้ `@ast-grep/napi` สำหรับ programmatic AST analysis
- รวบรวม metrics จาก knip, biome, vitest, madge
- รัน `bunx ast-grep outline` ดู structure

## Expected Outcome

- เข้าใจ architecture และ design patterns ที่ใช้
- ระบุ code quality issues พร้อม severity
- ระบุ features ทั้งหมดและ dependencies
- ระบุ tech stack และ outdated dependencies
- ระบุ performance และ security issues
- ระบุ gaps ระหว่าง current implementation และ best practices
- Recommendations สำหรับ improvements ตาม priority และ impact
- Roadmap สำหรับ improvements ที่ชัดเจน
