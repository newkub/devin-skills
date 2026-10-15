---
name: learn-from-references
description: Learn from user-given references — files, repos, docs, skills — extract patterns and apply them
argument-hint: "<@files|urls|repo|skill-name...>"
related:
  - learn-from-web
  - learn-from-cli
  - learn-from-codebase
  - check-reference
  - deep-research
  - report
---

## Goal

อ่านและสกัดความรู้จาก references ที่ user ชี้มาโดยตรง — หลายแหล่งผสมกัน (local files, GitHub repos, docs, skills) — แล้วสรุปเป็น patterns, conventions, หรือ knowledge ที่นำไปใช้กับ task ปัจจุบันได้ทันที

## Scope

- ใช้เมื่อ user ให้ reference ชี้เป้า (`@file`, URL, repo, ชื่อ skill) — ถ้าเป็น web docs อย่างเดียว → `/learn-from-web`; codebase ในเครื่องล้วน → `/learn-from-codebase`; CLI binary → `/learn-from-cli`
- ครอบคลุม: reference implementations, example repos, API docs, skill `references/` dirs, design/pattern docs
- Output: สรุป patterns + conventions ในแชท, เขียน `references/` ให้ skill, หรือ apply เข้างาน — **ไม่ copy โค้ดตรงๆ** โดยไม่เข้าใจ
- ตรวจความถูกต้องของ claims จาก references → `/check-reference`; cross-check หลายแหล่ง/เสี่ยงสูง → `/deep-research`

## Execute

### 1. รวบรวม References

> Goal: รู้ว่ามีแหล่งไหนบ้างและอ่านได้ยังไง

1. `@file` / path → `read` โดยตรง; directory → list + read ไฟล์หลักก่อน (README, index, entry points)
2. GitHub repo → `/learn-from-web` ผ่าน DeepWiki (`read_wiki_structure` → `read_wiki_contents` → `ask_wiki_question`)
3. URL/docs → `webfetch` หรือ `crw_scrape`; library API → `context7` (`resolve` → `query-docs`)
4. skill name → อ่าน `SKILL.md` + `references/` ใน `%APPDATA%\devin\skills\<name>/`
5. จัดกลุ่ม: หลัก (source of truth ที่ต้องตาม) vs supporting (context เสริม)

### 2. อ่านแบบมีเป้าหมาย

> Goal: สกัดเฉพาะสิ่งที่ task ต้องใช้

1. กำหนดคำถามก่อนอ่าน: task ต้องการอะไรจาก reference นี้ — API surface? patterns? conventions? pitfalls?
2. อ่านตามลำดับ: overview → core patterns → examples ที่ใกล้ task → edge cases
3. ข้าม: boilerplate, generated files, tests ที่ไม่เกี่ยว, marketing content

### 3. สกัด Knowledge

> Goal: ได้ patterns ที่นำไปใช้ได้ ไม่ใช่แค่สรุป

1. สำหรับแต่ละ reference จด: **patterns** (ทำยังไง), **conventions** (กฎที่ต้องตาม), **constraints** (ห้าม/จำกัด), **gotchas** (จุดที่พังบ่อย)
2. เทียบกับ codebase ปัจจุบัน — conventions ที่ต่างกันต้องชี้ชัดว่าจะ adopt หรือไม่
3. เจอความขัดแย้งระหว่าง references → `/check-reference` หรือเลือกตาม official source

### 4. Apply หรือ Persist

> Goal: knowledge ไม่หายและนำไปใช้จริง

1. ถ้า task คือ implement → apply patterns เข้างานตาม conventions ของ project ปัจจุบัน (references เป็นแนว ไม่ใช่ต้นฉบับ)
2. ถ้าเป็น knowledge ที่ใช้ซ้ำ → เขียนลง `references/` ของ skill ที่เกี่ยวข้อง หรือ `AGENTS.md` ถ้าเป็น project convention
3. ถ้า user ขอสรุป → report แบบมีโครงสร้าง: source แต่ละแหล่ง + สิ่งที่สกัดได้ + จะใช้ยังไง

### 5. Report

> Goal: user รู้ว่าเรียนรู้อะไรได้บ้าง

1. ทำ `/report` สรุป: references ที่อ่าน, patterns/conventions หลัก, สิ่งที่ apply หรือ persist ไป
2. ชี้ gaps — reference ที่อ่านไม่ได้ หรือข้อมูลที่ขาด

## Rules

- อ่าน reference จริงก่อนสรุป — ห้ามเดาจากชื่อไฟล์/URL
- Source หลักคือ official docs/code ต้นฉบับ — blog/forum เป็น supporting เท่านั้น
- Apply ตาม conventions ของ project ปลายทางเสมอ — reference ไม่ได้ override project rules
- References หลายแหล่งขัดกัน → ถาม user หรือเลือกตาม authority (official > community)
- ไม่แก้ reference sources — อ่านอย่างเดียว

## Expected Outcome

- ได้ patterns/conventions ที่ชัดเจนจากทุก reference ที่ user ให้
- Knowledge ถูก apply เข้างานหรือ persist ไว้ถูกที่
- Report ระบุชัดว่าอ่านอะไร ได้อะไร และใช้ต่อยังไง
