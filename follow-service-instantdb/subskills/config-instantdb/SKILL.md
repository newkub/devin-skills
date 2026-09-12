---
name: follow-service-instantdb-config-instantdb
description: ตั้งค่า InstantDB schema, permissions, env vars และ push/pull config
argument-hint: "[project-path]"
related:
  - follow-service-instantdb
  - check-env-vars
  - resolve-errors
  - run-verify
  - update-references
  - use-scripts
---

## Goal

ตั้งค่า/แก้ไข InstantDB configuration — `instant.schema.ts`, `instant.perms.ts`, env vars และ push/pull — โดยไม่ clobber schema เดิม

## Scope

- แก้ entities, fields, links, rooms ใน `instant.schema.ts`
- กำหนด `allow`/`bind` rules ใน `instant.perms.ts`
- จัดการ env app id และ `instant-cli push/pull`
- ไม่ครอบคลุม SDK install/init → ใช้ `subskills/setup-instantdb/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: รู้ schema/perms ปัจจุบันก่อนแก้

1. อ่าน `instant.schema.ts` และ `instant.perms.ts` ที่มีอยู่
2. ทำ `/check-env-vars` เพื่อระบุ app id var ที่ขาดหรือผิด prefix
3. รัน `npx instant-cli@latest pull` ถ้าต้อง sync config ล่าสุดจาก server ก่อนแก้
4. ถ้าไม่มี config files เลย → ทำ `subskills/setup-instantdb/SKILL.md` แทน

### 2. Update Schema

> Goal: เพิ่ม/แก้ data model แบบ type-safe

1. แก้ `instant.schema.ts` เพิ่ม entities, fields, links, rooms เฉพาะส่วนที่ต้องการ — merge ห้าม rewrite ทั้งไฟล์
2. ใช้ `i.entity({ ... })`, `i.string()`, `i.number()`, `i.boolean()`, `i.date()` และ `i.any()` ตาม docs
3. ระบุ `.unique()`, `.indexed()`, `.optional()` ตามความจำเป็น
4. กำหนด links ด้วย `forward`/`reverse` labels ให้ชัดเจน

### 3. Update Permissions

> Goal: ป้องกัน data access ด้วย rules

1. แก้ `instant.perms.ts` ด้วย `allow`/`bind` rules ต่อ entity และ action (`view`, `create`, `update`, `delete`)
2. ใช้ `auth.id`, `auth.email` ใน rules — deny by default สำหรับ data sensitive
3. ผูก rules กับ links เช่น `data.user` เมื่อต้องเช็ค ownership
4. Review rules ก่อน push — ห้าม expose data โดยไม่ตั้งใจ

### 4. Push And Verify

> Goal: apply config และยืนยัน typecheck ผ่าน

1. รัน `npx instant-cli@latest push schema` เมื่อแก้ schema
2. รัน `npx instant-cli@latest push perms` เมื่อแก้ permissions
3. รัน `bunx tsc --noEmit` หรือ `bun run build` เพื่อ typecheck schema types
4. รัน `npx instant-cli@latest status` ยืนยัน connection — ถ้า fail → `resolve-errors` max 3 รอบ
5. ถ้ามี links/rooms ใหม่ → อัปเดต references ของ parent และทำ `/update-references`

## Rules

- Merge เฉพาะ keys ที่จำเป็น — ห้าม overwrite schema/perms ทั้งไฟล์
- อย่า push schema/perms โดยไม่ review diff ก่อน
- ใช้ generated types จาก `InstaQLEntity<typeof schema, "...">` สำหรับ type safety
- ห้าม hardcode app id/secrets — ใช้ env vars ตาม framework prefix
- ถ้า field type/rule syntax ไม่แน่ใจ → ดู official docs `https://www.instantdb.com/docs`

## Expected Outcome

- `instant.schema.ts` และ `instant.perms.ts` ถูก merge และ push สำเร็จ
- Typecheck ผ่านและ rules ป้องกัน data sensitive ถูกต้อง
- Env vars ถูกต้องตาม framework
