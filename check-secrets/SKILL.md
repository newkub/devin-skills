---
name: check-secrets
description: ตรวจ secrets hygiene — env vars, hardcoded values และ secrets leak ผ่าน subskills
argument-hint: "[domain]"
related:
  - follow-secret-manager
  - review-security
  - report
  - ask-me
---

## Goal

Dispatch ไป subskill ตาม domain ของ secrets check — parent ทำ routing เท่านั้น

## Scope

- รวม capability ของ skills ที่ถูก merge เข้ามา (merged from: check-env-vars, check-hardcoded-values, check-secrets-leak)
- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Subskills

| Domain | Subskill |
|---|---|
| `env-vars` | `subskills/env-vars/SKILL.md` — เทียบ `.env` vs `.env.example` vs code usage |
| `hardcoded-values` | `subskills/hardcoded-values/SKILL.md` — ค่า hardcoded ที่ควรย้ายไป config/env |
| `secrets-leak` | `subskills/secrets-leak/SKILL.md` — secrets หลุดใน code/config/history |

1. ระบุ domain จาก argument (เช่น `/check-secrets secrets-leak`)
2. ถ้า domain รองรับ → ทำตาม `subskills/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ subskill
- secrets ที่พบห้าม echo ค่าจริง — report เฉพาะ location + type

- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป subskill ที่ตรง domain แล้วทำ secrets check ตาม flow นั้น
