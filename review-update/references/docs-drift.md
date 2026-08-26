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

- เปรียบเทียบ `CHANGELOG.md` กับ git commits และ git tags ล่าสุด
- ตรวจสอบ: version numbers, commit messages, dates, release history
- ระบุ commits และ tags ที่ยังไม่อยู่ใน changelog

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
- `run-release` สำหรับ `CHANGELOG.md` (gen อัตโนมัติเมื่อ release สำเร็จ)
- `gen-changelog-md` สำหรับ `CHANGELOG.md` (gen จาก git tags)
- `follow-tool-changelogen` สำหรับ `CHANGELOG.md` (ด้วย changelogen)
- `update-test` สำหรับ `spec/SPEC.md`
