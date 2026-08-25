# Features And Subagents Drift Checks

## Features Drift Checks

### Features Doc Vs Source

- เปรียบเทียบ `docs/project/features.md` กับ actual source code features
- ระบุ features ใน source code ที่ไม่มีใน docs
- ระบุ features ใน docs ที่ไม่มีใน source code แล้ว

### Feature Completeness

- ตรวจสอบว่า features doc ครอบคลุม: routes, modules, schemas, API endpoints
- ระบุ sources ที่ไม่ได้วิเคราะห์
- ตรวจสอบ feature metadata: name, description, module, domain, status

### Features In Monorepo

- ตรวจสอบว่า features doc ครอบคลุมทุก workspace ใน monorepo
- ระบุ workspaces ที่ไม่มี features doc

## Subagents Drift Checks

### Subagent Standards

- ตรวจสอบ subagents ใน `%APPDATA%\devin\agents` เทียบกับมาตรฐาน `AGENT.md`
- ตรวจสอบ: frontmatter (`name`, `description`, `model`, `allowed-tools`)
- ตรวจสอบ: 5 sections (`Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`)
- ตรวจสอบ: ไม่เกิน 250 บรรทัด, ไม่มี TODO/MOCK/placeholder

### Subagent Consistency

- ตรวจสอบว่า subagent `name` ตรงกับ directory name
- ตรวจสอบว่า `description` ไม่เกิน 100 ตัวอักษร
- ระบุ subagents ที่ล้าสมัยหรือไม่ตรงมาตรฐาน

## Skills Drift Checks

### Skills Standards

- ตรวจสอบ skills ใน `%APPDATA%\devin\skills` เทียบกับมาตรฐาน `SKILL.md`
- ตรวจสอบ: frontmatter (`name`, `description`), sections, line count
- ตรวจสอบ: `related` references ไม่มี missing/unused
- ระบุ skills ที่ล้าสมัย

## Drift Severity

- Critical: features doc ผิดพื้นฐาน, subagents ไม่ตรงมาตรฐาน
- High: features doc ล้าหลัง source code มาก, subagents ขาด critical sections
- Medium: features doc ล้าหลังเล็กน้อย, subagents มี minor issues
- Low: cosmetic drift, minor inconsistency

## Recommended Update Skills

- `update-features` สำหรับ update features doc
- `update-devin-subagents` สำหรับ update subagents
- `update-all-devin-global-skills` สำหรับ update skills repo
