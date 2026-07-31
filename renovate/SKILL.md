---
name: renovate
description: "Automated dependency update tool ที่สร้าง pull requests อัตโนมัติสำหรับ update dependencies"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Renovate สำหรับ automated dependency updates


## Scope

ใช้สำหรับ:
- Automated dependency updates
- Auto-create pull requests สำหรับ dependency updates
- Support หลาย platform เช่น GitHub, GitLab, Bitbucket
- Monorepo support
- Schedule dependency updates


## Execute

### 1. Install Renovate CLI

ติดตั้ง Renovate CLI:
```bash
npx renovate --version
```

### 2. Run Renovate in Dry-run

รัน Renovate ในโหมด dry-run:
```bash
npx renovate --dry-run
```

### 3. Validate Config

ตั้งค่า config:
```bash
renovate:config:validate
```

### 4. Create PR for Testing

สร้าง PR สำหรับทดสอบ:
```bash
npx renovate --platform=github
```


## Rules

- ใช้ presets คล้าย ESLint - ใช้ config ที่มีอยู่แล้วได้
- รองรับ monorepo ได้ดี
- กำหนดเวลาสร้าง PR ได้
- ใช้ configuration ที่ centralized


## Expected Outcome

- Automated dependency updates ที่ efficient
- Pull requests ที่ created อัตโนมัติ
- Multi-platform support ที่ comprehensive
- Monorepo support ที่ robust
- Scheduled updates ที่ reliable
