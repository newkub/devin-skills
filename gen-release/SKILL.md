---
name: gen-release
description: สร้าง RELEASE.md ด้วย Bun Shell
---

## Goal

สร้าง RELEASE.md ด้วย Bun Shell สำหรับ tracking releases

## Scope

ใช้สำหรับสร้าง release notes จาก git tags ด้วย Bun native APIs

## Execute

### 1. Generate Release

สร้าง RELEASE.md จาก git tags ด้วย Bun Shell

1. รัน `bun -e 'const { stdout: tags } = await Bun.$\`git tag --sort=-version:refname\`.quiet(); const tagsStr = String(tags).trim(); if (!tagsStr) { const { stdout: date } = await Bun.$\`git log -1 --format=%ad --date=short\`.quiet(); const dateStr = String(date).trim(); const release = \`# Release\\n\\n*Generated on \${new Date().toISOString()}*\\n\\n## Latest Release: v0.0.0 (\${dateStr})\\n\\n## All Releases\\n\\nNo releases yet.\\n\\n> See all releases at [GitHub Releases](https://github.com/wrikka/bun-packages/releases)\\n\`; await Bun.write("RELEASE.md", release); console.log("✅ Release generated!"); } else { const { stdout: latestTag } = await Bun.$\`git describe --tags --abbrev=0\`.quiet(); const latestTagStr = String(latestTag).trim(); const { stdout: tagDate } = await Bun.$\`git log -1 --format=%ad --date=short \${latestTagStr}\`.quiet(); const lines = tagsStr.split("\\n").slice(0, 10); let table = "| Version |\\n|---------|\\n"; lines.forEach(tag => { table += \`| [\${tag}](https://github.com/wrikka/bun-packages/releases/tag/\${tag}) |\\n\`; }); const release = \`# Release\\n\\n*Generated on \${new Date().toISOString()}*\\n\\n## Latest Release: \${latestTagStr} (\${tagDate.trim()})\\n\\n## All Releases\\n\\n\${table}\\n\\n> See all releases at [GitHub Releases](https://github.com/wrikka/bun-packages/releases)\\n\`; await Bun.write("RELEASE.md", release); console.log("✅ Release generated!"); }'`
2. ตรวจสอบ output จาก command

### 2. Review Release

ตรวจสอบ release ที่สร้าง

1. อ่าน `RELEASE.md` ที่สร้าง
2. ตรวจสอบ version numbers ถูกต้อง
3. ตรวจสอบ dates ถูกต้อง
4. ตรวจสอบ descriptions ถูกต้อง

## Rules

### 1. Use Bun Shell

ใช้ Bun Shell สำหรับ release generation

- ใช้ `Bun.$` สำหรับ shell commands
- ใช้ `.quiet()` สำหรับ suppress output
- ใช้ `Bun.write()` สำหรับ write file
- ไม่ต้อง config หรือ setup ใดๆ

### 2. Tag Conventions

ใช้ semantic versioning สำหรับ tags

- ใช้ format: `vX.Y.Z` (เช่น v1.0.0, v1.2.3)
- ใช้ tag messages สำหรับ release notes
- ใช้ annotated tags สำหรับ releases

## Expected Outcome

- Release สร้างอัตโนมัติด้วย Bun Shell
- Version numbers ถูกต้อง
- Release notes ครบถ้วน
- Markdown format มาตรฐาน
