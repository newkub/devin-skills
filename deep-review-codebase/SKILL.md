---
name: deep-review-codebase
description: Review codebase ครบทุกมิติ พร้อม severity ratings และ map ไปยัง review-* workflows ทีเหมาะสม
argument-hint: "[target-or-path]"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - find_file_by_name
  - exec
  - ask_user_question
  - todo_write
  - skill
  - run_subagent
triggers:
  - user
  - model
related:
  - deep-review
  - deep-thinking
  - pondering
  - deep-analyze
  - deep-analyze-by-use-scripts
  - scan-codebase
  - deep-plan
  - run-review
  - update-project-rules
  - update-review-cli
  - update-create-analyze-cli
  - deep-validate
  - deep-report
  - review-quality
  - review-architecture
  - review-security
  - review-performance
  - review-test
  - review-docs
  - review-config
  - review-techstack
  - suggest-next-action
  - fix
  - run-check
  - ship
  - deep-ship
---

## Goal

Review ครบทุกมิติของ codebase อย่างลึกซึ้ง พร้อม severity ratings และ actionable recommendations โดย map แต่ละ dimension ไปยัง `/review-*` workflows ทีเหมาะสม

## Scope

ใช้สำหรับ review codebase ทีซับซ้อน ครอบคลุม code quality, architecture, security, performance, testing, documentation, configuration, และ dependencies — สำหรับ review เฉพาะด้าน ให้ใช้ `/review-*` workflows โดยตรง

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้าตามลำดับ (Step N ขึ้นกับ Step N-1)

### 1. Deep Thinking And Pondering

> Goal: เตรียมการ review อย่างเป้นระบบ

- ทำ `/deep-thinking` เพื่อวางแผน review: แบ่งปัญหา สร้างทางเลือก ตรวจสอบ assumptions
- ทำ `/pondering` เพื่อทบทวนมุมมองหลายด้านก่อน review: user, system, future, trade-offs
- ระบุ scope ของ review: ทั้งโปรเจกต์ หรือเฉพาะส่วน
- ถ้า project มี `AGENTS.md` ให้อ่านและทำตาม

### 2. Deep Analyze Foundation

> Goal: วิเคราะห์โปรเจกต์แบบลึก

- ทำ `/deep-analyze` เพื่อวิเคราะห์ architecture, code quality, features, dependencies, performance, security
- ทำ `/deep-analyze-by-use-scripts` เพื่อรัน review CLI และ AST-based analysis พร้อม metrics
- ทำ `/scan-codebase` เพื่อค้นหา symbols, call sites, consumers
- บันทึก findings จาก analysis เป้น foundation สำหรับ review

### 3. Deep Plan Review Strategy

> Goal: วางแผน review strategy อย่างละเอียด

- จัดลำดับ review dimensions ตาม impact และ risk
- ระบุ critical paths ทีต้อง review ก่อน
- วางแผน parallel review สำหรับ independent dimensions
- กำหนด review metrics: coverage, severity distribution, finding count

### 3.5 Run CLI Review (If Available)

> Goal: สร้างหรืออัปเดต `tools/review-codebase` CLI แล้วรัน review เพื่อวัด metrics ครบทุกมิติ

ถ้า project มีหรือกำลังสร้าง `tools/review-codebase` CLI ที project root ให้ดำเนินการ 10 ขั้นตอนตาม `references/cli-review-steps.md` ถ้า CLI ไม่มี → ใช้ `/deep-analyze` และ `/review-*` workflows แทน

