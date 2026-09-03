---
name: view-devin-global-rules
description: แสดง devin global rules ในเทอร์มินัลพร้อม syntax highlighting
argument-hint: "[rule-name]"
allowed-tools:
  - exec
  - read
  - grep
  - find_file_by_name
triggers:
  - user
  - model
related:
  - view
  - follow-global-rules
  - check-reference
  - report-file-structure
---

## Goal

แสดง devin global rules และไฟล์กฎที่เกี่ยวข้องบนเทอร์มินัล พร้อมจัดรูปแบบในลักษณะ codebase

## Scope

ใช้เมื่อผู้ใช้ขอดู global rules, project rules หรือไฟล์กฎเฉพาะ ใช้ได้กับ `.codeium/windsurf/memories/global_rules.md`, `.devin/rules/`, และ `AGENTS.md` ของ repository

ดูเพิ่มเติม: /view, /follow-global-rules, /check-reference, /report-file-structure

## Execute

### 1. Locate Rule Files

> Goal: Locate Rule Files

หาไฟล์กฎที่จะแสดง

1. ตรวจสอบ `C:\Users\<user>\.codeium\windsurf\memories\global_rules.md` สำหรับ global rules
2. ตรวจสอบ `C:\Users\<user>\AppData\Roaming\devin\global_rules.md` สำหรับ devin global rules
3. ตรวจสอบ `<workspace>\AGENTS.md` สำหรับ project rules
4. ตรวจสอบ `<workspace>\.devin\rules\` สำหรับไฟล์กฎเฉพาะโปรเจกต์

### 2. View Global Rules

> Goal: View Global Rules

แสดงไฟล์ global rules

1. รัน `bat --style=header,numbers,grid --paging=never --color=always "<global_rules.md>"`
2. ถ้าไม่มี `bat` ให้ใช้ `Get-Content` แทน พร้อมคำนำหน้าหมายเลขบรรทัด
3. ถ้ามีชื่อกฎ ให้ใช้ `grep` หรือ `Select-String` เพื่อหาส่วนนั้น

### 3. View Project Rules

> Goal: View Project Rules

แสดงกฎในระดับโปรเจกต์

1. รัน `bat --style=header,numbers,grid --paging=never --color=always "<workspace>\AGENTS.md"`
2. ถ้าผู้ใช้ขอดู `.devin/rules` ให้แสดงรายการไฟล์ด้วย `find_file_by_name`
3. ดูไฟล์กฎที่เลือกด้วย `bat`

### 4. Search Specific Rule

> Goal: Search Specific Rule

หากฎจากชื่อหรือคีย์เวิร์ด

1. ใช้ `grep -n "<keyword>" "<global_rules.md>"`
2. แสดงส่วนที่ตรงกัน พร้อมบริบทโดยรอบ
3. ถ้ามีหลายผลลัพธ์ ให้แสดงรายการแล้วถามว่าจะดูอันไหน

### 5. Style And Limits

> Goal: Style And Limits

จัดรูปแบบผลลัพธ์อย่างปลอดภัย

1. ใช้ `bat` สำหรับ syntax highlighting และหมายเลขบรรทัด
2. จำกัดผลลัพธ์ให้ไม่เกิน 200 บรรทัดต่อครั้งสำหรับไฟล์กฎขนาดใหญ่
3. ใช้ `--line-range` เพื่อแสดงส่วนเฉพาะเมื่อมีการขอ

## Rules

### 1. Tooling

- ใช้ `bat` เป็นหลักสำหรับดูไฟล์กฎ
- ใช้ `grep` หรือ `Select-String` สำหรับค้นหา
- ใช้ `Get-Content` แทน ถ้าไม่มี `bat`

### 2. File Priority

- ดู `AGENTS.md` ของ workspace ถ้าผู้ใช้ขอ project rules
- ดู `global_rules.md` ถ้าผู้ใช้ขอ global rules
- ดู `.devin/rules/<rule>/RULE.md` ถ้ามีการขอกฎเฉพาะ

### 3. Scope

- อ่านอย่างเดียว ห้ามแก้ไขกฎเว้นแต่จะมีการขอ
- แสดงหมายเลขบรรทัดเพื่ออ้างอิงได้ง่าย
- อ้างอิงส่วนกฎในการสนทนาต่อเนื่อง

### 4. Safety

- ตรวจสอบว่าไฟล์มีอยู่ก่อนดู
- ห้ามเปิดเผย secrets หรือ personal paths ในผลลัพธ์
- เคารพขอบเขตของ workspace

## Expected Outcome

- ไฟล์กฎถูกแสดงพร้อมส่วนหัวไฟล์และหมายเลขบรรทัด
- สามารถหากฎเฉพาะได้จากคีย์เวิร์ดหรือชื่อ
- รองรับทั้ง global rules และ project rules
- ผลลัพธ์อ่านง่ายและคัดลอกได้สะดวก
