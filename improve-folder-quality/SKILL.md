---
name: improve-folder-quality
description: ตรวจสอบคุณภาพของโฟลเดอร์ ทั้งจำนวนไฟล์ โครงสร้าง domain และ imports
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'write', 'grep', 'glob', 'exec', 'ask_user_question']
related:
  - scan-codebase
  - use-scripts
  - restructure
  - review-codebase
  - use-ast-grep-outline
---

## Goal

ตรวจสอบคุณภาพของโฟลเดอร์ใน project โดยประเมินหลายมิติ: จำนวนไฟล์, domain cohesion, naming, imports boundaries, nesting depth, และ mixed concerns

## Scope

ใช้กับ source folders ใน project หรือ workspace เพื่อตรวจสอบคุณภาพของ physical structure ครอบคลุม:

- จำนวนไฟล์ต่อโฟลเดอร์ (bloat)
- การจัดกลุ่มตาม domain / cohesion
- naming consistency ของไฟล์และโฟลเดอร์
- imports ข้าม boundary หรือ layer
- ความลึกของ nesting (depth) หรือ flat เกินไป
- การปะปนของไฟล์หลายประเภท (logic, test, config, generated)
- การแนะนำ `/restructure` ถ้าพบปัญหา

## Execute

### 1. Determine Threshold

กำหนดเกณฑ์สำหรับ "โฟลเดอร์มีไฟล์มาก"

> Goal: มีเกณฑ์ชัดเจนก่อน scan

1. ค่าเริ่มต้น: โฟลเดอร์ที่มีไฟล์มากกว่า `20` ไฟล์ (ไม่รวม test หรือ generated)
2. ถ้ามี argument จาก user → ใช้ค่าที่ user ระบุ
3. ถ้า project มี convention อื่น → ใช้ตาม `AGENTS.md` หรือ `global_rules.md`

### 2. Scan Folder Structure

หาไฟล์ทั้งหมดใน target path

> Goal: มีรายการไฟล์ครบถ้วนพร้อม path

1. ทำ `/scan-codebase` เพื่อ list ไฟล์ใน target path
2. กรองไฟล์ที่ไม่ต้องนับ: `*.test.*`, `*.spec.*`, `node_modules/`, `.git/`, `dist/`, `build/`, `temp/`, `coverage/`
3. จัดกลุ่มไฟล์ตาม directory

### 3. Count Files Per Folder

นับจำนวนไฟล์ในแต่ละโฟลเดอร์

> Goal: ระบุโฟลเดอร์ที่เกิน threshold

1. ใช้ `/use-scripts` สร้าง script นับไฟล์ต่อโฟลเดอร์ด้วย `Bun.Glob`
2. รายงานเฉพาะโฟลเดอร์ที่เกิน threshold
3. เรียงลำดับตามจำนวนไฟล์จากมากไปน้อย

### 4. Assess Folder Quality

ประเมินหลายมิติของคุณภาพโฟลเดอร์

> Goal: ระบุปัญหาคุณภาพนอกเหนือจากจำนวนไฟล์

1. ตรวจสอบ domain cohesion: ไฟล์ในโฟลเดอร์เกี่ยวข้องกันหรือไม่ ดูจาก filenames และ imports
2. ตรวจสอบ naming consistency: ชื่อไฟล์และโฟลเดอร์สะท้อน responsibility หรือไม่ ใช้ `/review-codebase` ถ้าจำเป็น
3. ตรวจสอบ imports boundaries: มี imports ข้าม domain, layer, หรือ boundary หรือไม่ ใช้ `/use-ast-grep-outline --items imports`
4. ตรวจสอบ nesting depth: โฟลเดอร์ลึกเกินไป (เกิน 5 ระดับ) หรือ flat เกินไปหรือไม่
5. ตรวจสอบ mixed concerns: มีไฟล์ logic, test, config, generated, barrel ปะปนกันหรือไม่
6. ถ้าโฟลเดอร์ผ่านทุกข้อ → ข้าม ไม่ force restructure

### 5. Identify Restructure Candidates

วิเคราะห์ว่าโฟลเดอร์ใดควร restructure

> Goal: ไม่ทุกโฟลเดอร์ที่มีไฟล์เยอะจำเป็นต้อง restructure

1. รวมผลจาก Step 3 และ Step 4 เป็น quality score หรือ priority
2. ถ้าพบหลายปัญหา (bloat + low cohesion + cross-boundary imports) → mark เป็น high-priority candidate
3. ถ้าไฟล์ cohesive ในหมวดเดียวกัน (เช่น utilities ทั่วไป) → อาจข้ามหรือระบุเป็น low priority

### 6. Report

สรุปผลการตรวจสอบ

> Goal: ผู้ใช้ได้รับ report ที่ใช้ตัดสินใจได้

1. สร้างตาราง: folder | file count | quality issues | restructure candidate | priority
2. ระบุ recommended next action: `/restructure`, `/refactor-packages`, หรือ none
3. ถ้ามี candidates → แนะนำ `/restructure` หรือให้ user ดำเนินการต่อ

## Rules

### Threshold

- ค่าเริ่มต้น file count threshold = 20 ไฟล์ต่อโฟลเดอร์
- รวมเฉพาะ source files ที่เกี่ยวข้อง (ไม่รวม test/generated/dependency folders)
- ถ้า user ระบุ threshold ให้ใช้ค่าของ user

### Quality Dimensions

- domain cohesion: ไฟล์ในโฟลเดอร์ควรอยู่ใน domain เดียวกัน
- naming consistency: ชื่อไฟล์/โฟลเดอร์ต้องสะท้อน responsibility
- imports boundaries: หลีกเลี่ยง imports ข้าม layer หรือ domain
- nesting depth: ความลึก 3-5 ระดับเหมาะสม; เกินหรือ flat เกินไปต้องตรวจสอบ
- mixed concerns: ไม่ผสม logic, test, config, generated ในโฟลเดอร์เดียว

### Exclusions

- ข้าม `node_modules/`, `.git/`, `dist/`, `build/`, `temp/`, `.devin/scripts/temp/`, `coverage/`, `out/`
- ข้าม generated files ที่มี pattern `*.generated.*` หรือ `*.min.*`
- ข้าม hidden files/folders ยกเว้นมีเหตุผล

### Report Format

- ตาราง 5 columns: folder, file count, quality issues, restructure candidate, priority
- เรียงลำดับตาม file count มากไปน้อย แล้ว priority
- ระบุ quality issues สั้นๆ เช่น `bloat`, `mixed-concerns`, `cross-boundary`, `deep-nesting`, `naming`

## Expected Outcome

- รายการโฟลเดอร์ที่มีปัญหาคุณภาพ
- ระบุ quality issues แต่ละโฟลเดอร์
- ตาราง report ที่ใช้ตัดสินใจได้
- ไม่มี false positive จาก generated/dependency folders
