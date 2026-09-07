# Fix Guide

(merged from: improve-cli-ux)

## Goal

ปรับ UX ของ CLI tool — help text ที่ชัด, output ที่อ่านง่าย, flags ที่ consistent, interactive prompts ที่ใช้ดี และ error messages ที่ช่วยแก้ปัญหา

## Scope

- ตรวจ CLI entry points, command definitions, flag parsing, help/usage output, error output, exit codes
- ครอบคลุม: help text, flag naming/aliases, output formatting (colors, tables, JSON mode), progress indicators, prompts, exit codes, stderr vs stdout
- Action-oriented: แก้ code จริง — verify ด้วยการรัน CLI จริง

## Execute

### 1. Inventory CLI Surface

> Goal: map commands, flags และ output ทั้งหมด

1. หา CLI entry และ command registrations (commander, citty, clap, cobra ตาม ecosystem)
2. รัน `--help` ทุก command — บันทึก output ปัจจุบัน (`/capture` ถ้าต้องการ)
3. รัน error cases — ดู error messages และ exit codes ปัจจุบัน

### 2. Evaluate Against Conventions

> Goal: หา UX issues ตาม CLI conventions

1. Help: มี description, examples, flag docs ครบไหม — ไม่มี wall of text
2. Flags: naming consistent (`--verbose`/`--quiet` pairs), มี short aliases สำหรับ flags หลัก
3. Output: stdout สำหรับ data (pipeable), stderr สำหรับ messages/progress, มี `--json`/`--quiet` mode ถ้าเหมาะ
4. Errors: messages บอกว่าเกิดอะไร + แก้อย่างไร, exit codes ถูกต้อง (0 success, 1 general, 2 usage)
5. Interactivity: prompts มี defaults, confirm สำหรับ destructive ops, non-interactive fallback (CI detection)
6. Progress: long ops มี spinner/progress, ปิดอัตโนมัติเมื่อ non-TTY

### 3. Apply Improvements

> Goal: แก้ตาม priority

1. แก้ help text — เพิ่ม examples, จัดกลุ่ม flags, ใช้ภาษา consistent
2. แก้ output — routing ไป stdout/stderr ถูกต้อง, เพิ่ม output modes ถ้าจำเป็น
3. แก้ errors — messages ที่ actionable, exit codes ถูก, ทำ `/review-stability` ร่วม
4. แก้ flags — เพิ่ม aliases, ทำ naming consistent
5. เพิ่ม confirmations สำหรับ destructive operations

### 4. Verify

> Goal: ทดสอบ CLI จริงทุก flow

1. รัน `/run-test-cli` — ทุก command, help, error paths
2. ทดสอบ piping: `<cli> | jq` ต้อง parse stdout ได้
3. ทดสอบ non-TTY (CI) mode — ไม่มี ANSI garbage ใน logs
4. ใช้ `/report-before-after` แสดง output ก่อน-หลัง

## Rules

### 1. Convention Compliant

- ทำตาม POSIX/GNU CLI conventions และ ecosystem norms
- flags ที่มีอยู่ห้ามเปลี่ยน meaning — เพิ่ม aliases แทนการเปลี่ยนชื่อ (breaking)

### 2. Verify By Running

- ต้องรัน CLI จริงเพื่อ verify — ไม่ใช่แค่อ่าน code
- ทดสอบทั้ง TTY และ non-TTY modes

### 3. Preserve API

- ห้ามลบ/rename flags ที่มีอยู่โดยไม่บอก user — deprecate ก่อน
- Output format changes ที่ทำให้ scripts พัง = breaking — flag ชัดเจน

## Expected Outcome

- Help text ครบพร้อม examples ทุก command
- stdout/stderr routing ถูกต้อง และ output parseable
- Error messages actionable พร้อม exit codes ที่ถูกต้อง
- Destructive ops มี confirmation
