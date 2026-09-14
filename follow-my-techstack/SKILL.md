---
name: follow-my-techstack
description: ใช้ canonical tech stack catalog เป็นตัวเลือก default เมื่อเลือกหรือใช้ dependencies ใน project
argument-hint: "[category-or-need]"
related:
  - review-techstack
  - review-dependencies
  - use-lib-effective
  - research-dependencies
  - deep-research
  - list-raindrop-favorite
  - search-raindrop
  - run-install
  - ask-me
---

## Goal

เลือกและใช้ dependencies/tools ตาม canonical tech stack ของ user เพื่อให้ทุก project ใช้ stack เดียวกัน ลด drift และไม่ตัดสินใจเลือก lib ใหม่โดยไม่จำเป็น

## Scope

ใช้เมื่อ task ต้องเลือก library/tool/service สำหรับความต้องการหนึ่งอย่าง (เช่น validator, HTTP client, ORM, testing, styling) — ไม่ว่าจะติดตั้งใหม่หรือใช้ของที่มีอยู่

- Canonical catalog: `review-dependencies/references/techstack-catalog.md` (merged from: follow-my-tech-stack) — source of truth เดียว ห้าม copy เนื้อหามาไว้ที่นี่
- Review stack ทั้ง project เทียบ catalog → `/review-techstack`
- หา package ที่ยังไม่มีใน catalog → `/research-dependencies` หรือ `/deep-research`
- ติดตั้ง package → `/run-install`

## Execute

### 1. Read Catalog

> Goal: ได้ Default pick ของ category ที่ต้องการ

1. อ่าน `review-dependencies/references/techstack-catalog.md`
2. หา category ที่ตรงกับความต้องการ (เช่น "Validator", "HTTP Client", "ORM")
3. เลือก column `Default` ของ ecosystem ที่ตรงกับ project (TS / Rust / Vue / TanStack / Cloudflare / Third-Party)

### 2. Apply Selection Rules

> Goal: ได้ตัวเลือกที่ถูกต้องตาม context

1. ใช้ `Default` เสมอ — ยกเว้นเงื่อนไข `(→ ...)` ใน `Alternatives` ตรงกับ project (เช่น `Hono` → CF Workers)
2. ถ้า project มี lib ใน category นั้นอยู่แล้ว → ใช้ของเดิมต่อ ไม่เปลี่ยนเพื่อให้ตรง default โดยไม่มีเหตุผล
3. ถ้า project ใช้ตัวที่ไม่ใช่ default และไม่มีเหตุผล → flag drift ให้ user ตัดสินใจผ่าน `/ask-me` อย่า migrate เอง
4. ถ้า lib ที่ต้องการไม่อยู่ใน catalog → ทำ `/research-dependencies` หรือ `/deep-research` แล้วเสนออัปเดต catalog

### 3. Consult Preference Signals

> Goal: รู้ว่า user มี preference เพิ่มเติมนอก catalog หรือไม่

1. ทำ `/list-raindrop-favorite` เมื่อต้องเทียบ alternatives หลายตัว — favorites คือ curated preference signal
2. ทำ `/search-raindrop "<library>"` — ถ้า candidate ถูก bookmark → น้ำหนัก preferred สูงขึ้น

### 4. Install And Use

> Goal: นำ pick มาใช้จริงตาม best practices

1. ติดตั้งด้วย `/run-install` ตาม package manager ของ project
2. ถ้ามี skill `follow-lib-*` / `follow-tool-*` / `follow-service-*` สำหรับตัวที่เลือก → invoke skill นั้นเพื่อใช้ถูกวิธี (ห้ามเดา API)
3. ถ้าไม่มี skill เฉพาะ → อ่าน official docs ผ่าน `/learn-web` หรือ context7

## Rules

### 1. Catalog Is Source Of Truth

- อ่านจาก `review-dependencies/references/techstack-catalog.md` เท่านั้น ห้าม hardcode list ซ้ำ
- ถ้าพบว่า catalog ล้าสมัย → เสนออัปเดต catalog ไม่ใช่แก้ใน skill นี้

### 2. Existing Before New

- lib ที่ติดตั้งอยู่แล้วใน manifest มีความสำคัญกว่า default pick — เปลี่ยนเฉพาะเมื่อมีเหตุผลชัด (EOL, security, broken)
- ห้ามเพิ่ม dependency ใหม่ถ้า dep ที่มีอยู่ทำได้

### 3. No Silent Drift

- การเลือกที่ขัดกับ default ต้องมีเหตุผลที่บันทึกได้ (comment, ADR, หรือเงื่อนไข `(→ ...)` ใน catalog)
- ตัดสินใจเสี่ยงสูงหรือไม่ชัด → `/ask-me`

## Expected Outcome

- ทุกการเลือก lib อ้างอิงกลับไปที่ catalog หรือ preference signals ของ user
- ไม่มี dependency drift ที่ไม่ได้ตั้งใจ
- lib ที่เลือกถูกใช้ตาม `follow-lib-*`/`follow-tool-*`/`follow-service-*` skill ที่ตรงกัน
