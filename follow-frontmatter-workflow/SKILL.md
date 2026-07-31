---
name: follow-frontmatter-workflow
description: กำหนด frontmatter spec สำหรับ workflow files ให้ consistent และ validate ได้
---

## Goal

กำหนด frontmatter spec สำหรับ workflow `.md` files — ครอบคลุม 22 fields แบ่งเป็น 6 กลุ่ม: Core, Classification, Safety, Execution Permissions, Execution Control, และ Output & Lifecycle

## Scope

ใช้กับ workflow `.md` ทุกไฟล์ใน `global_workflows` และ project workflows ที่ใช้ YAML frontmatter — ไม่ใช้กับ `.devin/rules`, skills, หรือ config files อื่น

## Execute

### 1. Validate Core Fields

ตรวจสอบ fields ที่ workflow ทุกไฟล์ต้องมี — ขาด field ใด field หนึ่งไม่ได้

> Goal: Workflow มี metadata ขั้นต่ำครบถ้วน ไม่มี field ขาด

1. ตรวจ 8 required fields: `title`, `description`, `auto_execution_mode`, `category`, `risk_level`, `allow`, `auto_run`, และ `related`
2. ตรวจว่า `title` เป็น Title Case และตรงกับ filename แบบ kebab-case — เช่น `Run Health` ตรงกับ `run-health.md`
3. ตรวจว่า `description` กระชับไม่เกิน 100 ตัวอักษร และอธิบายสิ่งที่ workflow ทำได้โดยไม่ต้องอ่าน body
4. ตรวจว่า `auto_execution_mode` เป็น `3` เสมอ
5. ถ้า required field ขาดหรือ invalid → fix ก่อนเขียน body — ห้ามเขียน body ถ้า frontmatter ไม่ valid

### 2. Validate Classification Fields

ตรวจสอบ fields สำหรับจัดกลุ่ม ค้นหา และเลือก workflow ที่เหมาะสม

> Goal: Workflow ค้นหาและจัดกลุ่มได้แม่นยำ ไม่มี category ผิด

1. เลือก `category` จาก options ที่กำหนดใน Rules table เท่านั้น — ห้ามใช้ค่านอก list
2. ใส่ `tags` เฉพาะ keywords ที่ช่วยค้นหาจริง — ไม่ใส่ generic words เช่น `workflow`, `task`
3. ตั้ง `scope` เป็น `global`, `project`, หรือ `workspace` — default คือ `global`
4. ตั้ง `language` เป็น `th`, `en`, หรือ `mixed` — default คือ `th`

### 3. Validate Safety Fields

ตรวจสอบ fields สำหรับความเสี่ยง prerequisites และ lifecycle — บอก AI ว่าปลอดภัยแค่ไหน

> Goal: Workflow บอกความเสี่ยงและเงื่อนไขก่อนรันได้ชัดเจน

1. ตั้ง `risk_level` เป็น `low`, `medium`, หรือ `high` — ดู Safety Mapping ใน Rules เพื่อเลือกระดับที่ถูกต้อง
2. ใส่ `requires` เฉพาะ tools, files, services, หรือ credentials ที่จำเป็นก่อนเริ่ม — ถ้าไม่มี prerequisites ใช้ `requires: []`
3. ตั้ง `idempotent` ตามพฤติกรรมจริง — `true` ถ้ารันซ้ำได้โดยไม่เกิด side effects, `false` ถ้ามี side effects
4. ถ้า `deprecated: true` ต้องมี `replaces` หรือระบุ workflow ที่ควรใช้แทนใน body

### 4. Validate Execution Permissions

ตรวจสอบ fields ที่ควบคุมว่า workflow อนุญาตให้ทำ action อะไร — บอก AI ขอบเขตการทำงาน

> Goal: AI รู้ action boundary ก่อนเริ่มทำงาน ไม่ทำเกินขอบเขต

