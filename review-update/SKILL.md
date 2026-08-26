---
name: review-update
description: Review drift between current and target state to determine update priority order
---

## Goal

Review drift ระหว่าง current state และ target state เพื่อระบุสิ่งที่ต้อง update และจัดลำดับ priority ครอบคลุม dependency drift, rules drift, docs drift, config drift, test drift, gitignore drift, features drift, subagents drift, ast-grep rules drift, devin-project-rules drift, references drift โดยไม่ดำเนินการ update จริง

## Scope

ใช้ก่อนเรียก `update-*` skills เพื่อทำความเข้าใจ drift และจัดลำดับการ update ครอบคลุมทุกประเภท: dependencies, rules, docs, config, tests, gitignore, features, subagents, ast-grep rules, devin-project-rules, references ไม่รวมการ update จริง — เป็น review เท่านั้น

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project state และ drift scope ก่อน review

1. ทำ `/check-should-update` เพื่อตรวจ git changes และระบุว่าต้อง update หรือไม่
2. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ tech stack
3. อ่าน `AGENTS.md` เพื่อทราบ tools และ conventions
4. ถ้าสแกนไม่ได้ → stop และ report

### 2. Analyze Dependency Drift

> Goal: ระบุ dependency version drift

1. รัน `bunx taze -r` หรือ `npm outdated` เพื่อดู outdated dependencies
2. ตรวจสอบ drift ตาม [references/dependency-drift.md](references/dependency-drift.md)
3. แยกตามประเภท: major, minor, patch
4. ตรวจสอบ breaking changes จาก changelogs
5. บันทึก: package, current version, latest version, drift type, breaking changes

### 3. Analyze Docs Drift

> Goal: ระบุ docs ที่ล้าหลัง source code

1. ตรวจสอบ drift ตาม [references/docs-drift.md](references/docs-drift.md)
2. ตรวจสอบ `README.md` เทียบกับ actual project state
3. ตรวจสอบ `AGENTS.md` เทียบกับ actual architecture และ skills
4. ตรวจสอบ `CONTRIBUTING.md` เทียบกับ actual workflows
5. ตรวจสอบ `CHANGELOG.md` เทียบกับ git commits และ git tags
7. ตรวจสอบ `spec/SPEC.md` เทียบกับ actual tests
8. บันทึก: doc file, drift type, severity, recommended update skill

### 4. Analyze Config Drift

> Goal: ระบุ config และ gitignore drift

1. ตรวจสอบ drift ตาม [references/config-drift.md](references/config-drift.md)
2. ตรวจสอบ `.gitignore` เทียบกับ stack และ artifacts ที่ใช้
3. ตรวจสอบ config files (`tsconfig.json`, `vite.config.ts`, `biome.jsonc`) เทียบกับ dependencies
4. ตรวจสอบ `.devin` structure completeness
5. บันทึก: config file, drift type, severity, recommended update skill

### 5. Analyze Rules Drift

> Goal: ระบุ rules, ast-grep rules, devin-project-rules drift

1. ตรวจสอบ drift ตาม [references/rules-drift.md](references/rules-drift.md)
2. ตรวจสอบ `.devin/rules/` เทียบกับ dependencies ใน `package.json`
3. ตรวจสอบ `rules/` (ast-grep) เทียบกับ `.devin/rules/`
4. ตรวจสอบ `sgconfig.yml` configuration completeness
5. บันทึก: rule file, drift type, severity, recommended update skill

### 6. Analyze Test Drift

> Goal: ระบุ test suite drift

1. ตรวจสอบ drift ตาม [references/test-drift.md](references/test-drift.md)
2. ตรวจสอบ test coverage เทียบกับ source code
3. ตรวจสอบ `spec/SPEC.md` เทียบกับ actual test files
4. ตรวจสอบ test framework version เทียบกับ latest
5. บันทึก: test area, drift type, severity, recommended update skill

### 7. Analyze Features And Subagents Drift

> Goal: ระบุ features และ subagents drift

1. ตรวจสอบ drift ตาม [references/features-drift.md](references/features-drift.md)
2. ตรวจสอบ `docs/project/features.md` เทียบกับ actual source code features
3. ตรวจสอบ subagents ใน `%APPDATA%\devin\agents` เทียบกับมาตรฐาน `AGENT.md`
4. ตรวจสอบ skills ใน `%APPDATA%\devin\skills` เทียบกับมาตรฐาน `SKILL.md`
5. บันทึก: area, drift type, severity, recommended update skill

### 8. Calculate Update Priority

> Goal: จัดลำดับ update priority ตาม drift severity และ dependencies

1. รวม findings จาก Step 2-7 เป็น drift report
2. คำนวณ priority ตาม [references/update-priority.md](references/update-priority.md)
3. จัดลำดับ: critical drift ก่อน → high drift → medium drift → low drift
4. ระบุ dependencies ระหว่าง updates (เช่น dependency update ก่อน docs update)
5. สร้าง update priority order พร้อม recommended skills

### 9. Report

> Goal: รายงาน drift report และ update priority order

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Drift Report: area, drift type, current state, target state, severity
3. สร้างตาราง Update Priority: priority, update skill, drift area, effort, impact
4. แสดง update health score พร้อม grade
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่ update ไฟล์ระหว่าง review
- แยก review process จาก update process
- ถ้าต้อง update ให้ทำ `update-*` skills หลัง review

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ evidence
- ใช้ tools สำหรับ verification ไม่เดา
- ระบุ false positives ที่พบ

### 3. Drift Severity

- Critical: dependency มี security vulnerability, docs ผิดพื้นฐาน, rules ขาด critical coverage
- High: major version drift, docs ล้าหลัง source code มาก, rules ไม่ครอบคลุม tools
- Medium: minor/patch drift, docs ล้าหลังเล็กน้อย, config ไม่สอดคล้องบางส่วน
- Low: cosmetic drift, minor inconsistency

### 4. Update Priority Formula

- Priority = drift severity × update urgency
- Critical drift = priority 1 (update ทันที)
- High drift = priority 2 (update เร็วๆ นี้)
- Medium drift = priority 3 (update เมื่อมีเวลา)
- Low drift = priority 4 (nice to have)
- ถ้ามี dependency ระหว่าง updates → update ตาม dependency order

### 5. Update Health Scoring

- ครอบคลุม drift areas: dependencies, docs, config, rules, tests, features, subagents
- คะแนนต่อ area: no drift = 1, minor drift = 0.5, major drift = 0
- Update health score = (total score / total areas) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง Drift Report พร้อม severity และ evidence
- รายงานตาราง Update Priority พร้อม recommended update skills
- Update health score พร้อม grade
- ไม่มีการ update ไฟล์จริง — เป็น review เท่านั้น
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
