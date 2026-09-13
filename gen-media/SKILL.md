---
name: gen-media
description: สร้าง media ด้วย AI — images, videos, character consistency, 3D models ผ่าน subskills
argument-hint: "[domain]"
related:
  - generate-prompt-from-image
  - draw-svg-image
  - convert
  - ask-me
  - report
---

## Goal

Dispatch ไป subskill ตาม media domain — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: gen-ai-images, gen-ai-videos, gen-image-character, gen-3d-model)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `ai-images` | `subskills/ai-images/SKILL.md` — สร้างรูปภาพด้วย AI ผ่าน bunx CLI |
| `ai-videos` | `subskills/ai-videos/SKILL.md` — สร้างวิดีโอด้วย AI ผ่าน bunx CLI |
| `image-character` | `subskills/image-character/SKILL.md` — สร้าง character ที่ consistency |
| `3d-model` | `subskills/3d-model/SKILL.md` — สร้าง 3D model จาก prompt ด้วย AI CLI |

1. ระบุ domain จาก argument (เช่น `/gen-media ai-images`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- ทุก prompt ที่สร้างต้อง confirm output path ก่อน generate

- ใช้ /generate-prompt-from-image ถ้าจำเป็น
- ใช้ /draw-svg-image ถ้าจำเป็น
- ใช้ /convert ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง domain แล้วสร้าง media ตาม flow นั้น
