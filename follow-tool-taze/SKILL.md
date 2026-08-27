---
name: follow-tool-taze
description: ใช้ Taze สำหรับจัดการ dependencies อัตโนมัติใน projects และ monorepos
related:
  - follow-tool-turborepo
  - follow-monorepo
  - follow-package-manifest
  - follow-tool-semantic-release
---

## Goal

ใช้ Taze สำหรับตรวจสอบและอัปเดท dependencies อัตโนมัติ ทั้ง single project และ monorepo

## Scope

ใช้สำหรับ projects หรือ workspaces ที่ต้องการ keep dependencies up-to-date โดยใช้ Taze CLI

## Execute

### 1. Run Taze

> Goal: ตรวจสอบ updates เริ่มต้น

1. รัน `bunx taze` เพื่อ scan dependencies
2. ใช้ `bunx taze major|minor|patch|latest` ตาม mode ทีต้องการ
3. ใช้ `bunx taze --json` สำหรับ machine-readable output
4. ดูรายละเอียด options ใน [references/taze.md](references/taze.md)

### 2. Configure Update Behavior

> Goal: กำหนด mode และ scope ของการ update

1. ใช้ `-r` สำหรับ recursive scan ใน monorepo
2. ใช้ `-w` เพื่อ write ลง `package.json`
3. ใช้ `-i` เพื่อ install dependencies หลัง bump
4. ใช้ `-I` สำหรับ interactive mode
5. รัน `bunx taze latest -r -w -i` ถ้าต้องการ update ทั้งหมด

### 3. Add to Package Scripts

> Goal: ทำให้ Taze รันอัตโนมัติ

1. เพิ่ม `prepare` script ใน `package.json`: `"prepare": "bunx taze latest -w -r -i"`
2. ตรวจสอบว่า `prepare` ไม่ break CI
3. ใช้ `pre-commit` hook ถ้า prefer แทน `prepare`
4. ดู package scripts example ใน [references/taze.md](references/taze.md)

### 4. Advanced Configuration

> Goal: ปรับแต่ง Taze config สำหรับ project

1. สร้าง `taze.config.ts` ถ้าต้องการ config ซับซ้อน
2. กำหนด `exclude`, `include`, `packageMode`, `depFields`
3. ตั้งค่า `ignorePaths` สำหรับ `package.json` lookup
4. ใช้ `maturityPeriodExclude` เพื่อยกเว้น packages บางตัว

### 5. Validate Updates

> Goal: ตรวจสอบว่า updates ไม่พัง project

1. รัน `bun install` หลัง write
2. รัน `bun run test` เพื่อตรวจสอบ
3. รัน `bun run lint` และ `bun run typecheck`
4. ตรวจสอบ `package.json` diff ก่อน commit

## Rules

### 1. Usage

- ใช้ `bunx taze` สำหรับ one-off runs
- ใช้ `-r -w -i` สำหรับ monorepo updates
- ใช้ `--json` สำหรับ agents และ CI

### 2. Configuration

- สร้าง `taze.config.ts` ถ้ามี package-specific rules
- ใช้ `exclude` สำหรับ packages ที่ไม่ต้องการ update
- ระบุ `packageMode` สำหรับ packages ที่ต้องการ mode พิเศษ

### 3. Safety

- ตรวจสอบ diff ก่อน commit
- รัน tests หลัง update
- ไม่ update dependencies ใน production branch โดยไม่ review

### 4. Monorepo

- ใช้ `-r` สำหรับ scan ทุก workspace
- ใช้ `ignoreOtherWorkspaces` ถ้าจำเป็น
- ตรวจสอบ compatibility ข้าม workspace

## Expected Outcome

- Dependencies อัปเดทอัตโนมัติ
- `package.json` scripts พร้อมใช้
- Updates ผ่าน tests และ lint
- Monorepo จัดการ dependencies ได้
