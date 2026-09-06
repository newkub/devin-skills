---
name: check-skill-usage
description: หา skills ที่ไม่ถูก reference หรือใช้เลย — dead skills ที่ควรรีวิวหรือลบ
argument-hint: "[min-references]"
related:
  - check-skills-related
  - list-devin-global-skills-relation
  - check-broken-skills-references
  - list-devin-global-skills
  - cleanup-files-in-computer
  - report-table
---

## Goal

ตรวจหา skills ที่ไม่มีใครอ้างถึงและไม่เคยถูกใช้ — dead skills ที่กิน context โดยไม่ให้คุณค่า — เพื่อรีวิวว่าควรเก็บ, ปรับปรุง หรือลบ

## Scope

- ตรวจทุก skill dir ใน global skills repo (`%APPDATA%\devin\skills`)
- วัด: inbound references (มี skill อื่น related ถึงไหม), outbound references, usage signals (ถ้ามี session data)
- Read-only: รายงาน — ลบผ่าน `/delete` หรือปรับปรุงแยก

## Execute

### 1. Build Reference Graph

> Goal: map related graph ทั้งชุด skills

1. ใช้ `/list-devin-global-skills-relation` ถ้ามี — หรือสร้างเอง: parse `related:` ของทุก SKILL.md
2. นับ inbound count ต่อ skill — 0 inbound = candidate dead
3. ทำ `/check-skills-related` และ `/check-broken-skills-references` ร่วมเพื่อ graph ที่ clean

### 2. Classify Usage Tiers

> Goal: แยกระดับการใช้งาน

1. **Orphaned**: 0 inbound + ไม่ถูกอ้างใน `AGENTS.md`/`global_rules.md`/docs
2. **Leaf**: 0 inbound แต่เป็น entry-point skills (user เรียกตรงผ่าน `/name`) — ไม่ใช่ dead โดยอัตโนมัติ
3. **Hub**: inbound สูง — core skills ที่อื่นพึ่ง
4. **Self-referencing only**: อ้างถึงเฉพาะในกลุ่มตัวเอง — อาจเป็น cluster ที่ตายทั้งก้อน

### 3. Check Utility Signals

> Goal: ประเมินว่า orphaned skills มีค่าจริงไหม

1. อ่าน description — เป็น entry-point workflow (เรียกใช้โดยตรง) หรือ helper ที่ควรถูก reference?
2. flag: skills ที่ description กว้างเกิน/ซ้ำกับตัวอื่น, skills ที่สร้างแต่ไม่เคย integrate
3. เช็ค session history ถ้าเข้าถึงได้ — skills ที่เคยถูก trigger จริง

### 4. Report

> Goal: รายงาน dead/dying candidates พร้อม action

1. ใช้ `/report-table` คอลัมน์: `No.`, `Skill`, `Inbound`, `Tier`, `Last Signal`, `Recommendation`
2. Recommendations: `keep` (entry-point ที่มีค่า), `integrate` (มีค่าแต่ไม่มี ref — เพิ่ม related), `merge` (ซ้ำกับตัวอื่น), `delete` (dead จริง)
3. ระบุชัดว่า "0 references ≠ ไร้ค่า" — entry points ไม่ต้องมี inbound

## Rules

### 1. Evidence-Based

- ตัวเลข inbound ต้องมาจาก graph จริง — ไม่เดา
- แยก "ไม่มี ref" ออกจาก "ไม่มีประโยชน์" — คนละเรื่อง

### 2. Entry Points Exempt

- skills ที่เป็น user-facing entry (`/morning-briefing`, `/ship`) ไม่ต้องมี inbound — ตัดออกจาก dead list
- flag เฉพาะที่ทั้งไม่มี ref และไม่มี clear trigger

### 3. Read-Only

- ไม่ลบ skill — รายงาน recommendations ให้ user ตัดสินใจ
- การลบต้องผ่าน `/delete` + `/update-references` เสมอ

## Expected Outcome

- ตาราง skills แยกตาม usage tier พร้อม inbound counts
- รายการ candidates สำหรับ integrate/merge/delete พร้อมเหตุผล
- ภาพรวมสุขภาพของ skill graph
