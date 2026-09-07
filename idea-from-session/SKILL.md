---
name: idea-from-session
description: Mine session ปัจจุบันหา workflow ที่ทำซ้ำหรือ manual แล้วเสนอเป็น skill candidates
argument-hint: "[min-candidates]"
related:
  - idea-new-skills
  - save-to-devin-global-skills
  - list-devin-user-request-in-this-session
  - follow-create-devin-global-skills
  - report-idea
---

## Goal

วิเคราะห์ session ปัจจุบันหา patterns ที่ทำซ้ำหรือทำมือหลายขั้นตอน แล้วเสนอเป็น skill candidates — เปลี่ยนงาน ad-hoc ที่พิสูจน์แล้วว่าใช้ได้เป็น reusable workflows

## Scope

- ใช้เมื่อ session มีงานที่ทำหลายขั้นตอน ซ้ำกัน หรือน่าจะมีประโยชน์ซ้ำ — เช่น การสร้าง skills เป็นชุด, git workflow เฉพาะ, manual checklist
- วิเคราะห์จาก: user requests, command sequences, file edit patterns, fixes ที่ทำซ้ำ
- เสนอเป็น proposals เท่านั้น — ไม่สร้าง skills โดยไม่ confirm

## Execute

### 1. Mine Session Activity

> Goal: รวบรวมสิ่งที่ทำใน session

1. ทบทวน user requests และงานที่ทำจริงใน session — ใช้ `/list-devin-user-request-in-this-session` ถ้าต้องการ list
2. หา command sequences ที่ทำซ้ำ (git workflows, validation scripts, batch operations)
3. หา manual multi-step processes ที่ควรเป็น workflow เดียว

### 2. Identify Candidates

> Goal: แยกสิ่งที่ควรเป็น skill ออกจากงานครั้งเดียว

1. Skill-worthy: ทำซ้ำได้ใน project อื่น, มี clear trigger, มีหลายขั้นตอน, มี rules/gotchas
2. Not skill-worthy: งานเฉพาะครั้ง, one-off fixes, สิ่งที่ skill เดิมครอบแล้ว
3. เทียบกับ skills ที่มี — เสนอขยายของเดิมแทนสร้างใหม่ถ้าซ้อน

### 3. Draft Proposals

> Goal: สร้าง proposal ต่อ candidate

แต่ละตัวระบุ:
- `name` kebab-case ตาม prefix conventions
- `description` ≤100 ตัวอักษร
- `trigger` เมื่อไหร่ควรใช้
- `related` skills ที่มีจริง
- Evidence จาก session: ขั้นตอน/commands ที่ทำจริงที่ skill จะครอบ

### 4. Present

> Goal: ให้ user เลือก

1. ใช้ `/report-idea` หรือตาราง: `No.`, `Skill`, `Solves`, `Session Evidence`, `Related`
2. จัดลำดับตาม reusability × frequency ที่เห็นใน session
3. ถาม user เลือกตัวที่จะสร้าง — ไม่สร้างเอง

## Rules

### 1. Session Evidence Only

- เสนอเฉพาะ patterns ที่เห็นจริงใน session — ไม่เดา hypothetical needs
- อ้างอิงขั้นตอน/คำสั่งจริงที่ทำเป็น evidence

### 2. No Duplicates

- เช็ค skills ที่มีก่อนเสนอ — ใช้ `/idea-new-skills` flow สำหรับ gap analysis ทั่วไป
- ถ้าซ้อนกับที่มี → เสนอขยาย skill นั้น

### 3. User-Driven

- ไม่สร้าง skill โดยไม่ได้รับเลือกจาก user
- proposals ต้องชัดพอให้ตัดสินใจ — name + description + trigger

## Expected Outcome

- รายการ skill candidates ที่มี evidence จาก session จริง
- แต่ละตัวพร้อม name, description, trigger, related
- User เลือกสร้างต่อผ่าน `/follow-create-devin-global-skills` หรือ `/save-to-devin-global-skills`
