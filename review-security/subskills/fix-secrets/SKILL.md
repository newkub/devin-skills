---
name: review-security-fix-secrets
description: Apply secrets findings — rotate/revoke leaked secrets, env migration, git history notes
argument-hint: "[scope]"
related:
  - review-security
  - follow-secret-manager
  - open-web-for-config-secret
  - check-secrets
  - run-check
  - report-before-after
---

## Goal

แก้ secrets findings จาก `/review-security` จริง — rotate/revoke secrets ที่รั่ว, ย้ายไป env/secret manager, ลบ hardcoded secrets พร้อม notes เรื่อง git history

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้ — review/report-only โดย default
- ครอบคลุม: hardcoded secrets, secrets ใน client bundle, leaked API keys/tokens, missing rotation
- multi-domain fix → `/deep-review-then-fix`

## Execute

### 1. Inventory Leaks

> Goal: รู้ว่า secret ไหนรั่วที่ไหนบ้าง

1. รวม findings จาก `/check-secrets secrets-leak` และ review report — file path, line, secret type
2. จัดกลุ่ม: committed secrets (อยู่ใน git history) vs working-tree only vs runtime config
3. ระบุ provider ของแต่ละ secret เพื่อเตรียม rotation

### 2. Rotate Compromised Secrets

> Goal: secret ที่รั่วใช้ไม่ได้อีกต่อไป

1. ทุก secret ที่ commit เข้า repo หรือ leak ออก client → rotate/revoke ที่ provider ก่อนเสมอ — แก้ code อย่างเดียวไม่พอ
2. สร้าง secret ใหม่ → อัปเดต env/secret manager ทุก environment → revoke ของเดิม
3. ใช้ `/open-web-for-config-secret` ถ้าต้อง config ผ่าน provider dashboard

### 3. Remove From Code

> Goal: code ไม่มี secret ฝังอยู่

1. ย้าย secrets ไป env vars หรือ secret manager ตาม `/follow-secret-manager`
2. แทนที่ hardcoded values ด้วย env lookup — ห้ามมี default value ที่เป็น secret จริง
3. ตรวจ secrets ไม่ leak เข้า client bundle — ใช้เฉพาะ env prefix ที่ framework ออกแบบสำหรับ public
4. เพิ่ม `.env.example` ด้วย placeholder และอัปเดต `.gitignore` ถ้าจำเป็น

### 4. Handle Git History

> Goal: บันทึกสถานะ history ไม่ rewrite มั่ว

1. secrets ใน git history ยังอ่านย้อนได้แม้แก้ working tree — report ข้อเท็จจริงนี้เสมอ
2. default: rotate แล้วทิ้ง history ไว้ พร้อมบันทึกใน report
3. ถ้า user confirm history rewrite → ใช้ `git filter-repo` หรือ BFG แล้ว force push + แจ้งทีม re-clone — รายละเอียดดู official docs

### 5. Verify

> Goal: ไม่มี secret เหลือและ app ทำงานได้

1. รัน `/check-secrets secrets-leak` ซ้ำ — ต้องไม่มี finding เดิม
2. `/run-check` + tests ที่เกี่ยวข้องผ่าน — app อ่าน secret จาก env ได้จริง
3. `/report-before-after` — rotated list, files changed, history status

## Rules

- rotate ก่อนเสมอ — ลบออกจาก code โดยไม่ rotate = secret ยังใช้ได้
- ห้าม commit secret จริงลง `.env.example`, docs หรือ test fixtures
- ห้าม rewrite git history โดยไม่มี user confirmation
- แยก commit: rotation/config → code removal → gitignore/example

## Expected Outcome

- secrets ที่รั่วถูก rotate/revoke ครบทุกตัว
- code ไม่มี hardcoded secrets — อ่านจาก env/secret manager เท่านั้น
- report ครบ: rotated list, files changed, git history status

