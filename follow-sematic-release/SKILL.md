---
name: follow-sematic-release
description: Fully automated version management และ package publishing tool ที่ใช้ conventional commits
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

ใช้งาน Semantic Release สำหรับ automated version management และ package publishing


## Scope

ใช้สำหรับ:
- Automated version management
- Semantic versioning อัตโนมัติ
- Automated changelog generation
- Package publishing ไปยัง bun, GitHub, GitLab


## Execute

### 1. Install Semantic Release

ติดตั้ง Semantic Release:
```bash
bun add -D semantic-release
```

### 2. Run Semantic Release

รัน semantic-release:
```bash
bunx semantic-release
```

### 3. Dry Run

Dry run:
```bash
bunx semantic-release --dry-run
```

### 4. Debug Mode

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
