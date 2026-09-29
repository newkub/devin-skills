# Bulk Update

## Goal

Orchestrate อัปเดตหลาย skills ในครั้งเดียวเมื่อไม่มี `@files` ระบุ — เลือก target set, แจกงานทีละ skill, validate รวม, ship เป็น batch

## Steps

### 1. Select Target Set

> Goal: ได้ target list ที่ชัดเจนและยืนยันแล้ว

1. ถ้ามี `topic` หรือ context → เลือกเฉพาะ skills ที่เกี่ยวข้อง (ผ่าน `/use-related-skills`, `/search-skills`, หรือ family prefix เช่น `follow-*`, `review-*`)
2. ถ้าไม่มี scope เลย → ถาม user ผ่าน `/ask-me` ก่อน (stale skills, family เดียว, หรือทั้ง repo) — ห้าม sweep ทั้ง repo โดยไม่ยืนยัน
3. เก็บ target list เป็นตาราง: No., Skill, Reason, Priority

### 2. Plan Per Skill

> Goal: แต่ละ skill ได้ procedure เดียวกัน ไม่มี skip เพราะ "แก้น้อย"

1. แต่ละ skill ทำตาม Execute steps 3-8 ของ parent (check duplicates → structure → research → write → references → validate)
2. skills ที่อิสระกันหลายตัว → spawn `subagents/skill-updater.md` ทีละ skill ขนานกัน — parent เป็นคน validate รวมและ commit
3. skills ที่แก้ `related`, `AGENTS.md` หรือ shared references ชนกัน → ทำ sequential ไม่ spawn subagent

### 3. Validate And Ship

> Goal: repo เขียวทั้งก้อนก่อนส่งมอบ

1. รัน broken-references checker (`review-devin-global-harness/subskills/broken-skills-references`) + `/deep-validate` ครั้งเดียวหลังทุก skill เสร็จ
2. sync living documents ตาม `references/living-documents.md` — `AGENTS.md`, tool-map, subagent registry, `related` lists
3. `/git-commit` checkpoint ต่อ batch ที่สัมพันธ์กัน — ไม่ commit รวมทุก skill ใน commit เดียวถ้า topic ต่างกัน
4. report ตาราง before/after ต่อ skill พร้อม status

## Rules

- ห้าม bulk update ทั้ง repo โดยไม่มี topic หรือ user confirmation — เสี่ยง scope creep
- skills ที่ share references ห้าม update ขนานกัน — git/index conflicts
- ทุก skill ต้องผ่าน validation เดียวกัน ห้าม skip