1. ตั้ง `allow` เป็น array ของ actions ที่ workflow ใช้จริงเท่านั้น — ดู options ใน Rules table
2. ตั้ง `interactive` เป็น `true` เมื่อ workflow ต้องรอ user input หรือ confirmation ระหว่างทำงาน
3. ตั้ง `auto_run` เป็น `always`, `confirm`, หรือ `never` — `always` รันอัตโนมัติ, `confirm` ต้องถามก่อน, `never` ต้องเรียกใช้โดยตรง
4. ถ้า `risk_level: high` ต้องตั้ง `auto_run: confirm` หรือ `auto_run: never` — ห้าม `auto_run: always` เมื่อ `risk_level: high`
5. ใส่ `confirm_before` เป็น array ของ actions ที่ต้อง confirm ก่อนทำ เช่น
   ```yaml
   confirm_before:
     - file-delete
     - git
   ```

### 5. Validate Execution Control Fields

ตรวจสอบ fields สำหรับ parallelism, conflicts, retry และ timeout

> Goal: Workflow ทำงานร่วมกับ workflows อื่นได้โดยไม่ race หรือ loop เกินจำเป็น

1. ตั้ง `true` เฉพาะ workflow ที่ไม่มี shared mutable state — ถ้าเขียนไฟล์เดียวกันกับ workflow อื่น ตั้ง `false`
2. ใส่ `conflicts` เมื่อ workflow ห้ามรันพร้อม workflow อื่น — เช่น
   ```yaml
   conflicts:
     - /run-format
   ```
   ห้ามรันพร้อม `/run-format`
3. ตั้ง `timeout` เป็นจำนวนวินาทีสูงสุดที่ workflow ควรรัน — default ไม่มี ถ้าไม่ใส่หมายถึงไม่จำกัด

### 6. Validate Output And Lifecycle Fields

ตรวจสอบ fields สำหรับ output tracking และ lifecycle management

> Goal: Workflow บอก output ที่ได้และ lifecycle status ได้ชัดเจน

1. ใส่ `produces` เป็น array ของ output artifacts เช่น `health-report`, `test-results`, `changelog`
2. ใส่ `updated_last` เป็น ISO 8601 datetime พร้อม timezone — เช่น `2026-07-14T06:30:00+07:00`
3. ถ้า `deprecated: true` ต้องมี `replaces` ชี้ไปยัง workflow ใหม่

## Rules

### 1. Field Options

| Field | Type | Required | Default | Options |
|---|---|---|---|---|
| `title` | string | yes | — | Title Case, ตรง filename kebab-case |
| `description` | string | yes | — | text <= 100 chars |
| `auto_execution_mode` | number | yes | `3` | `3` |
| `category` | string | yes | — | 49 verbs — `ask` `bench` `capture` `check` `cleanup` `commit` `compare` `continue` `create` `debug` `deep` `delete` `deploy` `edit` `ensure` `follow` `git` `goal` `idea` `implement` `improve` `learn` `list` `loop` `merge` `move` `news` `open` `plan` `prioritize` `record` `refactor` `report` `resolve` `review` `roleplay` `run` `scan` `search` `ship` `simplify` `suggest` `test` `update` `use` `validate` `watch` `write` |
| `tags` | array | no | `[]` | lowercase keywords |
| `risk_level` | string | yes | — | `low` `medium` `high` |
| `requires` | array | no | `[]` | tools, files, services, credentials |
| `idempotent` | boolean | no | `true` | `true` `false` |
| `scope` | string | no | `global` | `global` `project` `workspace` |
| `parallel` | boolean | no | `true` | `true` `false` |
| `conflicts` | array | no | `[]` | workflow names like `/run-format` |
| `deprecated` | boolean | no | `false` | `true` `false` |
| `replaces` | array | no | `[]` | workflow names like `/old-workflow` |
| `language` | string | no | `th` | `th` `en` `mixed` |
| `timeout` | number | no | — | seconds, no limit if omitted |
| `updated_last` | string | no | — | ISO 8601 datetime `YYYY-MM-DDTHH:MM:SS+07:00` |
| `allow` | array | yes | — | `file-read` `edit` `file-write` `file-delete` `terminal` `install` `network` `git` `deploy` `browser` `mcp` `memory` |
| `interactive` | boolean | no | `false` | `true` `false` |
| `auto_run` | string | yes | — | `always` `confirm` `never` |
| `confirm_before` | array | no | `[]` | actions from `allow` list |
| `produces` | array | no | `[]` | output artifacts like `health-report` |
| `related` | array | yes | — | workflows called directly |

