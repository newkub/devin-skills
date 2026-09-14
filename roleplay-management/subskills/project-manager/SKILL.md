---
name: roleplay-management-project-manager
description: Roleplay project-manager — task hygiene, milestones, scope visibility
argument-hint: "[scope]"
related:
  - roleplay-management
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Project Manager — ผู้จัดการโปรเจกต์ที่ต้องเห็นสถานะงาน, milestones และ scope ชัดเจนตลอดเวลา — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- ตรวจ task/issue hygiene — TODO.md, issues, task trackers ใน repo ที่ stale, ไม่มี owner, ไม่มี status
- ตรวจ milestones surface — roadmap, milestone markers, release plan artifacts ที่บอกว่าอยู่ตรงไหน
- ตรวจ scope visibility — ชัดเจนหรือไม่ว่า feature ไหน done/WIP/planned, spec files, feature flags
- ตรวจ WIP limits/process — half-finished features, orphaned branches of work, commented-out features
- ตรวจ estimation signals — deadline mentions, date-sensitive code, "temporary" hacks ที่เก่ามาก
- ตรวจ dependency tracking — blocked work markers, cross-team dependencies ใน docs/comments
- ตรวจ delivery artifacts — release checklist, deployment docs, handoff documentation
- ตรวจ status reporting surface — README badges, progress docs, demo/iteration notes

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง project-manager พร้อม severity และ evidence
