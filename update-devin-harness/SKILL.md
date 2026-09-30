---
name: update-devin-harness
description: อัปเดต global rules, global skills และ global subagents ให้สอดคล้องกัน
argument-hint: "[scope]"
related:
  - update-devin
  - update-devin-global-skills
  - update-devin-global-subagents
  - list-devin
  - use-related-skills
  - deep-validate
  - check-reference
  - report
  - suggest-next-action
  - review-devin-global-harness
  - update-references
  - scan-codebase
---

## Goal

ทำให้ `global_rules.md`, `devin global skills`, และ `devin global subagents` มี alignment ทีตรงกัน สอดคล้องกัน และไม่ขัดแย้งกัน

## Scope

ใช้เมื่อต้อง sync ทั้งสาม layer ของ devin ecosystem โดยเฉพาะหลังมีการ rename, merge, หรือสร้าง skills/subagents จำนวนมาก — merged จาก `/align-devin-layers` เดิม (alias stub ถูกลบ — ใช้ skill นี้โดยตรง)

## Execute

### Subskills

| Domain | Subskill |
|--------|----------|
| `devin-knowledge`, `knowledge` — ตรวจ Devin knowledge notes/suggestions | `subskills/devin-knowledge/SKILL.md` |

### 1. Inventory All Layers

> Goal: รวบรวมข้อมูลจากทุก layer

