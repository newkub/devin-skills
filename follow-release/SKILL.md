---
name: follow-release
description: เลือกและตั้งค่า release strategy สำหรับ project ครอบคลุมทุก platform
---

## Goal

เลือกและตั้งค่า release strategy ที่เหมาะสมกับ project ครอบคลุม npm, crates, Docker, VSCode, preview และ monorepo versioning

## Scope

ใช้เมื่อ project ต้อง release ไปยัง external platforms หรือต้องจัดการ versioning, changelog และ preview releases

## Execute

### 1. Detect Release Targets
> Goal: ระบุ platforms ที project จะ release

1. อ่าน `package.json` ตรวจสอบ `private`, `publisher`, `workspaces`
2. อ่าน `Cargo.toml` ถ้ามี Rust crate
3. อ่าน `Dockerfile` ถ้ามี container image
4. อ่าน `package.json` ตรวจสอบ `publisher` สำหรับ VS Code extension
5. ถาม user ถ้าไม่แน่ใจว่าต้องการ release แบบไหน

### 2. Choose Release Strategy
> Goal: เลือก strategy ทีเหมาะสม

ถ้าต้องการ release ไปยัง platform จริง:
- npm/bun: ทำ `/follow-auto-it` สำหรับ conventional commits และ auto release
- npm: ทำ `/follow-release-npm` สำหรับ release ไป npm
- Rust: ทำ `/follow-release-crates`
- Docker: ทำ `/follow-release-docker`
- VS Code: ทำ `/follow-release-vscode`
- semantic-release: ทำ `/follow-semantic-release`

ถ้าต้องการ preview ทุก PR/commit:
- ทำ `/follow-pkg-new` สำหรับ continuous preview releases

ถ้าต้องการ versioning/changelog ใน monorepo:
- ทำ `/follow-changesets` สำหรับ manage versioning และ changelogs

### 3. Combine Changesets and pkg.pr.new
> Goal: ใช้งานคู่กันได้อย่างปลอดภัย

- ใช้ `pkg.pr.new` สำหรับ preview ทุก PR/Commit โดยไม่กระทบ npm
- ใช้ `Changesets` เมื่อ merge เข้า main เพื่อ release จริงลง npm
- ถ้าต้องการ snapshot release ด้วย Changesets เพิ่ม script:
  ```json
  {
    "scripts": {
      "release:snapshot": "changeset version --snapshot canary && changeset publish --tag canary"
    }
  }
  ```

### 4. Compare Preview Options
> Goal: เลือก preview release tool ทีถูกต้อง

| คุณสมบัติ | `Changesets Snapshot` | `pkg.pr.new` |
| --- | --- | --- |
| ที่เก็บแพ็กเกจ | Publish ลง `npm Registry` จริง | ฝากไว้บน `CDN` ของ StackBlitz |
| วิธีติดตั้ง | `bun add package-name@0.0.0-snapshot-...` | `bun add https://pkg.pr.new/owner/repo` |
| ความสะอาด | เปรอะ `version history` บน npm | ไม่กระทบ `npm Registry` |
| การตั้งค่า | ต้องมี `NPM_TOKEN` และ Snapshot script | Zero Config ไม่ต้องใช้ Token |

### 5. Run Release
> Goal: Release ให้สำเร็จ

1. ตรวจสอบ tokens/permissions ก่อน release
2. ทำ `/run-release` สำหรับ multi-platform release อัตโนมัติ
3. ตรวจสอบ tags, changelogs และ published artifacts

## Rules

### 1. Strategy Selection
- ใช้ `pkg.pr.new` สำหรับ preview ทุก Commit/PR
- ใช้ `Changesets` สำหรับ release จริงและ changelog
- ใช้ `semantic-release` หรือ `auto` สำหรับ conventional commit based release

### 2. Best Practices
- แยก workflow preview กับ release จริง
- ไม่ publish preview ลง npm จริงโดยไม่ตั้งใจ
- ตรวจสอบ `NPM_TOKEN`, `CARGO_REGISTRY_TOKEN`, `VSCE_PAT`, `DOCKER_PASSWORD` ก่อนรัน

### 3. Safety
- ใช้ `Changesets Snapshot` ต้องระวัง `version history` เปรอะ
- `pkg.pr.new` เหมาะกับ PR preview ไม่กระทบ npm Registry
- นิยมใช้ `pkg.pr.new` คู่กับ `Changesets` สำหรับ preview ก่อน release จริง

## Expected Outcome

- Release strategy เหมาะสมกับ project
- Tools ติดตั้งและตั้งค่าถูกต้อง
- Preview และ release จริงทำงานตาม flow
- ไม่มี conflict ระหว่าง snapshot และ official versions
