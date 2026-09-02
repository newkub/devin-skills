---
name: follow-create-sdk
description: ถามและส่งต่อไปยัง skill follow-create-* ทีเหมาะสมกับงานสร้าง
argument-hint: "[skill-name-or-goal]"
related:
  - ask-me
  - follow-create-biome-plugins
  - follow-create-browser-extensions
  - follow-create-bun-cli
  - follow-create-claude-plugin
  - follow-create-cli
  - follow-create-codex-plugin
  - follow-create-devin-plugins
  - follow-create-devin-skills
  - follow-create-discord-bot
  - follow-create-elysia-plugin
  - follow-create-eslint-plugins
  - follow-create-github-action
  - follow-create-line-bot
  - follow-create-mobile-android
  - follow-create-mobile-ios
  - follow-create-mobile-ios-android
  - follow-create-nitro-plugin
  - follow-create-nvim-plugins
  - follow-create-obsidian-plugin
  - follow-create-oxlint-plugins
  - follow-create-raycast-extensions
  - follow-create-rolldown-plugins
  - follow-create-rust-cli
  - follow-create-rust-crate
  - follow-create-tauri-plugins
  - follow-create-telegram-bot
  - follow-create-vite-plugins
  - follow-create-vitest-plugins
  - follow-create-vscode-extensions
  - follow-create-web
  - follow-create-zed-extensions
  - report-table
  - run-test
  - search-files-patterns
  - search-skills
  - ship
  - update-devin-global-skills
  - update-devin-global-subagents
  - update-references
  - update-test-and-fix
  - follow-my-tech-stack
  - review-techstack
---
## Goal

ช่วย user เลือก `follow-create-*` skill ทีเหมาะสมกับงานสร้าง แล้วส่งต่อไปดำเนินการทันที

## Scope

ใช้เมื่อ user ต้องการสร้าง project/plugin/library/extension/CLI/skills/subagents/MCP/web/mobile แต่ยังไม่แน่ใจว่าควรใช้ `follow-create-*` หรือ skill ทีเหมาะสมใด

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Parse Argument

> Goal: ตรวจสอบว่า user ระบุ skill หรือ goal มาหรือไม่

1. ถ้า user ระบุ `skill-name` ทีตรงกับ `follow-create-<name>` ที่มีอยู่ → ส่งต่อไปยัง skill นั้นทันที
2. ถ้า user ระบุ goal (เช่น `bun cli`, `mobile app`, `vite plugin`, `skills`, `mcp`, `web`, `mobile`) → ใช้เป็นคำใบ้ในการ sort ตัวเลือก
3. ถ้าไม่ระบุอะไร → ไปขั้นตอนถัดไป

### 3. Discover Create Skills

> Goal: หา `follow-create-*` skills ทีมีอยู่ทั้งหมด

1. ใช้ `search-files-patterns` หรือ `exec` ค้นหา `follow-create-*/SKILL.md` ใน `%APPDATA%\devin\skills`
2. อ่าน frontmatter (`name`, `description`) ของแต่ละ skill
3. สร้างรายการ: ชื่อ skill, description, category โดยประมาณ
   - `skills` → `follow-create-devin-skills`
   - `devin skills` → `follow-create-devin-skills`
   - `update all skills` → `update-devin-global-skills`
   - `subagents` → `update-devin-global-subagents`
   - `mcp`/`plugins` → `follow-create-devin-plugins`, `follow-create-claude-plugin`, `follow-create-codex-plugin`
   - `web` → `follow-create-web`
   - `mobile` → `follow-create-mobile-ios`, `follow-create-mobile-android`, `follow-create-mobile-ios-android`
4. ใช้ `/report-table` แสดงตารางสรุปให้ user เห็นภาพรวมก่อนถาม

### 4. Build And Ask Options

> Goal: ถาม user ว่าจะทำตาม follow-create- ไหน

1. เรียง skills ตาม relevance กับ goal/argument ก่อน ถ้าไม่มี goal เรียงตาม category (`skills`, `subagents`, `mcp`, `web`, `mobile`, `cli`, `plugin`) แล้วชื่อ
2. ใช้ `/ask-me` ด้วย `ask_user_question` ทีละชุด ชุดละไม่เกิน 3 skills + ตัวเลือก `More...`
3. ตัวเลือก `label` ใช้ชื่อ skill สั้นๆ เช่น `follow-create-bun-cli`
4. `description` ใช้ description จาก frontmatter
5. ถ้ามี skills เหลืออยู่ → เพิ่ม `More...` เสมอ (ยกเว้นชุดสุดท้าย)
6. ถ้าถึงชุดสุดท้าย → เพิ่ม `Skip` และ `Suggest another` เป็นทางเลือก
7. ถ้า user เลือก `More...` → แสดงชุดถัดไป
8. ถ้า user เลือก `Skip` → หยุดและรายงานว่าไม่มีการเลือก
9. ถ้า user เลือก `Suggest another` → ให้ user พิมพ์ชื่อ skill หรือ goal แล้ว match ใหม่

