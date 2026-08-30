---
name: review-devin-global-subagents
description: ตรวจสอบ subagent ก่อน update-devin-global-subagents แก้ไข ครอบคลุม format
---

## Goal

Review devin subagents ก่อนเรียก `update-devin-global-subagents` เพื่อยืนยันว่า `AGENT.md` ผ่านเกณฑ์มาตรฐาน: frontmatter, sections, line count, style, และ safety

## Scope

ใช้ก่อนเรียก `update-devin-global-subagents` — ตรวจ subagent ใน `%APPDATA%\devin\agents` ทำ review เท่านั้น ไม่แก้ไข subagents ระหว่าง review

## Execute

### 1. Prepare Context
ทำตาม [references/prepare-context.md](references/prepare-context.md)

### 2. Check Frontmatter
ทำตาม [references/frontmatter.md](references/frontmatter.md)

### 3. Check Sections
ทำตาม [references/sections.md](references/sections.md)

### 4. Check Style
ทำตาม [references/style.md](references/style.md)

### 5. Check Safety
ทำตาม [references/safety.md](references/safety.md)

### 6. Score And Report
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) แล้วทำ `/report-table` และ `/suggest-next-action`

## Rules

- ทำ review เท่านั้น ไม่แก้ไข subagents ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `update-devin-global-subagents` หลัง review
- ทุก finding ต้องมี file path และ evidence
- ใช้ `Critical / High / Medium / Low / Info` สำหรับ severity
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis

## Expected Outcome

- รายงาน Subagent Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence และ action
- ยืนยัน frontmatter, sections, line count, style, safety ครบถ้วน
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
