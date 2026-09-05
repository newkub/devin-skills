---
name: update-devin-global-skills
description: อัปเดต global Devin skills ด้วย research ล่าสุดและมาตรฐาน repo
argument-hint: "[@files-or-topic...]"
related:
  - follow-create-devin-global-skills
  - create-devin-global-skills
  - update-devin-project-skills
  - deep-research
  - learn-from-web
  - follow-skills-map
  - review-devin-global-skills
  - follow-global-rules
  - deep-validate
  - check-circular-dependencies
  - check-reference
  - update-references
  - review-issue
  - report-table
  - ship
---

## Goal

อัปเดต skill หนึ่งตัวหรือหลายตัวใน `%APPDATA%\devin\skills` ให้ทันสมัยและถูกต้อง — research ข้อมูลล่าสุดจาก official sources แล้วแก้ไขตามมาตรฐานจาก `/follow-create-devin-global-skills`

## Scope

ใช้เมื่อต้องอัปเดต skill ที่มีอยู่ รองรับการระบุ skill เดียว หลาย skill หรือไม่ระบุ (ทั้งหมด) — ถ้าต้องสร้าง skill ใหม่ให้ทำ `/follow-create-devin-global-skills` แทน

ดูเพิ่มเติม: /follow-create-devin-global-skills, /update-devin-project-skills, /review-devin-global-skills

## Execute

### 1. Identify Targets

> Goal: รู้ว่าต้องอัปเดต skill ใดบ้าง

1. รับ `@files...` หรือ `topic` จาก argument หรือ context
2. ถ้าไม่มี `@files` → อ่าน `%APPDATA%\devin\skills` ทั้งหมดเพื่อ update ทุก skill
3. ถ้ามี `@files` → อัปเดตเฉพาะ skill ที่ระบุ
4. ตรวจว่าแต่ละ `<skill-name>\SKILL.md` มีอยู่ — ถ้าไม่มี → ส่งต่อ `/follow-create-devin-global-skills`
5. ถ้าชื่อไม่ชัด → ทำ `/ask-me` ก่อนดำเนินการ
6. ทำ `/follow-skills-map` เพื่อดูกลุ่ม skills ที่เกี่ยวข้องก่อนดำเนินการต่อ

### 2. Deep Research

> Goal: มีข้อมูลล่าสุดและถูกต้องก่อนแก้ไข

1. ทำ `/deep-research` โดยระบุ topic หรือ skill ที่จะอัปเดต
2. ทำ `/learn-from-web` จาก official docs, changelog, repository เป็นแหล่งหลัก
3. บันทึก: latest version, breaking changes, new commands, new options, deprecations, environment variables, URLs
4. หาตัวอย่าง command, config, output จริง — ไม่เดา API หรือ command
5. ถ้า topic ไม่ต้อง research (เช่น fix structure ล้วน) → ข้ามขั้นตอนนี้

### 3. Map Findings To Skills

> Goal: รู้ว่าต้องแก้ skill และ section ไหนบ้าง

