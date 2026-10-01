---
name: learn-from-cli
description: เรียนรู้ CLI tool จาก --help, subcommands, machine-readable output แล้วสรุป capability
argument-hint: "[cli-command]"
related:
  - learn
  - learn-from-web
  - check-types-definition
  - check-my-global-cli
  - use-scripts
  - check-reference
  - report
---

## Goal

เรียนรู้และสกัดความรู้ของ CLI tool จาก binary จริง — `--help`, subcommands, flags, machine-readable output — แล้วสรุป capability, commands และ usage ที่ใช้งานได้จริง

## Scope

ใช้เมื่อต้องเรียนรู้ CLI tool ที่ติดตั้งอยู่ในเครื่องหรือใน project:

- สำรวจ command tree, subcommands, options, flags ของ CLI
- ยืนยัน version และ output format จริงก่อนเขียน docs หรือ how-to
- เติม CLI reference ให้ skill ที่ผูกกับ tool นั้น

ไม่ใช่เรียนรู้จาก web docs (ใช้ `/learn-from-web`) หรือ TypeScript API surface (ใช้ `/check-types-definition`)

## Execute

### 1. Identify CLI Target

> Goal: รู้ว่า CLI คืออะไรและติดตั้งอยู่จริง

1. รับ CLI name หรือ binary path จาก user
2. ตรวจว่า CLI ติดตั้งจริง — `<cli> --version` หรือ `where <cli>` (Windows) / `which <cli>`
3. ถ้าไม่มีในเครื่อง → เช็ค `check-my-global-cli/references/global-cli-commands.md` หรือทำ `/check-my-global-cli`; ถ้าต้องติดตั้ง → แจ้ง user ก่อน
4. ถ้าเป็น subcommand ของ tool ใหญ่ → เริ่มจาก root command ก่อน

### 2. Discover Command Surface

> Goal: map ครบทุก subcommand, option, flag

ทำตาม [references/cli-discovery.md](references/cli-discovery.md) — `--version` → `--help` → `help <subcommand>` → `<subcommand> --help` → machine-readable metadata (`agent-context`, `completion`)

### 3. Extract Knowledge

> Goal: สกัดความรู้จาก output จริง

1. จดบันทึก command groups และ hierarchy
2. บันทึก options/flags ที่สำคัญ พร้อม default values และ argument types
3. บันทึก exit codes, output formats (text/json/table) และ env vars ที่ CLI ใช้
4. ทดลองรัน common commands จริงเพื่อเห็น output จริง
5. บันทึก edge cases และ common pitfalls ที่เจอจากการรัน

### 4. Write Content Or CLI Reference

> Goal: ความรู้ถูกบันทึกครอบคลุม

1. ถ้าเรียนเพื่อตัวเอง → สรุปในแชทตาม `/report`
2. ถ้าถูกเรียกเพื่อ dependency ของ skill → เขียน `references/<dep>/cli.md` จริงตาม `update-devin-global-skills` (`## Conventions → Write References`) (บังคับ ห้ามข้าม)
3. ใช้ output จริงจากการรัน — ห้ามเดา flags หรือ options
4. ถ้าต้องเขียน >10 ไฟล์ → ทำ `/use-scripts`
5. ทำ `/check-reference` กับ commands ที่เขียน

## Rules

### 1. Run Real Commands

- ทุก claim ต้องมาจาก output จริงของ `<cli> --help` หรือการรันจริง — ห้ามเดา
- ถ้า output ใหญ่ → สรุปเฉพาะส่วนที่เกี่ยวกับ use case

### 2. Source Priority

- CLI binary จริง (`--help`, `--version`, subcommand help) เป็นแหล่งหลัก
- web docs เป็น fallback เมื่อ CLI ใช้ไม่ได้ — ต่อด้วย `/learn-from-web`

### 3. Content Quality

- ใช้ backticks สำหรับ `commands`, `flags`, `paths`
- ไม่มี TODO/MOCK/placeholder — ทุก example ต้องเคยรันจริง
- ไม่เกิน 250 บรรทัดต่อไฟล์

## Expected Outcome

- รู้ command surface ของ CLI ครบจาก binary จริง ไม่ใช่เดาจาก docs
- summary หรือ `references/<dep>/cli.md` มี commands, flags, output format จริง
- ถ้าถูกเรียกเพื่อ skill dependency → reference file จริงไม่มี placeholder
