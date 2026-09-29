---
name: refactor-to-srp
description: Refactor ไฟล์/โมดูลให้มี Single Responsibility — แยกตาม reason to change, ≤250 บรรทัด
argument-hint: "[@files... | target]"
related:
  - refactor
  - follow-single-responsibility
  - follow-single-of-source
  - check-long-files
  - check-code-structure
  - review-code-quality
  - update-references
  - run-verify
  - use-subagents

---

## Goal

แยกไฟล์/โมดูล/คลาสที่มีหลาย responsibility ออกเป็นหน่วยเดียวต่อ concern — หนึ่ง unit = หนึ่ง reason to change — โดย preserve public API และ behavior เดิม

## Scope

ใช้กับ code targets ที่มี SRP violations: ไฟล์ >250 บรรทัด, ไฟล์ผสมหลาย concern (types + logic + IO), class/function เปลี่ยนจากหลายเหตุ — ถูก dispatch จาก `/refactor` (file/codebase/structure scopes) หรือเรียกตรงกับ `@files`

## Execute

### 1. Identify Responsibilities

> Goal: รู้ว่า unit นี้มีกี่ responsibility และ axis of change คืออะไร

1. อ่าน target แล้ว list responsibilities ทั้งหมด — ใช้ `## Code Smells` ของ `/refactor` เป็นตัวช่วย (Divergent Change, Shotgun Surgery, Long Method)
2. ทำ `/review-code-quality` เพื่อได้ SRP counts และ function metrics เป็น evidence
3. จัดกลุ่มตาม reason to change: ใครขอเปลี่ยน (actor/domain), เปลี่ยนบ่อยแค่ไหน, เปลี่ยนพร้อมกันไหม
4. ตัดสินใจ split boundaries — ไม่มีหลาย responsibility จริง → stop + report ว่า SRP ผ่านอยู่แล้ว (`/dont-over-engineer`)

### 2. Split By Concern

> Goal: แต่ละหน่วยเหลือหนึ่ง responsibility

1. เลือก technique ตาม smell: Extract Method → Extract Class/Module → Move Method/Field — ทีละ technique เดียว
2. แยก content ประเภทเดียวรวมกัน: `types.ts`, `constants.ts`, `config.ts`, `schema.ts` หรือไฟล์ตามชื่อ concern/domain
3. คง public API เดิมผ่าน barrel `index` re-export — consumers ไม่ต้องแก้ถ้าไม่จำเป็น
4. หลายไฟล์อิสระกัน → spawn `refactor/subagents/file-worker.md` ทีละไฟล์ขนานกันผ่าน `/use-subagents` — parent rewire + commit รวม

### 3. Update References

> Goal: ไม่มี broken references หลัง split

1. ทำ `/update-references` ทุก split/move — rewire importers ให้ชี้ไฟล์ใหม่
2. ค้นหา refs เก่าซ้ำยืนยันไม่เหลือ — broken → `/resolve-errors`

### 4. Verify

> Goal: split ผ่านและไม่มี regression

1. ทำ `/run-verify` (lint, typecheck, test, build)
2. ทำ `/check-long-files` + `/check-code-structure` เทียบ baseline — ทุกไฟล์ใหม่ ≤250 บรรทัด
3. ไม่ผ่าน → กลับแก้ที่ step 2 (max 3 รอบ → stop + report)

## Rules

### 1. One Reason To Change

- หนึ่ง file/class/function = หนึ่ง responsibility = หนึ่ง reason to change; หนึ่งโฟลเดอร์ = domain เดียว
- ไฟล์ ≤250 บรรทัด ยกเว้น barrel/index — ตรวจด้วย `/check-long-files`
- หนึ่ง fact หนึ่ง canonical source — duplicate ที่เจอระหว่าง split → extract ตาม `/follow-single-of-source`

### 2. Preserve Behavior

- ห้าม mix feature/bug fix กับ split (Two Hats) — public API เหมือนเดิม, tests ต้องเขียวเหมือนเดิม
- ไม่มี tests → characterization tests ก่อน (`/update-tests`)

### 3. Minimal Split

- แยกเท่าที่ responsibility ต่างกันจริง — ห้ามสร้าง micro-modules หรือ abstraction เกินจำเป็น (`/dont-over-engineer`)
- cohesion สูงที่เปลี่ยนด้วยกันเสมอ → อย่าแยก — fragmentation เพิ่ม cognitive load

## Expected Outcome

- ทุก unit มี single responsibility ชัดเจน ไฟล์ ≤250 บรรทัด
- ไม่มี broken references; public API เดิมใช้ได้
- ผ่าน `/run-verify`
