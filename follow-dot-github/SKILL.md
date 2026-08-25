---
name: follow-dot-github
description: จัดการ .github directory ครบถ้วน ทั้ง workflows, templates, policies, และ automation config
---

## Goal

จัดการ `.github` directory ให้ครบถ้วนและเป็นระบบ ครอบคลุม CI/CD workflows, issue/PR templates, community files, automation config และ security policies

## Scope

ใช้สำหรับสร้าง ปรับปรุง และตรวจสอบ `.github` directory ทั้งหมด ไม่ทับซ้อนกับ `/follow-tool-github-actions` (เลือก workflows) และ `/follow-tool-github-workflows` (เขียน workflow YAML)

### Standard Project

```
.github/
├── workflows/           # CI/CD workflows (YAML)
├── ISSUE_TEMPLATE/       # Issue templates
│   ├── bug_report.yml
│   ├── feature_request.yml
│   └── config.yml
├── PULL_REQUEST_TEMPLATE.md
├── CODEOWNERS
├── dependabot.yml
├── FUNDING.yml           # optional
├── SECURITY.md
├── CODE_OF_CONDUCT.md    # optional
└── CONTRIBUTING.md       # optional
```

### Monorepo

```
.github/
├── workflows/
├── ISSUE_TEMPLATE/
├── PULL_REQUEST_TEMPLATE.md
├── CODEOWNERS
├── dependabot.yml
├── SECURITY.md
└── CONTRIBUTING.md
```

## Execute

### 1. Analyze Existing .github

> Goal: อ่านและวิเคราะห์ `.github` directory ที่มีอยู่เพื่อเข้าใจสถานะปัจจุบัน

1. อ่าน `.github/` directory ทั้งหมด
2. จัดทำรายการไฟล์ที่มีอยู่และไฟล์ที่ขาด
3. อ่านไฟล์ที่มีอยู่เพื่อตรวจสอบความถูกต้อง
4. ถ้าไม่มี `.github/` directory → เริ่มใหม่ทั้งหมด
5. ถ้าอ่านไฟล์ไม่ได้ → stop และ report

### 2. Analyze Project

> Goal: วิเคราะห์ project เพื่อกำหนดไฟล์ที่จำเป็น

1. ทำ `/analyze-project` เพื่อดู tech stack และ structure
2. ทำ `/check-monorepo` เพื่อตรวจสอบประเภท project
3. ระบุว่าเป็น open source, private, หรือ organization repo
4. ระบุว่ามี contributors หลายคนหรือไม่
5. ถ้า project type ไม่ชัด → stop และ report

### 3. Setup CI/CD Workflows

> Goal: จัดการ CI/CD workflows โดยอ้างอิง workflows เฉพาะทาง

1. ทำ `/follow-tool-github-actions` เพื่อเลือก workflows ที่เหมาะสม
2. ทำ `/follow-tool-github-workflows` เพื่อเขียน workflow YAML
3. ตรวจสอบว่า workflows ใช้ actions เวอร์ชันล่าสุด
4. ตรวจสอบ `permissions` และ `concurrency` settings
5. ถ้า workflows ที่มีอยู่ถูกต้องครบถ้วน → skip step นี้

### 4. Setup Issue Templates

> Goal: สร้าง issue templates สำหรับ bug reports, feature requests และ config

1. สร้าง `.github/ISSUE_TEMPLATE/bug_report.yml` พร้อมฟิลด์: description, steps to reproduce, expected behavior, environment
2. สร้าง `.github/ISSUE_TEMPLATE/feature_request.yml` พร้อมฟิลด์: problem, proposed solution, alternatives
3. สร้าง `.github/ISSUE_TEMPLATE/config.yml` พร้อม `blank_issues_enabled` และ contact links
4. ใช้ GitHub Forms syntax (YAML) ไม่ใช่ Markdown templates
5. ถ้ามี issue templates ที่ถูกต้องอยู่แล้ว → อัปเดตเฉพาะส่วนที่ขาด

### 5. Setup PR Template

> Goal: สร้าง pull request template เพื่อ guide contributors

1. สร้าง `.github/PULL_REQUEST_TEMPLATE.md`
2. รวม sections: Summary, Changes, Type, Testing, Checklist
3. กรอก checklist ตาม project conventions (tests, docs, lint)
4. ถ้าเป็น monorepo → ระบุ workspace ที่กระทบ
5. ถ้ามี PR template ที่ถูกต้องอยู่แล้ว → อัปเดตเฉพาะส่วนที่ขาด

### 6. Setup CODEOWNERS

> Goal: สร้าง CODEOWNERS เพื่อกำหนด code owners ตาม directory structure

1. สร้าง `.github/CODEOWNERS`
2. กำหนด owners ตาม directory structure ของ project
3. สำหรับ monorepo → กำหนด owners แยกตาม workspace (เช่น `apps/website/ @owner1`)
4. กำหนด default owner สำหรับ root directory
5. ถ้าเป็น solo project → skip step นี้

### 7. Setup Dependabot

> Goal: สร้าง `dependabot.yml` เพื่อ automated dependency updates

1. สร้าง `.github/dependabot.yml`
2. กำหนด `package-ecosystem` ตาม package manager ที่ใช้ (npm, github-actions, etc.)
3. กำหนด `directory` ตาม project structure (`/` สำหรับ root, แต่ละ workspace สำหรับ monorepo)
4. กำหนด `schedule.interval` เป็น `weekly` หรือ `daily`
5. กำหนด `open-pull-requests-limit` ตามความเหมาะสม
6. สำหรับ monorepo → เพิ่ม entry สำหรับแต่ละ workspace และ `github-actions` ecosystem
7. กำหนด `commit-message` prefix ตาม conventional commits
8. ถ้ามี dependabot.yml ที่ถูกต้องอยู่แล้ว → อัปเดตเฉพาะ entry ที่ขาด

