---
name: watch-lint
description: ตรวจสอบและ monitor linting ในโปรเจกต์อย่างต่อเนื่อง
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related: []
---
## Goal

ตรวจสอบและ monitor linting ในโปรเจกต์อย่างต่อเนื่อง

## Scope

ใช้สำหรับ project ที่ต้องการ monitor linting อย่างต่อเนื่อง

## Prompt

ใช้ workflow นี้เมื่อต้องการตรวจสอบและ monitor linting ในโปรเจกต์อย่างต่อเนื่อง

## Execute

1. Setup Linting

- ติดตั้ง linter ที่เหมาะสม
- กำหนด linting rules
- สร้าง configuration files
- Setup pre-commit hooks

2. Configure Watch Mode

- เปิด watch mode สำหรับ linter
- กำหนด files ที่จะ monitor
- ตั้งค่า ignore patterns
- Configure notifications

3. Monitor Results

- ตรวจสอบ linting results
- Track warnings และ errors
- ระบุ trends
- Generate reports

4. Fix Issues

- แก้ไข linting errors
- ลด warnings
- Update code style
- Refactor ถ้าจำเป็น

5. Maintain Configuration

- อัพเดท linting rules
- ปรับปรุง configuration
- Review ignored files
- Update documentation

## Rules

1. Zero Tolerance

- ไม่ merge code ที่มี linting errors
- Fix warnings อย่างสม่ำเสมอ
- Maintain clean codebase
- Enforce standards

2. Automation

- ใช้ automated linting
- Integrate กับ CI/CD
- Setup pre-commit hooks
- Automate fixes เมื่อเป็นไปได้

3. Consistency

- ใช้ consistent linting rules
- Apply ทั้ง codebase
- No exceptions without reason
- Document overrides

4. Continuous Improvement

- Review rules อย่างสม่ำเสมอ
- Update ตาม best practices
- Gather feedback
- Iterate

## Expected Outcome

- Clean codebase
- Consistent code style
- Automated enforcement
- Reduced technical debt
