# Docs Drift Checks

## Checks

### README.md Drift

- เปรียบเทียบ `README.md` กับ actual project state
- ตรวจสอบ: project name, description, features, usage, scripts, tech stack
- ระบุ sections ที่ล้าหลังหรือไม่ตรง source code

### AGENTS.md Drift

- เปรียบเทียบ `AGENTS.md` กับ actual architecture และ skills
- ตรวจสอบ: tech stack mapping, skills mapping, workspace rules
- ระบุ mappings ที่ล้าหลังหรือไม่ตรง dependencies

### CONTRIBUTING.md Drift

- เปรียบเทียบ `CONTRIBUTING.md` กับ actual workflows และ conventions
- ตรวจสอบ: prerequisites, setup, development workflow, git conventions, validation
- ระบุ sections ที่ล้าหลังหรือไม่ตรง actual commands

### CHANGELOG.md Drift

- เปรียบเทียบ `CHANGELOG.md` กับ git commits ล่าสุด
- ตรวจสอบ: version numbers, commit messages, dates
- ระบุ commits ที่ยังไม่อยู่ใน changelog

### RELEASE.md Drift

- เปรียบเทียบ `RELEASE.md` กับ git tags
- ตรวจสอบ: version numbers, release dates, release notes
- ระบุ tags ที่ยังไม่อยู่ใน release notes

### spec/SPEC.md Drift

- เปรียบเทียบ `spec/SPEC.md` กับ actual test files
- ตรวจสอบ: test cases, coverage targets, test categories
- ระบุ test cases ที่ล้าหลังหรือไม่ตรกับ tests จริง

## Drift Severity

- Critical: docs ผิดพื้นฐาน ทำให้ user เข้าใจผิด
- High: docs ล้าหลัง source code มาก, missing critical sections
- Medium: docs ล้าหลังเล็กน้อย, minor inconsistency
- Low: cosmetic drift, typo, formatting

## Recommended Update Skills

- `update-readme` สำหรับ `README.md`
- `update-agents-md` สำหรับ `AGENTS.md`
- `update-contributing-md` สำหรับ `CONTRIBUTING.md`
- `update-changelog-md` สำหรับ `CHANGELOG.md`
- `update-release-md` สำหรับ `RELEASE.md`
- `update-spec-md` สำหรับ `spec/SPEC.md`