### 8. Setup Community Files

> Goal: สร้าง community files ตามประเภท project

1. สร้าง `.github/SECURITY.md` พร้อมวิธีรายงาน vulnerabilities และ response timeline
2. สร้าง `.github/CONTRIBUTING.md` ถ้าเป็น open source หรือมี contributors หลายคน
3. สร้าง `.github/CODE_OF_CONDUCT.md` ถ้าเป็น open source (ใช้ Contributor Covenant)
4. สร้าง `.github/FUNDING.yml` ถ้ารับ funding (GitHub Sponsors, Open Collective, etc.)
5. ถ้าเป็น private repo และไม่มี contributors → skip CONTRIBUTING.md, CODE_OF_CONDUCT.md, FUNDING.yml

### 9. Validate And Update References

> Goal: ตรวจสอบความถูกต้องและอัปเดต references

1. ตรวจสอบ YAML syntax ของทุก `.yml`/`.yaml` ไฟล์
2. ตรวจสอบ Markdown syntax ของทุก `.md` ไฟล์
3. ตรวจสอบ CODEOWNERS format ตาม GitHub spec
4. ตรวจสอบ dependabot.yml format ตาม GitHub spec
5. ทำ `/update-reference` หากมี file operations หรือ moves
6. อัปเดต `AGENTS.md` ถ้ามีการเพิ่มไฟล์ใหม่ที่ project ต้องรู้
7. ถ้า validation ไม่ผ่าน → แก้และ re-validate (max 3 ครั้ง → stop/report)

## Rules

### 1. No Overlap With Specialized Workflows

- ใช้ `/follow-tool-github-actions` สำหรับเลือก CI/CD workflows
- ใช้ `/follow-tool-github-workflows` สำหรับเขียน workflow YAML
- `follow-dot-github` จัดการไฟล์อื่นใน `.github/` และ coordinate การเรียก specialized workflows

### 2. File Format Standards

- Issue templates: ใช้ GitHub Forms syntax (YAML) ไม่ใช่ Markdown
- PR template: ใช้ Markdown
- CODEOWNERS: ใช้ GitHub CODEOWNERS format (`path @owner`)
- dependabot.yml: ใช้ GitHub Dependabot v2 format
- SECURITY.md: ระบุ response timeline และ contact method

### 3. Monorepo Guidelines

- dependabot.yml ต้องมี entry สำหรับทุก workspace และ `github-actions` ecosystem
- CODEOWNERS ต้องกำหนด owners แยกตาม workspace
- PR template ต้องระบุ workspace ที่กระทบ
- ISSUE_TEMPLATE ใช้ร่วมกันที่ root `.github/`

### 4. Security First

- SECURITY.md ต้องมีอย่างน้อย: reporting method, response timeline, scope
- ห้ามระบุ vulnerabilities ที่ยังไม่ได้ fix ในไฟล์สาธารณะ
- dependabot.yml ต้องกำหนด `commit-message` prefix ตาม conventional commits
- ห้าม hardcode secrets, tokens, หรือ credentials ในไฟล์ใดใน `.github/`

### 5. Deterministic And Measurable

- ผลลัพธ์ต้อง deterministic — project type เดียวกัน → ไฟล์เหมือนกันทุกครั้ง
- Validation criteria ต้อง measurable: YAML syntax ผ่าน, CODEOWNERS format ถูก, dependabot.yml ตรง spec
- ถ้าไฟล์ที่มีอยู่ถูกต้องแล้ว → ไม่สร้างใหม่ แต่อัปเดตเฉพาะส่วนที่ขาด
- ลำดับการสร้างไฟล์ต้อง fixed ตามลำดับ steps

### 6. High Impact Content

- เก็บเฉพาะไฟล์ที่ project ใช้จริง — ถ้าไม่มี contributors ไม่ต้องสร้าง CONTRIBUTING.md
- ถ้าเป็น private repo ไม่ต้องสร้าง CODE_OF_CONDUCT.md และ FUNDING.yml
- ถ้าเป็น solo project ไม่ต้องสร้าง CODEOWNERS
- ตรวจสอบว่าทุกไฟล์มีเนื้อหาที่เกี่ยวข้องกับ project จริง ไม่ใช่ generic template

## Expected Outcome

- `.github/` directory มีไฟล์ครบตามประเภท project — ไม่มีไฟล์ขาด ไม่มีไฟล์เกิน
- CI/CD workflows ครบถ้วน (delegated to `/follow-tool-github-actions` และ `/follow-tool-github-workflows`)
- Issue templates ใช้ GitHub Forms syntax (YAML) ครบ 3 ไฟล์
- PR template มี sections ครบ: Summary, Changes, Type, Testing, Checklist
- CODEOWNERS กำหนด reviewers อัตโนมัติตาม directory (ถ้ามี contributors)
- Dependabot มี entry ครบทุก workspace และ `github-actions` ecosystem
- SECURITY.md มี reporting method, response timeline, และ scope ชัดเจน
- ทุกไฟล์ผ่าน validation: YAML syntax, Markdown syntax, CODEOWNERS format, dependabot.yml format
- `AGENTS.md` อัปเดตถ้ามีไฟล์ใหม่
