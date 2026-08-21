---
name: update-dependencies-latest
description: อัพเดท dependencies ในทุก workspace ให้เป็น latest version ทั้ง major, minor, patch
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

อัพเดท dependencies ในทุก workspace/package ให้เป็น latest version ทั้งหมด ไม่ว่าจะเป็น major, minor หรือ patch updates

## Scope

อัพเดท dependencies ในทุก workspace และ packages ใน monorepo

## Execute

### 1. Pre-Update Analysis

1. รัน `bunx taze -r` หรือ `npm outdated` เพื่อดู dependencies ที่ต้องอัพเดททั้งหมด
2. แยกตามประเภทการอัพเดท: major, minor, patch
3. ตรวจสอบ breaking changes ที่อาจเกิดขึ้นจาก major updates
4. สร้าง backup หรือ branch ใหม่ก่อนอัพเดท (แนะนำ)

### 2. Update Root Dependencies

1. รัน `bunx taze -w -i` สำหรับ root package.json
2. รัน `bunx taze -r -w -i` สำหรับ recursive update ทุก workspace
3. รัน `bun update --latest` สำหรับ update ทั้งหมดเป็น latest version

### 3. Update Workspace Dependencies

1. รัน `bunx taze -r -w -i` ในแต่ละ workspace folder
2. หรือรัน `bun update --latest` ในแต่ละ package
3. ตรวจสอบว่า peerDependencies ยัง compatible หรือไม่

### 4. Handle Major Version Updates

1. รัน `bunx taze major -w -i` สำหรับ major updates เท่านั้น
2. อ่าน changelogs ของแต่ละ major update
3. ตรวจสอบ migration guides ถ้ามี
4. ทดสอบ breaking changes ด้วยการรัน tests

### 5. Handle Minor/Patch Updates

1. รัน `bunx taze minor -w -i` สำหรับ minor updates
2. รัน `bunx taze patch -w -i` สำหรับ patch updates
3. หรือรัน `bunx taze -w -i` สำหรับทั้ง minor และ patch

### 6. Update Lock File

1. รัน `bun install` เพื่อ update bun.lock file
2. รัน `bun pm cache rm` ถ้าต้องการ clear cache ก่อน install
3. ตรวจสอบว่า lock file ไม่มี conflicts

### 7. Post-Update Verification

1. รัน `bun audit` เพื่อตรวจสอบว่าไม่มี new vulnerabilities
2. รัน `bun run typecheck` เพื่อตรวจสอบ TypeScript errors
3. รัน `bun run lint` เพื่อตรวจสอบ linting issues
4. รัน `bun run test` เพื่อตรวจสอบว่า tests ยังผ่าน

### 8. Version Consistency Check

1. ตรวจสอบว่า dependencies ที่ใช้ในหลาย workspace มี version เดียวกัน
2. อัพเดทให้สอดคล้องกันถ้าจำเป็น
3. ใช้ workspace protocol (`workspace:*`) ถ้าเหมาะสม

## Rules

### 1. Update Strategy

- อัพเดททีละประเภท: patch → minor → major
- ไม่อัพเดททุกอย่างพร้อมกันในครั้งเดียวถ้ามี breaking changes
- แยก commit ตามประเภทการอัพเดท (patch, minor, major)

### 2. Safety First

- สร้าง branch ใหม่ก่อนอัพเดทเสมอ
- รัน tests ก่อนและหลังอัพเดท
- ตรวจสอบ CI/CD pipeline หลังอัพเดท
- มี rollback plan ถ้าอัพเดทไม่สำเร็จ

### 3. Breaking Changes

- อ่าน changelogs ก่อนอัพเดท major versions
- ตรวจสอบ migration guides
- ทดสอบ breaking changes ใน local environment
- ไม่อัพเดท major versions ที่มี breaking changes เยอะในทีเดียว

### 4. Monorepo Handling

- อัพเดท root dependencies ก่อน
- อัพเดท shared dependencies ให้ consistent
- ใช้ workspace protocol เมื่อเหมาะสม
- ตรวจสอบ dependency hoisting หลังอัพเดท

### 5. CLI Commands Reference

| Command | Description |
|---------|-------------|
| `bunx taze -r -w -i` | Taze recursive |
| `bunx taze major -w -i` | Taze major only |
| `bunx taze minor -w -i` | Taze minor only |
| `bunx taze patch -w -i` | Taze patch only |
| `bun update --latest` | Bun update latest |
| `bun update <package>@latest` | Bun update specific |
| `bunx taze -r` | Check outdated |

### 6. Version Range Handling

- ระวัง caret (^) และ tilde (~) ranges
- ตรวจสอบว่า version pinning เหมาะสมหรือไม่
- ใช้ exact versions สำหรับ critical dependencies
- ใช้ ranges สำหรับ dependencies ที่มีการ update บ่อย

### 7. Post-Update Actions

- รัน security audit หลังอัพเดท
- รัน tests ให้ครบทุกประเภท (unit, integration, e2e)
- ตรวจสอบ bundle size ถ้ามีการเพิ่มขึ้นผิดปกติ
- สร้าง PR หรือ commit ที่มีรายละเอียดการอัพเดท

### 8. Automated Updates

- แนะนำการตั้งค่า Renovate หรือ Dependabot
- กำหนด schedule สำหรับ automated updates
- ตั้งค่า auto-merge สำหรับ patch updates ที่ผ่าน tests
- แยก major updates ออกมา review separately

## Expected Outcome

- ทุก dependencies อัพเดทเป็น latest versions (major, minor, patch)
- Lock file อัพเดทและไม่มี conflicts
- Tests ยังผ่านหลังอัพเดท
- ไม่มี security vulnerabilities ใหม่
- รายการอัพเดทที่มีรายละเอียดครบถ้วน (changelogs, breaking changes)
- Version consistency ใน monorepo
