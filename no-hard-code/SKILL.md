---
name: no-hard-code
description: หาและย้าย hardcoded values (secrets, URLs, magic strings/numbers, config) ไป env/config/constants
argument-hint: "[@files... | scope]"
related:
  - refactor
  - refactor-to-packages-shared
  - check-secrets
  - follow-secret-manager
  - follow-config
  - review-i18n
  - review-config
  - follow-single-of-source
  - edit-by-astgrep
  - update-references
  - run-verify
  - report-before-after
---

## Goal

ลบ hardcoded values ออกจาก code — ย้ายไป env vars, config files, หรือ shared constants ตามประเภท เพื่อให้เปลี่ยนค่าได้โดยไม่แก้ code และไม่ leak secrets

## Scope

- ถ้า user ระบุ `@files...` → เคลียร์เฉพาะไฟล์นั้น; ไม่ระบุ → scan scope ที่ให้มาหรือทั้ง project
- secrets/credentials → route ไป `/check-secrets` + `/follow-secret-manager` (rotate ก่อนเสมอ)
- user-facing strings → route ไป `/review-i18n` (extraction ไป locale files)
- config inconsistency ข้าม envs → route ไป `/review-config`
- mechanical batch หลายไฟล์ → `/edit-by-astgrep` (dry-run + confirm ก่อนเขียนทับเสมอ)

## Execute

### 1. Inventory Hardcoded Values

> Goal: รู้ว่า hardcode อะไรอยู่ที่ไหน แยกตามประเภท

1. scan literals ใน scope — string literals, magic numbers, URLs, paths, ports, timeouts, thresholds, feature flags
2. จัดกลุ่มตามประเภท: `secrets` (keys, tokens, passwords), `urls` (endpoints, hosts, redirect URIs), `env-specific` (booleans, limits ที่ต่างต่อ environment), `domain constants` (magic numbers/strings ที่เป็น business rule), `i18n strings` (user-facing text)
3. flag false positives ออก — literals ใน tests/fixtures, schema defaults, protocol constants (`HTTP/1.1`), type discriminators
4. ทำ `/check-secrets` ก่อนเสมอ — secret ที่ hardcode = incident ไม่ใช่ refactor

### 2. Classify Destination

> Goal: แต่ละค่าไปถูกที่ตาม nature ของมัน

| Type | Destination |
|------|-------------|
| secrets | env vars + secret manager (`/follow-secret-manager`) — ห้าม commit ค่าจริง |
| urls/endpoints | env vars หรือ config ต่อ environment |
| env-specific values | env vars พร้อม safe default + `.env.example` placeholder |
| domain constants | `constants/` หรือ shared config module — หนึ่ง fact หนึ่ง source (`/follow-single-of-source`) |
| magic numbers ที่อธิบายตัวเองไม่ได้ | named constant พร้อมชื่อบอก intent |
| i18n strings | `/review-i18n` extraction flow |

### 3. Extract

> Goal: code อ่านค่าจาก source เดียว ไม่มี literal กระจาย

1. ย้ายค่าไป destination ตามตาราง — ใช้ existing config/env pattern ของ project ก่อนสร้างใหม่
2. แทนที่ literal ด้วย reference (env lookup, config import, constant) — mechanical batch → `/edit-by-astgrep`
3. ถ้าค่าเดียวกันปรากฏหลายที่ → extract ครั้งเดียวแล้ว share — ห้ามคง duplicate
4. เพิ่ม validation/fail-fast ที่ boundary ถ้าค่าขาดแล้วพังเงียบๆ (`/follow-config`)

### 4. Update References And Docs

> Goal: consumers ทั้งหมดใช้ค่าจาก source ใหม่

1. ทำ `/update-references` สำหรับทุก site ที่เคยใช้ literal
2. อัปเดต `.env.example`, deployment docs, README ถ้าเพิ่ม env var ใหม่
3. secrets → เพิ่มใน `.gitignore` checks และ rotate ตาม `/follow-secret-manager` ถ้าเคย commit

### 5. Verify

> Goal: ไม่มี hardcode เหลือและ behavior เดิม

1. re-scan scope — literals เดิมต้องหาย (เหลือเฉพาะ false positives ที่ flag ไว้)
2. ทำ `/run-verify` — tests/typecheck/build ผ่าน behavior ไม่เปลี่ยน
3. app boot ด้วย env ใหม่ได้จริง — missing env fail fast ไม่ใช่ silent fallback เป็นค่าผิด
4. `/report-before-after` — count per type, files changed

## Rules

### 1. Preserve Behavior

- refactor เท่านั้น — ค่าที่ app เห็นต้องเหมือนเดิมทุก environment ห้ามเปลี่ยนค่าจริงใน pass เดียวกัน
- ห้าม mix กับ feature/fix ใน commit เดียว

### 2. Security First

- secret ที่เคย commit = compromised → rotate ก่อน extract เสมอ
- ห้ามย้าย secret ไป file ที่ commit ขึ้น repo — `.env` ต้องอยู่ใน `.gitignore`

### 3. Don't Over-Extract

- literals ที่เป็น protocol/format constants หรือใช้ครั้งเดียวและชัดเจน → ไม่ต้อง extract (`/dont-over-engineer`)
- test fixtures/mocks ปล่อยไว้ เว้นแต่เป็น real secret

### 4. Single Source

- ค่าเดียวกันต้องมี definition เดียว — extraction ต้อง consolidate ไม่ใช่ย้าย duplication ไป config

- ใช้ /refactor ถ้าจำเป็น
- ใช้ /check-secrets ถ้าจำเป็น
- ใช้ /follow-config ถ้าจำเป็น
- ใช้ /run-verify ถ้าจำเป็น

## Expected Outcome

- ไม่มี secrets, URLs, env-specific values, magic strings/numbers ฝังใน code
- ทุกค่ามี source เดียวที่เปลี่ยนได้โดยไม่แก้ code
- `.env.example`/docs อัปเดตครบ — app fail fast เมื่อ config ขาด
- ผ่าน lint/typecheck/test/build — behavior เดิม
