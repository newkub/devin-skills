---
name: release-it
description: "Generic CLI tool สำหรับ automate versioning และ package publishing"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Release It สำหรับ automate versioning และ package publishing


## Scope

ใช้สำหรับ:
- Automate versioning และ package publishing
- Git commit/tag/push automation
- GitHub/GitLab releases
- Changelog generation
- bun publishing


## Execute

### 1. Install Release It

ติดตั้ง Release It:
```bash
bun add -D release-it
```

### 2. Interactive Release

Interactive release:
```bash
bunx release-it
```

### 3. CI Mode

CI mode (no prompts):
```bash
bunx release-it --ci
```

### 4. Dry Run

Dry run:
```bash
bunx release-it --dry-run
```


## Rules

- ใช้ `bun add -D release-it` สำหรับติดตั้ง
- ใช้ `bunx release-it` สำหรับ interactive release
- ใช้ `--ci` สำหรับ CI mode
- ใช้ `--dry-run` สำหรับ dry run


## Expected Outcome

- Versioning ที่ automated
- Git commit/tag/push ที่ automated
- GitHub/GitLab releases ที่ automated
- Changelog generation ที่ automated
- bun publishing ที่ automated
