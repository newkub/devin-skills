---
name: watch-release
description: ตรวจสอบ release บน registry หรือ GitHub จนกว่าจะ live
argument-hint: "[scope]"
related:
  - run-release
  - follow-release
  - ship
  - watch-deploy
  - resolve-errors
---

## Goal

Monitor a release after it has been published and report when the version or tag becomes available on the target registry or platform.

## Scope

Use after `/run-release`, manual release, or when `/ship` detects a release. Supports npm, crates.io, Docker Hub, VS Code Marketplace, and GitHub releases.

## Execute

### 1. Identify Release Target

> Goal: ระบุ release ที่ต้องตรวจสอบ

1. รับ package name, version, image tag, หรือ GitHub release tag จาก user, release output, หรือ project files
2. ถ้าไม่มี → อ่าน `package.json`, `Cargo.toml`, `Dockerfile`, `manifest.json`, หรือ `git tag --sort=-version:refname`
3. ดู `references/targets.md` สำหรับ endpoints ของแต่ละ platform
4. ถ้า release ไม่ชัด → ทำ `/ask-me`

### 2. Determine Platform

> Goal: เลือกวิธี verification ตาม platform

1. npm: `https://registry.npmjs.org/<package>/<version>` หรือ `npm view <package>@<version>`
2. crates: `https://crates.io/api/v1/crates/<package>/<version>` หรือ `cargo search <package>`
3. docker: `https://hub.docker.com/v2/repositories/<owner>/<image>/tags/<tag>` หรือ `docker pull <image>:<tag>`
4. vscode: `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/<publisher>/vsextensions/<ext>/<version>`
5. github: `https://api.github.com/repos/<owner>/<repo>/releases/tags/<tag>` หรือ `gh release view <tag>`

### 3. Configure Polling

> Goal: กำหนดเงื่อนไขการ poll

1. กำหนด `interval` ค่าเริ่มต้น `30` วินาที
2. กำหนด `timeout` ค่าเริ่มต้น `600` วินาที
3. กำหนด `expectedStatus` ค่าเริ่มต้น `200` สำหรับ HTTP API

### 4. Poll Release

> Goal: ตรวจสอบ release ซ้ำจนกว่าจะพร้อมหรือหมดเวลา

1. ใช้ `curl -s -I -L` หรือ platform CLI เพื่อตรวจสอบ endpoint
2. บันทึก timestamp, status, version, elapsed time
3. ถ้า version/tag ปรากฏและสถานะตรงกับ `expectedStatus` → หยุดและ report success
4. ถ้า 404 → รอ `interval` แล้ว poll ใหม่ (registry อาจ lag)
5. ถ้า 401/403 → หยุดทันทีและ report "authentication required"
6. ถ้า 5xx → report และ retry จนกว่าจะหมดเวลา

### 5. Report Result

> Goal: สรุปผลลัพธ์

1. ถ้าผ่าน ให้ report platform, version/tag, URL, elapsed time
2. ถ้า timeout ให้ report last status, total polls, recommendation
3. ถ้ามี newer version หรือ tag เปลี่ยน → report ด้วย

## Rules

### 1. Default Polling

- `interval` = `30` วินาที
- `timeout` = `600` วินาที
- `expectedStatus` = `[200]`
- `followRedirects` = `true`
- `maxRetries` = `5`

### 2. Status Handling

- 200 + version found: healthy, stop
- 301/302: follow redirect
- 401/403: stop, auth required
- 404: continue polling (registry propagation)
- 429: back off, increase interval by 10s
- 500–599: continue polling, report if repeated 3 times
- network error: retry up to `maxRetries`

### 3. No Hardcoded Secrets

- ไม่ hardcode API tokens
- ใช้ env vars เช่น `NPM_TOKEN`, `GITHUB_TOKEN`, `CARGO_REGISTRY_TOKEN` ถ้าต้องการ auth
- ไม่ส่ง tokens ใน headers โดยไม่ได้รับอนุญาต

### 4. Output

- แสดงทุก poll ด้วย timestamp, status, elapsed
- ใช้ table สำหรับสรุปผลลัพธ์
- ไม่ print binary/package contents

### 5. Rollback Recommendation

- ถ้า timeout ถึงและ release ยังไม่ live → report แนะนำ rollback
- ระบุ platform-specific rollback command
- ไม่ rollback อัตโนมัติ

- ใช้ /follow-release ถ้าจำเป็น
- ใช้ /watch-deploy ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Expected Outcome

- Release ถูก poll จนกว่าจะ live หรือ timeout
- ผลลัพธ์ report ครบ: platform, version/tag, final status, elapsed, polls
- ไม่มี TODO/MOCK/placeholder
- `SKILL.md` และ references ไม่เกิน 250 บรรทัด

