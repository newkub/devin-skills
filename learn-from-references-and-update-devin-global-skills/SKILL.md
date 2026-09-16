---
name: learn-from-references-and-update-devin-global-skills
description: เรียนรู้จาก references/web/CLI ก่อน แล้วค่อยสร้างหรืออัปเดต global Devin skills ตามมาตรฐาน
argument-hint: "[@files-or-topic...]"
related:
  - learn-from-references
  - update-devin-global-skills
  - check-reference
  - deep-validate
---

## Goal

เรียนรู้ source ที่เกี่ยวข้องให้ครบก่อน แล้วจึงสร้างหรืออัปเดต global Devin skill ใน `%APPDATA%\devin\skills` — ใช้เมื่อต้อง research ก่อนเขียน/แก้ skill

## Scope

ใช้สำหรับงาน skill ที่ต้องการความรู้จาก `references/`, official docs, web sources หรือ CLI discovery ก่อน เช่น skill ที่มี dependencies, ผูกกับ library/tool เวอร์ชันล่าสุด หรือต้องเขียน `references/` ใหม่ — ถ้า skill ไม่ต้อง research → ใช้ `/update-devin-global-skills` โดยตรง

## Execute

### 1. Learn

> Goal: มีความรู้ครบจาก sources ก่อนแก้ skill

ทำ `/learn-from-references` ตาม target ของงาน:

1. ถ้า skill มี `references/` อยู่แล้ว → สกัดความรู้จากไฟล์เดิม
2. ถ้าต้องข้อมูลใหม่จาก tool/library → web research (official docs → DeepWiki → Context7 → Web Search)
3. ถ้า skill ผูกกับ CLI → CLI discovery (`--help`, subcommands, machine-readable output)
4. ถ้าถูกเรียกเพื่อ dependencies → เขียน `references/` files จริง ไม่ใช่แค่ research

### 2. Update Skills

> Goal: skill ถูกสร้าง/อัปเดตตามมาตรฐาน repo

ทำ `/update-devin-global-skills` เต็ม workflow:

1. ผ่าน context ที่ได้จาก step 1 ไปยัง deep research, template selection และ writing steps
2. ใช้ reference files ที่เขียนใน step 1 เป็น input ของ `references/` ใน skill package
3. sync living documents ตาม `update-devin-global-skills/references/living-documents.md` เสมอหลัง add/remove/rename

### 3. Validate

> Goal: ทั้ง knowledge และ skill package ผ่านเกณฑ์

1. ทำ `/check-reference` เพื่อยืนยัน `references/` ครบและถูกต้อง
2. ทำ `/deep-validate` กับ `SKILL.md` ที่เขียน/แก้
3. ทำ `/report` สรุปสิ่งที่เรียนรู้และ skill ที่เปลี่ยน

## Rules

- เรียงลำดับ learn ก่อน update เสมอ — ห้ามเขียน/แก้ skill โดยขาดข้อมูลจาก step 1
- ทุก reference file ต้องมีเนื้อหาจริงจาก official docs — ห้าม placeholder
- ถ้า research พบว่า skill ไม่ต้องเปลี่ยน → stop และ report แทนที่จะแก้โดยไม่จำเป็น

## Expected Outcome

- ความรู้จาก sources ครบและ cross-checked ก่อนเขียน
- skill ผ่าน `/deep-validate` ไม่เกิน 250 บรรทัด ไม่มี TODO/MOCK/placeholder
- `references/` ของ skill ที่เกี่ยวข้องถูกเขียนจริงครบทุก dependency
- living documents (AGENTS.md, tool-map, related lists) sync ครบ
