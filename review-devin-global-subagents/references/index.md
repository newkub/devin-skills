---
title: Reference Index
description: ตาราง mapping reference files กับความรับผิดชอบ
---

# Reference Index

## Reference Files Mapping

| File | Responsibility |
|---|---|
| `frontmatter.md` | ตรวจสอบ frontmatter fields: `name`, `description`, `model`, `allowed-tools`, `permissions` |
| `sections.md` | ตรวจสอบลำดับ sections, line count <=250, ไม่มี TODO/MOCK/placeholder |
| `style.md` | ตรวจสอบ style conventions: backticks, ไม่มี `**` bold, heading Title Case |
| `safety.md` | ตรวจสอบ safety: ไม่มี secrets hardcoded, `permissions` deny risky paths, `allowed-tools` เหมาะสม |
| `scoring.md` | สูตรคำนวณ review score, grade A-F, action threshold Score<70 |
| `index.md` | ตาราง mapping reference files กับความรับผิดชอบ (ไฟล์นี้) |

## Usage

อ้างอิง reference file ตามขั้นตอนใน `SKILL.md`:

- ขั้นตอน Check Frontmatter → `references/frontmatter.md`
- ขั้นตอน Check Sections → `references/sections.md`
- ขั้นตอน Check Style → `references/style.md`
- ขั้นตอน Check Safety → `references/safety.md`
- ขั้นตอน Score And Report → `references/scoring.md`

## Single Responsibility

แต่ละ reference file ครอบคลุม concern เดียวเท่านั้น:

- `frontmatter.md` → frontmatter validation เท่านั้น
- `sections.md` → section order และ line count เท่านั้น
- `style.md` → style conventions เท่านั้น
- `safety.md` → safety และ security เท่านั้น
- `scoring.md` → scoring formula เท่านั้น
