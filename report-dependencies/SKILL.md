---
name: report-dependencies
description: สรุป dependencies: versions, outdated, unused, vulnerabilities, licenses
---

## Goal

รายงานสถานะ dependencies ของโปรเจกต์: versions, outdated, unused, vulnerabilities, licenses และ insights

## Scope

ใช้สำหรับการรายงาน dependencies ใน package manifests (`package.json`, `Cargo.toml`, `pyproject.toml`, etc.) — ไม่รวมการติดตั้งหรืออัปเดต (ใช้ `/run-install` หรือ `/update-dependencies-latest`)

## Execute

### 1. Gather Data

> Goal: รวบรวม dependencies และตรวจสอบสถานะทั้งหมด
> Goal: มี inventory และ status ครบสำหรับการวิเคราะห์

1. ทำ `/list-dependencies` เพื่อดู dependencies ทั้งหมด แยกตามประเภท: `dependencies`, `devDependencies`, `peerDependencies`
2. รัน `bun outdated` เพื่อระบุ dependencies ที่ล้าสมัย — จัดประเภท: safe to update (patch/minor) vs breaking (major)
3. ทำ `/check-unused-deps` เพื่อตรวจจับ unused dependencies — แยก type-only packages (`@types/*`) จาก runtime
4. ทำ `/run-audit` เพื่อ scan vulnerabilities — ระบุ severity: critical, high, medium, low
5. ระบุ license ของแต่ละ dependency — จัดประเภท: permissive (MIT, Apache-2.0), copyleft (GPL), proprietary

### 2. Analyze

> Goal: วิเคราะห์ข้อมูลที่รวบรวม
> Goal: เข้าใจ patterns และ priority ของ issues

1. จัดกลุ่ม dependencies ตามสถานะ: latest, outdated, unused, vulnerable, license issue
2. ระบุ dependencies ที่มี vulnerabilities และมี fix available vs ไม่มี fix
3. ระบุ dependencies ที่มี license ไม่เข้ากันกับโปรเจกต์หรือไม่มี license
4. ระบุความเสี่ยงของการอัปเดต major versions

### 3. Format

> Goal: จัดรูปแบบรายงานให้อ่านง่าย
> Goal: รายงานครบ อ่านง่าย มี insights

1. ทำ `/report-table` เพื่อจัดรูปแบบเป็นตาราง
2. แสดงผลตามลำดับ: Summary → Outdated → Unused → Vulnerabilities → Licenses
3. กำหนด columns: No., Package, Current, Latest, Type, Status (✅ latest / ⚠️ outdated / ❌ vulnerable / 🗑️ unused)
4. แยกตารางตามหมวด: Outdated, Unused, Vulnerabilities, Licenses

### 4. Present

> Goal: นำเสนอ report พร้อม insights และ recommendations
> Goal: ผู้อ่านรู้ว่าต้องทำอะไรต่อ

1. สรุปจำนวน dependencies ทั้งหมดแยกตามประเภท
2. ระบุ priority actions: critical vulnerabilities ก่อน, จากนั้น unused, จากนั้น outdated
3. แนะนำ next steps: `/run-install` สำหรับอัปเดต, `/delete` สำหรับลบ unused
4. ทำ `/suggest-next-action`

## Rules

### Report UX/UI
> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### Read-Only

- ไม่ติดตั้ง ไม่อัปเดต ไม่ลบ dependencies — รายงานเท่านั้น
- ใช้ `/run-install` สำหรับการติดตั้ง
- ใช้ `/update-dependencies-latest` สำหรับการอัปเดต
- ใช้ `/delete` สำหรับการลบ

### Output Format

- ทำ `/report-table` สำหรับจัดรูปแบบผลลัพธ์
- แยกตารางตามหมวด: Outdated, Unused, Vulnerabilities, Licenses
- ใช้ symbols: ✅ latest, ⚠️ outdated, ❌ vulnerable, 🗑️ unused, ⚖️ license issue

### High Impact Content

- ถ้ามีมากกว่า 100 dependencies → แสดงเฉพาะที่มีปัญหา
- ชี้เน้น critical vulnerabilities ก่อนเสมอ
- ชี้เน้น unused dependencies ที่ควรลบ
- ชี้เน้น major version updates ที่มีความเสี่ยง

### Non-Redundancy

- รายละเอียด listing อยู่ใน `/list-dependencies` แล้ว
- รายละเอียด vulnerability scanning อยู่ใน `/run-audit` แล้ว
- รายละเอียด unused detection อยู่ใน `/check-unused-deps` แล้ว

## Expected Outcome

- สรุป dependencies ทั้งหมดในตารางที่อ่านง่าย
- ระบุ outdated, unused, vulnerable และ license issues
- มี priority actions ชัดเจน
- ไม่มีการแก้ไข dependencies จริง — read-only report
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
