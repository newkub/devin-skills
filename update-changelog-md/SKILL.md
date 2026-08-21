---
name: update-changelog-md
description: สร้าง changelog ด้วย Bun Shell
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
related:
  - git-commit
---

## Goal

สร้าง changelog อัตโนมัติจาก git commits ด้วย Bun Shell (ไม่ต้อง config)

## Scope

ใช้สำหรับสร้าง changelog จาก git commit history ด้วย Bun native APIs

## Execute

### 1. Generate Changelog
> Goal: Generate Changelog

สร้าง changelog จาก commits ด้วย Bun Shell และ format เป็น table (2 columns, 10 commits ล่าสุด, no grouping, no emoji)

1. รัน `bun -e 'const { stdout: commits } = await Bun.$\`git log --pretty=format:"%h|%s" --no-merges -10\`.quiet(); const { stdout: latestTag } = await Bun.$\`git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"\`.quiet(); const { stdout: date } = await Bun.$\`git log -1 --format=%ad --date=short\`.quiet(); const lines = String(commits).trim().split("\\n"); let table = "| Hash | Change |\\n|------|--------|\\n"; lines.forEach(line => { const [hash, msg] = line.split("|"); table += \`| [\${hash}](https://github.com/wrikka/bun-packages/git-commit/\${hash}) | \${msg} |\\n\`; }); const changelog = \`# Changelog\\n\\n*Generated on \${new Date().toISOString()}*\\n\\n## \${latestTag} (\${date})\\n\\n\${table}\\n\\n> 📖 See full changelog at [GitHub Repository](https://github.com/wrikka/bun-packages/commits/main)\\n\`; await Bun.write("CHANGELOG.md", changelog); console.log("✅ Changelog generated!");'`
2. ตรวจสอบ output จาก command

### 2. Review Changelog
> Goal: Review Changelog

ตรวจสอบ changelog ที่สร้าง

1. อ่าน `CHANGELOG.md` ที่สร้าง
2. ตรวจสอบ version numbers ถูกต้อง
3. ตรวจสอบ commit messages ถูกจัดกลุ่ม
4. ตรวจสอบ dates ถูกต้อง

### 3. Commit Changelog
> Goal: Commit Changelog

Commit changelog ที่สร้าง

1. Add `CHANGELOG.md` ไปยัง git
2. Commit ด้วย message ที่เหมาะสม
3. Push ไปยัง remote repository

## Rules

### 1. Use Bun Shell

ใช้ Bun Shell สำหรับ changelog generation

- ใช้ `Bun.$` สำหรับ shell commands
- ใช้ `.quiet()` สำหรับ suppress output
- ใช้ `Bun.write()` สำหรับ write file
- ไม่ต้อง config หรือ setup ใดๆ

### 2. Commit Conventions

ใช้ conventional commits สำหรับ changelog generation

- ใช้ format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`
- ใช้ breaking change indicator: `feat!:` หรือ `BREAKING CHANGE:`
- ใช้ scopes สำหรับ categorization ใน monorepos

## Expected Outcome

- Changelog สร้างอัตโนมัติด้วย Bun Shell
- Version numbers ถูกต้อง
- Commit messages ถูกจัดกลุ่ม
- Changelog format มาตรฐาน
