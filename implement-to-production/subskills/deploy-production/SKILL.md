---
name: implement-to-production-deploy-production
description: Production deploy gate — checks ก่อน deploy, deploy, verify และ rollback plan
argument-hint: "[target]"
related:
  - deep-validate
  - run-verify
  - run-test-all
  - run-check
  - run-deploy
  - follow-deploy
  - check-secrets-leak
  - test-usage
  - resolve-errors
  - ask-me
  - ship
---

## Goal

เป็น gate สุดท้ายก่อน production deploy — ทุก check ต้องผ่าน, deploy แล้ว verify จริง และมี rollback plan พร้อม

## Scope

- ใช้ตอนท้าย flow `/implement-to-production` เมื่อ code พร้อม deploy จริง
- ครอบคลุม: pre-deploy gate, deploy execution, post-deploy verify, rollback
- platform-specific deploy → delegate ไป `/follow-deploy` หรือ `deploy-to-<platform>` skill ที่ตรง

## Execute

### 1. Pre-Deploy Gate

> Goal: ทุก check ผ่านก่อน deploy — ห้ามข้าม

1. ทำ `/deep-validate` — validate หลายมิติต้องผ่าน
2. ทำ `/run-test-all` — unit, integration, e2e ต้องเขียว
3. ทำ `/run-verify` — scan, format, lint, typecheck, build ผ่าน
4. pre-ship sweep: `/check-secrets-leak` (ไม่มี secrets หลุด) และไม่มี debug leftovers
5. ทำ `/test-usage` — usage examples ใน README/docs ทำงานจริง
6. ถ้า check ใด fail → `/resolve-errors` max 3 รอบ; ยัง fail → stop report ห้าม deploy

### 2. Confirm Rollback Plan

> Goal: rollback path ชัดเจนก่อน deploy

1. ระบุ rollback method: `git revert <commit>`, redeploy version เดิม หรือ platform rollback
2. บันทึก current production version/revision ไว้เทียบ
3. ถ้า deploy เป็น destructive (DB migration, breaking API) → `/ask-me` confirm ก่อน

### 3. Deploy

> Goal: deploy ตาม platform ที่เลือก

1. เลือก deploy path ตาม target: ทำ `/run-deploy` หรือ `/follow-deploy` (ซึ่ง dispatch ไป `deploy-to-<platform>`)
2. deploy staging/preview ก่อนถ้า platform รองรับ → verify แล้วจึง production
3. เก็บ deployment URL และ version/revision id เสมอ

### 4. Post-Deploy Verify

> Goal: production ทำงานจริงหลัง deploy

1. smoke test critical paths บน production URL จริง
2. ตรวจ logs/metrics/error tracking ช่วงแรก — ไม่มี error spike
3. เทียบ behavior กับผล `/run-check` ที่ผ่านมา
4. ถ้า fail → execute rollback plan ทันทีแล้ว report

### 5. Finalize

> Goal: ปิด loop ตาม parent flow

1. report URL, version และผล verify
2. ถ้ามี items ค้าง/blocked → เก็บลง `TODO.md` ตาม parent flow
3. ทำ `/ship` แล้ว `/suggest-next-action`

## Rules

### 1. Gate Is Mandatory

- ห้าม deploy ถ้า gate (Step 1) ยังไม่เขียว — ไม่มี exception
- deploy ที่ destructive ต้อง user confirm เสมอ

### 2. Evidence

- เก็บ URL + version ทุก deploy และผล verify ทุกขั้น
- rollback plan ต้อง executable ไม่ใช่แค่ note

## Expected Outcome

- production deploy สำเร็จหลังผ่าน gate ครบ
- post-deploy verify ผ่าน และ rollback plan พร้อม
- report ครบ: URL, version, verify results
