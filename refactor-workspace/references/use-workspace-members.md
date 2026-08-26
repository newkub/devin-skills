---
name: use-workspace-members-overview
description: วิเคราะห์และแนะนำ workspace members จาก workspace ที่ควรนำมาใช้ในโปรเจกต์ปัจจุบัน
---

## Goal

วิเคราะห์ workspace members ที่มีอยู่ใน workspace และแนะนำ members ที่เหมาะสมกับโปรเจกต์ปัจจุบัน

## Scope

ใช้สำหรับ monorepo ที่มีหลาย workspace members เช่น packages, crates, modules, apps

## Execute

### 1. Analyze Current Project

1. อ่าน `package.json`, `Cargo.toml`, `bun.lock`, `pnpm-workspace.yaml` หรือไฟล์จัดการ dependencies ที่เกี่ยวข้อง
2. วิเคราะห์ dependencies ที่มีอยู่
3. ระบุประเภทโปรเจกต์และ stack (web, backend, desktop, mobile, library, Rust, JS, etc.)

### 2. Scan Workspace Members

1. สำรวจโครงสร้าง workspace ตาม manifest (`packages/*`, `crates/*`, `apps/*`)
2. อ่าน manifest ของแต่ละ workspace member
3. จัดกลุ่ม: UI, Utilities, Frameworks, Libraries, Tools, Integrations

### 3. Evaluate Relevance

สำหรับแต่ละ workspace member:

1. ตรวจสอบ compatibility: ภาษา, platform, dependencies
2. ประเมินประโยชน์: ลด duplication, เพิ่มประสิทธิภาพ, ปรับปรุง DX
3. ตรวจสอบสถานะ: version stability, maintenance, docs

### 4. Generate Recommendations

1. High Priority — members ที่ควรใช้ทันที
2. Medium Priority — members ที่ควรพิจารณา
3. Low Priority — members ที่อาจไม่จำเป็น

### 5. Provide Integration Guidance

สำหรับ members ที่แนะนำ:

1. ระบุวิธีการติดตั้ง/เพิ่ม dependency
2. ระบุวิธีการ configuration
3. ระบุ breaking changes ที่อาจเกิดขึึ้น
4. ให้ตัวอย่างการใช้งาน
5. ระบุ dependencies ที่ต้องเพิ่ม

## Rules

- Relevance, Compatibility, Stability, Documentation, Adoption, Maintenance
- Critical → High → Medium → Low
- รายงานต้องมีชื่อ member, version, คำอธิบาย, เหตุผล, วิธี integrate, trade-offs
- ไม่แนะนำ members ที่ซับซ้อนเกินความจำเป็นหรือไม่ maintain

## Expected Outcome

- รายงาน workspace members ที่ควรใช้แบ่งตาม priority
- คำแนะนำ integration ที่ชัดเจน
- ตัวอย่างการใช้งานและ trade-offs
