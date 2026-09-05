---
name: follow-tool-renovate
description: ตั้งค่า Renovate สำหรับ auto update dependencies ผ่าน GitHub Actions
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-tool-renovate-json
  - follow-tool-github-actions
  - follow-tool-pkg-new
  - follow-tool-release-it
  - follow-tool-semantic-release
---

## Goal

ตั้งค่า Renovate เพื่ออัปเดต dependencies อัตโนมัติผ่าน GitHub Actions

## Scope

ใช้สำหรับ repositories บน GitHub ที่ต้องการ dependency updates, schedule, automerge และ PR management

## Execute

### 1. Configure Renovate

> Goal: สร้าง renovate config ที project

1. สร้าง `.github/renovate.json`
2. ใช้ `"$schema": "https://docs.renovatebot.com/renovate-schema.json"`
3. ตั้ง `extends` เป็น `["config:base"]`
4. ตั้ง `schedule` เช่น `["every day"]`
5. ตั้ง `automerge: true` สำหรับ `dependencies` และ `devDependencies` ผ่าน `packageRules`
6. ตั้ง `docker: false` และ `"platform": "github"` ถ้าใช้ self-hosted
7. ดูรายละเอียดใน [references/renovate.md](references/renovate.md)

### 2. Create Workflow

> Goal: สร้าง GitHub Actions workflow สำหรับรัน Renovate

1. สร้าง `.github/workflows/renovate.yml`
2. ตั้งค่า `cron` รันเวลา `0 2 * * *`
3. เพิ่ม `workflow_dispatch` สำหรับ manual trigger
4. กำหนด permissions `contents: write`, `pull-requests: write`, `issues: write`
5. ใช้ `renovatebot/github-action@v39.2.4` หรือ version ล่าสุด
6. ดูรายละเอียดใน [references/renovate.md](references/renovate.md)

### 3. Setup Token

> Goal: ตั้งค่า `RENOVATE_TOKEN` สำหรับ authentication

1. ใช้ `/follow-secret-manager` เพื่อจัดการ `RENOVATE_TOKEN` หรือ `/open-web-for-config-secret` เพื่อเปิดหน้าสร้าง GitHub PAT ด้วย `repo` scope
2. ตั้งค่า secret ใน repository โดย user เอง หรือใช้ `gh secret set RENOVATE_TOKEN -b "token"`
3. ตรวจสอบ secret ด้วย `gh secret list` หรือ secret manager dashboard
4. ดูรายละเอียดใน [references/renovate.md](references/renovate.md)

### 4. Validate Config

> Goal: ตรวจสอบว่า renovate config ถูกต้อง

1. รัน `bunx -- renovate-config-validator .github/renovate.json`
2. ตรวจ `extends` ว่า preset มีอยู่จริง
3. ตรวจ `packageRules` matchers ว่าถูกต้อง
4. ดูรายละเอียดใน [references/renovate.md](references/renovate.md)

### 5. Monitor Pull Requests

> Goal: ติดตาม PRs ที Renovate สร้าง

1. ตรวจ PRs ทีถูกสร้างตาม schedule
2. ตรวจสอบ `automerge` ว่า merge ผ่านหรือต้อง review
3. ปรับ `packageRules` เมื่อมี deps ทีไม่ต้องการ auto update
4. ดูรายละเอียดใน [references/renovate.md](references/renovate.md)

## Rules

### 1. Config

- ใช้ `config:base` เป็น base config
- ตั้ง `docker: false` เพื่อปิด Docker updates
- ใช้ `"platform": "github"` สำหรับ GitHub repositories
- ระบุ `repositories: ["owner/repo"]` ถ้าใช้ self-hosted
- ใช้ `schedule` ทีชัดเจน

### 2. Workflow

- ใช้ `cron: "0 2 * * *"` สำหรับรันทุกวัน
- ตั้งค่า permissions `contents`, `pull-requests`, `issues` เป็น `write`
- ใช้ `bun install --ignore-scripts` หรือ package manager ของ project
- ไม่ตั้งค่า `RENOVATE_AUTODISCOVER` หรือ `RENOVATE_AUTODISCOVER_FILTER` เมื่อระบุ `repositories`

### 3. Token

- ใช้ PAT ด้วย `repo` scope สำหรับ private repos
- ตั้งค่า `RENOVATE_TOKEN` เป็น repository secret
- ใช้ `/follow-secret-manager` เพื่อจัดการ `RENOVATE_TOKEN` หรือ `/open-web-for-config-secret` เพื่อเปิดหน้าสร้าง token
- ใช้ `gh secret set` หรือ GitHub UI สำหรับตั้งค่า

### 4. Common Mistakes

- ไม่ตั้งค่า `RENOVATE_TOKEN` ทำให้ workflow fail
- ใช้ `config:recommended` อาจทำให้เกิด Node.js version check ทีไม่ต้องการ
- ลืมตั้งค่า permissions ใน workflow
- ใช้ `--frozen-lockfile` ทำให้ Renovate ไม่สามารถ update lockfile ได้

- ใช้ /follow-tool-renovate-json ถ้าจำเป็น
- ใช้ /follow-tool-github-actions ถ้าจำเป็น
- ใช้ /follow-tool-pkg-new ถ้าจำเป็น
- ใช้ /follow-tool-release-it ถ้าจำเป็น
- ใช้ /follow-tool-semantic-release ถ้าจำเป็น

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Renovate รันทุกวันหรือ manual trigger
- Dependencies อัปเดตอัตโนมัติและ automerge ตาม rules
- PRs สร้างขึ้นสำหรับ dependency updates
- Lock files อัปเดตอัตโนมัติ
- Workflow ไม่ fail จาก token หรือ permissions
