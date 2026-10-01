---
name: follow-default-config
description: Convention การเขียน config — config files เก็บเฉพาะ overrides เท่านั้น ค่าที่เท่า default ห้ามเขียน (เช็ค defaults ด้วย /check-types-definition)
argument-hint: "[config-path]"
related:
  - check-types-definition
  - update-config
  - deep-review
  - report
---

## Goal

Config files ต้องสั้นและอ่านง่าย — เก็บเฉพาะค่าที่ override default ของ tool เท่านั้น; ค่าที่เท่ากับ default อยู่แล้วให้ลบออก ไม่เขียน config ซ้ำกับสิ่งที่ tool ทำเองอยู่แล้ว

## Scope

ใช้ทุกครั้งที่เขียน/แก้/audit config file (`uno.config.ts`, `vite.config.ts`, `biome.jsonc`, `tsconfig.json`, `Cargo.toml` profiles, `.eslintrc`, etc.) — ก่อนเขียน key ใหม่ต้องรู้ว่าค่านั้นต่างจาก default หรือไม่

## Execute

### 1. Enumerate Defaults

> Goal: รู้ defaults จริงของทุก option

1. ใช้ `/check-types-definition` — inspect config type ของ tool (`defineConfig` param type, `.d.ts`, schema) ได้ table `Name | Type | Options | Default | Comment`
2. ถ้า type ไม่มี default ใน definition → อ่าน official docs/default source ของ tool (`/learn-from-web`) — ห้ามเดา default
3. สร้าง map `option → default` ไว้เทียบ

### 2. Strip Redundant Keys

> Goal: เหลือเฉพาะ overrides

1. เทียบทุก key ใน config กับ default map — key ที่ `value === default` → ลบออก
2. key ที่ต่างจาก default → เก็บไว้ (นี่คือ intent จริงของ config)
3. comments ที่แค่ restate default → ลบด้วย; comments ที่อธิบาย override เหตุผล → เก็บ
4. ระวัง: บาง tool defaults เปลี่ยนตาม env/preset — เช็ค `mode`/`env`/`preset` ที่ทำให้ default ต่างออกไปก่อนลบ

### 3. Verify

> Goal: config ที่เหลือทำงานเหมือนเดิม

1. รัน validate/build command ของ tool หลัง strip
2. behavior ต้องเหมือนเดิม — ถ้าเปลี่ยน แปลว่าลบ key ที่ต่างจาก effective default จริง → revert key นั้น

## Rules

- Default source ต้อง authoritative — ใช้ `/check-types-definition` หรือ official docs เท่านั้น ห้ามเดา
- ห้ามลบ key ที่ต่างจาก default หรือ key ที่ docs ระบุ "recommended explicit" ถึงจะเท่า default
- ห้าม strip config ที่เป็น shared/base config ถ้า downstream merge logic ต้องการ key นั้น
- Report keys ที่ลบทั้งหมด + เหตุผล ก่อน commit

## Expected Outcome

- Config file เหลือเฉพาะ overrides + intent comments — สั้น อ่านรู้ว่า project customize อะไรจริง
- ไม่มี cargo-culted boilerplate ที่ซ้ำกับ defaults
- Verify ผ่าน — behavior ไม่เปลี่ยน
