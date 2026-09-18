# Fix Guide

(merged from: optimize-ci)

## Goal

วิเคราะห์ CI workflows แล้วลด wall-clock time และ cost — cache dependencies, ตัด jobs ซ้ำ, เพิ่ม path filters, tune matrix และ parallelism

## Scope

- CI configs: `.github/workflows/*`, `.gitlab-ci.yml`, `.circleci/`
- ครอบคลุม: job dependencies, caching, triggers, matrix, runners, artifact passing
- Action-oriented: แก้ workflow files จริง — ทดสอบ local ด้วย `/follow-tool-act` ก่อน push

## Execute

### 1. Inventory And Baseline

> Goal: รวบรวม workflows และดู runtime ปัจจุบัน

1. ใช้ `/list-ci-configs` หา workflow files ทั้งหมด
2. ดู runtimes จาก `gh run list` — ระบุ workflow/job ที่ช้าที่สุด
3. map job dependency graph (`needs`) เพื่อหา critical path

### 2. Find Waste

> Goal: หางานซ้ำซ้อนและโอกาส cache

1. flag: install deps ซ้ำทุก job โดยไม่มี cache (`actions/cache`, `setup-*` cache)
2. flag: workflow run ทุก path ทั้งที่เปลี่ยนแค่ docs → เพิ่ม `paths:`/`paths-ignore:` filters
3. flag: jobs ที่รันซีเรียมทั้งที่ parallel ได้ (ไม่มี `needs` dependency จริง)
4. flag: matrix ใหญ่เกิน (ทุก OS × ทุก version โดยไม่จำเป็น)
5. flag: build ซ้ำใน deploy job ทั้งที่ใช้ artifact จาก build job ได้

### 3. Apply Optimizations

> Goal: แก้ workflow ตาม findings

1. เพิ่ม dependency caching: `actions/setup-node` cache, `pnpm`/`bun` cache, `Swatinem/rust-cache`
2. เพิ่ม `concurrency` group + `cancel-in-progress` เพื่อยกเลิก run เก่าของ PR เดียวกัน
3. เพิ่ม `paths:` filters ให้ docs-only/workflows เฉพาะทาง
4. แตก heavy jobs เป็น parallel หรือใช้ `fail-fast` matrix
5. ใช้ artifact passing แทน rebuild
6. ปรับ `timeout-minutes` ให้สมเหตุสมผล

### 4. Verify

> Goal: ทดสอบ workflow ก่อน push

1. validate YAML syntax
2. รัน local ด้วย `/follow-tool-act` ถ้าเป็นไปได้
3. รายงาน estimated time savings ต่อ workflow

## Rules

### 1. Measure First

- ดู actual runtimes จาก run history ก่อนแก้ — ไม่เดา
- รายงาน expected savings เป็น % หรือนาที

### 2. Preserve Semantics

- ต้องไม่ตัด checks ที่ required หรือลด coverage โดยไม่บอก user
- path filters ต้องไม่ทำให้ required status checks พัง — แนะนำ branch protection config ที่ตรงกัน

### 3. Security Aware

- ห้ามลด permissions/security steps เพื่อความเร็ว
- cache keys ต้องไม่รวม secrets

## Expected Outcome

- Workflows เร็วขึ้นพร้อม estimated savings
- Cache, filters, concurrency ตั้งค่าครบ
- ไม่มี required checks ที่พังจากการเปลี่ยน
