---
name: follow-release-deploy-vscode-marketplace
description: Publish VS Code extension ไป Marketplace ด้วย vsce — package, publish, verify
argument-hint: "[version-bump]"
related:
  - run-release
  - run-check
  - follow-secret-manager
  - open-web-for-config-secret
  - resolve-errors
  - learn
---

## Goal

Publish VS Code extension ไปยัง Marketplace ด้วย `vsce` — metadata ครบ, auth พร้อม, publish แล้ว verify บน Marketplace

## Scope

- ครอบคลุม: manual publish ด้วย `@vscode/vsce` — metadata, PAT auth, package, publish, verify
- CI automation → ทำตาม parent `/follow-release` Step 5
- หมายเหตุ: package เดิม `vsce` rename เป็น `@vscode/vsce`

## Execute

### 1. Verify Extension Metadata

> Goal: `package.json` พร้อม publish

1. ตรวจ required fields: `publisher`, `name`, `version`, `displayName`, `description`, `engines.vscode`
2. ตรวจ recommended fields: `repository`, `icon`, `categories`, `keywords`, `license`
3. ตรวจ `.vscodeignore` exclude dev files ออกจาก package

### 2. Setup vsce And Auth

> Goal: `vsce` ใช้งานได้และ authenticated

1. ติดตั้ง `bun add -D @vscode/vsce` แล้วใช้ `bunx vsce`
2. สร้าง publisher บน Marketplace (ถ้ายังไม่มี) — ใช้ `/open-web-for-config-secret` เปิดหน้า manage
3. สร้าง PAT จาก Azure DevOps (scope Marketplace → Manage) เก็บเป็น `VSCE_PAT` ผ่าน `/follow-secret-manager`
4. `vsce login <publisher>` หรือใช้ `vsce publish -p <PAT>` สำหรับ non-interactive/CI

### 3. Package And Check

> Goal: `.vsix` ถูกต้องก่อน publish

1. ทำ `/run-check` — tests/typecheck ผ่าน
2. รัน `vsce package` เพื่อสร้าง `.vsix` แล้วตรวจ contents/warnings
3. ตรวจ version bump ถูกต้องตาม semver — `vsce publish` bump ให้ได้ (เช่น `vsce publish minor`) ถ้าไม่แน่ใจดู official docs

### 4. Publish

> Goal: extension ขึ้น Marketplace

1. รัน `vsce publish` (ระบุ bump ใน command ได้)
2. หรือ `vsce publish -p <PAT>` สำหรับ non-interactive
3. เก็บ version ที่ publish

### 5. Post-Publish Verify

> Goal: extension install ได้จาก Marketplace

1. เช็คหน้า extension บน Marketplace (propagation อาจใช้เวลาสั้นๆ)
2. verify install: ค้นหาใน VS Code Extensions view หรือ `code --install-extension <publisher>.<name>`
3. ถ้า publish ผิด → `vsce unpublish <publisher>.<name>` (destructive — เฉพาะฉุกเฉินและต้อง user confirm) แล้ว `/resolve-errors`
4. สำเร็จ → report version แล้วทำ `/run-release` ถ้า parent ต้องการ multi-platform release

## Rules

### 1. Unpublish Is Destructive

- `vsce unpublish` ลบ extension ออกจาก Marketplace — ใช้เฉพาะฉุกเฉินและต้อง user confirm
- version ที่ publish แล้วให้ bump ใหม่แทนการ unpublish ถ้าแก้ไขได้

### 2. Token Safety

- `VSCE_PAT` ผ่าน `/follow-secret-manager` เท่านั้น — ห้าม commit หรือใส่ใน scripts

### 3. Docs First

- flags/features ใหม่ของ `@vscode/vsce` → ดู official docs ผ่าน `/learn-from-references` แทนการเดา

## Expected Outcome

- extension publish บน Marketplace ด้วย version ใหม่
- install ได้จริงจาก Marketplace
