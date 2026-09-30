---
name: keepup-source-code
description: ทำให้ source code ทันสมัย — ตรวจ staleness signals แล้ว dispatch update-* ที่ตรง domain
argument-hint: "[scope]"
related:
  - update-project
  - update-version-to-latest
  - update-docs
  - update-usage-md
  - update-features-md
  - update-tests
  - update-config
  - deep-review
  - check-config-drift
  - check-should-update
  - run-check
  - deep-validate
  - report
  - suggest-next-action

---

## Goal

รักษา source code ให้ทันสมัยและ sync กับ dependencies, config, codegen และ docs เสมอ — ตรวจหาส่วนที่ stale แล้ว dispatch ไปยัง `update-*`/`check-*` ที่ตรง domain จนผ่าน validation

## Scope

ใช้เมื่อต้องการให้ code ไม่ล้าสมัย — เช่น หลัง bump deps, เปลี่ยน config, อัปเดต upstream, หรือเป็น periodic maintenance ไม่ใช่สำหรับ implement feature ใหม่

## Execute

### 1. Detect Staleness Signals

> Goal: รู้ว่าอะไรใน project stale

1. ทำ `/check-should-update` ดู git changes เพื่อประเมินว่า target ต้องอัปเดต
2. ทำ `/deep-review` scope `deprecated-apis` หา code ที่ใช้ deprecated APIs/dependencies
3. ทำ `/deep-review` scope `content-outdate` ตรวจ skills/docs/specs ที่ล้าสมัย
4. ทำ `/check-config-drift` ตรวจ config ที่ drift จาก defaults
5. ตรวจ manifest drift — `package.json`/`Cargo.toml`/`go.mod` เปลี่ยนแต่ lockfile หรือ code ไม่ตาม
6. รวม signals เป็น list: `{area, signal, severity}`

### 2. Map Signal To Update

> Goal: เลือก update-* ที่ตรงกับแต่ละ signal

| No. | Signal | Dispatch To |
|-----|--------|-------------|
| 1 | deps/runtime/tools เก่า | `/update-version-to-latest` |
| 2 | config drift หรือ missing | `/update-config` |
| 3 | public API/exports เปลี่ยน | `/update-usage-md` + `/update-features-md` |
| 4 | docs ล้าสมัย | `/update-docs` |
| 5 | tests ไม่ครอบ code ใหม่ | `/update-tests` |
| 6 | generated code/artifacts stale | re-run generator (codegen, ast-grep rules, specs) |
| 7 | หลาย workspace drift พร้อมกัน | `/update-project` |

### 3. Apply Updates

> Goal: แก้ staleness ทีละ domain

1. ทำตามลำดับ: Foundation (deps/config) → Code → Docs/Tests
2. dispatch ตาม mapping table ทีละ domain — อย่ารวมหลาย domain ในแก้ไขเดียว
3. ถ้า signal ไม่มี update skill ตรง → แก้ manual ด้วย minimal change
4. บันทึกสิ่งที่แก้ไปต่อ domain

### 4. Validate

> Goal: ยืนยัน code ทันสมัยและไม่พัง

1. ทำ `/run-check` เพื่อ lint, typecheck, scan
2. ทำ `/deep-validate` ถ้ามีการแก้หลายไฟล์
3. ถ้าไม่ผ่าน → `/resolve-errors` แล้ว recheck (max 3 รอบ → stop/report)

### 5. Report

> Goal: สรุป staleness ที่พบและแก้

1. ทำ `/report` เป็น table: `No.`, `Area`, `Signal`, `Action`, `Status`
2. ทำ `/suggest-next-action` แนะนำ periodic keepup หรือขั้นตอนถัดไป

## Rules

- detect ก่อนแก้เสมอ — ห้าม update โดยไม่มี signal ว่า stale
- dispatch ไป `update-*` skill ที่ตรง domain — ห้ามเขียน update logic เองถ้ามี skill อยู่
- minimal change — แก้เฉพาะส่วนที่ stale ไม่ refactor เพิ่ม
- ทุก domain ที่แก้ต้องผ่าน `/run-check` ก่อนจบ

## Expected Outcome

- ทุก staleness signal ถูก resolve หรือมีเหตุผลที่ defer
- code, config, docs, tests sync กันและผ่าน validation
- report แสดงครบว่า area ไหนแก้อะไร
