---
name: review-by-stakeholder
description: Review project โดยเลือก roleplay stakeholders ตาม status และ context ของ project
related:
  - use-subagents
  - follow-devin-global-subagents
  - scan-codebase
  - deep-validate
  - report
  - suggest-next-action
---

## Goal

Review project จากหลายมุมมองของ stakeholder โดยเลือก `roleplay-*` ตาม status, stack, และ context ของ project ไม่ต้อง run ทั้งหมด

## Scope

ใช้กับ project ที่ต้องการ multi-perspective review โดยเลือก roleplay ที่เหมาะสม ครอบคลุม web, mobile, library, data, enterprise, และ open source

## Execute

### 1. Detect Project Status

> Goal: รู้ context ก่อนเลือก stakeholder

1. อ่าน `package.json`, `Cargo.toml`, `pyproject.toml`, `moon.yml`, `README`, `AGENTS.md`
2. ทำ `/scan-codebase` หรือ `find_file_by_name` เพื่อหา stack และ boundaries
3. ระบุ project type: web app, mobile, library, CLI, data platform, marketplace
4. ระบุ maturity: MVP, growth, enterprise, open source, internal
5. ระบุ critical domains: payment, auth, data, compliance, public API

### 2. Select Stakeholders

> Goal: เลือก `roleplay-*` ตาม context

เลือก 3-7 บทบาท จากตาราง mapping:

| Project Type | บทบาทที่เลือกได้ |
|---|---|
| Web / SaaS | user, uxui-designer, product-manager, qa-tester, security-architect, performance-engineer, customer-support-agent, growth-manager |
| Mobile app | user, uxui-designer, product-manager, qa-tester, performance-engineer, security-architect |
| Library / SDK | new-developer, technical-writer, open-source-contributor, staff-engineer, solutions-engineer, qa-tester, product-manager |
| Data / analytics | data-analyst, data-engineer, compliance-officer, staff-engineer, performance-engineer |
| Enterprise / B2B | solutions-engineer, customer-success-manager, security-architect, compliance-officer, staff-engineer, qa-tester |
| Early stage / MVP | ceo, product-manager, user, uxui-designer, growth-manager, staff-engineer |
| Open source | open-source-contributor, technical-writer, new-developer, staff-engineer, legal-counsel |

Adjustment rules:
- ถ้ามี payment → เพิ่ม `financial-analyst`, `legal-counsel`, `compliance-officer`
- ถ้ามี customer-facing → เพิ่ม `customer-support-agent`, `customer-success-manager`
- ถ้ามี public API → เพิ่ม `solutions-engineer`, `technical-writer`
- ถ้ามี sensitive data → เพิ่ม `compliance-officer`
- ถ้ามี incident risk สูง → เพิ่ม `incident-commander`, `devops-engineer`
- ไม่เลือกเกิน 7 บทบาท

### 3. Run Stakeholder Reviews

> Goal: เก็บ findings จากแต่ละ roleplay

1. ทำ `/use-subagents` หรือ `/follow-devin-global-subagents` เพื่อ run แต่ละ `/roleplay-*` ที่เลือกพร้อมกัน
2. ส่ง context ที่พบไปให้ทุก roleplay: project type, stack, critical paths, assumptions
3. ถ้าไม่สามารถ parallel ได้ → ทำ `/roleplay-*` ทีละตัวตามลำดับ priority
4. บันทึก findings จากแต่ละ roleplay

### 4. Aggregate Findings

> Goal: รวม findings เป็นมุมมองเดียว

1. ทำ `/deep-validate` เพื่อ cross-check evidence
2. Deduplicate ถ้าหลาย roleplay พบ issue เดียวกัน
3. รวม severity สูงสุด หรือ severity จากทุก roleplay ถ้าต่างกัน
4. จัดกลุ่มตาม dimension: security, ux, performance, growth, ops, compliance, business
5. ระบุ stakeholder ที่พบในแต่ละ finding

### 5. Generate Stakeholder Report

> Goal: สร้างรายงาน multi-stakeholder

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Stakeholder, Dimension, Location, Issue, Impact, Recommendation
3. สร้าง stakeholder coverage map (เลือกอะไร, ไม่เลือกอะไร, เหตุผล)
4. สรุป top 5 findings ตาม severity
5. สรุป conflicts ระหว่าง stakeholder (ถ้ามี)
6. ทำ `/suggest-next-action`

## Rules

### 1. Context First
- ไม่เลือก stakeholder ก่อนดู project status
- ถ้า context ไม่ชัด → ทำ `/scan-codebase` แล้วถาม user
- ถ้า user ระบุ stakeholder เอง → ใช้ตามที user ระบุ

### 2. Selection Discipline
- เลือก 3-7 บทบาท ไม่เกิน
- ไม่ run ทั้งหมด เพราะบทบาทบางตัวไม่เกี่ยวข้อง
- ระบุเหตุผลทีเลือกหรือไม่เลือกแต่ละบทบาท

### 3. Parallel Execution
- พยายามใช้ `/use-subagents` หรือ `/follow-devin-global-subagents` เพื่อ run ขนาน
- ถ้าไม่สามารถ parallel ได้ → ทำ sequential ตาม priority

### 4. Evidence-Based
- ทุก finding ต้องมี file path/line หรือ code snippet
- ระบุ roleplay ที่พบ
- ถ้าเป็น assumption ให้ระบุชัดเจน

### 5. No Runtime Execution In Orchestrator
- `review-by-stakeholder` ไม่รัน test, build, server, browser เอง
- ให้แต่ละ roleplay ทำงานของตัวเองตามกฎของ roleplay
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow

## Expected Outcome

- รายงาน multi-stakeholder review จาก roleplay ที่เลือก
- ตาราง findings มี Severity, Stakeholder, Dimension, Location, Issue, Impact, Recommendation
- stakeholder coverage map พร้อมเหตุผล
- สรุป top 5 findings
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
