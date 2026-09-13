---
name: update-config-config-env
description: อัปเดต env config — diff ค่าปัจจุบัน vs ที่ต้องการ, apply, verify ไม่ clobber
argument-hint: "[env-file-or-scope]"
related:
  - update-config
  - follow-config
  - check-secrets
  - follow-secret-manager
  - check-config-drift
---

## Goal

อัปเดต env configuration ของ project — diff ระหว่าง vars ที่มีกับที่ code ต้องการ, apply เฉพาะ keys ที่จำเป็น, verify ว่า app ยังรันได้ — ไม่ clobber values เดิม

## Scope

- ใช้เมื่อต้องเพิ่ม/แก้/ลบ env vars หรือ sync `.env.example` กับ code
- ครอบคลุม: `.env`, `.env.local`, `.env.<mode>`, `.env.example`, env validation schema
- สำหรับ audit patterns/conventions → `follow-config/subskills/config-env/SKILL.md`

## Execute

### 1. Diff Current Vs Needed

> Goal: รู้ว่าขาด/เกิน/เปลี่ยน key ไหน

1. ทำ `/check-secrets env-vars` — vars ที่ code อ่าน (`process.env.*`, `import.meta.env.*` ตาม stack) เทียบกับที่ define
2. อ่าน env files ปัจจุบันและ `.env.example` — list keys ทั้งหมด
3. สร้าง diff: missing keys (code ใช้แต่ไม่มี), stale keys (มีแต่ code ไม่ใช้), keys ที่ต้องเปลี่ยนค่า/format
4. ทำ `/check-config-drift` report-drift subskill ถ้าต้องดู drift ข้าม environments/workspaces

### 2. Apply Changes

> Goal: แก้เฉพาะ keys ที่จำเป็น

1. เพิ่ม missing keys ใน `.env.example` พร้อม placeholder + comment ว่าใช้ทำอะไร
2. อัปเดต validation schema (ถ้ามี) ให้ครอบคลุม keys ใหม่ — required/optional, types, defaults
3. ถาม user ก่อนลบ stale keys — อาจใช้ใน environment อื่นหรือ runtime ภายนอก
4. secrets/ค่าจริง → `/follow-secret-manager` — ห้ามใส่ในไฟล์ที่ commit; local `.env` แก้ได้แต่ห้าม commit

### 3. Verify

> Goal: app รันได้กับ env ใหม่

1. รัน dev/build — startup validation ผ่าน ไม่มี missing var crash
2. ทดสอบ path ที่ใช้ vars ใหม่ — smoke test เฉพาะจุดที่แก้
3. ทำ `/check-secrets secrets-leak` — ยืนยันไม่มี secrets ใน git-tracked files
4. `git status` ยืนยัน `.env` ไม่ถูก stage — commit เฉพาะ `.env.example`/schema

## Rules

- merge เฉพาะ keys ที่เปลี่ยน — ห้าม rewrite ทั้งไฟล์ env ถ้าไม่จำเป็น
- ห้าม commit `.env`/`.env.local` หรือค่าจริง — commit เฉพาะ example/schema/code
- ห้ามลบ keys โดยไม่ confirm — stale ใน repo นี้อาจ required ใน environment อื่น
- prefix conventions ต้องถูก — public vars ตาม framework (`NEXT_PUBLIC_*`, `VITE_*`)
- ถ้าพบ secret ที่ commit ไปแล้ว → แจ้ง user ต้อง rotate ไม่ใช่แค่แก้ไฟล์

## Expected Outcome

- env files ตรงกับ vars ที่ code ใช้ — ไม่มี missing/stale ที่ไม่ได้ตั้งใจ
- `.env.example` และ validation schema sync กัน
- verify ผ่าน — app รันได้ ไม่มี secrets leak