1. อ่าน `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
2. ทำ `/list-devin-global-skills`
3. ทำ `/list-devin-global-subagents`
4. บันทึก versions, last updated, และ critical rules

### 2. Run Update Workflows

> Goal: อัปเดตแต่ละ layer

1. Sync `global_rules.md` โดยตรง — อ่านและแก้ไขไฟล์ให้สอดคล้องกับ skills/subagents
2. ทำ `/update-devin-global-skills` เพื่อ audit และอัปเดต skills
3. ทำ `/update-devin-global-subagents` เพื่ออัปเดต subagents
4. บันทึก output ของแต่ละ step

### 3. Detect Cross-Layer Misalignment

> Goal: หาความไม่สอดคล้อง

1. เปรียบเทียบ rules จาก global rules vs skills vs subagents
2. ทำ `/scan-codebase` เพื่อค้นหา references ทั่ว repo
3. ตรวจ references: ชื่อ skills/subagents ใน AGENTS.md, global rules, และ skill `related`
4. ทำ `/review-devin-global-harness` หา broken references
5. หา circular dependencies หรือ broken references
6. ระบุ skills/subagents ทีล้าหลัง global rules

### 4. Resolve Conflicts

> Goal: แก้ไขความขัดแย้ง

1. ถ้า global rules กับ skill ขัดแย้ง → ปรับ skill หรือ update global rules
2. ถ้า subagent เรียก skill ทีไม่มี → อัปเดต subagent
3. ถ้า skill อ้างอิง rules ทีไม่มี → เพิ่มหรือลบ reference
4. ใช้ `/update-references` เพื่อ sync ทั่ว repo
5. ใช้ `/use-related-skills` เพื่อหา overlaps

### 5. Validate Harness

> Goal: ตรวจสอบความสมบูรณ์

1. ทำ `/deep-validate` กับ global rules
2. ตรวจ frontmatter ของ skills ทั้งหมดด้วย `/review-devin-global-harness`
3. ตรวจ `AGENT.md` ของ subagents ด้วย `/update-devin-global-subagents` ถ้าจำเป็น
4. รัน `/check-reference`
5. รัน `git diff --check`

### 6. Report

> Goal: สรุป alignment status

1. ทำ `/report` คอลัมน์: `No.`, `Layer`, `Status`, `Changes`, `Issues`
2. ระบุสิ่งที่ยังค้าง
3. ทำ `/suggest-next-action`

## Rules

### 1. Run In Order

- อัปเดต global rules ก่อน skills ก่อน subagents
- ถ้ามี dependency loop → แก้ loop ก่อน
- ไม่ข้าม layer

### 2. Minimal Scope

- แก้เฉพาะสิ่งที่ขัดแย้งหรือล้าหลัง
- ไม่เปลี่ยนโครงสร้างใหญ่ถ้าไม่จำเป็น
- เก็บ intent เดิมของแต่ละ layer

### 3. Cross-Reference Integrity

- `name` ใน frontmatter ต้องตรง directory
- `related` ต้องมีอยู่จริง
- `AGENTS.md` ต้อง sync

### 4. Backup

- สำรอง `global_rules.md` ก่อนแก้ไข
- สำรอง `AGENTS.md` ถ้ามีการเปลี่ยนแปลงใหญ่
- ใช้ `git commit` ทีละ layer

- ใช้ /update-devin-global-subagents ถ้าจำเป็น

## Merged Details

### devin-knowledge

##### Goal

ตรวจ Devin knowledge notes ว่ายังถูกต้องและใช้งานอยู่ — หา notes ที่ stale, ขัดกัน, ไม่มีใครใช้ หรืออ้าง resources ที่ไม่มีแล้ว

##### Scope

- ใช้ `devin_knowledge_manage` MCP tools เมื่อมี — หรือ knowledge files ที่เก็บใน repo/workspace
- ครอบคลุม: note freshness (age vs referenced reality), contradictions ระหว่าง notes, dead references, coverage gaps
- Read-only: รายงาน — แก้/ลบผ่าน user confirmation

##### Execute

###### 1. Inventory Knowledge

> Goal: รวบรวม notes ทั้งหมด

1. ใช้ `devin_knowledge_manage` (list) หรือค้น knowledge files ที่มี
2. เก็บ metadata: title, content summary, created/updated date, folder
3. จัดกลุ่มตาม topic/folder

###### 2. Check Freshness

> Goal: หา notes ที่อาจ stale

1. flag notes ที่เก่า (>90 วัน) โดยไม่ถูก update — โดยเฉพาะที่อ้าง tools/versions
2. เทียบ notes ที่อ้าง code/config กับสถานะจริง — facts เปลี่ยนไปไหม
3. flag notes ที่ reference skills/files ที่ถูกลบหรือ rename แล้ว (ทำ `/check-reference` ร่วม)

###### 3. Detect Contradictions And Duplicates

> Goal: หา notes ที่ขัดหรือซ้ำกัน

1. เทียบ notes ที่ topic เดียวกัน — คำแนะนำที่ขัดกัน (เช่น config คนละแบบ)
2. หา near-duplicates — notes ที่พูดเรื่องเดียวกันควรรวม
3. flag suggestions ที่ค้างนานไม่ถูก review

###### 4. Report

> Goal: สรุป knowledge health

1. ใช้ `/report`: `No.`, `Note`, `Issue`, `Age`, `Severity`, `Action`
2. Actions: `update`, `merge`, `dismiss`, `delete`, `keep`
3. สรุป coverage: topics ที่มี notes ครบ vs ที่ขาด

##### Rules

###### 1. Evidence-Based

- "stale" ต้องมีเหตุ — age alone ไม่พอ, ต้องเทียบกับ reality ปัจจุบัน
- contradiction ต้องอ้างทั้งสอง notes พร้อมจุดที่ขัด

###### 2. Read-Only

- ไม่แก้หรือลบ notes — รายงานให้ user ตัดสินใจ
- การแก้ไข knowledge ต้อง user confirm

###### 3. Value Preserved

- notes เก่าที่ยังถูกต้อง ≠ stale — flag เฉพาะที่ผิดหรือไม่ใช้แล้ว
- ระมัดระวัง institutional knowledge — เสนอ archive มากกว่า delete

##### Expected Outcome

- รายงาน notes ที่ stale/contradicting/duplicate พร้อม evidence
- Action recommendations ต่อ note
- ภาพรวม knowledge coverage

## Expected Outcome

- global rules, global skills, global subagents สอดคล้องกัน
- ไม่มี broken references
- ไม่มี rules ซ้ำซ้อนหรือขัดแย้ง
- มีรายงาน alignment status
- ผ่าน validation

