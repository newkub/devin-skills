---
name: follow-single-of-source
description: Single source of truth — canonical definition ที่เดียว ที่อื่น reference ไม่ duplicate
argument-hint: "[topic-or-file]"
related:
  - follow-best-practice
  - update-devin-global-skills
  - new-skills
  - idea-merge
  - refactor
  - follow-reusable
  - review-devin-global-harness
  - update-references
  - follow-config
---

## Goal

บังคับ single source of truth — ข้อมูล/definition/config/catalog แต่ละอย่างมี canonical location เดียว ที่อื่นทั้งหมด reference หรือ derive จากมัน ไม่ copy เนื้อหาซ้ำ

## Scope

ใช้เมื่อสร้าง/แก้ skills, docs, config, หรือ data ที่มีโอกาสซ้ำซ้อน:

- skill content — canonical catalog/dispatch table อยู่ที่เดียว (เช่น `deep-review/references/review-skills.md`)
- config values — define ที่เดียวแล้ว inject/import (env, tokens, versions)
- docs — facts ที่เปลี่ยนบ่อย (counts, versions, commands) มี source เดียว
- data/schema — model definition เดียว derive types/forms/validation
- reuse internal code ที่มีอยู่ก่อนเขียนใหม่ (DRY) → `/follow-reusable`

## Execute

### 1. Identify Candidate

> Goal: หาจุดที่ข้อมูลเดียวกันปรากฏหลายที่

1. หา content ที่ซ้ำ: ตัวเลข (counts, versions), ตาราง dispatch, lists, rules
2. ถ้าข้อมูลเดียวกันอยู่ ≥2 ที่ → candidate สำหรับ SSOT
3. ตัดสินว่าอันไหนคือ canonical — ปกติคือที่ที่ authoritative ที่สุดหรือละเอียดที่สุด

### 2. Establish Canonical Source

> Goal: กำหนด source เดียวที่ authoritative

1. เลือก canonical location — ไฟล์/section/variable เดียว
2. ย้ายเนื้อหาเต็มไปที่ canonical
3. ที่อื่นเหลือแค่ reference — `> Canonical X อยู่ที่ <path>` หรือ derive ผ่าน script/import

### 3. Wire References

> Goal: consumers ชี้กลับ canonical ไม่ copy

1. แทนที่ duplicate content ด้วย pointer + บริบทสั้นที่จำเป็น
2. ถ้า count/list ต้องปรากฏหลายที่ → derive จาก command (`git ls-files`, script) แทน hardcode
3. ทำ `/update-references` ถ้ามีการย้ายไฟล์

### 4. Guard Drift

> Goal: กัน drift หลังจากนี้

1. ใส่ sync note ที่ canonical — "ถ้าแก้ตัวนี้ให้อัปเดต X" เมื่อ derived copies จำเป็น
2. ถ้า derive ได้ → เขียน check script (`check-*`) ตรวจ consistency
3. ระบุ canonical ใน `AGENTS.md` หรือ conventions ถ้าเป็น repo-wide

## Rules

- canonical เดียวต่อ fact — ห้ามสองที่ authoritative พร้อมกัน
- reference ≠ copy — derived location เก็บแค่ pointer หรือ generated content
- ถ้าต้อง duplicate จริง (เช่น performance/embedding) → ต้องมี drift check หรือ sync note
- แก้ที่ canonical เสมอ ห้ามแก้ที่ derived copy โดยตรง
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/update-devin-global-skills` ถ้าจำเป็น
- ใช้ `/new-skills` ถ้าจำเป็น
- ใช้ `/idea-merge` ถ้าจำเป็น
- ใช้ `/refactor` ถ้าจำเป็น
- ใช้ `/review-devin-global-harness` ถ้าจำเป็น
- ใช้ `/follow-config` ถ้าจำเป็น


## Expected Outcome

- ทุก fact มี source เดียว — แก้ที่เดียวแล้ว propagate ถูก
- ไม่มี drift ระหว่าง copies
- canonical path ระบุชัดใน docs/conventions
