---
name: follow-create-sdk
description: ถามและส่งต่อไปยัง skill follow-create-* ทีเหมาะสมกับงานสร้าง
argument-hint: "[skill-name-or-goal]"
related:
  - follow-create-bun-cli
  - follow-create-cli
  - follow-create-rust-cli
  - follow-create-website
  - follow-create-mobile-ios
  - follow-create-mobile-android
  - follow-create-mobile-ios-android
  - follow-create-browser-extensions
  - follow-create-raycast-extensions
  - follow-create-vite-plugins
  - follow-create-vitest-plugins
  - follow-create-tauri-plugins
  - follow-create-nvim-plugins
  - follow-create-biome-plugins
  - follow-create-oxlint-plugins
  - follow-create-eslint-plugins
  - follow-create-rolldown-lib
  - ask-me
  - search-skills
  - search-files-patterns
  - report-table
---

## Goal

ช่วย user เลือก `follow-create-*` skill ทีเหมาะสมกับงานสร้าง แล้วส่งต่อไปดำเนินการทันที

## Scope

ใช้เมื่อ user ต้องการสร้าง project/plugin/library/extension/CLI แต่ยังไม่แน่ใจว่าควรใช้ `follow-create-*` ใด

## Execute

### 1. Parse Argument

> Goal: ตรวจสอบว่า user ระบุ skill หรือ goal มาหรือไม่

1. ถ้า user ระบุ `skill-name` ทีตรงกับ `follow-create-<name>` ที่มีอยู่ → ส่งต่อไปยัง skill นั้นทันที
2. ถ้า user ระบุ goal (เช่น `bun cli`, `mobile app`, `vite plugin`) → ใช้เป็นคำใบ้ในการ sort ตัวเลือก
3. ถ้าไม่ระบุอะไร → ไปขั้นตอนถัดไป

### 2. Discover Create Skills

> Goal: หา `follow-create-*` skills ทีมีอยู่ทั้งหมด

1. ใช้ `search-files-patterns` หรือ `exec` ค้นหา `follow-create-*/SKILL.md` ใน `%APPDATA%\devin\skills`
2. อ่าน frontmatter (`name`, `description`) ของแต่ละ skill
3. สร้างรายการ: ชื่อ skill, description, category โดยประมาณ
4. ใช้ `/report-table` แสดงตารางสรุปให้ user เห็นภาพรวมก่อนถาม

### 3. Build And Ask Options

> Goal: ถาม user ว่าจะทำตาม follow-create- ไหน

1. เรียง skills ตาม relevance กับ goal/argument ก่อน ถ้าไม่มี goal เรียงตาม category แล้วชื่อ
2. ใช้ `/ask-me` ด้วย `ask_user_question` ทีละชุด ชุดละไม่เกิน 3 skills + ตัวเลือก `More...`
3. ตัวเลือก `label` ใช้ชื่อ skill สั้นๆ เช่น `follow-create-bun-cli`
4. `description` ใช้ description จาก frontmatter
5. ถ้ามี skills เหลืออยู่ → เพิ่ม `More...` เสมอ (ยกเว้นชุดสุดท้าย)
6. ถ้าถึงชุดสุดท้าย → เพิ่ม `Skip` และ `Suggest another` เป็นทางเลือก
7. ถ้า user เลือก `More...` → แสดงชุดถัดไป
8. ถ้า user เลือก `Skip` → หยุดและรายงานว่าไม่มีการเลือก
9. ถ้า user เลือก `Suggest another` → ให้ user พิมพ์ชื่อ skill หรือ goal แล้ว match ใหม่

### 4. Invoke Selected Skill

> Goal: ส่งต่อไปยัง skill ทีเลือก

1. ถ้า user เลือก skill เดียว → เรียก `skill` tool ด้วย `skill: <selected-skill-name>`
2. ถ้า user เลือกหลาย skills → ยืนยันลำดับกับ user ด้วย `/ask-me` ก่อน แล้วเรียกตามลำดับ
3. ถ้า user ตอบเอง (custom text) → ใช้ `search-skills` หรือ string match กับ `follow-create-*` แล้ว invoke ถ้าตรง

### 5. Handle Mismatch

> Goal: จัดการกรณีหาหรือ match ไม่เจอ

1. ถ้าไม่พบ skill ทีตรงกับ argument หรือ goal → แสดงรายการ follow-create-* ทั้งหมด
2. ถ้า match ไม่ชัดเจน → ถาม user ยืนยันก่อน invoke
3. ถ้า user ต้องการ skill ทียังไม่มี → รายงานว่าไม่พร้อมใช้และหยุด

## Rules

- ถ้า user ระบุชื่อ skill ตรงต้องส่งต่อทันทีโดยไม่ถามซ้ำ
- ถามทีละชุดไม่เกิน 4 ตัวเลือก (รวม `More...` หรือ `Skip`/`Suggest another`)
- ใช้ description จาก `SKILL.md` frontmatter ของแต่ละ skill
- ไม่เพิ่ม `follow-create-*` ใหม่เองถ้ายังไม่มี
- หลัง user เลือกต้อง invoke skill ด้วย `skill` tool
- ถ้าเลือกหลาย skills ต้องยืนยันลำดับก่อน

## Expected Outcome

- User เห็นรายการ `follow-create-*` skills ทีมีอยู่ทั้งหมด
- User เลือก skill ทีต้องการผ่าน `/ask-me`
- Skill ทีเลือกถูก invoke เพื่อดำเนินการต่อ
