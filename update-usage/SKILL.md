---
name: update-usage
description: อัปเดต usage.kdl CLI spec ให้ตรงกับ CLI จริงและ generate completions/docs
related:
  - review-usage
  - follow-usage
  - follow-create-bun-cli
  - validate
  - suggest-next-action
---

## Goal

อัปเดต `usage.kdl` CLI spec ให้สะท้อน CLI จริง แล้ว generate completions, docs, manpages และ type-safe SDK

## Scope

ใช้เมื่อ CLI มีการเปลี่ยนแปลง (เพิ่ม/ลบ/แก้ flags, args, commands) และต้องการอัปเดต `usage.kdl` ให้ตรง — ไม่รวมการสร้าง `usage.kdl` จาก scratch (ใช้ `follow-usage` แทน)

## Execute

### 1. Review Current Spec

> Goal: เข้าใจสถานะปัจจุบันของ `usage.kdl`

1. ทำ `/review-usage` เพื่อตรวจ `usage.kdl` ก่อนอัปเดต
2. ถ้าไม่มี `usage.kdl` → ทำ `/follow-usage` แทน
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

1. รัน `usage parse usage.kdl` เพื่อ validate syntax
2. ถ้า parse ไม่ผ่าน → แก้ไขแล้ว retry (max 3)
3. รัน `usage generate docs --usage usage.kdl` เพื่อทดสอบ generation
4. ตรวจว่า generated docs ถูกต้อง

### 5. Generate Outputs

> Goal: สร้าง completions, docs, manpages

1. รัน `usage generate completions --usage usage.kdl --shell bash`
2. รัน `usage generate completions --usage usage.kdl --shell zsh`
3. รัน `usage generate completions --usage usage.kdl --shell fish`
4. รัน `usage generate docs --usage usage.kdl` สำหรับ markdown docs
5. รัน `usage generate man --usage usage.kdl` สำหรับ manpages

### 6. Report

> Goal: รายงานผลการอัปเดต

1. ทำ `/report` สรุปสิ่งที่เปลี่ยนแปลงใน `usage.kdl`
2. ทำ `/suggest-next-action` เพื่อแนะนำขั้นต่อไป

## Rules

### 1. Spec Matches CLI

- `usage.kdl` ต้องสะท้อน CLI จริงเสมอ
- ทุก flag, arg, command ใน CLI ต้องมีใน `usage.kdl`
- ทุก flag, arg, command ใน `usage.kdl` ต้องมีใน CLI จริง

### 2. Effects Required

- ทุก command ต้องมี `effect` (`read`, `write`, `destructive`)
- flags ที่มี side effects ต้องมี `effect` ด้วย

### 3. Version Sync

- `version` ใน `usage.kdl` ต้องตรงกับ `package.json`
- ถ้า version เปลี่ยน → อัปเดต `usage.kdl` ด้วย

### 4. Validate Before Generate

- ต้อง validate spec ก่อน generate outputs
- ถ้า parse ไม่ผ่าน → ห้าม generate

## Expected Outcome

- `usage.kdl` ตรงกับ CLI จริง
- spec ผ่าน `usage parse` ไม่มี error
- completions, docs, manpages ถูก generate ครบ
- version ตรงกับ `package.json`
- รายงานสรุปการเปลี่ยนแปลงครบถ้วน
