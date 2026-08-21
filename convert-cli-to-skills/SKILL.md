---
name: convert-cli-to-skills
description: แปลง CLI commands ทั้งหมดเป็น Devin skills
triggers:
  - user
  - model
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
related:
  - idea-convert-cli-skills
  - follow-write-devin-skills
  - write-skills-md
  - validate
---

## Goal

แปลง CLI tool หรือ command set ทีระบุ เป็น skill ย่อยทีเรียกผ่าน `/`

## Scope

ใช้เมื่อมี CLI ทีต้องการ convert เป็น skills ตามมาตรฐาน Devin CLI

## Execute

### 1. Identify CLI

ระบุ CLI ทีต้องการ convert

> Goal: ทราบ scope ของ CLI

1. หา binary/package ที user ต้องการ เช่น `my-cli`, `docker`, `kubectl`
2. ตรวจสอบ version ล่าสุดและ installation path
3. ถ้าไม่ชัดให้ `ask-me`

### 2. List All Commands

รวบรวม commands ทั้งหมดของ CLI

> Goal: ได้รายการ commands ครบถ้วน

1. รัน `<cli> --help` หรือ `<cli> help` เพื่อดู top-level commands
2. รัน `<cli> <command> --help` เพื่อดู subcommands ย่อย
3. บันทึก: command name, description, flags, arguments, examples, exit codes
4. ใช้ `learn-from-cli` หรือ official docs ถ้า help ไม่ครบ

### 3. Group And Prioritize

จัดกลุ่ม commands ตามความใช้ซ้ำและ complexity

> Goal: ได้กลุ่ม commands ทีสมควรแยก skill

1. รวม commands ทีคล้ายกันใน skill เดียวกัน (เช่น create/delete ของ resource)
2. แยก commands ทีซับซ้อนหรือใช้บ่อยมากเป็น skill เดียว
3. ให้คะแนนความสำคัญ: High (ใช้บ่อย/ซับซ้อน), Medium, Low
4. ตัดสินใจว่า low-priority commands ควรสร้าง skill หรือไม

### 4. Draft Skills

เขียน draft skill สำหรับแต่ละกลุ่ม

> Goal: ได้ draft ทีพร้อม review

1. ใช้ `/write-skills-md` หรือ `/follow-write-devin-skills` สำหรับแต่ละ skill
2. กำหนด `name` ในรูป `<cli>-<command>` หรือกลุ่ม เช่น `my-cli-build`
3. `description` ≤ 100 ตัวอักษร
4. ระบุ `allowed-tools` ตามลักษณะ command (exec, read, edit, grep)
5. ใส่ `related` ไปยัง skills อื่นในกลุ่มเดียวกัน

### 5. Validate

ตรวจสอบว่า skills ครบและถูกต้อง

> Goal: ไม่มี skill ซ้ำหรือขาด

1. ทำ `/validate` ตรวจ frontmatter, references, เงื่อนไขต่างๆ
2. ตรวจว่า command ทุกอันมี skill ครอบคลุม
3. ตรวจว่าไม่มีชื่อ skill ซ้ำ
4. ถ้าไม่ผ่านให้แก้ไขและ validate ซ้ำ

## Rules

### 1. One Skill Per Concern

- หนึ่ง skill ควรครอบคลุม command หรือกลุ่ม commands ทีมี goal เดียวกัน
- ไม่รวมหลาย tool ที่ไม่เกี่ยวข้องกันในหนึ่ง skill
- ถ้า command มี subcommands มาก ให้แยกตาม subcommand

### 2. Preserve CLI Semantics

- ชื่อ skill ควรสะท้อน command จริง
- ใช้ flags/options เดิมของ CLI ใน instructions
- รักษา exit codes และ error handling ของ CLI

### 3. Reusable Patterns

- สร้าง utility skill สำหรับ patterns ทีซ้ำ เช่น `<cli>-run` หรือ `<cli>-config`
- ใช้ `related` เพื่อเชื่อมโยง skills ใน ecosystem เดียวกัน

## Expected Outcome

- มีชุด skills ทีครอบคลุม commands ของ CLI ทั้งหมด
- ทุก skill ผ่าน validation
- References ภายในกลุ่มถูกต้อง
