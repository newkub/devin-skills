---
name: follow-tool-renovate-json
description: เขียนและตรวจ renovate.json config สำหรับ Renovate bot auto update dependencies
related:
  - follow-tool-renovate
  - follow-tool-agent-browser
  - follow-tool-ast-grep
  - follow-tool-usage
  - follow-best-practice
  - setup-cicd
---

## Goal

เขียน `renovate.json` ให้ถูกต้องตาม Renovate JSON schema และ project requirements

## Scope

ใช้สำหรับสร้าง แก้ไข หรือตรวจ `renovate.json`/`renovate.jsonc`/`.github/renovate.json` และไฟล์ config ที่เกี่ยวข้อง

## Execute

### 0. Setup

> Goal: ติดตั้งหรือเชื่อมต่อ Renovate

1. เลือกวิธีติดตั้ง:
   - GitHub App: ติดตั้ง Mend Renovate จาก GitHub Marketplace (ไม่ต้อง self-host)
   - Self-hosted CLI: `mise use -g npm:renovate` หรือ `bun add -g renovate`
2. ตั้งค่า token:
   - `RENOVATE_TOKEN` environment variable
   - หรือ `--token=` ใน CLI
   - หรือ `token` ใน `config.js`
3. Verify CLI: `renovate --version`
4. ถ้าต้อง dry-run: `renovate --dry-run --platform github --repositories owner/repo`
5. ถ้าติดตั้งไม่สำเร็จ → ใช้ `/research-setup renovate`

### 1. Check Existing Config

> Goal: ตรวจสอบ config ที่มีอยู่เพื่อหลีกเลี่ยงการซ้ำ

1. ค้นหาไฟล์ config ที่มีอยู่: `renovate.json`, `renovate.jsonc`, `renovate.json5`, `.github/renovate.json`, `.gitlab/renovate.json`, `.renovaterc`, `.renovaterc.json`, `package.json` (ใน `renovate` section)
2. ถ้ามีหลายไฟล์ → Renovate ใช้ไฟล์แรกที่เจอ และ ignore ไฟล์อื่น → แจ้ง user ให้เลือกไฟล์เดียว
3. ถ้าไม่มี → สร้าง `renovate.json` ที่ root ของ repository

### 2. Write Config

> Goal: เขียน renovate.json ตาม schema และ project requirements

1. เพิ่ม `$schema` สำหรับ editor autocomplete: `"$schema": "https://docs.renovatebot.com/renovate-schema.json"`
2. ใช้ `extends` สำหรับ base presets เช่น `config:best-practices`, `config:recommended`, `:dependencyDashboard`
3. ตั้งค่า `schedule` สำหรับกำหนดเวลา update เช่น `["every weekend"]`, `["after 10pm every weekday"]`
4. ตั้งค่า `packageRules` สำหรับกำหนดกฎเฉพาะ package เช่น automerge patch, group minor, ignore major
5. ตั้งค่า `automerge` และ `automergeType` (`branch` หรือ `pr`) สำหรับ merge อัตโนมัติ
6. ใช้ `vulnerabilityAlerts.enabled: true` สำหรับ security updates

### 3. Validate Config

> Goal: ตรวจสอบ config ผ่าน renovate-config-validator

1. รัน `bunx -- renovate-config-validator renovate.json` เพื่อ validate
2. ตรวจ `extends` ว่า preset มีอยู่จริง
3. ตรวจ `packageRules` ว่า matchers ถูกต้อง (`matchPackageNames`, `matchPackagePatterns`, `matchManagers`, `matchDepTypes`)
4. ตรวจ `schedule` ว่าใช้ syntax ที่ถูกต้องตาม later library

### 4. Common Patterns

> Goal: ใช้ patterns สำหรับ monorepo, Docker และ GitHub Actions

1. สำหรับ monorepo → ใช้ `detectMonorepos: true` และ `updateInternalDeps: true`
2. สำหรับ npm → ใช้ `npmrc` สำหรับ custom registry
3. สำหรับ Docker → ใช้ `dockerfile` manager และ `pinDigests: true`
4. สำหรับ GitHub Actions → ใช้ `github-actions` manager
5. สำหรับ lockfile maintenance → ใช้ `lockfileMaintenance.enabled: true`

## Rules

### 1. File Location Priority

Renovate ค้นหา config ตามลำดับนี้:
- `renovate.json` → `renovate.jsonc` → `renovate.json5`
- `.github/renovate.json` → `.github/renovate.jsonc` → `.github/renovate.json5`
- `.gitlab/renovate.json` → `.gitlab/renovate.jsonc` → `.gitlab/renovate.json5`
- `.renovaterc` → `.renovaterc.json` → `.renovaterc.jsonc` → `.renovaterc.json5`
- `package.json` (ใน `renovate` section)

### 2. Format Recommendations

- ใช้ `.jsonc` แทน `.json5` เมื่อต้องการ comments
- ใช้ `.json` สำหรับ config ง่าย ไม่มี comments
- ใช้ `$schema` เสมอเพื่อ editor autocomplete และ validation

### 3. Validation

- รัน `renovate-config-validator` ก่อน commit
- ตรวจ `extends` ว่า preset มีอยู่จริง
- ตรวจ `packageRules` ว่า matchers ถูกต้อง

- ใช้ /follow-tool-renovate ถ้าจำเป็น
- ใช้ /follow-tool-agent-browser ถ้าจำเป็น
- ใช้ /follow-tool-ast-grep ถ้าจำเป็น
- ใช้ /follow-tool-usage ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- `renovate.json` ถูกต้องตาม schema
- Config ผ่าน `renovate-config-validator`
- ใช้ presets ที่มีอยู่จริง
- ไม่มี config ซ้ำซ้อนในหลายไฟล์
