---
name: follow-tool-semantic-release
description: ใช้งาน Semantic Release สำหรับ automated version management และ package publishing
---

## Goal

ใช้งาน Semantic Release สำหรับ automated version management, semantic versioning, changelog generation และ package publishing

## Scope

ใช้สำหรับ:
- Automated version management
- Semantic versioning อัตโนมัติ
- Automated changelog generation
- Package publishing ไปยัง npm, GitHub, GitLab

## Execute

### 1. Install Semantic Release

> Goal: ติดตั้ง semantic-release ใน project

ติดตั้ง Semantic Release:
```bash
bun add -D semantic-release
```

### 2. Run Semantic Release

> Goal: รัน semantic-release
```bash
bunx semantic-release
```

### 3. Dry Run

> Goal: ทดสอบ release โดยไม่ publish จริง
```bash
bunx semantic-release --dry-run
```

### 4. Debug Mode

> Goal: รันใน debug mode เพื่อ troubleshoot

Debug mode:
```bash
DEBUG=semantic-release:* bunx semantic-release
```

## Rules

- ใช้ `bun add -D semantic-release` สำหรับติดตั้ง
- ใช้ `bunx semantic-release` สำหรับรัน
- ใช้ `--dry-run` สำหรับ dry run
- ใช้ conventional commits สำหรับ version bump

## Expected Outcome

- Version management ที่ automated
- Semantic versioning ที่ consistent
- Changelog generation ที่ automated