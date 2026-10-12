---
name: follow-tool-gitleaks
description: ตั้งค่าและใช้ gitleaks สแกน secrets ใน git history, staged changes และ working tree
argument-hint: "[scope]"
related:
  - check-secrets
  - follow-monorepo
  - setup-cicd
  - follow-tool-git
  - follow-tool-mise
---

## Goal

ใช้ `gitleaks` ป้องกัน secrets (API keys, tokens, private keys) หลุดเข้า git — scan staged/history + wire เข้า hooks และ CI

## Scope

- ติดตั้ง/ใช้ `gitleaks` CLI, config `.gitleaks.toml`, baseline report
- wire เข้า git hooks (`pre-commit`/`pre-push`) และ CI job
- ไม่ใช่สำหรับจัดเก็บ/โหลด secrets (ใช้ `/check-secrets` ตรวจ env + `fnox`/vault สำหรับ secret management)

- Latest: `gitleaks@v8` line (Gitleaks by Zachary Rice, OSS)
- Docs: https://github.com/gitleaks/gitleaks

## Execute

### 1. Install

> Goal: มี gitleaks binary พร้อมใช้

1. `mise use -g gitleaks` (แนะนำ — ตาม `/follow-tool-mise`) หรือ `winget install Gitleaks.Gitleaks` / `scoop install gitleaks`
2. ตรวจด้วย `gitleaks version`
3. ใน monorepo ใช้ตัวเดียวกันทุก workspace — pin version ใน `mise.toml` หรือ toolchain config

### 2. Scan

> Goal: scan ปัจจุบันและ history

1. Working tree: `gitleaks dir . -v`
2. Staged (ก่อน commit): `gitleaks git --staged --redact`
3. History เต็ม: `gitleaks git . --redact -r gitleaks-report.json`
4. ถ้าเจอ findings เก่าที่ rotate แล้ว → สร้าง baseline: `gitleaks git . -b .gitleaks-baseline.json` แล้ว scan ต่อด้วย `-b .gitleaks-baseline.json`

### 3. Configure `.gitleaks.toml`

> Goal: กฎตรงกับ project

1. เริ่มจาก default config แล้วเพิ่ม `[allowlist]` สำหรับ test fixtures, docs examples, placeholder tokens (`paths`, `regexes`, `commits`)
2. เพิ่ม `[[rules]]` เฉพาะเมื่อมี secret format ของตัวเองที่ default rules ไม่ครอบ
3. commit `.gitleaks.toml` ที่ repo root

### 4. Wire Hooks And CI

> Goal: block secrets ก่อนเข้า remote

1. Git hooks: ใส่ `gitleaks protect --staged --no-banner --redact` ใน pre-commit/pre-push (monorepo นี้ผ่าน `.moon/workspace.yml` `vcs.hooks`)
2. CI: เพิ่ม step `gitleaks git . --redact` หรือ `gitleaks/gitleaks-action@v2`
3. ถ้ามี findings → rotate secret ก่อน แล้วค่อยเพิ่มใน baseline

## Rules

- ห้าม commit secrets เพื่อ "แก้ให้ scan ผ่าน" — rotate ก่อนเสมอ
- `--redact` เสมอใน CI/hooks output เพื่อไม่ให้ secret โผล่ใน logs
- baseline ใช้กับ findings เดิมที่ rotate แล้วเท่านั้น — ห้ามใช้ปิดปัญหาใหม่
- allowlist ต้องแคบที่สุด (path + regex เฉพาะจุด)

## Expected Outcome

- `gitleaks` ติดตั้งและ scan ผ่าน/มี baseline ที่ชัดเจน
- `.gitleaks.toml` committed และ hooks/CI enforce อยู่
