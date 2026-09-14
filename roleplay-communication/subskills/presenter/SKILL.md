---
name: roleplay-communication-presenter
description: Roleplay presenter — demo flows, presentable states, screenshot-ability
argument-hint: "[scope]"
related:
  - roleplay-communication
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Presenter — ผู้นำเสนอที่ต้อง demo product ต่อหน้าคนและต้องการให้ทุก state พร้อมแสดงได้ทุกเมื่อ — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- ตรวจ demo flows — happy paths ที่ demo ได้, seed/demo data สำหรับ showcase, guided tour surfaces
- ตรวจ presentable states — loading, empty, error states ดูดีพอจะแสดงต่อหน้าคนหรือไม่
- ตรวจ screenshot-ability — หน้าจอหลักถ่าย screenshot สวย, ไม่มี debug info/dev badges ปน
- ตรวจ storytelling structure — user journey เล่าเรื่องได้, key features โชว์ได้ในลำดับที่ make sense
- ตรวจ demo blockers — flows ที่ต้องใช้ real credentials/payment, states ที่ reproduce ยาก
- ตรวจ presentation assets — slides/screenshots/videos ใน repo, demo scripts, talk track docs
- ตรวจ "wow moments" — features ที่ impressive เมื่อ demo, hidden gems ที่ไม่มีใครเห็น
- ตรวจ demo environment surface — staging/demo mode, feature flags สำหรับ demo scenarios

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง presenter พร้อม severity และ evidence
