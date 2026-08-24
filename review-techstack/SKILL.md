---
name: review-techstack
description: Review tech stack และ dependencies ครอบคลุม framework, library, runtime, versions, security, unus...
---

## Goal

Review tech stack และ dependencies quality ครอบคลุม framework choices, library versions, runtime compatibility, technology alignment, dependency versions, security vulnerabilities, unused packages, transitive dependencies, และ compatibility

## Scope

framework selection, library versions, runtime compatibility, build tools, package manager, technology alignment, dependency versions, security vulnerabilities, unused dependencies, transitive dependencies, duplicate packages, และ compatibility

## Execute

### 1. Prepare

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ tech stack structure ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ tech stack structure
2. ระบุ frameworks, runtimes, build tools และ package manager ที่ใช้

### 2. Deep Analyze

วิเคราะห์ tech stack อย่างลึกซึ้ง

> Goal: ครอบคลุมทุก tech stack dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter tools-review review:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. Analyzer ตรวจสอบ framework versions, compatibility matrix, และ EOL status
6. Analyzer ตรวจสอบ library alignment กับ project requirements และ redundancy
7. Analyzer ตรวจสอบ build tool configuration, package manager consistency, และ runtime requirements
8. Analyzer ตรวจสอบ outdated dependencies, security vulnerabilities, unused packages, transitive dependencies, และ duplicate packages
9. Review CLI คำนวณ tech stack review score จาก review report
10. ถ้า review CLI ไม่ผ่าน → ทำ `/update-create-review-cli` แล้ว re-run ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report

### 3. Validate Findings

ตรวจสอบว่า findings แต่ละอย่างถูกต้อง

> Goal: Findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับการ validate ตาม severity

### 4. Report

รายงานผล review ในรูปแบบตาราง

> Goal: รายงาน findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Tech Stack Metrics Summary: framework versions, library alignment, build tools, security vulnerabilities, unused packages, duplicate packages พร้อม status
3. สร้างตาราง Findings by Category: Category, Finding, Severity, Location, Recommendation
4. สร้างตาราง Recommended Actions: Priority, Action, Impact, Effort, Workflow
5. แสดง tech stack review score พร้อม progress bar และ grade
6. ทำ `/suggest-next-action`

### 5. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Severity Classification

- Critical: EOL framework, incompatible runtime, security-impacted version, critical vulnerability, incompatible dependency
- High: outdated major version, redundant library, missing compatibility, high vulnerability, outdated major dependency version
- Medium: minor version lag, suboptimal build tool, inconsistent package manager, unused dependency, outdated minor dependency version
- Low: cosmetic config improvement, naming convention, outdated patch version, duplicate package

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number หรือ package name และ version

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 4. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง findings พร้อม severity และ location
- รายงาน recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
