---
name: follow-tool-renovate-setup-renovate
description: ติดตั้ง Renovate — GitHub App หรือ self-hosted workflow พร้อม token
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - follow-tool-github-actions
  - open-web-for-config-secret
---

## Goal

ติดตั้งและเปิดใช้ Renovate บน repository — เลือก hosted GitHub App หรือ self-hosted runner — พร้อม authentication ที่ถูกต้อง

## Scope

ใช้สำหรับ repo ที่ยังไม่มี Renovate — install method, token, workflow trigger. รายละเอียด `renovate.json` อยู่ใน `subskills/config-renovate/SKILL.md`

- ถ้า Renovate รันอยู่แล้ว (มี config + PRs จาก renovate bot) → verify เท่านั้น

## Execute

### 1. Choose Install Method

> Goal: เลือกวิธี deploy Renovate

1. **Mend Renovate GitHub App** — ติดตั้ง app จาก GitHub Marketplace บน repo/org — ไม่ต้อง self-host, config ผ่าน `renovate.json` เท่านั้น
2. **Self-hosted via GitHub Actions** — สร้าง `.github/workflows/renovate.yml` รัน `renovatebot/github-action` — เหมาะเมื่อต้องควบคุม schedule/runner เอง (version ดู parent skill หรือ official docs)
3. Self-hosted แบบอื่น (docker, npm cli) — ดู official docs

### 2. Setup Token (Self-hosted)

> Goal: ตั้งค่า `RENOVATE_TOKEN`

1. ใช้ `/follow-secret-manager` หรือ `/open-web-for-config-secret` สร้าง GitHub PAT ด้วย `repo` scope (สำหรับ private repos)
2. ตั้งเป็น repository secret: `gh secret set RENOVATE_TOKEN` หรือผ่าน GitHub UI
3. ตรวจด้วย `gh secret list`
4. GitHub App method ข้าม step นี้ — app auth เอง

### 3. Create Workflow (Self-hosted)

> Goal: สร้าง workflow รัน Renovate

1. สร้าง `.github/workflows/renovate.yml` ด้วย triggers `schedule` (cron เช่น `0 2 * * *`) + `workflow_dispatch`
2. ตั้ง permissions `contents: write`, `pull-requests: write`, `issues: write`
3. ใช้ `renovatebot/github-action` พร้อม `RENOVATE_TOKEN` — ถ้ารันหลาย repo ระบุ `repositories` ใน config หรือ env
4. ไม่ตั้ง `RENOVATE_AUTODISCOVER`/`RENOVATE_AUTODISCOVER_FILTER` เมื่อระบุ `repositories` แล้ว

### 4. Minimal Config

> Goal: สร้าง config ขั้นต่ำให้ Renovate ทำงาน

1. สร้าง `.github/renovate.json` (หรือ `renovate.json` ที่ root) พร้อม `$schema` และ `extends: ["config:base"]`
2. รายละเอียด presets/packageRules/automerge ทำต่อใน `subskills/config-renovate/SKILL.md`

### 5. Verify

> Goal: ยืนยัน Renovate ทำงาน

1. Validate config: `bunx -- renovate-config-validator .github/renovate.json`
2. Self-hosted: trigger `workflow_dispatch` แล้วดู run logs — ต้อง scan repo สำเร็จ
3. GitHub App: รอ onboarding PR (`Configure Renovate`) — merge เพื่อ activate
4. ถ้า fail จาก token/permissions → แก้แล้ว rerun (max 3 รอบ) แล้ว report

## Rules

### 1. Method Choice

- prefer GitHub App ถ้าไม่มีเหตุผล self-host — ลด maintenance
- self-hosted ต้องมี schedule + `workflow_dispatch` เสมอ

### 2. Token

- `RENOVATE_TOKEN` เป็น repository secret เท่านั้น ห้าม commit
- PAT `repo` scope สำหรับ private repos

### 3. Common Pitfalls

- ลืม `RENOVATE_TOKEN` → workflow fail
- ลืม permissions `contents/pull-requests/issues: write`
- ห้ามใช้ `--frozen-lockfile` ใน install step — Renovate ต้อง update lockfile ได้

- ใช้ /follow-tool-github-actions ถ้าจำเป็น
- ใช้ /follow-secret-manager ถ้าจำเป็น

## Expected Outcome

- Renovate active บน repo (app หรือ self-hosted workflow)
- Token/permissions ถูกต้อง — run ไม่ fail
- Config ผ่าน `renovate-config-validator`
