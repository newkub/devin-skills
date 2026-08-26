---
name: review
description: Review ตาม context โดยเลือก review skill ที่เหมาะสม
---

## Goal

Review งานตาม context โดยเลือก review skill ที่เหมาะสม

## Scope

ใช้เมื่อต้องการ review แต่ยังไม่รู้จะใช้ skill ไหน รองรับ code, docs, GitHub, และ skills

## Execute

### 1. Detect Context

> Goal: รู้ context ก่อนเลือก review skill

1. ตรวจ workspace files: `package.json`, `AGENTS.md`, `SKILL.md`, `git status`
2. ถ้ามี `apps/`, `src/`, `packages/` → น่าจะเป็น code
3. ถ้าเป็น `.md` หรือ `AGENTS.md` → น่าจะเป็น docs
4. ถ้ามี `/.devin/skills/` หรือ `%APPDATA%/devin/skills` → น่าจะเป็น skill
5. ถ้า user ระบุ issue/PR number หรือ `github` → น่าจะเป็น GitHub

### 2. Route To Review Skill

> Goal: เรียก review skill ที่ถูกต้อง

1. ถ้า code → ทำ `/update-review-codebase-cli-and-run`
2. ถ้า `AGENTS.md` หรือ docs → ทำ `/review-rules`
3. ถ้า GitHub issue → ทำ `/review-github-issue`
4. ถ้า GitHub PR → ทำ `/review-github-pr`
5. ถ้า devin skills → ทำ `/review-devin-global-skills`
6. ถ้า context ไม่ชัด → ทำ `/scan-codebase` แล้ว `/report-before` ก่อน แล้วถาม user

### 3. Report

> Goal: สรุปผล review

1. สรุป findings พร้อม severity
2. ระบุ skill ที่ใช้
3. ทำ `/suggest-next-action`

## Rules

### 1. Context First
- ไม่เดาถ้า context ไม่ชัด
- ถาม user ก่อน review ถ้าจำเป็น

### 2. Skill Selection
- เลือก skill ตาม target object ไม่ใช่ตามชื่อ file อย่างเดียว
- สามารถใช้หลาย review skills ถ้า task มีหลาย context

### 3. Evidence
- ทุก finding ต้องมี file, line, หรือ reference

## Expected Outcome

- รู้ว่า review อะไร
- ได้ findings พร้อม evidence
- รู้ skill ถัดไปที่ควรทำ