1. อ่าน `SKILL.md` และ `references/` ของ skill เป้าหมาย
2. ระบุ sections ที่ต้อง update: `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
3. ระบุ `references/` ที่ต้องสร้างหรือแก้
4. แก้เฉพาะสิ่งที่เปลี่ยนจริง — ไม่ rewrite ทั้งไฟล์ถ้าไม่จำเป็น

### 4. Apply Updates

> Goal: skill ทันสมัยตาม research และมาตรฐาน

1. ทำตาม `/follow-create-devin-global-skills` สำหรับมาตรฐาน structure, naming, templates, ecosystem และ content rules
2. อัปเดต commands, options, examples, environment variables และ URLs
3. ลบ deprecated commands/options ออก
4. เพิ่ม new commands/sections เฉพาะที่จำเป็นต้องรู้
5. ถ้าไฟล์เกิน 250 บรรทัด → แยกไป `references/` ตาม `/follow-create-devin-global-skills`
6. ตรวจ markdown links ชี้ไปไฟล์ที่มีอยู่จริง

### 5. Align With Catalog And Global Rules

> Goal: skill ที่อัปเดตสอดคล้องกับ repo standards และ global rules

1. ทำ `/review-devin-global-skills` เพื่อตรวจ conventions, naming, structure และ content quality
2. ทำ `/follow-global-rules` เพื่อตรวจว่าไม่ขัด `global_rules.md`
3. ถ้ามี misalignment → ปรับแก้ก่อน validate
4. บันทึก findings และการแก้ไข

### 6. Validate

> Goal: skill ผ่านเกณฑ์ทั้งหมด

1. ทำ `/deep-validate` เพื่อตรวจ frontmatter, sections, ความยาว, `related` missing/unused, TODO/MOCK/placeholder
2. ตรวจทุกไฟล์ไม่เกิน 250 บรรทัด
3. ทำ `/check-circular-dependencies` ถ้ามีการแก้ `related`
4. ถ้าไม่ผ่าน → แก้และ recheck (max 3 รอบ → stop และ report)

### 7. Review Issue And Update References

> Goal: issues ถูกบันทึกและ references ถูกต้อง

1. ถ้าพบ issue หรือ gap ระหว่าง update → ทำ `/review-issue` เพื่อประเมินความสำคัญ
2. บันทึก findings พร้อม severity และ recommendation
3. ทำ `/update-references` เพื่ออัปเดต references ระหว่าง skills
4. อัปเดต `AGENTS.md` ถ้ามีการ rename หรือย้าย skill
5. ถ้า skill เกี่ยวข้องกับ global rules → อัปเดต `global_rules.md` และ `/follow-global-rules`
6. ตรวจว่า skills อื่นที่อ้างถึง skill นี้ยังถูกต้อง — broken references แก้ทันที

### 8. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะและ stop
3. ทำ `/report-table` สรุป topic, old info, new info, files changed และ next actions

## Rules

### 1. Update Only

- skill นี้อัปเดตเท่านั้น — สร้างใหม่ให้ใช้ `/follow-create-devin-global-skills`
- แก้เฉพาะสิ่งที่เปลี่ยนจริง รักษา existing conventions
- ทำตาม `/follow-create-devin-global-skills` สำหรับมาตรฐาน structure และ content

### 2. Official Sources First

- ใช้ official docs, changelog, repository เป็นแหล่งหลัก
- ไม่ใช้ third-party ถ้า official มี และระบุ source URLs

### 3. Evidence-Based Updates

- ทุกการแก้ skill ต้องมี evidence และบันทึก version ที่ research
- ไม่เดา API, command หรือ version

### 4. Safety

- ทำ dry run ก่อน destructive หรือ high-risk actions
- ถ้ามี overwrite ไฟล์เดิม → user confirmation ก่อน
- ไม่ทำลาย references หรือ existing skills

### 5. Content Standard

- `name` ตรง directory name, `description` ≤100 ตัวอักษร
- ไม่มี TODO/MOCK/placeholder — ถ้าข้อมูลไม่ชัดให้ระบุความไม่แน่นอน
- global skills เขียนภาษาไทยคงคำศัพท์เทคนิคอังกฤษ ตาม `/follow-create-devin-global-skills`
- install commands ตาม ecosystem: `bun add`/`bun install` (Bun/Node), `cargo add` (Rust), `go get` (Go), `pip install` (Python), `mise use -g npm:<package>` สำหรับ global npm CLI

- ใช้ /alignment ถ้าจำเป็น
- ใช้ /check-reference ถ้าจำเป็น

## Expected Outcome

- Skill ที่อัปเดตสะท้อน latest version, APIs, commands และ best practices
- `SKILL.md` ผ่าน `/deep-validate`, ไม่เกิน 250 บรรทัด, ไม่มี TODO/MOCK/placeholder
- `related` ครบถ้วน ไม่มี missing/unused
- Deprecated commands/options ถูกลบออก
- References อัปเดตครบทั้ง `AGENTS.md`, `global_rules.md` และ skills อื่นที่เกี่ยวข้อง
- Report table สรุป findings และการเปลี่ยนแปลง
