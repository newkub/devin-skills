---
name: check-secrets
description: ตรวจ secrets hygiene — env vars, hardcoded values และ secrets leak ผ่าน workflows
argument-hint: "[domain]"
related:
  - follow-secret-manager
  - deep-review
  - report
  - ask-me

---

## Goal

Dispatch ไป workflow ตาม domain ของ secrets check — parent ทำ routing เท่านั้น

## Scope

- argument คือ domain; ถ้าไม่ระบุ → `/ask-me` เลือก domain

## Execute

### Workflows

| Domain | Workflow |
|---|---|
| `env-vars` | `workflows/env-vars/SKILL.md` — เทียบ `.env` vs `.env.example` vs code usage |
| `hardcoded-values` | `workflows/hardcoded-values/SKILL.md` — ค่า hardcoded ที่ควรย้ายไป config/env |
| `secrets-leak` | `workflows/secrets-leak/SKILL.md` — secrets หลุดใน code/config/history |
| `report`, `inventory` | `workflows/report-inventory/SKILL.md` — secrets inventory report พร้อม redaction |

1. ระบุ domain จาก argument (เช่น `/check-secrets secrets-leak`)
2. ถ้า domain รองรับ → ทำตาม `workflows/<domain>/SKILL.md` ทั้ง flow
3. ถ้าไม่ระบุหรือไม่รู้จัก domain → `/ask-me` เลือก domain

## Rules

- parent ทำ dispatch เท่านั้น — ห้าม duplicate workflow ของ workflow
- secrets ที่พบห้าม echo ค่าจริง — report เฉพาะ location + type

- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น

## Expected Outcome

- caller ถูก dispatch ไป workflow ที่ตรง domain แล้วทำ secrets check ตาม flow นั้น
