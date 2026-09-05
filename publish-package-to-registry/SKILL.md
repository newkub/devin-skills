---
name: publish-package-to-registry
description: Auto-detect registry แล้ว publish package ไปยัง npm, crates.io, GitHub Packages หรือ registry อืน
related:
  - follow-secret-manager
  - run-release
  - run-verify
  - gen-changelog-md
  - follow-runtime-bun
  - list-my-npm-packages
  - use-my-packages-on-registry
  - ship
  - ask-me
  - watch-release
  - follow-tool-release-it
  - follow-tool-semantic-release
  - follow-tool-changelogen
  - follow-tool-changesets
  - check-backward-compatibility
---

## Goal

Auto-detect registry จาก project manifest แล้ว publish package ไปยัง npm, crates.io, GitHub Packages หรือ registry ที่กำหนด

## Scope

ใช้สำหรับ publish package หนึ่ง package ไปยัง registry ที่ detect ได้จาก project files

## Execute

### 1. Detect Registry

> Goal: ระบุ registry และ package manager ของ project

1. อ่าน `package.json` → npm/bun registry (default) หรือ GitHub npm registry ถ้า `publishConfig.registry` ชี้ `npm.pkg.github.com`
2. อ่าน `Cargo.toml` → crates.io
3. อ่าน `pyproject.toml` → PyPI
4. อ่าน `Dockerfile` หรือ `docker-compose.yml` → GitHub Container Registry (`ghcr.io`) ถ้า image tag ขึ้นต้น `ghcr.io/` หรือมี `.github/workflows` ที push package
5. ถ้า `package.json` มี `private: true` → ไม่ publish ยกเว้น user confirm
6. ถ้า detect ไม่ได้หรือหลาย registry → ทำ `/ask-me`

### 2. Verify

> Goal: ตรวจสอบคุณภาพก่อน publish

1. ทำ `/run-verify`
2. ตรวจสอบ version ถูกต้องตาม semver
3. ทำ `/gen-changelog-md` หรือตรวจสอบ `CHANGELOG.md`
4. ตรวจสอบ authentication:
   - npm: `npm whoami`
   - cargo: `cargo login` หรือ `CARGO_REGISTRY_TOKEN`
   - python: `twine check` + token
   - GitHub Packages npm: `npm ping --registry https://npm.pkg.github.com` ด้วย `GITHUB_TOKEN` หรือ `NODE_AUTH_TOKEN`
   - GitHub Container Registry (ghcr.io): `echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin`

### 3. Build

> Goal: Build package ก่อน publish

1. npm/bun: `bun run build` หรือ `npm run build`
2. cargo: `cargo build --release`
3. python: `python -m build`
4. GitHub Container Registry: `docker build -t ghcr.io/OWNER/IMAGE:VERSION .`
5. ถ้า build ไม่ผ่าน → แก้ไขก่อน publish

### 4. Dry Run

> Goal: ทดสอบ publish ก่อนของจริง

1. npm/bun: `npm publish --dry-run` หรือ `bun publish --dry-run`
2. cargo: `cargo publish --dry-run`
3. python: `twine check dist/*` แล้ว `twine upload --repository testpypi dist/*` ถ้าจำเป็น
4. GitHub Packages npm: `npm publish --dry-run --registry https://npm.pkg.github.com`
5. GitHub Container Registry: `docker push --dry-run ghcr.io/OWNER/IMAGE:VERSION` หรือ build แล้ว inspect image layers
6. ตรวจสอบ warnings และ size limits

### 5. Publish

> Goal: Publish package ไปยัง registry

1. npm/bun: `bun publish` หรือ `npm publish`
2. cargo: `cargo publish`
3. python: `twine upload dist/*`
4. GitHub Packages npm: `npm publish --registry https://npm.pkg.github.com`
5. GitHub Container Registry: `docker push ghcr.io/OWNER/IMAGE:VERSION`
6. ถ้า publish ไม่สำเร็จ → แก้ไขแล้วรันใหม่

### 6. Verify Publish

> Goal: ยืนยัน publish สำเร็จ

1. ตรวจสอบ registry ว่ามี version ใหม่
2. ทำ `/list-my-npm-packages` ถ้าเป็น npm เพื่อยื่นยัน
3. GitHub Packages: `gh package list` หรือเปิด https://github.com/OWNER?tab=packages
4. ทำ `/suggest-next-action`

## Rules

### 1. Auto-Detection

- ใช้ manifest หลักของ project ในการระบุ registry
- GitHub Packages: ตรวจ `Dockerfile` / image tag `ghcr.io` หรือ `package.json` `publishConfig.registry` → `https://npm.pkg.github.com`
- ถ้าหลาย manifest ให้ user เลือก หรือ publish ตามลำดับ
- ไม่ assume registry ถ้าไม่มี manifest

### 2. Verify Before Publish

- ทำ `/run-verify` เสมอก่อน publish
- version ต้อง bump ก่อน publish
- changelog ต้อง gen ด้วย `/gen-changelog-md`

### 3. Dry Run First

- ทำ dry run ก่อน publish จริงทุกครั้งถ้าเป็นไปได้
- ตรวจสอบ package contents และ warnings
- GitHub Container Registry: ตรวจ image tag, owner และ visibility (public/private) ก่อน push

### 4. Authentication And Security

- ตรวจสอบ tokens ก่อน publish
- ไม่ expose secrets ใน output
- ใช้ `/follow-secret-manager` สำหรับจัดการ tokens แล้ว sync ไป CI/CD หรือใช้ `gh secret set` แบบ manual
- GitHub Packages: ต้องมีสิทธิ์ `write:packages` สำหรับ `GITHUB_TOKEN` หรือ classic PAT ที่มี `read:packages` + `write:packages`

### 5. Scripts

- ถ้าต้อง process ข้อมูลซับซ้อน → ทำ `/use-scripts`
- ใช้ `/create-files-in-os-temp` สำหรับ temp files หรือ build artifacts ชั่วคราว

- ใช้ /run-release ถ้าจำเป็น
- ใช้ /follow-runtime-bun ถ้าจำเป็น
- ใช้ /follow-create-cli ถ้าจำเป็น
- ใช้ /use-my-packages-on-registry ถ้าจำเป็น
- ใช้ /ship ถ้าจำเป็น
- ใช้ /watch-release ถ้าจำเป็น
- ใช้ /follow-tool-release-it ถ้าจำเป็น
- ใช้ /follow-tool-semantic-release ถ้าจำเป็น
- ใช้ /follow-tool-changelogen ถ้าจำเป็น
- ใช้ /follow-tool-changesets ถ้าจำเป็น
- ใช้ /check-backward-compatibility ถ้าจำเป็น
- ใช้ /follow-tool-build-packages ถ้าจำเป็น
- ใช้ /follow-tool-pkg-new ถ้าจำเป็น

## Expected Outcome

- Package ถูก publish ไปยัง registry ที่ detect ได้ (npm, crates.io, PyPI, GitHub npm registry, หรือ ghcr.io)
- Version, changelog, และ build ถูกต้อง
- Verify ผ่านก่อน publish
- Dry run ผ่านก่อนของจริง
- ไม่ expose secrets
