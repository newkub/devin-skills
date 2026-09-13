---
name: deep-analyze
description: วิเคราะห์โปรเจกต์อย่างลึกซึ้งครบทุกมิติ ด้วย tools, scripts, CLI, และ external research
argument-hint: "[scope]"
related:
  - deep-thinking
  - scan-codebase
  - check-files
  - check-code-structure
  - use-astgrep
  - use-astgrep
  - report-deep
  - deep-research
  - run-audit
  - use-scripts
---

## Goal

วิเคราะห์โปรเจกต์อย่างลึกซึ้งครบทุกมิติ เพื่อเข้าใจ architecture, patterns, quality, และ opportunities สำหรับ improvements

## Scope

ครอบคลุมการวิเคราะห์หลายมิติ (merged from: `analyze-project`, `deep-analyze-by-use-scripts`, `scan-codebase`, `check-code-structure`, `check-file-structure`):

- Architecture และ design patterns
- Code quality และ technical debt
- Features และ business logic
- Dependencies และ tech stack
- Performance และ security
- External research สำหรับ best practices
- Recommendations สำหรับ improvements

## Execute

### 1. Deep Thinking And Quick Scan

> Goal: วิเคราะห์ปัญหาและวางแผนก่อนเริ่ม

1. ทำ `/deep-thinking` เพื่อกำหนด objectives, sub-problems, assumptions และ action plan
2. ระบุ scope และ thresholds ตาม ## Rules ข้อ 4
3. ทำ `/scan-codebase` ดู structure, patterns, quality ใน 2 นาที
4. ทำ `/check-files structure` ด้วย `eza --tree --level 2` ดู physical layout และ file-level issues ใน 1 นาที
5. ใช้ `/use-astgrep` หา patterns เบื้องต้น และ `/use-scripts` รวบรวม metrics ถ้าต้องการ
6. ถ้าต้องการ analysis ด้วย review CLI, ast-grep NAPI, Bun scripts:
   - ตรวจสอบ `tools/review-codebase` กับ `tools/analyze`
   - ใช้ `@ast-grep/napi` หรือ `oxc-parser` สำหรับ programmatic AST analysis
   - รวบรวม metrics จาก knip, biome, vitest, madge, `ast-grep scan`
7. สร้าง structured data สำหรับ analysis

### 2. Structure Analysis

> Goal: วิเคราะห์โครงสร้างไฟล์และ symbols

1. ทำ `/check-files structure` ด้วย `eza --tree --level 2` หรือ `tree` ดู directory structure
2. ทำ `/check-code-structure` เพื่อใช้ `ast-grep outline`
3. วิเคราะห์ top-level symbols, exports, members, SRP violations, cohesion
4. ตรวจสอบ file patterns, naming conventions, และ cross-layer imports

### 3. Architecture Analysis

> Goal: วิเคราะห์ architecture และ design patterns

1. ทำ `/use-astgrep` ระบุ architectural patterns
2. วิเคราะห์ data flow ด้วย `Grep`
3. ระบุ design patterns และ adherence ต่อ principles
4. วิเคราะห์ coupling และ cohesion

### 4. Features Analysis

> Goal: วิเคราะห์ features และ business logic

1. Discovery และ inventory features ทั้งหมด
2. Categorize และ group features
3. Document features ในรูปแบบ systematic
4. Validate และ review features

### 5. Code Quality Analysis

> Goal: วิเคราะห์ code quality อย่างละเอียด

1. ทำ `/use-astgrep` หา patterns, anti-patterns, design patterns
2. ทำ `/use-astgrep programmatic` สำหรับ AST-based metrics ถ้าต้องการ
3. หา code smells ด้วย `Grep` multiline mode
4. ใช้ `/use-scripts` คำนวณ metrics (complexity, coupling, cohesion)
5. ทำ `/review-quality`, `/check-repo-hygiene unused` แบบ parallel
6. ตรวจหา hardcoded secrets ด้วย `Grep`

### 6. Dependencies And Tech Stack

> Goal: วิเคราะห์ dependencies และ tech stack

1. อ่าน manifest files แบบ parallel
2. ระบุ tech stack และ versions
3. วิเคราะห์ dependency graph
4. ตรวจสอบ outdated dependencies
5. วิเคราะห์ security vulnerabilities ด้วย `/run-audit`

### 7. Performance And Security

> Goal: วิเคราะห์ performance และ security

1. วิเคราะห์ performance bottlenecks
2. ตรวจสอบ security vulnerabilities
3. วิเคราะห์ error handling และ resilience
4. ตรวจสอบ caching strategies
5. วิเคราะห์ database queries ถ้ามี

### 8. Domain Dispatch

> Goal: ครอบคลุมทุก dimension — dispatch ไป `review-*` ตาม stack ที่ตรวจพบ

