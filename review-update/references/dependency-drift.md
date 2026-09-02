# Dependency And Runtime Version Drift Checks

## Checks

### Version Drift

- รัน `bunx taze -r` หรือ `npm outdated` เพื่อดู outdated dependencies
- แยกตามประเภท: major, minor, patch
- ตรวจสอบ breaking changes จาก changelogs ของแต่ละ package

### Runtime Version Drift

- รัน `bun --version`, `node --version`, `python --version`, `rustc --version`, `go version`, `dotnet --version`
- ตรวจสอบ `package.json#engines`, `mise.toml`, `.nvmrc`, `.python-version`, `rust-toolchain.toml`, `go.mod`, `global.json`
- ระบุ runtime ที่ outdated เทียบกับ latest stable

### Security Vulnerabilities

- รัน `bun audit` หรือ `npm audit` เพื่อตรวจสอบ vulnerabilities
- ระบุ dependencies ที่มี known vulnerabilities
- ระบุ severity: critical, high, moderate, low

### Version Consistency (Monorepo)

- ตรวจสอบว่า dependencies ที่ใช้ในหลาย workspace มี version เดียวกัน
- ระบุ version conflicts ระหว่าง workspaces
- ตรวจสอบ workspace protocol (`workspace:*`) usage

### Peer Dependencies

- ตรวจสอบว่า peerDependencies ยัง compatible หรือไม่
- ระบุ peer dependency conflicts

### Lock File

- ตรวจสอบว่า lock file (`bun.lock`, `package-lock.json`) สอดคล้องกับ `package.json`
- ระบุ lock file drift

## Drift Severity

- Critical: security vulnerability, lock file conflict
- High: major version drift, breaking changes
- Medium: minor version drift, version inconsistency
- Low: patch version drift, minor peer dependency issue

## Recommended Update Skills

- `update-version-latest` สำหรับ update ทุก versioned สิ่ง (dependencies, runtimes, tools, config)
- `update-dependencies-latest` สำหรับ update dependencies เป็น latest
- `update-dot-devin` ถ้า dependency/runtime changes กระทบ `.devin` structure
- `update-project-rules` ถ้า dependency/runtime changes กระทบ rules
