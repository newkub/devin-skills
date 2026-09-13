---
name: check-monorepo-pipeline
description: ตรวจ task pipeline consistency ใน monorepo — tasks ครบทุก project, ไม่มี orphans
argument-hint: "[workspace-or-package]"
related:
  - follow-tool-moonrepo
  - follow-tool-turborepo
  - list-workspaces
  - report
---

## Goal

ตรวจ task pipeline ของ monorepo — ทุก project มี required tasks (`build`, `test`, `lint`, `typecheck`), task graph ไม่มี orphans/cycles, cache config สอดคล้อง

## Scope

- ใช้เมื่อ `/check-monorepo` dispatch มาที่ `pipeline`/`tasks` หรือเรียกเดี่ยวๆ
- รองรับ Moonrepo (`.moon/tasks.yml`, `moon.yml`), Turborepo (`turbo.json`), Nx (`nx.json`), pnpm scripts
- Read-only: รายงาน — ไม่แก้ task config

## Execute

### 1. Inventory Tasks Per Project

> Goal: รู้ว่าแต่ละ project มี tasks อะไร

1. ใช้ `/list-workspaces` หา projects ทั้งหมด
2. รวม tasks ต่อ project: `moon.yml`/`package.json` scripts/`project.json`
3. สร้างตาราง project × task coverage

### 2. Check Coverage And Orphans

> Goal: หา projects ที่ task graph ไม่ครอบ

1. flag projects ที่ขาด required tasks (`build`, `test`, `lint`, `typecheck`) โดยไม่มีเหตุผล
2. flag orphan projects — ไม่มี tasks เลย หรือไม่ถูกอ้างใน workspace config
3. flag task deps ที่ชี้ไป task/project ที่ไม่มี (`dependsOn` dangling)

### 3. Check Pipeline Config

> Goal: cache และ ordering สอดคล้อง

1. ตรวจ `turbo.json` pipeline/`tasks` — outputs, cache, dependsOn (`^build`) ถูกต้อง
2. ตรวจ `.moon/tasks.yml` shared tasks ไม่ conflict กับ project-level overrides
3. flag tasks ที่ไม่ cacheable แต่ถูก cache (มี side effects เช่น deploy, publish)

### 4. Report

> Goal: สรุป pipeline health

1. ใช้ `/report` คอลัมน์: `No.`, `Project`, `Issue`, `Severity`, `Fix`
2. แนะนำ: เพิ่ม missing tasks, fix dangling deps, correct cache flags

## Rules

- ทุก finding ต้องมี evidence (project path, task name, config file)
- แยก "จงใจไม่มี task" (เช่น docs package ไม่มี test) ออกจาก "ขาดจริง"
- dangling `dependsOn` = High; missing task = Medium; cache misconfig = Medium

## Expected Outcome

- Task coverage matrix ทุก project พร้อม gaps
- รายการ orphan projects และ dangling task deps