### 5. Invoke Selected Skill

> Goal: ส่งต่อไปยัง skill ทีเลือก

1. ถ้า user เลือก skill เดียว → เรียก `skill` tool ด้วย `skill: <selected-skill-name>`
2. ถ้า user เลือกหลาย skills → ยืนยันลำดับกับ user ด้วย `/ask-me` ก่อน แล้วเรียกตามลำดับ
3. ถ้า user ตอบเอง (custom text) → ใช้ `search-skills` หรือ string match กับ `follow-create-*` แล้ว invoke ถ้าตรง
4. ถ้า selected skill สร้าง project/app/CLI ที่ต้อง ship หรือ user ระบุให้ ship → invoke `/ship` หลัง skill ทีเลือกเสร็จ

### 6. Handle Mismatch

> Goal: จัดการกรณีหาหรือ match ไม่เจอ

1. ถ้าไม่พบ skill ทีตรงกับ argument หรือ goal → แสดงรายการ follow-create-* ทั้งหมด
2. ถ้า match ไม่ชัดเจน → ถาม user ยืนยันก่อน invoke
3. ถ้า user ต้องการ skill ทียังไม่มี → รายงานว่าไม่พร้อมใช้และหยุด

## Rules

- ถ้า user ระบุชื่อ skill ตรงต้องส่งต่อทันทีโดยไม่ถามซ้ำ
- ถามทีละชุดไม่เกิน 4 ตัวเลือก (รวม `More...` หรือ `Skip`/`Suggest another`)
- ใช้ description จาก `SKILL.md` frontmatter ของแต่ละ skill
- ไม่เพิ่ม `follow-create-*` ใหม่เองถ้ายังไม่มี
- หลัง user เลือกต้อง invoke skill ด้วย `skill` tool
- ถ้าเลือกหลาย skills ต้องยืนยันลำดับก่อน
- ถ้า user ต้องการ ship ให้ invoke `/ship` หลัง skill ทีเลือกเสร็จ

- ใช้ /follow-create-biome-plugins ถ้าจำเป็น
- ใช้ /follow-create-browser-extensions ถ้าจำเป็น
- ใช้ /follow-create-cli ถ้าจำเป็น
- ใช้ /follow-create-discord-bot ถ้าจำเป็น
- ใช้ /follow-create-elysia-plugin ถ้าจำเป็น
- ใช้ /follow-create-eslint-plugins ถ้าจำเป็น
- ใช้ /follow-create-github-action ถ้าจำเป็น
- ใช้ /follow-create-line-bot ถ้าจำเป็น
- ใช้ /follow-create-nitro-plugin ถ้าจำเป็น
- ใช้ /follow-create-nvim-plugins ถ้าจำเป็น
- ใช้ /follow-create-obsidian-plugin ถ้าจำเป็น
- ใช้ /follow-create-oxlint-plugins ถ้าจำเป็น
- ใช้ /follow-create-raycast-extensions ถ้าจำเป็น
- ใช้ /follow-create-rolldown-plugins ถ้าจำเป็น
- ใช้ /follow-create-rust-cli ถ้าจำเป็น
- ใช้ /follow-create-rust-crate ถ้าจำเป็น
- ใช้ /follow-create-tauri-plugins ถ้าจำเป็น
- ใช้ /follow-create-telegram-bot ถ้าจำเป็น
- ใช้ /follow-create-vite-plugins ถ้าจำเป็น
- ใช้ /follow-create-vitest-plugins ถ้าจำเป็น
- ใช้ /follow-create-vscode-extensions ถ้าจำเป็น
- ใช้ /follow-create-zed-extensions ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น
- ใช้ /update-references ถ้าจำเป็น
- ใช้ /update-test-and-fix ถ้าจำเป็น

## Expected Outcome

- User เห็นรายการ `follow-create-*` skills ทีมีอยู่ทั้งหมด
- User เลือก skill ทีต้องการผ่าน `/ask-me`
- Skill ทีเลือกถูก invoke พร้อม `/ship` ถ้าจำเป็น

