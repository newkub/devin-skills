---
name: follow-tool-renovate-config-renovate
description: ตั้งค่า `renovate.json` — extends presets, packageRules, automerge, schedule
argument-hint: "[scope]"
related:
  - follow-tool-github-actions
  - run-install
  - check-config-drift
---

## Goal

ตั้งค่า `renovate.json` ให้ตรง update policy — `extends` presets, `packageRules`, `automerge`, `schedule` — โดย merge กับ config เดิม

## Scope

ใช้เมื่อต้องแก้ Renovate config ที่มีอยู่ — install/token/workflow อยู่ใน `subskills/setup-renovate/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: อ่าน config เดิมก่อนแก้

1. หา config: `renovate.json`, `.github/renovate.json`, `renovate.json5`, หรือ `"renovate"` field ใน `package.json`
2. บันทึก keys ปัจจุบัน — ทำ `/check-config-drift` ถ้าสงสัย config ค้าง
3. ถ้าไม่มี config → ทำ `subskills/setup-renovate/SKILL.md` ก่อน

### 2. Base Config And Presets

> Goal: ตั้งค่า base และ `extends`

1. ใช้ `"$schema": "https://docs.renovatebot.com/renovate-schema.json"`
2. `extends` — `["config:base"]` เป็นจุดเริ่มต้น; presets อื่นดู official docs (`config:recommended` อาจเพิ่ม checks ที่ไม่ต้องการ)
3. `schedule` — เช่น `["every day"]` หรือช่วงเวลาที่ชัดเจน
4. `"platform": "github"` สำหรับ self-hosted; `repositories: ["owner/repo"]` ถ้ารันหลาย repo
5. `docker: false` ถ้าไม่ต้องการ Docker updates

### 3. Package Rules

> Goal: กำหนด per-package/group policies ด้วย `packageRules`

1. Group related packages — `matchPackagePatterns`/`matchPackageNames` เพื่อรวม PR เดียว (เช่น eslint ecosystem, framework + plugins)
2. ใช้ `matchUpdateTypes` (`patch`, `minor`, `major`) แยก policy ตาม bump severity
3. `enabled: false` สำหรับ packages ที่ freeze ไว้
4. matchers ต้องถูกต้อง — ผิดจะทำ rule ไม่ match เงียบๆ

### 4. Automerge

> Goal: ตั้งค่า automerge policy

1. `automerge: true` ใน `packageRules` สำหรับ low-risk updates (เช่น devDependencies patch/minor)
2. ใช้ `automergeType`/`platformAutomerge` ตาม repo settings — ดู official docs สำหรับ option names ที่ไม่แน่ใจ
3. ไม่ automerge major bumps หรือ production-critical dependencies โดยไม่ review
4. ตรวจ branch protection — automerge ต้องผ่าน required checks

### 5. Validate And Monitor

> Goal: ตรวจ config และติดตามผล

1. รัน `bunx -- renovate-config-validator <config-path>` — ต้องผ่าน
2. หลัง merge → monitor PRs ที่ Renovate สร้าง: automerge ผ่านไหม, rules match ถูกไหม
3. ปรับ `packageRules` เมื่อพบ deps ที่ไม่ต้องการ auto update
4. report before/after ด้วย `/report-before-after`

## Rules

### 1. Config Discipline

- ใช้ `config:base` เป็น base; merge เฉพาะ keys ที่จำเป็น ห้าม overwrite ทั้งไฟล์
- validate ด้วย `renovate-config-validator` ทุกครั้งหลังแก้

### 2. Automerge Safety

- automerge เฉพาะ low-risk updates — major/critical deps ต้อง review
- branch protection required checks ต้อง set ก่อนเปิด automerge

### 3. Common Mistakes

- `config:recommended` อาจเพิ่ม checks ที่ไม่ต้องการ — รู้ว่า preset ทำอะไรก่อน extends
- matchers ผิด = rule ไม่ทำงานเงียบๆ — ตรวจ PRs จริงหลังแก้

- ใช้ /check-config-drift ถ้าจำเป็น

## Expected Outcome

- `renovate.json` ผ่าน validator
- `packageRules`/automerge ตรง update policy
- PRs สร้างและ automerge ตามที่ตั้งใจ