### 2. Naming Decisions

- ใช้ `auto_run` แทน `safe_to_auto_run` เพราะสั้นกว่าและบอก policy ได้ 3 แบบ: `always`, `confirm`, `never`
- ใช้ `updated_last` แทน `since` เพราะบอกวันที่แก้ล่าสุด ไม่ใช่วันที่สร้างอย่างเดียว และใช้ ISO 8601 datetime พร้อม timezone
- ใช้ `allow` เป็น array แทน boolean หลายตัว เช่น `allow_terminal`, `allow_git`, `allow_network` เพื่อลด field explosion
- ใช้ `requires` เท่านั้น ห้ามใช้ `require` เพราะ `requires` สื่อว่าเป็น prerequisites หลายรายการ
- ใช้ `confirm_before` แยกจาก `interactive` เพราะ `interactive` บอกว่าต้องรอ user ระหว่างทำงาน, `confirm_before` บอก action ที่ต้อง confirm ก่อนทำ

### 3. Safety Mapping

- Review/report/read-only workflows: `risk_level: low`, `auto_run: always`
  ```yaml
  allow:
    - file-read
  ```
- Edit-only workflows: `risk_level: medium`, `auto_run: confirm`
  ```yaml
  allow:
    - file-read
    - edit
    - file-write
  ```
- Terminal workflows: `risk_level: low` หรือ `medium`, `auto_run: always` หรือ `confirm`
  ```yaml
  allow:
    - file-read
    - terminal
  ```
- Destructive workflows: `risk_level: high`, `auto_run: confirm` หรือ `never`
  ```yaml
  allow:
    - file-read
    - file-delete
    - git
  confirm_before:
    - file-delete
    - git
  ```
- Interactive workflows: `interactive: true`, `auto_run: confirm` หรือ `never`
  ```yaml
  interactive: true
  auto_run: confirm
  ```

### 4. Required Template

```yaml
---
title: Workflow Name
description: กระชับไม่เกิน 100 ตัวอักษร
auto_execution_mode: 3
category: write
tags:
  - example
risk_level: low
requires: []
idempotent: true
scope: global
conflicts: []
deprecated: false
language: th
timeout: 60
updated_last: 2026-07-14T07:10:00+07:00
allow:
  - file-read
interactive: false
auto_run: always
confirm_before: []
produces: []
related:
  - /related-workflow
---
```

### 5. Validation Checklist

- ทุก required field มีค่าและไม่เป็นค่าว่าง
- `category` อยู่ใน options list
- `risk_level` สอดคล้องกับ `allow` — ถ้า `allow` มี `file-delete` ต้องเป็น `high`
- `auto_run` สอดคล้องกับ `risk_level` — ถ้า `risk_level: high` ต้องเป็น `confirm` หรือ `never`
- `confirm_before` มีเฉพาะ actions ที่อยู่ใน `allow` — ห้าม confirm action ที่ไม่ allow
- `deprecated: true` ต้องมี `replaces`
- `updated_last` เป็น ISO 8601 datetime พร้อม timezone
- `related` มีเฉพาะ workflows ที่เรียกโดยตรงใน Execute หรือ Rules

## Expected Outcome

- Workflow frontmatter มี 22 fields ครบ — 8 required + 14 optional
- Metadata ช่วยให้ search, sorting, safety decision, auto-run policy, lifecycle management และ output tracking ทำงานได้
- `/follow-write-devin-skills` อ้างอิง workflow นี้แทนการ duplicate frontmatter spec
- Validation checklist ใช้ตรวจสอบได้ deterministic — input เดียวกัน → pass/fail เหมือนกันทุกครั้ง
