---
name: follow-config-config-env
description: จัดการ .env patterns — env files, validation, secrets handling ตาม conventions
argument-hint: "[env-file-or-scope]"
related:
  - follow-config
  - check-secrets
  - follow-secret-manager
  - update-config
---

## Goal

ตรวจและจัดการ env configuration ของ project ให้ถูก pattern — `.env` files ครบ, validation มี, secrets ไม่ leak, สอดคล้องกับ framework conventions

## Scope

- ใช้กับ env config ทั้งหมด: `.env`, `.env.local`, `.env.example`, `.env.<mode>`, env loading ใน code
- ครอบคลุม: file patterns, required vars, validation, secrets handling, gitignore coverage
- ไม่ครอบคลุมการอัปเดตค่า env จริง — ใช้ `update-config/subskills/config-env/SKILL.md`

## Execute

### 1. Inventory Env Files

> Goal: รู้ว่ามี env files และ vars อะไรบ้าง

1. หา `.env*` files ทั้งหมดใน repo — root และ per-workspace
2. ทำ `/check-secrets env-vars` — vars ที่ code ใช้ vs vars ที่ define
3. ระบุ framework env conventions — เช่น `NEXT_PUBLIC_*`, `VITE_*`, `PUBLIC_*` prefixes ตามที่ตรวจพบ

### 2. Check Patterns

> Goal: env setup ตาม conventions

1. `.env.example` มีครบทุก required var — ไม่มีค่าจริง มีเฉพาะ placeholder/comments
2. `.env` และ `.env.local` ถูก gitignore — ตรวจ `.gitignore` coverage
3. env validation ที่ startup — schema validation (เช่น zod/arktype ตาม stack) สำหรับ required vars, type coercion, fail-fast message ชัด
4. ไม่มี hardcoded secrets ใน code — ทำ `/check-secrets secrets-leak`

### 3. Fix Gaps

> Goal: ปิดช่องว่างที่พบ

1. สร้าง/อัปเดต `.env.example` ให้ครบตาม vars ที่ code ใช้จริง
2. เพิ่ม `.env*` patterns ใน `.gitignore` ถ้าขาด — เก็บ `.env.example` ไว้ commit
3. เพิ่ม env validation ถ้ายังไม่มี — validate ตอน startup ไม่ใช่ตอน runtime access
4. secrets จริง → ทำ `/follow-secret-manager` — ห้าม commit

### 4. Verify

> Goal: env setup ใช้งานได้และปลอดภัย

1. รัน dev/build ด้วย env ที่มี — ผ่าน validation
2. ทดสอบ missing var → error message ชัด ไม่ใช่ undefined crash
3. `git status` / `git check-ignore` ยืนยัน `.env` ไม่ถูก track

## Rules

- ห้าม commit secrets หรือค่าจริง — `.env.example` ใช้ placeholder เท่านั้น
- validation ต้อง fail-fast ตอน startup พร้อมชื่อ var ที่ขาด
- prefix conventions ของ framework ต้องถูก — public vars เท่านั้นที่ expose ให้ client
- merge กับ env files เดิม — ห้ามลบ vars ที่ไม่รู้จักโดยไม่ถาม user
- ถ้าพบ secret ที่ commit ไปแล้ว → แจ้ง user ทันที ต้อง rotate ไม่ใช่แค่ลบไฟล์

## Expected Outcome

- `.env.example` ครบและ gitignore ป้องกัน secrets
- env validation fail-fast พร้อมข้อความชัด
- ไม่มี secrets ใน code หรือ git-tracked files
