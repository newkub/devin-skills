---
name: deep-review
description: Review ครบทุกมิติอย่างลึกซึ้ง พร้อม severity ratings และ actionable recommendations
related:
  - rethink
---

## Goal

Review ครบทุกมิติอย่างลึกซึ้ง พร้อม severity ratings และ actionable recommendations โดยใช้ deep workflows หลายตัวทำงานร่วมกัน

## Scope

ใช้สำหรับ review ที่ซับซ้อน ต้องการ comprehensive analysis ครอบคลุม code quality, architecture, security, performance, testing, documentation, configuration, และ dependencies — สำหรับ review เฉพาะด้าน ใช้ `/review-*` workflows

## Execute

Step dependencies: แต่ละ step ขึ้นกับ step ก่อนหน้าตามลำดับ (Step N ขึ้นกับ Step N-1)

### 1. Deep Thinking And Pondering

> Goal: Deep Thinking And Pondering

ทำ `/deep-thinking` และ `/pondering` เพื่อเตรียมการ review อย่างเป็นระบบ

- ทำ `/deep-thinking` เพื่อวางแผนการ review: แบ่งปัญหา สร้างทางเลือก ตรวจสอบ assumptions
- ทำ `/pondering` เพื่อทบทวนมุมมองหลายด้านก่อน review: user, system, future, trade-offs
- ระบุ scope ของ review: ทั้งโปรเจกต์ หรือเฉพาะส่วน
- ถ้า project มี `AGENTS.md` ให้อ่านและทำตาม

### 2. Deep Analyze Foundation

> Goal: Deep Analyze Foundation

ทำ `/deep-analyze` และ `/deep-analyze-by-use-scripts` เพื่อวิเคราะห์โปรเจกต์แบบลึก

- ทำ `/deep-analyze` เพื่อวิเคราะห์ architecture, code quality, features, dependencies, performance, security
- ทำ `/deep-analyze-by-use-scripts` เพื่อรัน review CLI และ AST-based analysis พร้อม metrics
- ทำ `/scan-codebase` เพื่อค้นหา symbols, call sites, consumers
- บันทึก findings จาก analysis เป็น foundation สำหรับ review

### 3. Deep Plan Review Strategy

> Goal: Deep Plan Review Strategy

ทำ `/deep-plan` เพื่อวางแผน review strategy อย่างละเอียด

- จัดลำดับ review dimensions ตาม impact และ risk
- ระบุ critical paths ที่ต้อง review ก่อน
- วางแผน parallel review สำหรับ independent dimensions
- กำหนด review metrics: coverage, severity distribution, finding count

### 4. Review All Dimensions

> Goal: Review All Dimensions

Review ครบทุกมิติตามนี้:

Goal reminder: ทุก dimension ต้องมี severity และ actionable recommendations

1. Code Quality — structure, naming, types, complexity, duplication, dead code
2. Architecture — patterns, boundaries, coupling, design principles, module dependencies
3. Security — auth, secrets, vulnerabilities, RBAC, browser security, data leak, privacy
4. Performance — queries, caching, bundle size, rendering, bottlenecks, web performance
5. Testing — coverage, test quality, test isolation, regression risks
6. Documentation — README, API docs, examples, content quality
7. Configuration — config files, env vars, consistency, safety
8. Dependencies — versions, security, unused, compatibility
9. ถ้า project มี `/review-codebase-everythink` → ใช้เป็น orchestrator สำหรับ dimension reviews

### 5. Deep Report

> Goal: Deep Report

ทำ `/deep-report` เพื่อสร้าง deep report ตาราง 7 columns พร้อม deep summary

- ทำ `/deep-report` เพื่อจัดรูปแบบผลลัพธ์เป็นตาราง 7 columns: Scope, File, Cause, Solutions, Severity, Review Workflow, Evidence
- จัดกลุ่มตาม `reviewWorkflow` และเรียงลำดับตาม severity: Critical > High > Medium > Low
- สร้าง deep summary 5 ส่วน: Domain Breakdown, Severity Distribution, Analyzer Changes, False Positive Analysis, Recommended Actions
- ทุก finding ต้องมี evidence ที่ตรวจสอบได้

### 6. Validate And Suggest Next Action

> Goal: Validate And Suggest Next Action

ตรวจสอบความถูกต้องและแนะนำ action ถัดไป

- ทำ `/deep-validate` เพื่อตรวจสอบความถูกต้องของ findings
- ทำ `/report-table` สรุปผลรวม
- ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไปที่มี impact จริง
- ถ้าพบ critical issues → ระบุ quick wins และ major improvements แยกกัน

## Rules

### 1. Deep Workflow Integration

- ใช้ `/deep-thinking` ก่อนเริ่ม review เสมอ — เพื่อวางแผนอย่างเป็นระบบ
- ใช้ `/pondering` เพื่อทบทวนมุมมองหลายด้านก่อน review
- ใช้ `/deep-analyze` และ `/deep-analyze-by-use-scripts` เพื่อวิเคราะห์ก่อน review
- ใช้ `/deep-plan` เพื่อวางแผน review strategy
- ใช้ `/deep-report` เพื่อจัดรูปแบบผลลัพธ์
- ไม่ duplicate content จาก sub-workflows — อ้างอิงแทน

### 2. Severity Classification

- Critical — ต้องแก้ทันที: security vulnerabilities, data loss, broken core functionality
- High — ต้องแก้ก่อน release: performance bottlenecks, missing tests, broken references
- Medium — ควรแก้: code quality issues, missing docs, minor performance issues
- Low — แก้ได้ทีหลัง: style issues, minor improvements, optional enhancements

### 3. Evidence-Based Findings

- ทุก finding ต้องมี evidence: file path, line number, หรือ code snippet
- ถ้า finding เป็น false positive ให้ระบุใน column Cause ว่า `False positive: <reason>`
- ไม่กล่าวอ้างผลที่ยังไม่ตรวจสอบ
- รายงานเฉพาะผลที่มี evidence แยก completed, failed, skipped, unverified ชัดเจน

### 4. Review Independence

- Review แต่ละ dimension อิสระจากกัน — ไม่ให้ finding ของ dimension หนึ่งอิทธิพลต่ออีก dimension
- ถ้าพบ cross-dimension issue → ระบุในทุก dimension ที่เกี่ยวข้อง
- ใช้ `/review-*` workflows สำหรับ dimension-specific reviews

### 5. Actionable Recommendations

- ทุก finding ต้องมี actionable solution — ไม่ใช่แค่ระบุปัญหา
- จัดลำดับ recommendations ตาม severity และ effort
- ระบุ quick wins (low effort, high impact) แยกจาก major improvements
- เชื่อมโยง findings ไปยัง `/review-*` workflows ที่เกี่ยวข้อง

## Expected Outcome

- Deep review ครบทุกมิติพร้อม severity ratings และ actionable recommendations
- Deep report ตาราง 7 columns พร้อม evidence ที่ตรวจสอบได้
- Deep summary 5 ส่วน: Domain Breakdown, Severity Distribution, Analyzer Changes, False Positive Analysis, Recommended Actions
- ทุก finding มี evidence และ actionable solution
- Quick wins และ major improvements แยกกันชัดเจน
- Next action ที่มี impact จริง