1. เตรียมและอัปเดต rules, skills, CLI ด้วย `/scan-codebase`, `/update-project-rules`, `/update-create-analyze-cli`, `/check-should-update`
2. วางแผน analyzer categories ตาม 5 domains จาก `/run-review` แล้ว map ไป `src/domain/analyzers/`
3. สร้างหรืออัปเดท workspace `tools-review-codebase` พร้อม `package.json`, `tsconfig.json`, `biome.jsonc`, `README.md` scripts
4. สร้างโครงสร้าง Clean Architecture สำหรับ `src/{adapters,domain,application,presentation}` แล้ว integrate `tools-analyze`
5. รัน `bun --filter tools-review-codebase {lint, typecheck, review-codebase, review-codebase:json}` บันทึก before metrics
6. ถ้า metrics ไม่ผ่านเกณฑ์ (categories < 60, score < 70, grade D/F, domain < 50, analyzerErrors > 0, falsePositiveRate > 20%) → ทำ `/update-create-analyze-cli` แล้วรันใหม่ ไม่เกิน 3 รอบ
7. ทำ `/run-review` เพื่อวิเคราะห์ผลลัพธ์ และ map findings ไป `reviewWorkflow` ทีเหมาะสม

ถ้าทุก metrics ผ่าน → ไป Step 4 (Review All Dimensions)

### 4. Review All Dimensions

> Goal: Review ครบทุกมิติ โดยเลือก `/review-*` ทีเหมาะสม

ถ้ามี findings จาก `tools/review-codebase` หรือ `/run-review` ให้ใช้เป้น foundation แล้วเติม gaps ด้วย manual review

1. Code Quality — `/review-quality`
2. Architecture — `/review-architecture`
3. Security — `/review-security`
4. Performance — `/review-performance`
5. Testing — `/review-test`
6. Documentation — `/review-docs`
7. Configuration — `/review-config`
8. Dependencies — `/review-techstack`
9. ถ้า project มี `tools/review-codebase` → ใช้ `/run-review` เป้น orchestrator สำหรับ dimension reviews

### 5. Deep Report

> Goal: สร้าง deep report ตาราง 7 columns พร้อม deep summary

- ทำ `/deep-report` เพื่อจัดรูปแบบผลลัพธ์เป้นตาราง 7 columns: Scope, File, Cause, Solutions, Severity, Review Workflow, Evidence
- จัดกลุ่มตาม `reviewWorkflow` และเรียงลำดับตาม severity: Critical > High > Medium > Low
- สร้าง deep summary 5 ส่วน: Domain Breakdown, Severity Distribution, Analyzer Changes, False Positive Analysis, Recommended Actions
- ทุก finding ต้องมี evidence ทีตรวจสอบได้

### 6. Validate And Suggest Next Action

> Goal: ตรวจสอบความถูกต้องและแนะนำ action ถัดไป

- ทำ `/deep-validate` เพื่อตรวจสอบความถูกต้องของ findings
- ใช้ `grep` หรือ `ast-grep` สำหรับ pattern-based checks ถ้าเกี่ยวข้อง
- ระบุ severity: Critical → High → Medium → Low
- ระบุ root cause และ false positives ทีพบ
- ทำ `/run-review` เพื่อวัด after score
- ทำ `/report-table` สรุปผลรวม
- ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไปทีมี impact จริง
- ถ้าพบ critical issues → ระบุ quick wins และ major improvements แยกกัน

### 7. Ship (If Requested)

> Goal: ส่งมอบงานหลัง deep review ผ่าน

- ถ้า user ต้องการ ship ผลงานทีผ่าน deep review และ validation → ทำ `/ship` สำหรับ ship ทั่วไป หรือ `/deep-ship` ถ้าต้องการ deep validation, release, deploy, rollback plan
- ทำ `/suggest-next-action` หลัง `/ship` หรือ `/deep-ship` เสร็จเพื่อแนะนำ action ถัดไป

## Rules

### 1. Deep Workflow Integration

- ใช้ `/deep-thinking` ก่อนเริ่ม review เสมอ
- ใช้ `/pondering` เพื่อทบทวนมุมมองหลายด้านก่อน review
- ใช้ `/deep-analyze` และ `/deep-analyze-by-use-scripts` เพื่อวิเคราะห์ก่อน review
- ใช้ `/deep-plan` เพื่อวางแผน review strategy
- ใช้ `/deep-report` เพื่อจัดรูปแบบผลลัพธ์
- ใช้ Step 3.5 สำหรับ CLI-driven review ถ้า project มี `tools/review-codebase`
- ใช้ `/run-review` เพื่อวิเคราะห์ผล metrics จาก CLI
- ไม่ duplicate content จาก sub-workflows — อ้างอิงแทน

