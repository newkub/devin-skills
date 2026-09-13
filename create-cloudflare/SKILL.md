---
name: create-cloudflare
description: สร้าง Cloudflare resources — worker, deploy button, API token ผ่าน subskills
argument-hint: "[domain]"
related:
  - follow-service-cloudflare
  - deploy-to-cloudflare
  - use-wrangler
  - follow-secret-manager
  - ask-me
---

## Goal

Dispatch ไป subskill ตาม Cloudflare resource ที่ต้องสร้าง — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: create-cloudflare-worker, create-cloudflare-deploy-button, create-cloudflare-token)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `worker` | `subskills/worker/SKILL.md` — scaffold Worker ใหม่ |
| `deploy-button` | `subskills/deploy-button/SKILL.md` — สร้าง deploy-to-Cloudflare button |
| `token` | `subskills/token/SKILL.md` — สร้าง API token ด้วย scope ที่เหมาะ |

1. ระบุ domain จาก argument (เช่น `/create-cloudflare worker`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- credentials/token ใหม่ต้องผ่าน `/follow-secret-manager` — ห้าม commit

- ใช้ /follow-service-cloudflare ถ้าจำเป็น
- ใช้ /deploy-to-cloudflare ถ้าจำเป็น
- ใช้ /use-wrangler ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง domain แล้วสร้าง resource ตาม flow นั้น
