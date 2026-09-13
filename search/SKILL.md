---
name: search
description: ค้นหาข้าม sources — files, GitHub stars, npmx, Raindrop, MCP, skills, drive D ผ่าน subskills
argument-hint: "[domain]"
related:
  - follow-tool-crw
  - learn
  - use-astgrep
  - ask-me
  - report
---

## Goal

Dispatch ไป subskill ตาม search source — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: search-files-patterns, search-in-github-star, search-mcp, search-in-npmx, search-project-in-drive-d, search-in-raindrop-io, search-similar, search-skills)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `files-patterns` | `subskills/files-patterns/SKILL.md` — ค้นไฟล์ตาม pattern/glob |
| `github-star` | `subskills/github-star/SKILL.md` — ค้นใน GitHub starred repos |
| `mcp` | `subskills/mcp/SKILL.md` — ค้น MCP servers |
| `npmx` | `subskills/npmx/SKILL.md` — ค้น/เปรียบเทียบ npm packages บน npmx.dev |
| `project-in-drive-d` | `subskills/project-in-drive-d/SKILL.md` — ค้น project ใน drive D |
| `raindrop` | `subskills/raindrop/SKILL.md` — ค้น bookmarks ผ่าน raindrop CLI |
| `similar` | `subskills/similar/SKILL.md` — ค้น code/files ที่คล้ายกัน |
| `skills` | `subskills/skills/SKILL.md` — ค้น skills ที่เกี่ยวข้อง |

1. ระบุ domain จาก argument (เช่น `/search npmx`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- ถ้าต้อง research เชิงลึกหลังเจอ source → ต่อด้วย `/learn web` หรือ `/deep-research`

- ใช้ /follow-tool-crw ถ้าจำเป็น
- ใช้ /use-astgrep ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง source แล้วค้นตาม flow นั้น