### 2. Severity Classification

- Critical — ต้องแก้ทันที: security vulnerabilities, data loss, broken core functionality
- High — ต้องแก้ก่อน release: performance bottlenecks, missing tests, broken references
- Medium — ควรแก้: code quality issues, missing docs, minor performance issues
- Low — แก้ได้ทีหลัง: style issues, minor improvements, optional enhancements

### 3. Evidence-Based Findings

- ทุก finding ต้องมี evidence: file path, line number, หรือ code snippet
- ถ้า finding เป้น false positive ให้ระบุใน column Cause ว่า `False positive: <reason>`
- ไม่กล่าวอ้างผลทียังไม่ตรวจสอบ
- รายงานเฉพาะผลทีมี evidence แยก completed, failed, skipped, unverified ชัดเจน

### 4. Review Independence

- Review แต่ละ dimension อิสระจากกัน — ไม่ให้ finding ของ dimension หนึ่งอิทธิพลต่ออีก dimension
- ถ้าพบ cross-dimension issue → ระบุในทุก dimension ทีเกี่ยวข้อง
- ใช้ `/review-*` workflows สำหรับ dimension-specific reviews
- ทำ review เท่านั้น ไม่แก้ไขระหว่าง review
- แยก review process จาก fix process

### 5. CLI-Driven Review

- ใช้ `tools/review-codebase` CLI เป้นแหล่งหลักของ findings ไม่ manual อ่าน references ทีละ dimension
- ถ้า metrics บ่งชี้ให้ update CLI → ทำ Step 3.5 ก่อนรีวิวต่อ
- `tools/review-codebase` สร้างที project root เท่านั้น ไม่ใช่ `tools/review`

### 6. Metric Triggers

- `categories < 60` → เพิ่ม analyzers ด้วย `/update-create-analyze-cli` Step 5-6
- `score < 70` หรือ `grade D/F` → ปรับปรุง analyzers ด้วย `/update-create-analyze-cli`
- `domain score < 50` → ปรับปรุง domain นั้นใน `tools/analyze`
- `analyzerErrors > 0` → แก้ไข analyzer errors ด้วย `/update-create-analyze-cli`
- `falsePositiveRate > 20%` → tune rules ใน `tools/analyze`
- `reviewWorkflow` ไม่ถูกต้อง → แก้ไข mapping ใน Step 5 ของ `/update-create-analyze-cli`

### 7. Execution Governance

- สร้าง/อัปเดต CLI แล้วรัน review ใหม่ ไม่เกิน 3 รอบ
- ทำ `/update-references` หลังจากแก้ไขไฟล์
- รัน tests หลังแต่ละ improvement

### 8. Formatting

- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป้นตารางด้วย `/report-table`

### 9. Actionable Recommendations

- ทุก finding ต้องมี actionable solution — ไม่ใช่แค่ระบุปัญหา
- จัดลำดับ recommendations ตาม severity และ effort
- ระบุ quick wins (low effort, high impact) แยกจาก major improvements
- เชื่อมโยง findings ไปยัง `/review-*` workflows ทีเกี่ยวข้อง
- ใช้ `/rethink` ถ้าจำเป็น

## Expected Outcome

- Deep review ครบทุกมิติพร้อม severity ratings และ actionable recommendations
- รองรับ CLI-driven review ผ่าน Step 3.5, `references/cli-review-steps.md`, และ `/run-review` ถ้ามี `tools/review-codebase`
- Deep report ตาราง 7 columns พร้อม evidence ทีตรวจสอบได้
- Deep summary 5 ส่วน: Domain Breakdown, Severity Distribution, Analyzer Changes, False Positive Analysis, Recommended Actions
- ทุก finding มี evidence และ actionable solution
- Before-after review score ผ่าน `/run-review`
- Issues ถูก validate และจัดลำดับตาม severity
- Quick wins และ major improvements แยกกันชัดเจน
- Next action ทีมี impact จริง
