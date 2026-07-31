---
name: improve-all-windsurf-global-workflows
description: ปรับปรุงทุก workflow ใน global_workflows ให้สอดคล้องกับมาตรฐาน
---

## Goal

ปรับปรุงทุก workflow ใน `global_workflows` ให้สอดคล้องกับ `/write-workflows` พร้อม review ก่อน improve

## Scope

ใช้สำหรับปรับปรุง workflow files ใน `~/.codeium/windsurf/global_workflows/` — ไม่รวม skills หรือ global rules (ใช้ `/improve-windsurf-global-workflows-all` แทน)

## Execute

### 1. List And Group Workflows

รายชื่อและจัดกลุ่ม workflows ทั้งหมดก่อน review

> Goal: รู้ขอบเขตและจัดกลุ่มเพื่อ review อย่างมีประสิทธิภาพ

1. ระบุไฟล์ `.md` ทั้งหมดใน `global_workflows/` — จัดลำดับตามตัวอักษร
2. จัดกลุ่มตาม prefix: `run-*`, `follow-*`, `check-*`, `review-*`, `deep-*`, `idea-*`, `report-*`, `template-*`, อื่นๆ
3. ถ้าไม่มีไฟล์ → stop และ report

### 2. Review Each Workflow

Review แต่ละ workflow ตาม `/write-workflows` validation checklist

> Goal: ระบุ workflows ที่ไม่ผ่านและ issues ที่ต้องแก้

1. อ่านและ validate แต่ละ workflow ตาม checklist: ≤250 บรรทัด, ≤10 steps, sections ครบ, `related` ไม่ missing/unused, ไม่มี TODO/MOCK/placeholder, `, ` ใช้เฉพาะ Execute numbered list, ทุก `, ` มี ``
2. จัดลำดับ issues ตาม severity: structure > content > format
3. บันทึก findings สำหรับ step ถัดไป — ถ้าทุก workflow ผ่าน → stop และ report

### 3. Improve Non-Compliant Workflows

แก้ไข workflows ที่ไม่ผ่านตาม findings

> Goal: ทุก workflow สอดคล้องกับ `/write-workflows`

1. แก้ไข workflows ที่ไม่ผ่านตาม priority: structure ก่อน → content → format
2. ทำ `/improve-flow` เพื่องปรับ step ordering, dependencies, parallelism ให้ fail-fast
4. ทำ `/follow-content-quality`, `/review-workflow-content`, `/update-reference` สำหรับ workflows ที่แก้แล้ว — quality check และ reference update
3. ถ้าแก้ไม่ได้ → ทำ `/write-workflows` rewrite จากต้น (max 3 → stop/report)

### 4. Validate And Report

ตรวจสอบผลลัพธ์และรายงาน

> Goal: ทุก workflow ผ่าน validation และมี report ชัดเจน

1. ทำ `/validate-workflow` สำหรับ workflows ที่แก้ไข — ตรวจสอบผ่าน checklist ซ้ำ
2. รายงานเป็นตาราง: filename | status (✅/❌) | issues fixed | lines
3. ทำ `/suggest-next-action` — แนะนำ action ถัดไป

## Rules

### 1. Review Before Improve

- ต้อง review ทุก workflow ก่อนแก้ไข — ไม่แก้ workflow ที่ผ่านแล้ว
- ใช้ `/write-workflows` validation checklist เป็นมาตรฐานเดียว
- ถ้า workflow ผ่านทุกข้อ → ข้าม ไม่ force change

### 2. Minimal Changes

- แก้เฉพาะ issues ที่พบ — ไม่ rewrite ถ้าไม่จำเป็น
- ถ้า workflow มี issues เยอะ → rewrite ตาม `/write-workflows` ทั้งไฟล์
- ใช้ `/update-reference` หลังแก้ไขทุกครั้งเพื่ออัปเดท references

### 3. High Impact Content

- ทุก bullet ต้องตอบได้ว่า "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ถ้าไม่เปลี่ยน → ลบ
- ห้าม TODO, MOCK, placeholder, generic filler

## Expected Outcome

- ทุก workflow ใน `global_workflows/` สอดคล้องกับ `/write-workflows`
- ตาราง report: filename | status | issues fixed | lines
- ไม่มี broken references — ทุก step มี `, ` markers สำหรับ parallel execution
