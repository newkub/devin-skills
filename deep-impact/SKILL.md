---
name: deep-impact
description: วิเคราะห์ผลกระทบลึกของ change ก่อน refactor, delete, rename, หรือ upgrade
related:
  - check-file-relations
  - search-files-patterns
  - report-workspace-graph
  - report-public-api
  - update-references
  - rename-to
  - run-test
  - deep-validate
  - review-risk
---

## Goal

วิเคราะห์ผลกระทบลึกของการเปลี่ยนแปลง code, dependency, API, infrastructure, หรือ architecture ก่อนลงมือ เพื่อลด regression และ surprise

## Scope

ใช้ก่อน refactor, delete, rename, move, upgrade dependency, change public API, หรือ major architectural change
ไม่ใช้สำหรับแก้ error เฉพาะหน้า — ใช้ `/resolve-errors`
ไม่ใช้สำหรับหาสาเหตุของ bug — ใช้ `/deep-debug`

## Execute

### 1. Define Change Scope

> Goal: ระบุสิ่งทีจะเปลี่ยนอย่างชัดเจน

1. ระบุ target: ไฟล์, function, class, API endpoint, dependency, config
2. ระบุ nature ของ change: refactor, delete, rename, upgrade, behavior change, signature change
3. ระบุ motivation: ทำไมต้องเปลี่ยน
4. ทำ `/scan-codebase` เพื่อเข้าใจ context

### 2. Map Direct Dependencies

> Goal: หา consumers ทีใช้งาน target โดยตรง

1. ทำ `/check-file-relations` เพื่อหา imports, consumers, references
2. ทำ `/search-files-patterns` เพื่อค้นหา call sites, imports, string references
3. ใช้ ast-grep หา pattern ทีอาจหายไปถ้า target เปลี่ยน
4. ตรวจสอบ public API: `/report-public-api` ถ้าเป็น library/project
5. บันทึก direct consumers เป็นลิสต์พร้อมตำแหน่ง

### 3. Map Indirect Dependencies

> Goal: หา chain effect ของ change

1. ตรวจสอบ workspace graph: `/report-workspace-graph` ถ้าเป็น monorepo
2. หา downstream consumers ของ consumers (2-3 levels)
3. ตรวจสอบ transitive dependencies ถ้าเป็น package upgrade
4. ระบุ shared config, types, schemas ทีอาจได้รับผลกระทบ
5. ทำ `/deep-thinking` ถ้า chain ซับซ้อน

### 4. Estimate Blast Radius

> Goal: ประเมินขนาดและความรุนแรงของผลกระทบ

1. จำนวนไฟล์/ไฟล์ทีต้องอัปเดต
2. จำนวน consumers ทั้ง internal และ external
3. จำนวน tests ทีอาจ fail
4. ระบบหรือ features ทีอาจหยุดทำงาน
5. data migration หรือ schema change ทีจำเป็นหรือไม

### 5. Assess Risk

> Goal: ประเมินความเสี่ยงและ mitigation

1. ทำ `/review-risk` เพื่อประเมิน probability และ impact
2. ระบุ risks ตามมิติ: correctness, performance, security, compatibility, DX
3. จัดลำดับ risk ตาม severity
4. ออกแบบ mitigation สำหรับแต่ละ risk สูง
5. ระบุ rollback plan ถ้าจำเป็น

### 6. Plan Migration

> Goal: สร้างแผนการเปลี่ยนแปลงทีปลอดภัย

1. เลือก strategy: in-place, backward-compatible, feature flag, staged rollout, blue-green
2. ระบุ breaking changes และทางเลือกทีช่วยลดผลกระทบ
3. วางแผนการ update references: `/update-references` หรือ `/rename-to`
4. วางแผนการ test: รัน `/run-test` หรือ `/run-verify-on-local`
5. ระบุระยะเวลาและ checkpoints

### 7. Execute Change Safely

> Goal: ทำการเปลี่ยนแปลงตามแผน

1. ทำ dry run สำหรับ changes ทีมีผลกระทบมาก
2. เปลี่ยนทีละ step ตาม migration plan
3. รัน tests หลังแต่ละ stage
4. ทำ `/deep-validate` เพื่อตรวจ reference, type, lint
5. ถ้า test fail → กลับไปใช้ `/deep-debug` หา root cause

### 8. Verify And Communicate

> Goal: ยืนยันว่า change ปลอดภัยและสื่อสารให้ทีมรู้

1. รัน test suite ทั้งหมด
2. รัน lint, typecheck, build
3. ทำ `/report-table` สรุป impact, risk, mitigation, test results
4. บันทึก migration notes สำหรับ consumer
5. แจ้งทีมหรือ stakeholder ถ้ามี breaking change

## Rules

### 1. No Guessing

- ใช้ tool หา references จริง ไม่เดาจำนวน consumer
- ไม่สร้าง breaking change ถ้าไม่จำเป็น
- ตรวจสอบ consumers ทั้ง internal และ external

### 2. Backward Compatibility

- พยายามรักษา backward compatibility เสมอ
- ถ้าต้อง break ให้มี migration path และ deprecation period
- ไม่ลบ public API โดยไม่มีแผน

### 3. Tool-First

- ใช้ `/check-file-relations`, `/search-files-patterns`, ast-grep, report workspace graph
- ไม่ทำการเปลี่ยนแปลงกว่างขวางโดยไม่มี evidence
- บันทึกผลการ analysis ก่อนลงมือ

### 4. Risk-Driven

- ไม่ merge หรือ deploy ถ้ามี high-risk ยังไม่มี mitigation
- ตรวจสอบ rollback plan ก่อน change ใหญ
- แบ่ง change เป็น small batch ถ้า blast radius กว้าง

## Expected Outcome

1. รายการ consumers และ references ทีชัดเจน
2. Blast radius assessment ทีวัดผลได้
3. Risk matrix พร้อม mitigation
4. Migration plan ทีปลอดภัย
5. Test results ยืนยันว่าไม่มี regression
6. Communication / migration notes สำหรับทีม
