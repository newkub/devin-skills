---
name: report-my-global-cli
description: รายงาน CLI tools ที่ติดตั้งและ commands ที่ควรแปลงเป็น skills
---

## Goal

รายงาน CLI tools ที่ติดตั้งในเครื่องและ commands ที่มี เพื่อประเมินความเหมาะสมในการแปลงเป็น devin skills

## Scope

ใช้สำหรับสำรวจ installed CLI tools จาก `mise`, `scoop`, `winget`, `bun` และรายงาน commands ที่มี ครอบคลุม:

- รายการ tools ที่ติดตั้ง
- commands, subcommands, options ของแต่ละ tool
- ความถี่ในการใช้งานและความซับซ้อน
- ความเหมาะสมในการแปลงเป็น skills

## Execute

### 1. Discover Installed CLI Tools

> Goal: หา CLI tools ที่ติดตั้งทั้งหมด

1. เช็ค tools ที่ติดตั้งด้วย `mise list`, `scoop list`, `winget list`, `bun --version`
2. รวบรวมรายการ tools เป็นตาราง (tool, version, manager)

### 2. Learn Commands

> Goal: สำรวจ commands และ options ของแต่ละ tool

1. ทำ `/learn-from-cli` สำหรับแต่ละ tool เพื่อดู subcommands, options, output
2. บันทึก commands, flags, argument types และ exit codes

### 3. Evaluate Conversion Candidates

> Goal: ประเมินว่า command ไหนเหมาะแปลงเป็น skill

1. ระบุ criteria:
   - ใช้บ่อยหรือมี pattern ซ้ำ
   - มี options/flags มากพอที่ต้องมี guideline
   - ใช้งานซับซ้อนจนควรมี skill คอยช่วย
   - มี project หลาย workspace ที่ใช้ร่วมกัน
2. จัดลำดับ commands ตาม priority: High, Medium, Low
3. ทำ `/report-table` เพื่อสรุป candidates

### 4. Suggest Next Action

> Goal: นำเสนอทิศทางถัดไป

1. ถ้ามี High priority commands → ทำ `/idea-convert-my-global-cli-to-skills` เพื่อเริ่ม convert
2. ถ้าข้อมูลไม่พอ → ทำ `/follow-tool-my-global-cli` อีกรอบหรือ `/learn-from-cli` เพิ่มเติม
3. ถ้าไม่มี candidates → ทำ `/suggest-next-action` เพื่อหาทิศทางอื่น

## Rules

### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-ansi` สำหรับรายงานสถานะ/progress/logs
4. ใช้คอลัมน์ "No." เป็นคอลัมน์แรก เรียงลำดับ 1, 2, 3, ... โดย headers ชัดเจน จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Tool Coverage

- ครอบคลุม tools ทั้งหมดจาก `mise`, `scoop`, `winget`, `bun`
- ข้าม tools ที่ไม่มี CLI interface หรือไม่มี `--help`
- ระบุ package manager ของแต่ละ tool

### 2. Command Analysis

- บันทึก command, subcommand, options ทั้งหมด
- ระบุ flags ที่สำคัญสำหรับ common workflows
- ไม่ duplicate ข้อมูลจาก `/follow-tool-my-global-cli` หรือ `/learn-from-cli`

### 3. Conversion Criteria

- High: ใช้บ่อย + มี flags หลายตัว + ใช้ใน project หลาย workspace
- Medium: ใช้บ่อยบางครั้ง หรือ flags ไม่มาก
- Low: ใช้นานๆ ครั้ง หรือ simple command

## Expected Outcome

- ตาราง CLI tools ที่ติดตั้งพร้อม version
- สรุป commands, options และ flags
- รายการ commands ที่เหมาะแปลงเป็น skills พร้อม priority
- คำแนะนำถัดไป เช่น ทำ `/idea-convert-my-global-cli-to-skills`
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน