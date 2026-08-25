---
name: update-usage
description: อัปเดต usage.kdl spec และ generate USAGE.md และ completions
---

## Goal

อัปเดต `usage.kdl` (KDL source spec) ให้สะท้อน CLI จริง แล้ว generate `USAGE.md` (markdown docs), completions และ manpages

## Scope

ใช้เมื่อ CLI มีการเปลี่ยนแปลง (เพิ่ม/ลบ/แก้ flags, args, commands) และต้องการอัปเดต `usage.kdl` และ `USAGE.md` — `usage.kdl` เป็น KDL source (single source of truth) `USAGE.md` เป็น markdown output ที่ generate จาก spec ไม่รวมการสร้าง `usage.kdl` จาก scratch (ใช้ `follow-tool-usage` แทน)

## Execute

### 1. Review Current Spec

> Goal: เข้าใจสถานะปัจจุบันของ `usage.kdl`

1. ทำ `/review-usage` เพื่อตรวจ `usage.kdl` ก่อนอัปเดต
2. ถ้าไม่มี `usage.kdl` → ทำ `/follow-tool-usage` แทน
3. บันทึก findings จาก review

### 2. Detect CLI Changes

> Goal: ระบุการเปลี่ยนแปลงของ CLI จริง

1. ตรวจ CLI entry point (`src/presentation/cli.ts` หรือ equivalent)
2. เปรียบเทียบ flags, args, commands จริงกับ `usage.kdl`
3. ระบุสิ่งที่เปลี่ยนแปลง:
   - flags เพิ่ม/ลบ/เปลี่ยน
   - args เพิ่ม/ลบ/เปลี่ยน
   - commands เพิ่ม/ลบ/เปลี่ยน
   - help text เปลี่ยน
4. บันทึก diff ระหว่าง spec และ CLI จริง

### 3. Update Spec

> Goal: `usage.kdl` ตรงกับ CLI จริง

1. อัปเดต metadata: `name`, `bin`, `about`, `version`, `author`, `license`
2. อัปเดต `flag`, `arg`, `cmd` พร้อม `help`
3. ใช้ `effect` เช่น `read`, `write`, `destructive` สำหรับ commands และ flags
4. ตรวจว่าทุก command มี `help` และ `effect`
5. ตรวจว่า version ตรงกับ `package.json`

### 4. Validate Spec

> Goal: `usage.kdl` ผ่าน validation

1. รัน `usage parse usage.kdl` เพื่อ validate KDL syntax
2. ถ้า parse ไม่ผ่าน → แก้ไขแล้ว retry (max 3)
3. รัน `usage lint usage.kdl` ถ้ามี lint command
4. ตรวจว่าไม่มี error ก่อน generate

### 5. Generate USAGE.md

> Goal: สร้าง `USAGE.md` (markdown docs) จาก `usage.kdl`

1. รัน `usage generate markdown -f usage.kdl > USAGE.md` เพื่อ generate markdown docs
2. ตรวจว่า `USAGE.md` มีครบ: synopsis, options, commands, examples
3. ถ้า `USAGE.md` มีอยู่แล้ว → overwrite หลัง confirm เท่านั้น
4. ตรวจว่า `USAGE.md` ไม่เกิน 250 บรรทัด

### 6. Generate Completions And Manpages

> Goal: สร้าง completions และ manpages

1. รัน `usage generate completion bash -f usage.kdl` สำหรับ bash completions
2. รัน `usage generate completion zsh -f usage.kdl` สำหรับ zsh completions
3. รัน `usage generate completion fish -f usage.kdl` สำหรับ fish completions
4. รัน `usage generate manpage -f usage.kdl` สำหรับ manpages
5. เก็บ completions ใน `completions/` directory ถ้าจำเป็น

### 7. Report

> Goal: รายงานผลการอัปเดต

1. ทำ `/report` สรุปสิ่งที่เปลี่ยนแปลงใน `usage.kdl` และ `USAGE.md`
2. ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป

## Rules

### 1. KDL Is Source, Markdown Is Output

- `usage.kdl` เป็น KDL source spec (single source of truth)
- `USAGE.md` เป็น markdown docs ที่ generate จาก `usage.kdl`
- ห้ามแก้ `USAGE.md` โดยตรง — แก้ `usage.kdl` แล้ว regenerate
- ถ้า `USAGE.md` ต้องการเนื้อหาเพิ่ม → เพิ่มใน `usage.kdl` แล้ว regenerate

### 2. Spec Matches CLI

- `usage.kdl` ต้องสะท้อน CLI จริงเสมอ
- ทุก flag, arg, command ใน CLI ต้องมีใน `usage.kdl`
- ทุก flag, arg, command ใน `usage.kdl` ต้องมีใน CLI จริง

### 3. Effects Required

- ทุก command ต้องมี `effect` (`read`, `write`, `destructive`)
- flags ที่มี side effects ต้องมี `effect` ด้วย

### 4. Version Sync

- `version` ใน `usage.kdl` ต้องตรงกับ `package.json`
- ถ้า version เปลี่ยน → อัปเดต `usage.kdl` แล้ว regenerate `USAGE.md`

### 5. Validate Before Generate

- ต้อง validate `usage.kdl` ก่อน generate `USAGE.md` และ completions
- ถ้า parse ไม่ผ่าน → ห้าม generate

## Expected Outcome

- `usage.kdl` ตรงกับ CLI จริง
- `USAGE.md` ถูก generate จาก `usage.kdl` ครบ synopsis, options, commands, examples
- completions และ manpages ถูก generate ครบ
- version ตรงกับ `package.json`
- รายงานสรุปการเปลี่ยนแปลงครบถ้วน
