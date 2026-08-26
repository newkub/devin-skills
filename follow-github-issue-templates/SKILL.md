---
name: follow-github-issue-templates
description: สร้าง GitHub issue templates สำหรับ bug, feature, plan, test, questions และ agents-task
---

## Goal

สร้างหรืออัปเดต `.github/ISSUE_TEMPLATE/` ให้ครบถ้วนด้วย templates 6 ประเภท: `bug-report`, `feature-request`, `plan`, `test`, `questions` และ `agents-task` พร้อม `config.yml`

## Scope

ใช้เมื่อ project ต้องการ standardize issue templates สำหรับ GitHub ไม่ duplicate กับ `/follow-dot-github` — skill นี้ focus เฉพาะ issue templates ส่วน `/follow-dot-github` จัดการ `.github` directory ทั้งหมด

## Execute

### 1. Analyze Existing Templates

> Goal: รู้จุดเริ่มต้นของ `.github/ISSUE_TEMPLATE/`

1. ตรวจสอบ `.github/ISSUE_TEMPLATE/` ที่มีอยู่
2. อ่าน `config.yml` ถ้ามี
3. ระบุ templates ที่ขาดหรือต้องอัปเดต

### 2. Select And Copy Templates

> Goal: มี templates ครบ 6 ประเภท

1. เลือก templates ตามประเภท project: `bug-report`, `feature-request`, `plan`, `test`, `questions`, `agents-task`
2. คัดลอกเนื้อหา YAML จาก `references/` ไปยัง `.github/ISSUE_TEMPLATE/`
3. ตรวจสอบชื่อไฟล์:
   - `bug_report.yml`
   - `feature_request.yml`
   - `plan.yml`
   - `test.yml`
   - `questions.yml`
   - `agents_task.yml`
4. สร้าง `config.yml` ถ้ายังไม่มี
5. แทนที่ `<owner>` และ `<repo>` ใน `config.yml` ด้วยค่าจริง

### 3. Customize Project Labels

> Goal: labels ตรงกับ project conventions

1. อ่าน `package.json` หรือ project docs เพื่อดู labels ที่ใช้
2. ปรับ labels ใน templates ให้ตรงกับ project conventions
3. ตรวจสอบว่า labels ทั้งหมดมีอยู่ใน repo ถ้าไม่มีให้ระบุให้สร้างผ่าน `labels.yml`

### 4. Validate

> Goal: templates ใช้งานได้จริง

1. ตรวจสอบ YAML syntax ของทุกไฟล์
2. ตรวจสอบ GitHub issue form syntax
3. ตรวจสอบ `required` fields
4. ทำ `/validate` เพื่อ verify templates

### 5. Report

> Goal: user ทราบสถานะ

1. ทำ `/report` พร้อมรายชื่อ templates
2. ทำ `/suggest-next-action`

## Rules

### 1. Template Coverage

- ต้องมี 6 templates หลัก: `bug_report.yml`, `feature_request.yml`, `plan.yml`, `test.yml`, `questions.yml`, `agents_task.yml`
- ต้องมี `config.yml` พร้อม `blank_issues_enabled: false` และ `contact_links`
- ไม่สร้าง markdown templates — ใช้ GitHub Forms YAML เท่านั้น

### 2. Naming

- ใช้ `snake_case` สำหรับชื่อไฟล์
- ชื่อ template ใน `name:` ใช้ภาษาอังกฤษ Title Case
- ตัวอย่าง: `name: Bug Report`

### 3. Default Labels

- `bug-report`: `bug`
- `feature-request`: `feature` หรือ `enhancement`
- `plan`: `plan`
- `test`: `test`
- `questions`: `question`
- `agents-task`: `agents-task`

### 4. Integration

- ถ้า `/follow-dot-github` ถูกเรียก → ทำ `/follow-github-issue-templates` ใน Step 4
- ถ้า `/create-github-issue` ถูกเรียก → ใช้ templates เพื่อ guide issue ให้ตรงกับประเภท

## Expected Outcome

- `.github/ISSUE_TEMPLATE/` มี templates ครบ 6 ประเภท
- `config.yml` กำหนด blank issues และ contact links
- ทุก template ผ่าน YAML syntax
- labels ตรงกับ project conventions
- project docs หรือ `AGENTS.md` อัปเดตถ้ามีการเพิ่ม labels ใหม่