| Domain | Skill | เมื่อไร |
|--------|-------|--------|
| api | `/review-api` | มี endpoints/REST/GraphQL |
| auth | `/review-auth` | มี auth/session/OAuth |
| security | `/review-security` | เสมอ |
| frontend | `/review-frontend` | มี UI code |
| backend | `/review-backend` | มี server code |
| database | `/review-database` | มี DB/ORM/migrations |
| migration | `/review-migration` | มี migration files |
| tests | `/review-test` | มี test suite |
| performance | `/review-performance` | เสมอ |
| bundle | `/review-bundle` | มี frontend build |
| assets | `/review-assets` | มี images/fonts/media |
| seo | `/review-seo` | มี public web pages |
| accessibility | `/review-accessibility` | มี UI |
| uxui | `/review-uxui` | มี UI/design system |
| docs | `/review-docs` | มี docs/README |
| dependencies | `/review-dependencies` | เสมอ |
| config | `/review-config` | มี config/env files |
| delivery | `/review-delivery` | มี CI/CD/Docker |
| observability | `/review-observability` | มี production services |
| stability | `/review-stability` | มี production services |
| cost | `/review-cost` | มี cloud infra |
| compliance | `/review-compliance` | มี user data/regulated domain |
| business | `/review-business` | มี payments/tenancy/flags |
| data-validation | `/review-data-validation` | มี forms/schemas |
| algorithm | `/review-algorithm` | มี compute-heavy logic |
| quality | `/review-quality` | เสมอ |
| correctness | `/review-quality` | เสมอ (merged) |
| architecture | `/review-architecture` | เสมอ |
| cli | `/review-cli` | มี CLI entry points |
| i18n | `/review-i18n` | มีหลาย locale |
| mobile | `/review-mobile` | มี mobile app/PWA mobile |
| ai | `/review-ai` | มี LLM/AI features |
| mcp | `/review-mcp` | มี MCP servers/config |
| events | `/review-events` | มี queues/webhooks/event-driven |
| workspace | `/review-workspace` | monorepo |
| rules/.devin | `/review-rules` + `/review-dot-devin` | มี `.devin/` config |
| risk | `/review-risk` | เสมอ (top-level) |

- dispatch เฉพาะ domains ที่ stack ตรวจพบ — ห้ามรันทุกตัวทุกครั้ง
- parallel ผ่าน `/use-subagents` เมื่อหลาย domains
- findings ทั้งหมดรวมเข้า report เดียวพร้อม domain tag
- dedup: finding เดียวกันจากหลาย domains → merge เป็น item เดียว tag ทุก domain ที่เจอ
- ถ้า `/deep-review` รันไปแล้วใน session → reuse findings ของมัน อย่า dispatch ซ้ำ domains เดิม
### 9. External Research

> Goal: ทำ `/deep-research` เพื่อค้นหา best practices

1. ค้นหา best practices สำหรับ tech stack ที่ใช้
2. ค้นหา alternatives ที่ดีกว่าสำหรับ dependencies
3. ค้นหา official documentation
4. เปรียบเทียบ findings กับ project ปัจจุบัน
5. ระบุ gaps ระหว่าง current implementation และ best practices

### 10. Comprehensive Report

> Goal: สร้างรายงานครบถ้วน

1. ทำ `/report-deep` สร้างตาราง 7 columns: Scope, File, Cause, Solutions, Severity, Review Workflow, Evidence
2. aggregate per-domain scores จาก dispatched `review-*` → overall score + grade — ตาราง `No. | Domain | Score | Grade | Top Finding`
3. ทำ `/report` สรุปตารางจัดกลุ่มตามหมวดหมู่ถ้าต้องการ chat output
4. ให้ recommendations ตาม priority และ impact
5. ระบุ action items ที่ชัดเจน
6. สร้าง roadmap สำหรับ improvements

## Rules

### 1. Analysis Depth

- ใช้ `/deep-thinking` ก่อนเริ่มเสมอ
- ใช้ `/scan-codebase` สำหรับ quick overview
- ใช้ workflows เฉพาะทางสำหรับแต่ละมิติ
- ใช้ `/deep-research` สำหรับ external validation
- ไม่ข้ามขั้นตอน analysis ใดๆ

### 2. Tool Selection

- Structure: `/scan-codebase`, `/check-files structure`, `eza --tree`, `ast-grep outline`, `/check-code-structure`
- Architecture: `/use-astgrep`, `Grep`
- Features: `/scan-codebase`, `/use-astgrep`
- Code Quality: `/use-astgrep`, `/use-astgrep programmatic`, `Grep`, `/use-scripts`
- Dependencies: manifest files, `/run-audit`
- Research: `/deep-research`, DeepWiki, Context7, WebSearch

### 3. Parallel Processing

- อ่าน manifest files พร้อมกัน
- รัน checks หลายอย่างพร้อมกัน
- รัน `Grep` patterns พร้อมกัน
- รัน ast-grep patterns พร้อมกัน

### 3. Metric Thresholds

- Long functions: > 50 lines
- Deep nesting: > 3 levels
- High complexity: cyclomatic complexity > 10
- Large files: > 300 lines
- High coupling: > 7 dependencies
- Low cohesion: < 0.3

### 3. Research Validation

- ใช้ multiple sources สำหรับ validation
- ตรวจสอบ credibility ของ sources
- เปรียบเทียบกับ project context
- ระบุ assumptions ที่ใช้

### 3. Report Quality

- จัดกลุ่ม findings ตามหมวดหมู่
- ให้ recommendations ตาม priority และ impact
- ระบุ action items ที่ชัดเจน
- สร้าง roadmap สำหรับ improvements
- ใช้ `/report-deep` สำหรับ detailed report
- ใช้ `/report` สำหรับ chat table

### 3. Deep Analysis Scripts

- ตรวจสอบ `tools/review-codebase` ก่อนใช้
- ตรวจสอบ `tools/analyze` ถ้ามี
- ใช้ `@ast-grep/napi` สำหรับ programmatic AST analysis
- รวบรวม metrics จาก knip, biome, vitest, madge
- รัน `bunx ast-grep outline` ดู structure
- รัน `eza --tree --level 2` หรือ `/check-files structure` ดู physical layout

## Expected Outcome

- เข้าใจ architecture และ design patterns ที่ใช้
- ระบุ code quality issues พร้อม severity
- ระบุ features ทั้งหมดและ dependencies
- ระบุ tech stack และ outdated dependencies
- ระบุ performance และ security issues
- ระบุ gaps ระหว่าง current implementation และ best practices
- Recommendations สำหรับ improvements ตาม priority และ impact
- Roadmap สำหรับ improvements ที่ชัดเจน
