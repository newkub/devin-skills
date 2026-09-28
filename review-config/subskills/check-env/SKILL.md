---
name: review-config-check-env
description: Check env vars — .env.example parity, required vars, prefix rules, secret leaks
argument-hint: "[scope]"
related:
  - review-config
  - check-config-drift
  - check-secrets
  - report
---

## Goal

Run the env-vars dimension of `/review-config` แบบ focused — env surface ครบ มี validation และไม่ leak

## Scope

- ใช้เมื่อ `/review-config` dispatch มาที่ `env`/`env-vars` หรือเรียก standalone
- ครอบคลุม: `.env.example` parity, required vars, client/server prefix rules, defaults, secret handling

## Execute

### 1. Env Checks

> Goal: env contract ชัดและ enforce ได้ — parent Execute (env section)

ทำตาม `../../references/config-checks.md`

1. parity — vars ที่ code ใช้ (`process.env.*`, `import.meta.env.*`) ↔ `.env.example` เทียบกัน
2. required vs optional — missing-var behavior ชัด (fail-fast vs silent default)
3. prefixes — server-only secrets ห้ามมี `NEXT_PUBLIC_`/`VITE_`/client prefix
4. drift — env files ข้าม environments ต่างกันอย่างไม่ตั้งใจ → `/check-config-drift`
5. secrets — values จริงใน `.env.example`/committed files → `/check-secrets`

### 2. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Variable`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ `../setup-env-validation/SKILL.md`
- ทุก finding มี evidence: usage site + env file line
- committed secret / client-exposed server var = Critical; missing example entry = Medium
- ห้ามคัดลอก secret values ลง report — ระบุ location เท่านั้น

## Expected Outcome

- Env parity findings + prefix violations + secret-leak flags
- Missing-var behavior gaps พร้อม affected vars
