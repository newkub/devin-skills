---
name: check-monorepo-config
description: ตรวจ workspace config consistency — declared workspaces vs dirs จริง, manifest coherence
argument-hint: "[workspace-or-package]"
related:
  - follow-monorepo
  - list-workspaces
  - report
---

## Goal

ตรวจ consistency ของ monorepo config — workspace globs ตรง dirs จริง, manifests สอดคล้องกัน, tool config ไม่ drift

## Scope

- ใช้เมื่อ `/check-monorepo` dispatch มาที่ `config` หรือเรียกเดี่ยวๆ
- ครอบคลุม: `package.json` workspaces, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `.moon/*`, `lerna.json`, `Cargo.toml` workspace
- Read-only: รายงาน — แก้ผ่าน `/update-config` หรือ `/follow-monorepo`

## Execute

### 1. Declared Vs Actual

> Goal: globs ที่ declare ตรงกับ dirs ที่มี

1. อ่าน workspace patterns จาก `package.json`/`pnpm-workspace.yaml`/`.moon/workspace.yml`
2. expand globs เทียบ dirs จริง — flag dirs ที่ไม่ถูก pattern ครอบ (unmanaged packages)
3. flag patterns ที่ไม่ match อะไรเลย (dead globs)

### 2. Manifest Coherence

> Goal: package manifests สอดคล้องกัน

1. ตรวจ `name` fields ไม่ซ้ำข้าม packages
2. ตรวจ internal deps ใช้ workspace protocol ถูก (`workspace:*`, `catalog:`) ไม่ pin version แข็ง
3. ตรวจ `packageManager` field ตรงกันทุก package และตรง lockfile จริง
4. flag root `package.json` ที่มี deps ที่ควรอยู่ใน package ย่อย (หรือกลับกัน)

### 3. Tool Config Consistency

> Goal: monorepo tool configs ไม่ขัดกัน

1. ถ้ามีหลาย tool markers (`turbo.json` + `.moon/` + `nx.json`) → flag ambiguity ว่าตัวไหน canonical
2. ตรวจ shared config inheritance: `tsconfig.base.json`, shared eslint/biome config ถูก extends ทุก package
3. บันทึก findings พร้อม evidence

### 4. Report

> Goal: สรุป config health

1. ใช้ `/report` คอลัมน์: `No.`, `Config`, `Issue`, `Severity`, `Fix`
2. แนะนำ: แก้ globs, รวม tool config, ใช้ workspace protocol

## Rules

- ทุก finding ต้องมี evidence (file path, glob, package name)
- unmanaged package dir = High (build อาจไม่ครอบ); dead glob = Low; tool ambiguity = Medium
- แยก "ตั้งใจ exclude" (มี `.npmrc`/ignore comment) ออกจาก "ลืมครอบ"

## Expected Outcome

- รายการ declared-vs-actual mismatches พร้อม severity
- Manifest/tool config drift ที่ต้อง sync
