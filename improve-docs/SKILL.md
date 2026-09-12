---
name: improve-docs
description: Apply docs fixes จาก review-docs findings — accuracy, coverage, freshness, links, structure
argument-hint: "[scope]"
related:
  - review-docs
  - update-docs
  - review-writing
  - check-dead-link
  - use-subagents
  - run-check
  - report
  - suggest-next-action
---

## Goal

แก้ documentation issues ที่ `/review-docs` พบ — เนื้อหา stale, commands ผิด, coverage gaps, broken links, structure รก — ให้ docs ตรง code จริง

## Scope

ใช้หลัง `/review-docs` มี findings หรือเมื่อ docs ไม่ตรง reality — apply fixes ไม่ใช่ report-only

- ถ้าสร้าง/อัปเดต docs site (VitePress) ทั้งระบบ → `/update-docs`
- ถ้า scope ใหญ่หลาย sections → dispatch ผ่าน `/use-subagents`

## Execute

### 1. Collect Findings

> Goal: รู้ว่าต้องแก้อะไร

1. ทำ `/review-docs` หรืออ่าน findings เดิม
2. จัดกลุ่ม: accuracy (commands/APIs ผิด), coverage (features ที่ไม่มี docs), freshness (stale), links, structure, writing quality

### 2. Fix Accuracy

> Goal: ทุก claim ตรง code จริง

1. commands/scripts/flags → ตรวจกับ manifest/config จริง แล้วแก้หรือทดสอบจริง
2. API signatures, env vars, config keys → ตรง source ปัจจุบัน
3. version numbers, deprecations → อัปเดตตามความจริง

### 3. Fix Coverage And Freshness

> Goal: features สำคัญมี docs ครบ

1. features/public APIs ที่ขาด docs → เขียนตาม conventions เดิม
2. stale sections → อัปเดตหรือลบถ้า obsolete (ระบุเหตุใน report)
3. setup/quickstart → walkthrough ตามจริง step-by-step

### 4. Fix Links And Structure

> Goal: navigate ได้ ไม่มี dead links

1. ทำ `/check-dead-link` — แก้ broken internal/external links
2. heading hierarchy + TOC/sidebar สอดคล้อง
3. writing quality → `/review-writing` สำหรับ sections ที่แก้เยอะ

### 5. Verify

> Goal: docs build/ผ่าน

1. build docs site ถ้ามี (VitePress ฯลฯ) — ไม่มี warnings/broken anchors
2. `/run-check` — markdown lint ถ้า project มี
3. ทุก command ที่เขียนต้องรันจริงหรือ verify กับ source

### 6. Report

> Goal: ส่งมอบ

1. ทำ `/report` — sections fixed, claims corrected, links repaired, gaps filled
2. ทำ `/suggest-next-action`

## Rules

### 1. Truth From Code

- ทุก doc claim ต้อง verify กับ source จริง — ห้ามแก้ docs ตามความจำ
- commands ต้อง runnable หรือระบุ prerequisites ชัด

### 2. Minimal Scope

- แก้ findings ที่มี — ห้าม rewrite docs ทั้งชุดโดยไม่จำเป็น
- รักษา style/formatting conventions เดิมของ docs

### 3. No Placeholders

- ห้ามเพิ่ม TODO/coming-soon sections — เขียนเนื้อหาจริงหรือไม่เขียน
- ลบ stale content แทนการทิ้งไว้ให้เข้าใจผิด

## Expected Outcome

- docs ตรง code จริง — commands/APIs verified
- coverage ครบ features สำคัญ, ไม่มี stale claims
- links/structure ผ่าน, docs build สำเร็จ
