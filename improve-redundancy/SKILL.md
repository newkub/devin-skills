---
name: improve-redundancy
description: ตรวจจับและลบเนื้อหาซ้ำซ้อนระหว่างไฟล์และ sections โดยใช้ tools ก่อน manual
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ตรวจจับและลบเนื้อหาซ้ำซ้อนระหว่างไฟล์, sections, และ modules โดยใช้ tools ก่อน manual editing เพื่อลด noise และรักษา single source of truth

## Scope

ใช้กับเนื้อหาทุกประเภท: workflow files, documentation, code, configs — ตรวจจับ duplication ระหว่างไฟล์และภายในไฟล์ — ไม่รวม code refactoring ลึกซึ้ง (อยู่ใน `/refactor`)

## Execute

### 1. Detect Redundancy

ตรวจจับเนื้อหาซ้ำซ้อนด้วย tools ก่อน manual review

> Goal: รู้ว่ามีอะไรซ้ำซ้อน ที่ไหน กี่จุด

1. ทำ `/scan-codebase` เพื่อเข้าใจ structure และ identify scope ของการตรวจสอบ
2. รัน `bunx jscpd` สำหรับ code duplication, รัน `bunx knip` สำหรับ unused exports/files, รัน `bunx madge --circular` สำหรับ circular dependencies
3. ตรวจจับ content duplication ด้วย `bunx ast-grep scan` สำหรับ structural patterns ที่ซ้ำกัน
4. สำหรับ markdown/docs: ค้นหา duplicate sections ด้วย `grep` หัวข้อที่ซ้ำ และเนื้อหาที่เหมือนกันข้ามไฟล์
5. รวมผลลัพธ์เป็น list พร้อม file path, line range, และ duplicate target

### 2. Classify And Prioritize

จัดประเภทและจัดลำดับความสำคัญของ redundancy ที่พบ

> Goal: รู้ว่าอะไรลบได้ อะไรต้อง merge อะไรต้อง reference

1. จัดประเภท redundancy: exact duplicate (ลบได้), near-duplicate (merge), partial overlap (extract shared), reference-only (อ้างอิงแทน)
2. จัดลำดับตาม impact: ข้ามไฟล์ > ภายในไฟล์ > ภายใน section — ข้าม module > ภายใน module
3. ตรวจสอบว่าแต่ละรายการซ้ำซ้อนจริง ไม่ใช่ false positive — ถ้าเนื้อหาดูเหมือนกันแต่ context ต่าง → mark เป็น intentional
4. ถ้าไม่พบ redundancy → stop และ report ว่าไม่มี

### 3. Remove And Merge

ลบและรวมเนื้อหาซ้ำซ้อนตามลำดับความสำคัญ

> Goal: เนื้อหาไม่ซ้ำซ้อน เก็บ context ครบ เป็น single source of truth

1. สำหรับ exact duplicate → ลบสำเนา เก็บต้นฉบับที่ location ที่เหมาะสม — แสดง dry run preview ก่อนลบ
2. สำหรับ near-duplicate → merge เป็นเนื้อหาเดียว รักษา context จากทั้งสองจุด — ย้ายไปยัง location ที่เหมาะสม
3. สำหรับ partial overlap → extract ส่วนที่ซ้ำเป็น shared section หรือ reference — อ้างอิงแทนการเขียนซ้ำ
4. สำหรับ reference-only → แทนที่เนื้อหาซ้ำด้วย reference ไปยัง single source of truth
5. ทำ `/dont-over-engineer` เพื่อกำหนดขอบเขตการแก้ไขให้ minimal — ถ้าลบแล้วทำให้ context ขาด → ยกเลิกการลบ
6. ถ้าเป็น workflow files → ทำตาม `/follow-write-devin-skills` Rule `Responsibility And Duplication`

### 4. Validate And Update References

ตรวจสอบว่าการลบไม่ทำลาย references และเนื้อหายังครบ

> Goal: ไม่มี broken references เนื้อหาครบ ไม่มี context หาย

1. ทำ `/validate` เพื่อตรวจสอบว่าเนื้อหาที่เหลือยังสมบูรณ์ — ไม่มี missing context จากการลบ
2. ทำ `/update-reference` เพื่ออัปเดท references ที่อาจชี้ไปยังเนื้อหาที่ถูกลบหรือย้าย
3. ตรวจสอบว่า single source of truth ยังเข้าถึงได้จากทุกจุดที่เคยอ้างอิง
4. ถ้าพบ broken reference → fix แล้ว recheck (max 3 → stop/report)

### 5. Report

รายงานผลการลด redundancy

> Goal: ผู้ใช้รู้ว่าลบอะไร รวมอะไร และเหลืออะไร

1. รายงานเป็นตารางด้วย `/report-format-table`: รายการที่ลบ, รายการที่ merge, รายการที่แปลงเป็น reference, จำนวนบรรทัดที่ลดลง
2. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Tools First

- ใช้ tools (`jscpd`, `knip`, `madge`, `ast-grep`) สำหรับ detection ก่อน manual review — ไม่เดาว่ามีอะไรซ้ำ
- ใช้ `bunx <tool>` สำหรับ npm tools — เร็วกว่า ไม่ต้องติดตั้ง global
- ถ้า tool ไม่ครอบคลุมประเภทเนื้อหา (เช่น markdown) → ใช้ `grep` และ manual review เป็นทางเลือก

### 2. Safety

- แสดง dry run preview ก่อนลบเนื้อหา — ผู้ใช้ confirm ก่อน destructive action
- ถ้าลบแล้วทำให้ context ขาด → ยกเลิกการลบ — ใช้ `/dont-over-engineer`
- ถ้าเนื้อหาดูเหมือนกันแต่ context ต่าง → mark เป็น intentional ไม่ลบ
- การลบต้อง idempotent — รันซ้ำได้โดยไม่เกิด side effects

### 3. Single Source Of Truth

- รวบรวมรายละเอียดที่เหมือนกันไว้ที่เดียว — อ้างอิงแทนการเขียนซ้ำ
- ถ้าเนื้อหาซ้ำระหว่าง Execute และ Rules → อ้างอิงแทน
- ถ้าเนื้อหาซ้ำระหว่าง workflows → อ้างอิง workflow อื่นแทน

### 4. Scope Boundary

- ไม่ refactor code ลึกซึ้ง — อยู่ใน `/refactor`
- ไม่ simplify โครงสร้าง — อยู่ใน `/simplify`
- เน้นเฉพาะการลบเนื้อหาซ้ำซ้อนและการรวมเนื้อหาที่เหมือนกัน

### 5. Evidence-Based

- ทุกการลบต้องมี evidence: file path, line range, duplicate target
- รายงาน false positives ที่ตรวจพบและ mark ว่าไม่ใช่ redundancy จริง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- เนื้อหาไม่ซ้ำซ้อน เป็น single source of truth
- รายงานตาราง: รายการที่ลบ, merge, แปลงเป็น reference, จำนวนบรรทัดที่ลดลง
- ไม่มี broken references หลังการลบ
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
