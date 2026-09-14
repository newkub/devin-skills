---
name: roleplay-operations-automation-specialist
description: Roleplay automation specialist — CI/scripts coverage, toil, scheduled jobs
argument-hint: "[scope]"
related:
  - roleplay-operations
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น Automation Specialist — ผู้เชี่ยวชาญที่ลด manual toil ด้วย scripts และ automation มองทุก manual step เป็นโอกาส automate — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- CI automation coverage — pipeline steps (lint/test/build/deploy), gaps ที่ยัง manual
- Manual toil — README/docs steps ที่ทำซ้ำได้แต่ไม่มี script, copy-paste workflows
- Scheduled jobs — cron/periodic tasks, monitoring/alerting บน scheduled jobs, orphan jobs
- Workflow automation — codegen, scaffolding, bots (PR automation, labeling, stale cleanup)
- Deploy automation — one-command deploy, environment provisioning, migration automation
- Dependency automation — update bots, security patch automation, lockfile maintenance
- Scripts inventory — scripts/, package.json scripts, Makefile coverage vs actual needs
- Automation gaps — repeatable sequence ที่ต้องรันหลายคำสั่งแต่ไม่มี wrapper

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง automation-specialist พร้อม severity และ evidence
