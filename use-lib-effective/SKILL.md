---
name: use-lib-effective
description: ใช้ dependencies ที่มีอยู่และ preferred stack ให้เต็มประสิทธิภาพแทนการ reinvent
argument-hint: "[need-or-feature]"
related:
  - follow-my-techstack
  - review-dependencies
  - research-dependencies
  - deep-research
  - follow-best-practice
  - learn-from-references
  - follow-reusable
  - refactor
  - implement-to-production
  - dont-over-engineer
  - ask-me
---

## Goal

ลดความซ้ำซ้อนและการ reinvent — ก่อนเขียน code ใหม่หรือเพิ่ม dependency ให้ใช้สิ่งที่มีอยู่แล้วใน manifest และ preferred stack ให้เต็มประสิทธิภาพ

## Scope

ใช้เมื่อ task กำลังจะ: เขียน utility/helper ใหม่, implement feature ที่ lib น่าจะทำได้, เพิ่ม dependency, หรือ refactor code ที่อาจถูกแทนด้วย lib ที่มีอยู่ — caller หลัก: `/refactor`, `/implement-to-production`, งาน implement ทั่วไป

- เลือก lib ตาม preferred stack → `/follow-my-techstack`
- Audit deps (outdated, unused, vulnerabilities) → `/review-dependencies`
- reuse internal code ที่มีอยู่ก่อนเขียนใหม่ (DRY) → `/follow-reusable`
- (restored เป็น standalone skill — เดิม merged ใน `review-dependencies/references/fix-use-lib-effective.md` ซึ่งยังใช้เป็น fix guide ของ review อยู่)

## Execute

### 1. Inventory What Exists

> Goal: รู้ว่า project มีอะไรใช้ได้แล้วก่อนคิดเขียนเอง

1. อ่าน package manifest (`package.json` + catalog/workspaces, `Cargo.toml`, `go.mod`) — ดู dependencies ทั้งที่ติดตั้งแล้วและ catalog entries
2. ค้นหาใน codebase ว่า dep นั้นถูกใช้แล้วหรือยัง และใช้ถึง capability ไหน (เช่น import `effect` แล้วแต่ยังไม่ได้ใช้ `Schedule`, `Layer`)
3. ตรวจ internal packages/utilities ของ monorepo ที่ solve ปัญหาเดียวกัน (`@booking/shared`, `src/utils`, `packages/*`)

### 2. Match Need To Existing Capability

> Goal: ตอบคำถาม "ของที่มีทำได้แล้วหรือยัง" ก่อนเสมอ

1. แปลงความต้องการเป็น category (เช่น retry → `Schedule` ใน `effect`; validation → `zod`; dates → `date-fns`)
2. ศึกษา capability ของ dep ที่มี: ทำ `/deep-research`, `/learn-from-references`, DeepWiki (repo ของ lib) หรือ context7 (API reference) และอ่าน `d.ts` ใน `node_modules` เพื่อรู้ API ที่พร้อมใช้ — ตรวจ changelog หา features ใหม่ที่ยังไม่ได้ใช้
3. ถ้า dep ที่มีอยู่ทำได้ → ใช้ dep นั้น ห้ามเขียนเองและห้ามเพิ่ม dep ใหม่
4. ถ้า dep ทำได้บางส่วน → ใช้ dep เป็นหลัก เขียนเฉพาะส่วนที่ขาดเป็น thin wrapper
5. ถ้ามีหลายตัวทำได้ → เลือกตาม `/follow-my-techstack`

### 3. Choose From Preferred Stack

> Goal: ถ้าต้องเพิ่ม dep ให้เลือกตัวที่ตรง canonical stack

1. ทำ `/follow-my-techstack` เพื่อได้ Default pick ของ category
2. ถ้า pick มี skill `follow-lib-*` / `follow-tool-*` / `follow-service-*` → invoke skill นั้นเพื่อใช้ lib ถูกวิธี (ห้ามเดา API)
3. ถ้าไม่มีใน catalog และไม่มี skill → ทำ `/deep-research` เปรียบเทียบ candidates ก่อนตัดสินใจ

### 4. Apply Effectively

> Goal: ใช้ lib ที่เลือกให้ถูกและครบ capability ที่จำเป็น

1. อ่าน docs ผ่าน context7 หรือ `/learn-from-references` เมื่อไม่แน่ใจ API surface
2. ใช้ feature ที่ lib มีให้ครบ (เช่น `Effect.retry`+`Schedule` แทน handwritten retry loop; connection pooling, tree-shaking, lazy loading, feature flags)
3. ลบ code ที่ reinvent สิ่งที่ lib ทำ — ถ้า refactor → เพิ่มเป็น finding ใน report
4. ถ้าพบ dep ซ้ำซ้อน (สองตัวทำอย่างเดียวกัน) → flag ใน report ให้ user ตัดสินใจ ไม่ลบเอง
5. Effective usage patterns: HTTP client → pooling/retry/cache; ORM → query optimization/connection mgmt; UI → tree-shaking/lazy loading; testing → parallel/isolation; dynamic imports สำหรับ code splitting
6. บันทึก patterns การใช้งานที่ซับซ้อนเป็น examples/conventions เมื่อจำเป็น

## Rules

### 1. Existing Installed First

- ลำดับความสำคัญ: built-in functions > dep ที่ติดตั้งแล้ว > monorepo shared packages > catalog default > dep ใหม่จาก research
- ห้ามเขียน helper ที่ duplicate capability ของ dep ที่มีอยู่ (เช่น sleep, retry, deepEqual, date format)
- เลือก libs ที่ actively maintained; พิจารณา bundle size สำหรับ frontend; wrap external lib ด้วย internal abstraction เมื่อจำเป็น

### 2. Skill Before Guess

- ทุกครั้งที่ใช้ lib ที่มี `follow-lib-*`/`follow-tool-*`/`follow-service-*` skill → invoke skill นั้น
- ไม่มี skill → official docs เท่านั้น ห้ามเดา API จาก memory

### 3. Evidence Of Reinvention

- เมื่อ refactor พบ code ที่ reinvent lib → ระบุใน report พร้อม file:line และ lib ที่แทนได้
- เมื่อเพิ่ม dep ใหม่ → ระบุเหตุผลว่าทำไมของเดิมไม่พอ

### 4. No New Dep Without Check

- ก่อน `add` dep ใดๆ → ผ่าน step 1-3 ครบก่อน
- version ใหม่ต้อง publish แล้ว ≥7 วัน และตรวจ peer constraints
- ใช้ /research-dependencies ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /dont-over-engineer ถ้าจำเป็น
- ใช้ /ask-me ถ้าจำเป็น


## Expected Outcome

- ไม่มี code ที่ duplicate capability ของ dep ที่ติดตั้งอยู่
- ทุก dep ใหม่อ้างอิง catalog หรือ research ได้
- lib ถูกใช้ถึง capability ที่เหมาะสม ไม่ใช่แค่ import แล้วเขียนเองต่อ
- report ระบุ reinvention findings และ dedup opportunities
