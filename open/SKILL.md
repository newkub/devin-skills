---
name: open
description: เปิด target ใน app ที่เหมาะ — explorer, browser, terminal, editor, GitHub ผ่าน subskills
argument-hint: "[domain]"
related:
  - open-in-devin
  - open-diff
  - open-files-in-web
  - open-readme-html
  - ask-me
---

## Goal

Dispatch ไป subskill ตาม target ที่ต้องเปิด — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: open-in-explorer, open-github, open-in-wezterm, open-in-windows-terminal, open-in-zed, open-web)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `explorer` | `subskills/explorer/SKILL.md` — เปิด path ใน file explorer |
| `github` | `subskills/github/SKILL.md` — เปิด repo/page บน GitHub |
| `web` | `subskills/web/SKILL.md` — เปิด URL ใน browser |
| `wezterm` | `subskills/wezterm/SKILL.md` — เปิดใน WezTerm |
| `windows-terminal` | `subskills/windows-terminal/SKILL.md` — เปิดใน Windows Terminal |
| `zed` | `subskills/zed/SKILL.md` — เปิดใน Zed editor |

1. ระบุ domain จาก argument (เช่น `/open web`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- open-* ที่เป็น domain เฉพาะ (devin, diff, files-in-web, readme-html) ยังเป็น skill แยก — ดู `related`

- ใช้ /open-in-devin ถ้าจำเป็น
- ใช้ /open-diff ถ้าจำเป็น
- ใช้ /open-files-in-web ถ้าจำเป็น
- ใช้ /open-readme-html ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง target แล้วเปิดตาม flow นั้น
