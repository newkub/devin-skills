---
name: open
description: เปิด target ใน app ที่เหมาะ — explorer, browser, terminal, editor, GitHub ผ่าน top-level skills
argument-hint: "[domain]"
related:
  - open-in-devin
  - open-diff
  - open-files-in-web
  - open-readme-html
  - ask-me
---

## Goal

Dispatch ไป skill ปลายทาง ตาม target ที่ต้องเปิด — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: open-in-explorer, open-github, open-in-wezterm, open-in-windows-terminal, open-in-zed, open-web)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Skills

| Domain | Skill |
|---|---|
| `explorer` | /open-explorer — เปิด path ใน file explorer |
| `github` | /open-github — เปิด repo/page บน GitHub |
| `web` | /open-web — เปิด URL ใน browser |
| `wezterm` | /open-wezterm — เปิดใน WezTerm |
| `windows-terminal` | /open-windows-terminal — เปิดใน Windows Terminal |
| `zed` | /open-zed — เปิดใน Zed editor |

1. ระบุ domain จาก argument (เช่น `/open-web`)
2. ถ้า domain รองรับ → ทำตาม `/open-<domain>` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ skill ปลายทาง
- open-* ที่เป็น domain เฉพาะ (devin, diff, files-in-web, readme-html) ยังเป็น skill แยก — ดู `related`

- ใช้ /open-in-devin ถ้าจำเป็น
- ใช้ /open-diff ถ้าจำเป็น
- ใช้ /open-files-in-web ถ้าจำเป็น
- ใช้ /open-readme-html ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป skill ปลายทาง ที่ตรง target แล้วเปิดตาม flow นั้น
